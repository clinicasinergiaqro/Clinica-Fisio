// Análisis de sentadilla desde un .dat de Kinect (réplica de SquatEngine.cs), en JS.
// Devuelve el objeto `analisis` que consume reporte.js. Testeable en Node y reutilizable en la web.
(function(root){
  'use strict';
  var UMBRAL_VALGO=3.0, UMBRAL_ASIM=4.0;
  var J={SpineBase:0,SpineShoulder:20,HipLeft:12,KneeLeft:13,AnkleLeft:14,HipRight:16,KneeRight:17,AnkleRight:18};

  function parseDat(buf){
    var dv = (buf instanceof ArrayBuffer) ? new DataView(buf) : new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    var nj=dv.getInt32(0,true), nf=dv.getInt32(4,true), off=8, W=77, frames=[], fps=30;
    for(var i=0;i<nf;i++){
      var base=off+i*W*4;
      var f=dv.getFloat32(base+4,true); if(f>1&&f<240) fps=f;   // col1 = fps
      var js=new Array(nj);
      for(var j=0;j<nj;j++){ var b=base+8+j*12; js[j]={x:dv.getFloat32(b,true),y:dv.getFloat32(b+4,true),z:dv.getFloat32(b+8,true)}; }
      frames.push(js);
    }
    return {nj:nj,nf:nf,fps:fps,frames:frames};
  }
  function med5(s){ var o=s.slice(); for(var k=0;k<s.length;k++){var a=Math.max(0,k-2),b=Math.min(s.length-1,k+2),w=[];for(var q=a;q<=b;q++)w.push(s[q]);w.sort(function(x,y){return x-y;});o[k]=w[(w.length/2)|0];} return o; }
  function mkd(knee,ank,midX){ return (Math.abs(ank.x-midX)-Math.abs(knee.x-midX))*100; }
  function mean(a){ var t=0; for(var i=0;i<a.length;i++) t+=a[i]; return a.length?t/a.length:0; }
  var r1=function(v){return Math.round(v*10)/10;}, r2=function(v){return Math.round(v*100)/100;};

  function analizar(cap){
    var F=cap.frames, n=F.length, fps=cap.fps;
    var out={nReps:0,fps:fps,duracionSeg:r1(n/(fps>1?fps:30)),profMediaCm:0,ratioMedio:0,mkdMedioIzq:0,mkdMedioDer:0,valgoIzq:false,valgoDer:false,asimetria:false,reps:[],sacroDescensoCm:[]};
    if(n<10) return out;
    var sacY=med5(F.map(function(f){return f[J.SpineBase].y;}));
    var stand=sacY.slice().sort(function(a,b){return a-b;})[(0.9*(n-1))|0];
    var desc=sacY.map(function(y){return (stand-y)*100;});
    out.sacroDescensoCm=desc;
    var enter=18,exit=8,inrep=false,peak=-1,kpk=-1,reps=[];
    for(var k=0;k<n;k++){ var d=desc[k];
      if(!inrep&&d>enter){inrep=true;peak=d;kpk=k;}
      else if(inrep){ if(d>peak){peak=d;kpk=k;} if(d<exit){reps.push([kpk,peak]);inrep=false;peak=-1;} } }
    if(inrep) reps.push([kpk,peak]);
    out.nReps=reps.length;
    var deps=[],rats=[],mLs=[],mRs=[];
    reps.forEach(function(rp,ix){
      var kb=rp[0],pk=rp[1],fb=F[kb], midX=(fb[J.HipLeft].x+fb[J.HipRight].x)/2;
      var mL=mkd(fb[J.KneeLeft],fb[J.AnkleLeft],midX), mR=mkd(fb[J.KneeRight],fb[J.AnkleRight],midX);
      var sepK=Math.abs(fb[J.KneeRight].x-fb[J.KneeLeft].x)*100, sepA=Math.abs(fb[J.AnkleRight].x-fb[J.AnkleLeft].x)*100;
      var ratio=sepA>1e-6?sepK/sepA:0;
      var sb=fb[J.SpineBase],ss=fb[J.SpineShoulder], tl=Math.atan2(ss.x-sb.x,ss.y-sb.y)*180/Math.PI;
      out.reps.push({n:ix+1,profundidadCm:r1(pk),mkdIzq:r1(mL),mkdDer:r1(mR),ratioRodillaTobillo:r2(ratio),troncoLateral:r1(tl)});
      deps.push(pk);rats.push(ratio);mLs.push(mL);mRs.push(mR);
    });
    if(deps.length){
      out.profMediaCm=r1(mean(deps)); out.ratioMedio=r2(mean(rats));
      out.mkdMedioIzq=r1(mean(mLs)); out.mkdMedioDer=r1(mean(mRs));
      out.valgoIzq=out.mkdMedioIzq>UMBRAL_VALGO; out.valgoDer=out.mkdMedioDer>UMBRAL_VALGO;
      out.asimetria=Math.abs(out.mkdMedioIzq-out.mkdMedioDer)>UMBRAL_ASIM;
    }
    return out;
  }
  var API={ analizarDat:function(buf){return analizar(parseDat(buf));}, parseDat:parseDat, analizar:analizar };
  if(typeof module!=='undefined' && module.exports) module.exports=API; else root.AnalisisSinergia=API;
})(typeof window!=='undefined'?window:this);
