/* ====== Datos sintéticos (sin PHI). Prototipo de rediseño. ====== */
window.DEMO = {
  user: { nombre:"Carlos", inicial:"CA", rol:"supervisor" },
  version: "v2-2026-11-26 · prototipo",
  hoy: { fecha:"Martes · 26 de noviembre", citas:14, atendidas:11, sinDoc:2, porLlegar:1 },
  agenda: {
    proximas: [
      { id:"p1", hora:"17:00", dur:"45 min", nombre:"Juan Pérez Demo", dx:"Tendinopatía rotuliana", ini:"Z", estado:"Por llegar", stCls:"wait", on:true },
      { id:"p2", hora:"17:45", dur:"45 min", nombre:"María López Ávila", dx:"Manguito rotador izq.", ini:"Z", estado:"Agendada", stCls:"todo" },
      { id:"p3", hora:"18:30", dur:"60 min", nombre:"Ana Torres Beltrán", dx:"Post-lipoabdominoplastia", ini:"J", estado:"Agendada", stCls:"todo", derma:true }
    ],
    sinDocumentar: [
      { id:"p4", hora:"16:00", dur:"Hoy", nombre:"Carlos Ramírez Ortega", dx:"Lumbalgia mecánica", ini:"D", estado:"Falta nota", stCls:"wait", falta:true },
      { id:"p6", hora:"15:15", dur:"Hoy", nombre:"Luis Hernández Gil", dx:"Esguince tobillo der.", ini:"Z", estado:"Falta nota", stCls:"wait", falta:true }
    ]
  },
  pacientes: [
    {
      id:"p1", nombre:"Juan Pérez Demo", edad:36, sexo:"H", terapeuta:"Zara", ini:"JP", activo:true, derma:false,
      dx:"Tendinopatía rotuliana derecha · fase reactiva",
      region:"Rodilla derecha", eva:6, flex:125, flexIni:100, sesiones:13, ultimaNota:"Hoy",
      seguridad:{ nivel:"ok", texto:"Seguridad revisada · sin contraindicaciones registradas" },
      evolucionEVA:[9,8,7,7,6,6], evoLabels:["S1","S3","S5","S7","S9","Hoy"],
      motivo:{ relato:"Dolor en la cara anterior de la rodilla derecha al bajar escaleras y al ponerse en cuclillas. Empezó hace ~10 semanas tras aumentar la carga de carrera. Mejora con el calentamiento, empeora al día siguiente de entrenar.",
               region:"Rodilla", lado:"Derecho", mecanismo:"Sobreuso / carga progresiva", desde:"Hace 10 semanas", evolucion:"En mejoría" },
      fuerza:[ {m:"Cuádriceps", der:7, izq:10, def:30}, {m:"Isquiotibiales", der:9, izq:9, def:0} ],
      pruebas:[ {t:"Dolor a la palpación polo inferior", st:"pos"}, {t:"Single-leg decline · dolor 6/10", st:"ne"}, {t:"Lachman negativo", st:"neg"}, {t:"Cajón anterior · no evaluado", st:"na"} ],
      dxFuncional:{ clinico:"Tendinopatía rotuliana (reactiva-degenerativa temprana)", funcional:"Limitación para sentadilla profunda y descenso de escaleras por dolor",
                    objCP:"EVA ≤3 en escaleras en 3 semanas; tolerar sentadilla a 60° sin dolor", objLP:"Retorno a carrera progresiva sin dolor residual >24 h en 10-12 semanas",
                    pronostico:"Favorable con carga progresiva (HSR)", limitaciones:["Impacto alto","Sentadilla >90° cargada"] },
      protocolo:{ nombre:"Rotuliano HSR", fase:"M2", frase:"Carga pesada lenta 3×/sem" },
      biomecanica:[ {clave:"flex_rod_der", etq:"Flexión rodilla der.", grado:125, ref:145, fuente:"camara", fecha:"09/11/2026", img:true},
                    {clave:"flex_rod_der_ini", etq:"Flexión rodilla der. (inicial)", grado:100, ref:145, fuente:"camara", fecha:"01/10/2026", img:true} ],
      soap:[
        { s:"Refiere menos dolor al bajar escaleras. Molestia matutina leve que cede al calentar.", evaI:5, evaF:3,
          o:"Flexión 125° (+25). Cuádriceps 7/10. Tolera isométricos a 70% CVM.", agentes:["Tecar resistiva","Láser 808 nm"],
          a:"Buena respuesta a carga progresiva (HSR). Tolera isométricos a 70% CVM sin dolor residual >24 h.",
          p:"Continuar HSR 3×/sem. Progresar sentadilla a 70°. Reevaluar en 2 semanas." }
      ],
      ejercicios:[ {n:"Sentadilla isométrica en pared", dosis:"5×45 s · 70% CVM"}, {n:"Extensión de rodilla HSR", dosis:"4×8 · tempo 3-3"}, {n:"Puente de glúteo", dosis:"3×12"}, {n:"Movilidad de tobillo", dosis:"2×10"} ],
      estudios:[ {t:"RM rodilla derecha", tipo:"resonancia", fecha:"05/11/2026"}, {t:"RX rodilla AP/lateral", tipo:"radiografia", fecha:"20/10/2026"} ]
    },
    { id:"p2", nombre:"María López Ávila", edad:52, sexo:"M", terapeuta:"Zara", ini:"ML", activo:true, derma:false,
      dx:"Síndrome de manguito rotador izquierdo", region:"Hombro izquierdo", eva:5, flex:140, flexIni:110, sesiones:6, ultimaNota:"Ayer",
      seguridad:{nivel:"ok", texto:"Seguridad revisada · sin contraindicaciones"}, evolucionEVA:[7,7,6,6,5,5], evoLabels:["S1","S2","S3","S4","S5","Hoy"] },
    { id:"p3", nombre:"Ana Torres Beltrán", edad:34, sexo:"M", terapeuta:"Jess", ini:"AT", activo:true, derma:true,
      dx:"Post-lipoabdominoplastia · día 14", region:"Abdomen", eva:3, sesiones:3, ultimaNota:"Hace 2 días",
      seguridad:{nivel:"warn", texto:"Post-quirúrgico reciente · drenajes retirados · vigilar signos de alarma"},
      derma_datos:{ procedimiento:"Lipoabdominoplastia", cirujano:"Dr. externo", dias:14, fototipo:"III",
                    edema:"+2", fibrosis:"N1 (supraumbilical)", cicatriz:"Plana, en proceso", autorizacion:"Sí, sin restricciones",
                    equipos:["Drenaje linfático","Presoterapia","Corriente Aura","Ultrasonido"] },
      evolucionEVA:[5,4,3], evoLabels:["S1","S2","Hoy"] },
    { id:"p4", nombre:"Carlos Ramírez Ortega", edad:45, sexo:"H", terapeuta:"Dulce", ini:"CR", activo:true, derma:false,
      dx:"Lumbalgia mecánica inespecífica", region:"Columna lumbar", eva:6, sesiones:4, ultimaNota:"—",
      seguridad:{nivel:"ok", texto:"Sin banderas rojas · cribado negativo"}, evolucionEVA:[7,7,6,6], evoLabels:["S1","S2","S3","Hoy"] },
    { id:"p6", nombre:"Luis Hernández Gil", edad:28, sexo:"H", terapeuta:"Zara", ini:"LH", activo:true, derma:false,
      dx:"Esguince de tobillo derecho grado II", region:"Tobillo derecho", eva:4, sesiones:5, ultimaNota:"—",
      seguridad:{nivel:"ok", texto:"Ottawa negativo · sin fractura"}, evolucionEVA:[6,5,5,4,4], evoLabels:["S1","S2","S3","S4","Hoy"] }
  ],
  // Tablero de rendimiento (supervisión)
  rendimiento:[
    { t:"Zara", cob:92, cal:84, notas:51, sinDoc:3 },
    { t:"Dulce", cob:88, cal:79, notas:50, sinDoc:4 },
    { t:"Dafne", cob:90, cal:81, notas:37, sinDoc:2 },
    { t:"Camila", cob:95, cal:83, notas:44, sinDoc:1 },
    { t:"Jess", cob:86, cal:80, notas:32, sinDoc:5 }
  ]
};
window.DEMO.pById = id => window.DEMO.pacientes.find(p=>p.id===id) || window.DEMO.pacientes[0];
