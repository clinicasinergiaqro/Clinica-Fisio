# Comparación V2.1 → V2.2 (insumos anonimizados)

- Casos: 24
- Sin fecha_corte: V2.1 = 24 → V2.2 = 0
- Metas asumidas SIN justificar (50%/90%/Daniels/simetría sin dato): V2.1 = 53 → V2.2.1 = 0 (las propuestas justificadas y editables NO cuentan)
- ROM cualitativo reportado como grados: V2.1 = 6 → V2.2 = 0
- Planes distintos (variedad por patología): V2.1 = 2 → V2.2 = 11
- Casos con cambio de seguridad: OCT-06, OCT-11, OCT-22, SINT-LCA, SINT-MEN, SINT-MIN, SINT-BIOSES
- Casos marcados como nuevo motivo (episodio): SINT-EPIS

## Por caso

### OCT-06 · Radiculopatia
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `derivacion_prioritaria` (bloquea true, reglas D2)
- Plan: _genérico (sin protocolo por patología)_ → _—_
- Metas asumidas: 3 → 0; ROM falso-grados: 1 → 0
- DX V2.1: Disfunción de lumbar derecho en contexto de dx médico referido: radiculopatía L5 derecha con denervación activa documentada por ENMG, caracterizada por EVA 7/10, síntomas neurales referidos.
- DX V2.2: Disfunción de lumbar derecho en contexto de radiculopatía L5 derecha con denervación activa documentada por ENMG por insidioso, sin trauma. Cursa con dolor EVA 7/10, con déficit neurológico OBJETIVADO. A la exploración: movilidad "limitado por dolor" (cualitativa, sin goniometría); fuerza 4/5 dorsiflexores (escala /5 documentada; no se convierte a 0–10); pruebas especiales: SLR positivo a 40°. Exploración objetiva por completar (ROM goniométrico): diagnóstico PROVISIONAL.

### OCT-11 · Cervicalgia
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `precaucion_especifica` (bloquea false, reglas P10)
- Plan: _genérico (sin protocolo por patología)_ → _Cervicalgia — ejercicio + terapia según categoría_
- Metas asumidas: 3 → 0; ROM falso-grados: 1 → 0
- DX V2.1: Disfunción de cervical sin diagnóstico médico referido, caracterizada por EVA 5/10, síntomas neurales referidos.
- DX V2.2: Disfunción de cervical por postural. Cursa con dolor EVA 5/10, con síntomas neurales referidos (sensitivos, sin déficit objetivado). A la exploración: movilidad "rotación limitada" (cualitativa, sin goniometría); fuerza "conservada" (cualitativa, sin escala 0–10); pruebas especiales: Spurling dudoso. Exploración objetiva por completar (ROM goniométrico, fuerza en escala 0–10): diagnóstico PROVISIONAL.

### OCT-19 · Cervicalgia
- Seguridad: `derivacion_prioritaria` (bloquea true, reglas D2) → `derivacion_prioritaria` (bloquea true, reglas D2)
- Plan: _—_ → _—_
- Metas asumidas: 0 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de cervical sin diagnóstico médico referido, caracterizada por EVA 6/10.
- DX V2.2: Disfunción de cervical por insidioso. Cursa con dolor EVA 6/10, con déficit neurológico OBJETIVADO. A la exploración: movilidad "limitado" (cualitativa, sin goniometría); fuerza 3/5 intrínsecos de mano (escala /5 documentada; no se convierte a 0–10). Exploración objetiva por completar (ROM goniométrico, pruebas especiales): diagnóstico PROVISIONAL.

### OCT-22 · Post-quirurgico
- Seguridad: `precaucion_especifica` (bloquea false, reglas P3) → `derivacion_prioritaria` (bloquea true, reglas D3/P3/V2)
- Plan: _genérico (sin protocolo por patología)_ → _—_
- Metas asumidas: 1 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla derecho sin diagnóstico médico referido, caracterizada por EVA 6/10, inflamación referida. Exploración objetiva pendiente (ROM, fuerza, pruebas especiales): diagnóstico PROVISIONAL.
- DX V2.2: Disfunción de rodilla derecho por post-operatorio con inmovilización y reposo prolongado. Cursa con dolor EVA 6/10, con inflamación. Sin hallazgos objetivos documentados. Antecedentes a considerar: material de osteosíntesis/prótesis. Exploración objetiva por completar (ROM goniométrico, fuerza en escala 0–10, pruebas especiales): diagnóstico PROVISIONAL. Datos clínicos insuficientes: no se afirma seguridad por ausencia de hallazgos.

### OCT-72 · Rodilla
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Sin protocolo específico en la biblioteca para esta patología; usar criterio clínico._
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla izquierdo en contexto de dx médico referido: condromalacia rotuliana, operado por [médico] García de Bustamante en 2024, caracterizada por EVA 5/10.
- DX V2.2: Disfunción de rodilla izquierdo en contexto de condromalacia rotuliana, operado por [médico] en 2024 por sobreuso por aumento de volumen de carrera. Cursa con dolor EVA 5/10. A la exploración: ROM flexión 130°; fuerza 4/5 cuádriceps (escala /5 documentada; no se convierte a 0–10). Exploración objetiva por completar (pruebas especiales): diagnóstico PROVISIONAL.

### OCT-84 · Hombro
- Seguridad: `precaucion_especifica` (bloquea false, reglas P2) → `precaucion_especifica` (bloquea false, reglas P2/V1)
- Plan: _genérico (sin protocolo por patología)_ → _Manguito rotador — por tamaño/tipo_
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de hombro derecho derecho en contexto de dx médico referido: síndrome subacromial, caracterizada por EVA 6/10.
- DX V2.2: Disfunción de hombro derecho derecho en contexto de síndrome subacromial por sobreuso. Cursa con dolor EVA 6/10. A la exploración: ROM abducción activa 100°; fuerza 4/5 supraespinoso (escala /5 documentada; no se convierte a 0–10); pruebas especiales: Jobe positivo; Hawkins positivo. Antecedentes a considerar: antecedente oncológico (verificar estado).

### SINT-TEND · Tendinopatia
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Tendinopatía — carga progresiva tipo HSR_
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla derecho sin diagnóstico médico referido, caracterizada por EVA 4/10.
- DX V2.2: Disfunción de rodilla derecho por sobreuso deportivo (voleibol). Cursa con dolor EVA 4/10. A la exploración: ROM flexión 140°; fuerza 4/5 cuádriceps (escala /5 documentada; no se convierte a 0–10). Limita: no puede saltar ni entrenar. Exploración objetiva por completar (pruebas especiales): diagnóstico PROVISIONAL.

### SINT-LCA · Lesion ligamentaria
- Seguridad: `bloqueo_por_dato_inconsistente` (bloquea true, reglas X3) → `precaucion_especifica` (bloquea false, reglas X3)
- Plan: _—_ → _LCA / ligamentaria — progresión por criterios_
- Metas asumidas: 0 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla izquierdo sin diagnóstico médico referido, caracterizada por EVA 2/10.
- DX V2.2: Disfunción de rodilla izquierdo por post-reconstrucción de LCA (injerto HTG). Cursa con dolor EVA 2/10. A la exploración: ROM extensión 0°, flexión 135°; fuerza "disminuida en cuádriceps" (cualitativa, sin escala 0–10); pruebas especiales: Lachman firme; cribado de banderas rojas negativo. Limita: no puede correr ni pivotar. Exploración objetiva por completar (fuerza en escala 0–10): diagnóstico PROVISIONAL.

### SINT-MEN · Lesion meniscal
- Seguridad: `bloqueo_por_dato_inconsistente` (bloquea true, reglas X3) → `precaucion_especifica` (bloquea false, reglas X3)
- Plan: _—_ → _Menisco — reparación (lento) vs meniscectomía (rápido)_
- Metas asumidas: 0 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla derecho sin diagnóstico médico referido, caracterizada por EVA 3/10.
- DX V2.2: Disfunción de rodilla derecho por post-reparación meniscal. Cursa con dolor EVA 3/10. A la exploración: ROM flexión limitada a 90° por indicación; fuerza 4/5 (escala /5 documentada; no se convierte a 0–10); pruebas especiales: McMurray no realizado por fase; cribado de banderas rojas negativo. Limita: no puede flexionar más de 90° ni cargar completo.

### SINT-LUMB · Lumbalgia
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Lumbalgia inespecífica — ejercicio graduado, anti-nocebo_
- Metas asumidas: 3 → 0; ROM falso-grados: 1 → 0
- DX V2.1: Disfunción de lumbar sin diagnóstico médico referido, caracterizada por EVA 4/10.
- DX V2.2: Disfunción de lumbar por esfuerzo al levantar carga. Cursa con dolor EVA 4/10. A la exploración: movilidad "flexión lumbar moderadamente limitada" (cualitativa, sin goniometría); fuerza "conservada" (cualitativa, sin escala 0–10); pruebas especiales: SLR negativo; cribado de banderas rojas negativo. Limita: molestia al estar sentado mucho tiempo. Exploración objetiva por completar (ROM goniométrico, fuerza en escala 0–10): diagnóstico PROVISIONAL.

### SINT-CERV · Cervicalgia
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Cervicalgia — ejercicio + terapia según categoría_
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de cervical sin diagnóstico médico referido, caracterizada por EVA 3/10.
- DX V2.2: Disfunción de cervical por postural, trabajo de oficina. Cursa con dolor EVA 3/10. A la exploración: ROM rotación cervical 60° bilateral; fuerza "conservada" (cualitativa, sin escala 0–10). Exploración objetiva por completar (fuerza en escala 0–10, pruebas especiales): diagnóstico PROVISIONAL.

### SINT-HOMB · Hombro
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Manguito rotador — por tamaño/tipo_
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de hombro izquierdo sin diagnóstico médico referido, caracterizada por EVA 5/10.
- DX V2.2: Disfunción de hombro izquierdo por insidioso. Cursa con dolor EVA 5/10. A la exploración: ROM abducción activa 110°; fuerza 4/5 manguito (escala /5 documentada; no se convierte a 0–10); pruebas especiales: Neer positivo; cribado de banderas rojas negativo. Limita: no puede levantar el brazo por encima del hombro.

### SINT-TOB · Tobillo/pie
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Esguince lateral / tobillo — carga funcional temprana_
- Metas asumidas: 3 → 0; ROM falso-grados: 1 → 0
- DX V2.1: Disfunción de tobillo/pie derecho sin diagnóstico médico referido, caracterizada por EVA 3/10.
- DX V2.2: Disfunción de tobillo/pie derecho por inversión jugando básquetbol. Cursa con dolor EVA 3/10. A la exploración: movilidad "dorsiflexión limitada (WBLT reducido)" (cualitativa, sin goniometría); fuerza 4/5 peroneos (escala /5 documentada; no se convierte a 0–10); pruebas especiales: cajón anterior leve; cribado de banderas rojas negativo. Limita: no puede correr ni saltar. Exploración objetiva por completar (ROM goniométrico): diagnóstico PROVISIONAL.

### SINT-CAD · Cadera
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Cadera — labrum/FAI o conservador_
- Metas asumidas: 3 → 0; ROM falso-grados: 1 → 0
- DX V2.1: Disfunción de cadera derecho sin diagnóstico médico referido, caracterizada por EVA 5/10.
- DX V2.2: Disfunción de cadera derecho por pinzamiento femoroacetabular. Cursa con dolor EVA 5/10. A la exploración: movilidad "rotación interna de cadera limitada" (cualitativa, sin goniometría); fuerza 4/5 glúteo medio (escala /5 documentada; no se convierte a 0–10); pruebas especiales: FADIR positivo; cribado de banderas rojas negativo. Limita: no puede hacer sentadilla profunda. Exploración objetiva por completar (ROM goniométrico): diagnóstico PROVISIONAL.

### SINT-FRAC · Fractura
- Seguridad: `precaucion_especifica` (bloquea false, reglas P3) → `precaucion_especifica` (bloquea false, reglas P3)
- Plan: _genérico (sin protocolo por patología)_ → _Post-fractura — según consolidación y autorización_
- Metas asumidas: 3 → 0; ROM falso-grados: 1 → 0
- DX V2.1: Disfunción de tobillo/pie izquierdo sin diagnóstico médico referido, caracterizada por EVA 5/10.
- DX V2.2: Disfunción de tobillo/pie izquierdo por caída, fractura bimaleolar con placa y tornillos. Cursa con dolor EVA 5/10. A la exploración: movilidad "dorsiflexión muy limitada" (cualitativa, sin goniometría); fuerza "disminuida" (cualitativa, sin escala 0–10). Limita: cojea, no puede caminar distancias largas. Antecedentes a considerar: material de osteosíntesis/prótesis. Exploración objetiva por completar (ROM goniométrico, fuerza en escala 0–10, pruebas especiales): diagnóstico PROVISIONAL.

### SINT-MARCA · Hombro
- Seguridad: `precaucion_especifica` (bloquea false, reglas P1) → `precaucion_especifica` (bloquea false, reglas P1)
- Plan: _genérico (sin protocolo por patología)_ → _Manguito rotador — por tamaño/tipo_
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de hombro derecho sin diagnóstico médico referido, caracterizada por EVA 4/10.
- DX V2.2: Disfunción de hombro derecho por insidioso. Cursa con dolor EVA 4/10. A la exploración: ROM abducción 120°; fuerza 4/5 (escala /5 documentada; no se convierte a 0–10); pruebas especiales: Hawkins positivo; cribado de banderas rojas negativo.

### SINT-EPIS · Rodilla
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Sin protocolo específico en la biblioteca para esta patología; usar criterio clínico._
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla derecho sin diagnóstico médico referido, caracterizada por EVA 3/10.
- DX V2.2: Disfunción de rodilla derecho por sobreuso. Cursa con dolor EVA 3/10. A la exploración: ROM flexión 140°; fuerza 4/5 (escala /5 documentada; no se convierte a 0–10). Evolución: en seguimiento, 2 notas SOAP. Exploración objetiva por completar (pruebas especiales): diagnóstico PROVISIONAL.

### SINT-LADO · Rodilla
- Seguridad: `bloqueo_por_dato_inconsistente` (bloquea true, reglas X1) → `bloqueo_por_dato_inconsistente` (bloquea true, reglas X1)
- Plan: _—_ → _—_
- Metas asumidas: 0 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla derecho en contexto de dx médico referido: gonartrosis de rodilla izquierda, caracterizada por EVA 5/10.
- DX V2.2: Disfunción de rodilla derecho en contexto de gonartrosis de rodilla izquierda por degenerativo. Cursa con dolor EVA 5/10. A la exploración: ROM flexión 120°; fuerza 4/5 (escala /5 documentada; no se convierte a 0–10). Exploración objetiva por completar (pruebas especiales): diagnóstico PROVISIONAL.

### SINT-MIN · Tendinopatia
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `precaucion_especifica` (bloquea false, reglas V2)
- Plan: _genérico (sin protocolo por patología)_ → _Tendinopatía — carga progresiva tipo HSR_
- Metas asumidas: 1 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de codo derecho sin diagnóstico médico referido, caracterizada por EVA 4/10. Exploración objetiva pendiente (ROM, fuerza, pruebas especiales): diagnóstico PROVISIONAL.
- DX V2.2: Disfunción de codo derecho. Cursa con dolor EVA 4/10. Sin hallazgos objetivos documentados. Exploración objetiva por completar (ROM goniométrico, fuerza en escala 0–10, pruebas especiales): diagnóstico PROVISIONAL. Datos clínicos insuficientes: no se afirma seguridad por ausencia de hallazgos.

### SINT-BIO · Rodilla
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Sin protocolo específico en la biblioteca para esta patología; usar criterio clínico._
- Metas asumidas: 2 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla derecho sin diagnóstico médico referido, caracterizada por EVA 2/10. Exploración objetiva pendiente (ROM): diagnóstico PROVISIONAL.
- DX V2.2: Disfunción de rodilla derecho por post-inmovilización por esguince. Cursa con dolor EVA 2/10. A la exploración: fuerza 4/5 cuádriceps (escala /5 documentada; no se convierte a 0–10). Limita: no logra flexión completa para subir escaleras. Exploración objetiva por completar (ROM goniométrico, pruebas especiales): diagnóstico PROVISIONAL.

### SINT-FZ10 · Lesion ligamentaria
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _LCA / ligamentaria — progresión por criterios_
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla derecho en contexto de dx médico referido: Insuficiencia de LCA, caracterizada por EVA 4/10.
- DX V2.2: Disfunción de rodilla derecho en contexto de Insuficiencia de LCA por giro con pie fijo en la cancha. Cursa con dolor EVA 4/10. A la exploración: ROM flexion 0-120 grados; fuerza cuadriceps 6/10 (escala comparativa Sinergia, ≈60% de la referencia; lado sano confirmado 10/10); (la disminución de fuerza referida no muestra contexto neurológico: se interpreta como déficit de fuerza, no neural); pruebas especiales: Lachman positivo. Limita: no puede correr.

### SINT-FZ10NR · Rodilla
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Sin protocolo específico en la biblioteca para esta patología; usar criterio clínico._
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla izquierdo sin diagnóstico médico referido, caracterizada por EVA 5/10. Exploración objetiva pendiente (pruebas especiales): diagnóstico PROVISIONAL.
- DX V2.2: Disfunción de rodilla izquierdo. Cursa con dolor EVA 5/10. A la exploración: ROM flexion 0-110 grados; fuerza cuadriceps 6/10 (escala comparativa Sinergia, ≈60% de la referencia); (la disminución de fuerza referida no muestra contexto neurológico: se interpreta como déficit de fuerza, no neural). Exploración objetiva por completar (pruebas especiales): diagnóstico PROVISIONAL.

### SINT-BIOSES · Rodilla
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `precaucion_especifica` (bloquea false, reglas V2)
- Plan: _genérico (sin protocolo por patología)_ → _Sin protocolo específico en la biblioteca para esta patología; usar criterio clínico._
- Metas asumidas: 1 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla izquierdo sin diagnóstico médico referido, caracterizada por EVA 2/10. Exploración objetiva pendiente (ROM, fuerza, pruebas especiales): diagnóstico PROVISIONAL.
- DX V2.2: Disfunción de rodilla izquierdo. Cursa con dolor EVA 2/10. Sin hallazgos objetivos documentados. Exploración objetiva por completar (ROM goniométrico, fuerza en escala 0–10, pruebas especiales): diagnóstico PROVISIONAL. Datos clínicos insuficientes: no se afirma seguridad por ausencia de hallazgos.

### SINT-EPIS2 · Hombro
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Manguito rotador — por tamaño/tipo_
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de hombro derecho sin diagnóstico médico referido, caracterizada por EVA 6/10. Exploración objetiva pendiente (pruebas especiales): diagnóstico PROVISIONAL.
- DX V2.2: Disfunción de hombro derecho. Cursa con dolor EVA 6/10. A la exploración: ROM abduccion 0-90 grados; fuerza abductor 7/10 (escala comparativa Sinergia, ≈70% de la referencia; lado sano confirmado 10/10). Exploración objetiva por completar (pruebas especiales): diagnóstico PROVISIONAL.
