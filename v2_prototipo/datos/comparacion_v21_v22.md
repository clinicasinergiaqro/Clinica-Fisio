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
- DX V2.2: Paciente de 48 años con disfunción de lumbar derecho. Cuadro: dolor EVA 7/10; déficit neurológico OBJETIVADO. A la exploración: movilidad limitado por dolor (cualitativa); fuerza 4/5 dorsiflexores (escala /5 legada; se conserva, no se convierte); pruebas especiales (SLR positivo a 40°). Mecanismo: insidioso, sin trauma. Exploración por completar (ROM goniométrico): diagnóstico PROVISIONAL.

### OCT-11 · Cervicalgia
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `precaucion_especifica` (bloquea false, reglas P10)
- Plan: _genérico (sin protocolo por patología)_ → _Cervicalgia — ejercicio + terapia según categoría_
- Metas asumidas: 3 → 0; ROM falso-grados: 1 → 0
- DX V2.1: Disfunción de cervical sin diagnóstico médico referido, caracterizada por EVA 5/10, síntomas neurales referidos.
- DX V2.2: Paciente de 52 años con disfunción de cervical. Cuadro: dolor EVA 5/10; síntomas neurales referidos (sensitivos, sin déficit objetivado). A la exploración: movilidad rotación limitada (cualitativa); fuerza conservada (cualitativa, sin escala 0–10); pruebas especiales (Spurling dudoso). Mecanismo: postural. Exploración por completar (ROM goniométrico, fuerza en escala 0–10): diagnóstico PROVISIONAL.

### OCT-19 · Cervicalgia
- Seguridad: `derivacion_prioritaria` (bloquea true, reglas D2) → `derivacion_prioritaria` (bloquea true, reglas D2)
- Plan: _—_ → _—_
- Metas asumidas: 0 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de cervical sin diagnóstico médico referido, caracterizada por EVA 6/10.
- DX V2.2: Paciente de 60 años con disfunción de cervical. Cuadro: dolor EVA 6/10; déficit neurológico OBJETIVADO. A la exploración: movilidad limitado (cualitativa); fuerza 3/5 intrínsecos de mano (escala /5 legada; se conserva, no se convierte). Mecanismo: insidioso. Exploración por completar (ROM goniométrico, pruebas especiales): diagnóstico PROVISIONAL.

### OCT-22 · Post-quirurgico
- Seguridad: `precaucion_especifica` (bloquea false, reglas P3) → `derivacion_prioritaria` (bloquea true, reglas D3/P3/V2)
- Plan: _genérico (sin protocolo por patología)_ → _—_
- Metas asumidas: 1 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla derecho sin diagnóstico médico referido, caracterizada por EVA 6/10, inflamación referida. Exploración objetiva pendiente (ROM, fuerza, pruebas especiales): diagnóstico PROVISIONAL.
- DX V2.2: Paciente de 67 años con disfunción de rodilla derecho. Cuadro: dolor EVA 6/10. A la exploración: inflamación. Mecanismo: post-operatorio con inmovilización y reposo prolongado. Antecedentes a considerar: material de osteosíntesis/prótesis. Exploración por completar (ROM goniométrico, fuerza en escala 0–10, pruebas especiales): diagnóstico PROVISIONAL. Datos clínicos insuficientes: no se afirma seguridad por ausencia de hallazgos.

### OCT-72 · Rodilla
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Sin protocolo específico en la biblioteca para esta patología; usar criterio clínico._
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla izquierdo en contexto de dx médico referido: condromalacia rotuliana, operado por [médico] García de Bustamante en 2024, caracterizada por EVA 5/10.
- DX V2.2: Paciente de 30 años con disfunción de rodilla izquierdo. Cuadro: dolor EVA 5/10. A la exploración: ROM flexión 130°; fuerza 4/5 cuádriceps (escala /5 legada; se conserva, no se convierte). Mecanismo: sobreuso por aumento de volumen de carrera. Exploración por completar (pruebas especiales): diagnóstico PROVISIONAL.

### OCT-84 · Hombro
- Seguridad: `precaucion_especifica` (bloquea false, reglas P2) → `precaucion_especifica` (bloquea false, reglas P2/V1)
- Plan: _genérico (sin protocolo por patología)_ → _Manguito rotador — por tamaño/tipo_
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de hombro derecho derecho en contexto de dx médico referido: síndrome subacromial, caracterizada por EVA 6/10.
- DX V2.2: Paciente de 58 años con disfunción de hombro derecho derecho. Cuadro: dolor EVA 6/10. A la exploración: ROM abducción activa 100°; fuerza 4/5 supraespinoso (escala /5 legada; se conserva, no se convierte); pruebas especiales (Jobe positivo; Hawkins positivo). Mecanismo: sobreuso. Antecedentes a considerar: antecedente oncológico (verificar estado).

### SINT-TEND · Tendinopatia
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Tendinopatía — carga progresiva tipo HSR_
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla derecho sin diagnóstico médico referido, caracterizada por EVA 4/10.
- DX V2.2: Paciente de 35 años con disfunción de rodilla derecho. Cuadro: dolor EVA 4/10. Limitación funcional: no puede saltar ni entrenar. A la exploración: ROM flexión 140°; fuerza 4/5 cuádriceps (escala /5 legada; se conserva, no se convierte). Mecanismo: sobreuso deportivo (voleibol). Exploración por completar (pruebas especiales): diagnóstico PROVISIONAL.

### SINT-LCA · Lesion ligamentaria
- Seguridad: `bloqueo_por_dato_inconsistente` (bloquea true, reglas X3) → `precaucion_especifica` (bloquea false, reglas X3)
- Plan: _—_ → _LCA / ligamentaria — progresión por criterios_
- Metas asumidas: 0 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla izquierdo sin diagnóstico médico referido, caracterizada por EVA 2/10.
- DX V2.2: Paciente de 24 años con disfunción de rodilla izquierdo. Cuadro: dolor EVA 2/10. Limitación funcional: no puede correr ni pivotar. A la exploración: ROM extensión 0°, flexión 135°; fuerza disminuida en cuádriceps (cualitativa, sin escala 0–10); pruebas especiales (Lachman firme; cribado de banderas rojas negativo). Mecanismo: post-reconstrucción de LCA (injerto HTG). Exploración por completar (fuerza en escala 0–10): diagnóstico PROVISIONAL.

### SINT-MEN · Lesion meniscal
- Seguridad: `bloqueo_por_dato_inconsistente` (bloquea true, reglas X3) → `precaucion_especifica` (bloquea false, reglas X3)
- Plan: _—_ → _Menisco — reparación (lento) vs meniscectomía (rápido)_
- Metas asumidas: 0 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla derecho sin diagnóstico médico referido, caracterizada por EVA 3/10.
- DX V2.2: Paciente de 41 años con disfunción de rodilla derecho. Cuadro: dolor EVA 3/10. Limitación funcional: no puede flexionar más de 90° ni cargar completo. A la exploración: ROM flexión limitada a 90° por indicación; fuerza 4/5 (escala /5 legada; se conserva, no se convierte); pruebas especiales (McMurray no realizado por fase; cribado de banderas rojas negativo). Mecanismo: post-reparación meniscal.

### SINT-LUMB · Lumbalgia
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Lumbalgia inespecífica — ejercicio graduado, anti-nocebo_
- Metas asumidas: 3 → 0; ROM falso-grados: 1 → 0
- DX V2.1: Disfunción de lumbar sin diagnóstico médico referido, caracterizada por EVA 4/10.
- DX V2.2: Paciente de 44 años con disfunción de lumbar. Cuadro: dolor EVA 4/10. Limitación funcional: molestia al estar sentado mucho tiempo. A la exploración: movilidad flexión lumbar moderadamente limitada (cualitativa); fuerza conservada (cualitativa, sin escala 0–10); pruebas especiales (SLR negativo; cribado de banderas rojas negativo). Mecanismo: esfuerzo al levantar carga. Exploración por completar (ROM goniométrico, fuerza en escala 0–10): diagnóstico PROVISIONAL.

### SINT-CERV · Cervicalgia
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Cervicalgia — ejercicio + terapia según categoría_
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de cervical sin diagnóstico médico referido, caracterizada por EVA 3/10.
- DX V2.2: Paciente de 38 años con disfunción de cervical. Cuadro: dolor EVA 3/10. A la exploración: ROM rotación cervical 60° bilateral; fuerza conservada (cualitativa, sin escala 0–10). Mecanismo: postural, trabajo de oficina. Exploración por completar (fuerza en escala 0–10, pruebas especiales): diagnóstico PROVISIONAL.

### SINT-HOMB · Hombro
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Manguito rotador — por tamaño/tipo_
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de hombro izquierdo sin diagnóstico médico referido, caracterizada por EVA 5/10.
- DX V2.2: Paciente de 50 años con disfunción de hombro izquierdo. Cuadro: dolor EVA 5/10. Limitación funcional: no puede levantar el brazo por encima del hombro. A la exploración: ROM abducción activa 110°; fuerza 4/5 manguito (escala /5 legada; se conserva, no se convierte); pruebas especiales (Neer positivo; cribado de banderas rojas negativo). Mecanismo: insidioso.

### SINT-TOB · Tobillo/pie
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Esguince lateral / tobillo — carga funcional temprana_
- Metas asumidas: 3 → 0; ROM falso-grados: 1 → 0
- DX V2.1: Disfunción de tobillo/pie derecho sin diagnóstico médico referido, caracterizada por EVA 3/10.
- DX V2.2: Paciente de 29 años con disfunción de tobillo/pie derecho. Cuadro: dolor EVA 3/10. Limitación funcional: no puede correr ni saltar. A la exploración: movilidad dorsiflexión limitada (WBLT reducido) (cualitativa); fuerza 4/5 peroneos (escala /5 legada; se conserva, no se convierte); pruebas especiales (cajón anterior leve; cribado de banderas rojas negativo). Mecanismo: inversión jugando básquetbol. Exploración por completar (ROM goniométrico): diagnóstico PROVISIONAL.

### SINT-CAD · Cadera
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Cadera — labrum/FAI o conservador_
- Metas asumidas: 3 → 0; ROM falso-grados: 1 → 0
- DX V2.1: Disfunción de cadera derecho sin diagnóstico médico referido, caracterizada por EVA 5/10.
- DX V2.2: Paciente de 33 años con disfunción de cadera derecho. Cuadro: dolor EVA 5/10. Limitación funcional: no puede hacer sentadilla profunda. A la exploración: movilidad rotación interna de cadera limitada (cualitativa); fuerza 4/5 glúteo medio (escala /5 legada; se conserva, no se convierte); pruebas especiales (FADIR positivo; cribado de banderas rojas negativo). Mecanismo: pinzamiento femoroacetabular. Exploración por completar (ROM goniométrico): diagnóstico PROVISIONAL.

### SINT-FRAC · Fractura
- Seguridad: `precaucion_especifica` (bloquea false, reglas P3) → `precaucion_especifica` (bloquea false, reglas P3)
- Plan: _genérico (sin protocolo por patología)_ → _Post-fractura — según consolidación y autorización_
- Metas asumidas: 3 → 0; ROM falso-grados: 1 → 0
- DX V2.1: Disfunción de tobillo/pie izquierdo sin diagnóstico médico referido, caracterizada por EVA 5/10.
- DX V2.2: Paciente de 55 años con disfunción de tobillo/pie izquierdo. Cuadro: dolor EVA 5/10. Limitación funcional: cojea, no puede caminar distancias largas. A la exploración: movilidad dorsiflexión muy limitada (cualitativa); fuerza disminuida (cualitativa, sin escala 0–10). Mecanismo: caída, fractura bimaleolar con placa y tornillos. Antecedentes a considerar: material de osteosíntesis/prótesis. Exploración por completar (ROM goniométrico, fuerza en escala 0–10, pruebas especiales): diagnóstico PROVISIONAL.

### SINT-MARCA · Hombro
- Seguridad: `precaucion_especifica` (bloquea false, reglas P1) → `precaucion_especifica` (bloquea false, reglas P1)
- Plan: _genérico (sin protocolo por patología)_ → _Manguito rotador — por tamaño/tipo_
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de hombro derecho sin diagnóstico médico referido, caracterizada por EVA 4/10.
- DX V2.2: Paciente de 72 años con disfunción de hombro derecho. Cuadro: dolor EVA 4/10. A la exploración: ROM abducción 120°; fuerza 4/5 (escala /5 legada; se conserva, no se convierte); pruebas especiales (Hawkins positivo; cribado de banderas rojas negativo). Mecanismo: insidioso.

### SINT-EPIS · Rodilla
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Sin protocolo específico en la biblioteca para esta patología; usar criterio clínico._
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla derecho sin diagnóstico médico referido, caracterizada por EVA 3/10.
- DX V2.2: Paciente de 40 años con disfunción de rodilla derecho. Cuadro: dolor EVA 3/10. A la exploración: ROM flexión 140°; fuerza 4/5 (escala /5 legada; se conserva, no se convierte). Mecanismo: sobreuso. Evolución: en seguimiento (2 notas SOAP). Exploración por completar (pruebas especiales): diagnóstico PROVISIONAL.

### SINT-LADO · Rodilla
- Seguridad: `bloqueo_por_dato_inconsistente` (bloquea true, reglas X1) → `bloqueo_por_dato_inconsistente` (bloquea true, reglas X1)
- Plan: _—_ → _—_
- Metas asumidas: 0 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla derecho en contexto de dx médico referido: gonartrosis de rodilla izquierda, caracterizada por EVA 5/10.
- DX V2.2: Paciente de 46 años con disfunción de rodilla derecho. Cuadro: dolor EVA 5/10. A la exploración: ROM flexión 120°; fuerza 4/5 (escala /5 legada; se conserva, no se convierte). Mecanismo: degenerativo. Exploración por completar (pruebas especiales): diagnóstico PROVISIONAL.

### SINT-MIN · Tendinopatia
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `precaucion_especifica` (bloquea false, reglas V2)
- Plan: _genérico (sin protocolo por patología)_ → _Tendinopatía — carga progresiva tipo HSR_
- Metas asumidas: 1 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de codo derecho sin diagnóstico médico referido, caracterizada por EVA 4/10. Exploración objetiva pendiente (ROM, fuerza, pruebas especiales): diagnóstico PROVISIONAL.
- DX V2.2: Paciente de 39 años con disfunción de codo derecho. Cuadro: dolor EVA 4/10. Exploración objetiva no documentada. Exploración por completar (ROM goniométrico, fuerza en escala 0–10, pruebas especiales): diagnóstico PROVISIONAL. Datos clínicos insuficientes: no se afirma seguridad por ausencia de hallazgos.

### SINT-BIO · Rodilla
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Sin protocolo específico en la biblioteca para esta patología; usar criterio clínico._
- Metas asumidas: 2 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla derecho sin diagnóstico médico referido, caracterizada por EVA 2/10. Exploración objetiva pendiente (ROM): diagnóstico PROVISIONAL.
- DX V2.2: Paciente de 27 años con disfunción de rodilla derecho. Cuadro: dolor EVA 2/10. Limitación funcional: no logra flexión completa para subir escaleras. A la exploración: fuerza 4/5 cuádriceps (escala /5 legada; se conserva, no se convierte). Mecanismo: post-inmovilización por esguince. Exploración por completar (ROM goniométrico, pruebas especiales): diagnóstico PROVISIONAL.

### SINT-FZ10 · Lesion ligamentaria
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _LCA / ligamentaria — progresión por criterios_
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla derecho en contexto de dx médico referido: Insuficiencia de LCA, caracterizada por EVA 4/10.
- DX V2.2: Paciente de 26 años con disfunción de rodilla derecho. Cuadro: dolor EVA 4/10. Limitación funcional: no puede correr. A la exploración: ROM flexion 0-120 grados; fuerza cuadriceps 6/10 — escala comparativa Sinergia 0–10 (sano = 10); referencia lado sano confirmada 10/10; pruebas especiales (Lachman positivo). La disminución de fuerza no muestra contexto neurológico (déficit de fuerza, no neural). Mecanismo: giro con pie fijo en la cancha.

### SINT-FZ10NR · Rodilla
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Sin protocolo específico en la biblioteca para esta patología; usar criterio clínico._
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla izquierdo sin diagnóstico médico referido, caracterizada por EVA 5/10. Exploración objetiva pendiente (pruebas especiales): diagnóstico PROVISIONAL.
- DX V2.2: Paciente de 40 años con disfunción de rodilla izquierdo. Cuadro: dolor EVA 5/10. A la exploración: ROM flexion 0-110 grados; fuerza cuadriceps 6/10 — escala comparativa Sinergia 0–10 (sano = 10). La disminución de fuerza no muestra contexto neurológico (déficit de fuerza, no neural). Exploración por completar (pruebas especiales): diagnóstico PROVISIONAL.

### SINT-BIOSES · Rodilla
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `precaucion_especifica` (bloquea false, reglas V2)
- Plan: _genérico (sin protocolo por patología)_ → _Sin protocolo específico en la biblioteca para esta patología; usar criterio clínico._
- Metas asumidas: 1 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de rodilla izquierdo sin diagnóstico médico referido, caracterizada por EVA 2/10. Exploración objetiva pendiente (ROM, fuerza, pruebas especiales): diagnóstico PROVISIONAL.
- DX V2.2: Paciente de 33 años con disfunción de rodilla izquierdo. Cuadro: dolor EVA 2/10. Exploración objetiva no documentada. Exploración por completar (ROM goniométrico, fuerza en escala 0–10, pruebas especiales): diagnóstico PROVISIONAL. Datos clínicos insuficientes: no se afirma seguridad por ausencia de hallazgos.

### SINT-EPIS2 · Hombro
- Seguridad: `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —) → `sin_alerta_detectada_con_datos_disponibles` (bloquea false, reglas —)
- Plan: _genérico (sin protocolo por patología)_ → _Manguito rotador — por tamaño/tipo_
- Metas asumidas: 3 → 0; ROM falso-grados: 0 → 0
- DX V2.1: Disfunción de hombro derecho sin diagnóstico médico referido, caracterizada por EVA 6/10. Exploración objetiva pendiente (pruebas especiales): diagnóstico PROVISIONAL.
- DX V2.2: Paciente de 52 años con disfunción de hombro derecho. Cuadro: dolor EVA 6/10. A la exploración: ROM abduccion 0-90 grados; fuerza abductor 7/10 — escala comparativa Sinergia 0–10 (sano = 10); referencia lado sano confirmada 10/10. Exploración por completar (pruebas especiales): diagnóstico PROVISIONAL.
