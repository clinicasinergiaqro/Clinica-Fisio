# Comparación V2.1 → V2.2 (insumos anonimizados)

- Casos: 20
- Sin fecha_corte: V2.1 = 20 → V2.2 = 0
- Metas asumidas (50%/90%/Daniels/simetría): V2.1 = 43 → V2.2 = 0
- ROM cualitativo reportado como grados: V2.1 = 6 → V2.2 = 0
- Planes distintos (variedad por patología): V2.1 = 2 → V2.2 = 11
- Casos con cambio de seguridad: OCT-06, OCT-11, OCT-22, SINT-LCA, SINT-MEN, SINT-MIN
- Casos marcados como nuevo motivo (episodio): SINT-EPIS

## Por caso

### OCT-06 · Radiculopatia
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `derivacion_prioritaria` (bloquea true, reglas D2)
- Plan: _genérico (sin protocolo por patología)_ → _—_
- Metas asumidas: 3 → 0; ROM falso-grados: 1 → 0
- DX V2.1: Disfunción de lumbar derecho en contexto de dx médico referido: radiculopatía L5 derecha con denervación activa documentada por ENMG, caracterizada por EVA 7/10, síntomas neurales referidos.
- DX V2.2: Disfunción de lumbar derecho en contexto de dx médico referido: radiculopatía L5 derecha con denervación activa documentada por ENMG; mecanismo: insidioso, sin trauma. Cuadro: EVA 7/10, déficit neurológico OBJETIVADO. Hallazgos objetivos: movilidad descrita como "limitado por dolor" (cualitativo, sin goniometría); fuerza 4/5 dorsiflexores; pruebas especiales: SLR positivo a 40°. Exploración objetiva por completar (ROM goniométrico): diagnóstico PROVISIONAL.

### OCT-11 · Cervicalgia
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `precaucion_especifica` (bloquea false, reglas P10)
- Plan: _genérico (sin protocolo por patología)_ → _Cervicalgia — ejercicio + terapia según categoría_
- Metas asumidas: 3 → 0; ROM falso-grados: 1 → 0
- DX V2.1: Disfunción de cervical sin diagnóstico médico referido, caracterizada por EVA 5/10, síntomas neurales referidos.
- DX V2.2: Disfunción de cervical sin diagnóstico médico referido; mecanismo: postural. Cuadro: EVA 5/10, síntomas neurales referidos (sensitivos, sin déficit objetivado). Hallazgos objetivos: movilidad descrita como "rotación limitada" (cualitativo, sin goniometría); fuerza descrita como "conservada" (cualitativo, sin escala); pruebas especiales: Spurling dudoso. Exploración objetiva por completar (ROM goniométrico, fuerza con escala): diagnóstico PROVISIONAL.

### OCT-19 · Cervicalgia
- Seguridad: `derivacion_prioritaria` (bloquea true, reglas D2) → `derivacion_prioritaria` (bloquea true, reglas D2)
- Plan: _—_ → _—_
- Metas asumidas: 0 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de cervical sin diagnóstico médico referido, caracterizada por EVA 6/10.
- DX V2.2: Disfunción de cervical sin diagnóstico médico referido; mecanismo: insidioso. Cuadro: EVA 6/10, déficit neurológico OBJETIVADO. Hallazgos objetivos: movilidad descrita como "limitado" (cualitativo, sin goniometría); fuerza 3/5 intrínsecos de mano. Exploración objetiva por completar (ROM goniométrico, pruebas especiales): diagnóstico PROVISIONAL.

### OCT-22 · Post-quirurgico
- Seguridad: `precaucion_especifica` (bloquea false, reglas P3) → `derivacion_prioritaria` (bloquea true, reglas D3/P3/V2)
- Plan: _genérico (sin protocolo por patología)_ → _—_
- Metas asumidas: 1 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla derecho sin diagnóstico médico referido, caracterizada por EVA 6/10, inflamación referida. Exploración objetiva pendiente (ROM, fuerza, pruebas especiales): diagnóstico PROVISIONAL.
- DX V2.2: Disfunción de rodilla derecho sin diagnóstico médico referido; mecanismo: post-operatorio con inmovilización y reposo prolongado. Cuadro: EVA 6/10, inflamación referida. Sin hallazgos objetivos documentados. Exploración objetiva por completar (ROM goniométrico, fuerza con escala, pruebas especiales): diagnóstico PROVISIONAL. Datos clínicos insuficientes: no se afirma seguridad por ausencia de hallazgos.

### OCT-72 · Rodilla
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Sin protocolo específico en la biblioteca para esta patología; usar criterio clínico._
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla izquierdo en contexto de dx médico referido: condromalacia rotuliana, operado por [médico] García de Bustamante en 2024, caracterizada por EVA 5/10.
- DX V2.2: Disfunción de rodilla izquierdo en contexto de dx médico referido: condromalacia rotuliana, operado por [médico] en 2024; mecanismo: sobreuso por aumento de volumen de carrera. Cuadro: EVA 5/10. Hallazgos objetivos: ROM flexión 130°; fuerza 4/5 cuádriceps. Exploración objetiva por completar (pruebas especiales): diagnóstico PROVISIONAL.

### OCT-84 · Hombro
- Seguridad: `precaucion_especifica` (bloquea false, reglas P2) → `precaucion_especifica` (bloquea false, reglas P2/V1)
- Plan: _genérico (sin protocolo por patología)_ → _Manguito rotador — por tamaño/tipo_
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de hombro derecho derecho en contexto de dx médico referido: síndrome subacromial, caracterizada por EVA 6/10.
- DX V2.2: Disfunción de hombro derecho derecho en contexto de dx médico referido: síndrome subacromial; mecanismo: sobreuso. Cuadro: EVA 6/10. Hallazgos objetivos: ROM abducción activa 100°; fuerza 4/5 supraespinoso; pruebas especiales: Jobe positivo; Hawkins positivo.

### SINT-TEND · Tendinopatia
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Tendinopatía — carga progresiva tipo HSR_
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla derecho sin diagnóstico médico referido, caracterizada por EVA 4/10.
- DX V2.2: Disfunción de rodilla derecho sin diagnóstico médico referido; mecanismo: sobreuso deportivo (voleibol). Cuadro: EVA 4/10. Hallazgos objetivos: ROM flexión 140°; fuerza 4/5 cuádriceps. Limitación funcional: no puede saltar ni entrenar. Exploración objetiva por completar (pruebas especiales): diagnóstico PROVISIONAL.

### SINT-LCA · Lesion ligamentaria
- Seguridad: `bloqueo_por_dato_inconsistente` (bloquea true, reglas X3) → `precaucion_especifica` (bloquea false, reglas X3)
- Plan: _—_ → _LCA / ligamentaria — progresión por criterios_
- Metas asumidas: 0 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla izquierdo sin diagnóstico médico referido, caracterizada por EVA 2/10.
- DX V2.2: Disfunción de rodilla izquierdo sin diagnóstico médico referido; mecanismo: post-reconstrucción de LCA (injerto HTG). Cuadro: EVA 2/10. Hallazgos objetivos: ROM extensión 0°, flexión 135°; fuerza descrita como "disminuida en cuádriceps" (cualitativo, sin escala); pruebas especiales: Lachman firme; cribado de banderas rojas negativo. Limitación funcional: no puede correr ni pivotar. Exploración objetiva por completar (fuerza con escala): diagnóstico PROVISIONAL.

### SINT-MEN · Lesion meniscal
- Seguridad: `bloqueo_por_dato_inconsistente` (bloquea true, reglas X3) → `precaucion_especifica` (bloquea false, reglas X3)
- Plan: _—_ → _Menisco — reparación (lento) vs meniscectomía (rápido)_
- Metas asumidas: 0 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla derecho sin diagnóstico médico referido, caracterizada por EVA 3/10.
- DX V2.2: Disfunción de rodilla derecho sin diagnóstico médico referido; mecanismo: post-reparación meniscal. Cuadro: EVA 3/10. Hallazgos objetivos: ROM flexión limitada a 90° por indicación; fuerza 4/5; pruebas especiales: McMurray no realizado por fase; cribado de banderas rojas negativo. Limitación funcional: no puede flexionar más de 90° ni cargar completo.

### SINT-LUMB · Lumbalgia
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Lumbalgia inespecífica — ejercicio graduado, anti-nocebo_
- Metas asumidas: 3 → 0; ROM falso-grados: 1 → 0
- DX V2.1: Disfunción de lumbar sin diagnóstico médico referido, caracterizada por EVA 4/10.
- DX V2.2: Disfunción de lumbar sin diagnóstico médico referido; mecanismo: esfuerzo al levantar carga. Cuadro: EVA 4/10. Hallazgos objetivos: movilidad descrita como "flexión lumbar moderadamente limitada" (cualitativo, sin goniometría); fuerza descrita como "conservada" (cualitativo, sin escala); pruebas especiales: SLR negativo; cribado de banderas rojas negativo. Limitación funcional: molestia al estar sentado mucho tiempo. Exploración objetiva por completar (ROM goniométrico, fuerza con escala): diagnóstico PROVISIONAL.

### SINT-CERV · Cervicalgia
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Cervicalgia — ejercicio + terapia según categoría_
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de cervical sin diagnóstico médico referido, caracterizada por EVA 3/10.
- DX V2.2: Disfunción de cervical sin diagnóstico médico referido; mecanismo: postural, trabajo de oficina. Cuadro: EVA 3/10. Hallazgos objetivos: ROM rotación cervical 60° bilateral; fuerza descrita como "conservada" (cualitativo, sin escala). Exploración objetiva por completar (fuerza con escala, pruebas especiales): diagnóstico PROVISIONAL.

### SINT-HOMB · Hombro
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Manguito rotador — por tamaño/tipo_
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de hombro izquierdo sin diagnóstico médico referido, caracterizada por EVA 5/10.
- DX V2.2: Disfunción de hombro izquierdo sin diagnóstico médico referido; mecanismo: insidioso. Cuadro: EVA 5/10. Hallazgos objetivos: ROM abducción activa 110°; fuerza 4/5 manguito; pruebas especiales: Neer positivo; cribado de banderas rojas negativo. Limitación funcional: no puede levantar el brazo por encima del hombro.

### SINT-TOB · Tobillo/pie
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Esguince lateral / tobillo — carga funcional temprana_
- Metas asumidas: 3 → 0; ROM falso-grados: 1 → 0
- DX V2.1: Disfunción de tobillo/pie derecho sin diagnóstico médico referido, caracterizada por EVA 3/10.
- DX V2.2: Disfunción de tobillo/pie derecho sin diagnóstico médico referido; mecanismo: inversión jugando básquetbol. Cuadro: EVA 3/10. Hallazgos objetivos: movilidad descrita como "dorsiflexión limitada (WBLT reducido)" (cualitativo, sin goniometría); fuerza 4/5 peroneos; pruebas especiales: cajón anterior leve; cribado de banderas rojas negativo. Limitación funcional: no puede correr ni saltar. Exploración objetiva por completar (ROM goniométrico): diagnóstico PROVISIONAL.

### SINT-CAD · Cadera
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Cadera — labrum/FAI o conservador_
- Metas asumidas: 3 → 0; ROM falso-grados: 1 → 0
- DX V2.1: Disfunción de cadera derecho sin diagnóstico médico referido, caracterizada por EVA 5/10.
- DX V2.2: Disfunción de cadera derecho sin diagnóstico médico referido; mecanismo: pinzamiento femoroacetabular. Cuadro: EVA 5/10. Hallazgos objetivos: movilidad descrita como "rotación interna de cadera limitada" (cualitativo, sin goniometría); fuerza 4/5 glúteo medio; pruebas especiales: FADIR positivo; cribado de banderas rojas negativo. Limitación funcional: no puede hacer sentadilla profunda. Exploración objetiva por completar (ROM goniométrico): diagnóstico PROVISIONAL.

### SINT-FRAC · Fractura
- Seguridad: `precaucion_especifica` (bloquea false, reglas P3) → `precaucion_especifica` (bloquea false, reglas P3)
- Plan: _genérico (sin protocolo por patología)_ → _Post-fractura — según consolidación y autorización_
- Metas asumidas: 3 → 0; ROM falso-grados: 1 → 0
- DX V2.1: Disfunción de tobillo/pie izquierdo sin diagnóstico médico referido, caracterizada por EVA 5/10.
- DX V2.2: Disfunción de tobillo/pie izquierdo sin diagnóstico médico referido; mecanismo: caída, fractura bimaleolar con placa y tornillos. Cuadro: EVA 5/10. Hallazgos objetivos: movilidad descrita como "dorsiflexión muy limitada" (cualitativo, sin goniometría); fuerza descrita como "disminuida" (cualitativo, sin escala). Limitación funcional: cojea, no puede caminar distancias largas. Exploración objetiva por completar (ROM goniométrico, fuerza con escala, pruebas especiales): diagnóstico PROVISIONAL.

### SINT-MARCA · Hombro
- Seguridad: `precaucion_especifica` (bloquea false, reglas P1) → `precaucion_especifica` (bloquea false, reglas P1)
- Plan: _genérico (sin protocolo por patología)_ → _Manguito rotador — por tamaño/tipo_
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de hombro derecho sin diagnóstico médico referido, caracterizada por EVA 4/10.
- DX V2.2: Disfunción de hombro derecho sin diagnóstico médico referido; mecanismo: insidioso. Cuadro: EVA 4/10. Hallazgos objetivos: ROM abducción 120°; fuerza 4/5; pruebas especiales: Hawkins positivo; cribado de banderas rojas negativo.

### SINT-EPIS · Rodilla
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Sin protocolo específico en la biblioteca para esta patología; usar criterio clínico._
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla derecho sin diagnóstico médico referido, caracterizada por EVA 3/10.
- DX V2.2: Disfunción de rodilla derecho sin diagnóstico médico referido; mecanismo: sobreuso. Cuadro: EVA 3/10. Hallazgos objetivos: ROM flexión 140°; fuerza 4/5. Exploración objetiva por completar (pruebas especiales): diagnóstico PROVISIONAL.

### SINT-LADO · Rodilla
- Seguridad: `bloqueo_por_dato_inconsistente` (bloquea true, reglas X1) → `bloqueo_por_dato_inconsistente` (bloquea true, reglas X1)
- Plan: _—_ → _—_
- Metas asumidas: 0 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla derecho en contexto de dx médico referido: gonartrosis de rodilla izquierda, caracterizada por EVA 5/10.
- DX V2.2: Disfunción de rodilla derecho en contexto de dx médico referido: gonartrosis de rodilla izquierda; mecanismo: degenerativo. Cuadro: EVA 5/10. Hallazgos objetivos: ROM flexión 120°; fuerza 4/5. Exploración objetiva por completar (pruebas especiales): diagnóstico PROVISIONAL.

### SINT-MIN · Tendinopatia
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `precaucion_especifica` (bloquea false, reglas V2)
- Plan: _genérico (sin protocolo por patología)_ → _Tendinopatía — carga progresiva tipo HSR_
- Metas asumidas: 1 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de codo derecho sin diagnóstico médico referido, caracterizada por EVA 4/10. Exploración objetiva pendiente (ROM, fuerza, pruebas especiales): diagnóstico PROVISIONAL.
- DX V2.2: Disfunción de codo derecho sin diagnóstico médico referido. Cuadro: EVA 4/10. Sin hallazgos objetivos documentados. Exploración objetiva por completar (ROM goniométrico, fuerza con escala, pruebas especiales): diagnóstico PROVISIONAL. Datos clínicos insuficientes: no se afirma seguridad por ausencia de hallazgos.

### SINT-BIO · Rodilla
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Sin protocolo específico en la biblioteca para esta patología; usar criterio clínico._
- Metas asumidas: 2 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla derecho sin diagnóstico médico referido, caracterizada por EVA 2/10. Exploración objetiva pendiente (ROM): diagnóstico PROVISIONAL.
- DX V2.2: Disfunción de rodilla derecho sin diagnóstico médico referido; mecanismo: post-inmovilización por esguince. Cuadro: EVA 2/10. Hallazgos objetivos: fuerza 4/5 cuádriceps. Limitación funcional: no logra flexión completa para subir escaleras. Exploración objetiva por completar (ROM goniométrico, pruebas especiales): diagnóstico PROVISIONAL.
