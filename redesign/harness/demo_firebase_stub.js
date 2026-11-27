/* ============================================================================
   DEMO STUB — Firebase/Firestore/Storage falsos para correr la app SIN red,
   SIN credenciales y SIN producción. Se inyecta ANTES de los scripts de la app
   (Playwright addInitScript / inline en la réplica). NO contiene secretos.
   ============================================================================ */
(function(){
  if (window.firebase) return; // ya instalado
  function fakePromise(v){ return Promise.resolve(v); }
  var fakeSnap = { empty:true, exists:false, size:0, docs:[],
    data:function(){ return {}; }, get:function(){ return undefined; },
    forEach:function(){}, id:'demo' };
  function fakeDocRef(){
    var ref = {
      get:function(){ return fakePromise(fakeSnap); },
      set:function(){ return fakePromise(); },
      update:function(){ return fakePromise(); },
      delete:function(){ return fakePromise(); },
      onSnapshot:function(){ return function(){}; },
      collection:function(){ return fakeColRef(); },
      id:'demo'
    };
    return ref;
  }
  function fakeColRef(){
    var ref = {
      doc:function(){ return fakeDocRef(); },
      add:function(){ return fakePromise(fakeDocRef()); },
      where:function(){ return ref; },
      orderBy:function(){ return ref; },
      limit:function(){ return ref; },
      get:function(){ return fakePromise(fakeSnap); },
      onSnapshot:function(){ return function(){}; }
    };
    return ref;
  }
  function fakeFirestore(){
    return {
      collection:function(){ return fakeColRef(); },
      doc:function(){ return fakeDocRef(); },
      runTransaction:function(fn){ try{ return Promise.resolve(fn({ get:function(){return fakePromise(fakeSnap);}, set:function(){}, update:function(){}, delete:function(){} })); }catch(e){ return fakePromise(); } },
      batch:function(){ return { set:function(){}, update:function(){}, delete:function(){}, commit:function(){ return fakePromise(); } }; },
      enablePersistence:function(){ return fakePromise(); }
    };
  }
  var fakeUser = { uid:'demo-uid', email:'demo.supervisor@sinergia.local',
    displayName:'Demo Supervisor',
    getIdToken:function(){ return fakePromise('demo-id-token'); } };
  function fakeAuth(){
    var a = {
      currentUser: fakeUser,
      onAuthStateChanged:function(cb){ try{ setTimeout(function(){ try{ cb(fakeUser); }catch(e){} },0);}catch(e){} return function(){}; },
      setPersistence:function(){ return fakePromise(); },
      useDeviceLanguage:function(){},
      signInWithEmailAndPassword:function(){ return fakePromise({ user:fakeUser }); },
      signOut:function(){ return fakePromise(); }
    };
    return a;
  }
  function fakeStorageRef(){
    var r = {
      child:function(){ return fakeStorageRef(); },
      put:function(){ return { on:function(ev,p,e,done){ if(typeof done==='function') setTimeout(done,0); }, snapshot:{ ref:{ getDownloadURL:function(){ return fakePromise('data:,'); } } }, then:function(f){ return fakePromise().then(f); } }; },
      putString:function(){ return fakePromise({ ref:{ getDownloadURL:function(){ return fakePromise('data:,'); } } }); },
      getDownloadURL:function(){ return fakePromise('data:,'); },
      delete:function(){ return fakePromise(); }
    };
    return r;
  }
  var firebase = {
    initializeApp:function(){ return {}; },
    app:function(){ return {}; },
    apps:[{}],
    auth:function(){ return fakeAuth(); },
    storage:function(){ return { ref:function(){ return fakeStorageRef(); }, refFromURL:function(){ return fakeStorageRef(); } }; },
    firestore:function(){ return fakeFirestore(); }
  };
  // Enums/estáticos que la app referencia directo
  firebase.auth.Auth = { Persistence:{ LOCAL:'local', SESSION:'session', NONE:'none' } };
  firebase.firestore.FieldValue = { serverTimestamp:function(){ return new Date(); }, arrayUnion:function(){ return {}; }, arrayRemove:function(){ return {}; }, increment:function(){ return 0; }, delete:function(){ return null; } };
  firebase.firestore.Timestamp = { now:function(){ return { toDate:function(){ return new Date(); }, seconds:Math.floor(Date.now()/1000) }; }, fromDate:function(d){ return { toDate:function(){ return d; } }; } };
  window.firebase = firebase;
  window.__DEMO_STUB__ = true;
})();
