using System;
using System.Text;
using System.Linq;
using System.Collections.Generic;
using System.Globalization;

namespace MedidorSinergia3D
{
    // Reporte HTML con INTERPRETACIÓN CLÍNICA ESCRITA (redactada desde las métricas).
    // Espeja la lógica de reporte.js/analisis.js, validada con capturas reales NORMAL vs RODILLA.
    public static class ReportBuilder
    {
        static string N1(double v) => (double.IsNaN(v) ? "—" : (Math.Round(v, 1)).ToString("0.#", CultureInfo.InvariantCulture));
        static string N2(double v) => (double.IsNaN(v) ? "—" : (Math.Round(v, 2)).ToString("0.00", CultureInfo.InvariantCulture));
        static string Lado(double m) => m > 0 ? "medial (valgo)" : "lateral (por fuera)";
        static string Esc(string s) => System.Net.WebUtility.HtmlEncode(s ?? "");

        // ── REDACCIÓN CLÍNICA por secciones ──
        public class Interp { public List<string> Profundidad = new List<string>(), Valgo = new List<string>(), Simetria = new List<string>(), Tronco = new List<string>(), Conclusiones = new List<string>(); }

        public static Interp Interpretar(SesionResultado a)
        {
            var I = new Interp();
            double mI = a.MkdMedioIzq, mD = a.MkdMedioDer;

            I.Profundidad.Add("Se registraron " + a.NReps + " repeticion" + (a.NReps == 1 ? "" : "es") + " de sentadilla, con una profundidad media de descenso del sacro de " + N1(a.ProfMediaCm) + " cm.");
            if (a.Reps.Count >= 2)
            {
                double dif = a.Reps.Max(r => r.ProfundidadCm) - a.Reps.Min(r => r.ProfundidadCm);
                I.Profundidad.Add(dif <= 6
                    ? "La profundidad se mantuvo consistente entre repeticiones (variación " + N1(dif) + " cm), lo que sugiere un gesto reproducible."
                    : "La profundidad varió " + N1(dif) + " cm entre repeticiones, lo que puede indicar fatiga o un gesto poco reproducible.");
            }

            I.Valgo.Add("El desplazamiento medial de la rodilla respecto al tobillo (MKD) en el fondo del gesto fue de " + N1(mI) + " cm en el lado izquierdo y " + N1(mD) + " cm en el derecho; valores positivos indican que la rodilla se mete hacia la línea media (valgo), y negativos que se mantiene por fuera.");
            if (a.ValgoIzq && a.ValgoDer)
                I.Valgo.Add("Se observa un VALGO DINÁMICO BILATERAL: ambas rodillas se desplazan hacia adentro en el descenso, patrón asociado a control neuromuscular deficiente y factor de riesgo de sobrecarga femoropatelar y de rodilla.");
            else if (a.ValgoIzq)
                I.Valgo.Add("Se observa un VALGO DINÁMICO de la rodilla IZQUIERDA (se mete " + N1(mI) + " cm hacia la línea media), mientras la derecha se mantiene con un control frontal adecuado. Sugiere déficit de control/fuerza del lado izquierdo.");
            else if (a.ValgoDer)
                I.Valgo.Add("Se observa un VALGO DINÁMICO de la rodilla DERECHA (se mete " + N1(mD) + " cm hacia la línea media), mientras la izquierda se mantiene con un control frontal adecuado. Sugiere déficit de control/fuerza del lado derecho.");
            else
                I.Valgo.Add("No se observa valgo dinámico marcado: ambas rodillas se mantienen por fuera de los tobillos durante el descenso, patrón compatible con un control frontal de rodilla adecuado.");
            I.Valgo.Add("La relación de separación rodillas/tobillos fue de " + N2(a.RatioMedio) + " (valores menores a 1 indican que las rodillas se colapsan hacia adentro respecto a los tobillos).");

            double difM = Math.Abs(mI - mD);
            if (a.Asimetria)
                I.Simetria.Add("Existe una ASIMETRÍA relevante entre lados (diferencia de " + N1(difM) + " cm en el MKD), con mayor colapso del lado " + (mI > mD ? "izquierdo" : "derecho") + ". Se sugiere dirigir el trabajo de control neuromuscular y fuerza hacia ese lado.");
            else
                I.Simetria.Add("El comportamiento entre lados es simétrico (diferencia de " + N1(difM) + " cm en el MKD), sin un lado claramente predominante.");

            double tl = a.Reps.Count > 0 ? a.Reps.Average(r => Math.Abs(r.TroncoLateral)) : 0;
            I.Tronco.Add(tl < 5
                ? "El tronco se mantuvo estable en el plano frontal (inclinación lateral media " + N1(tl) + "°), sin compensaciones laterales relevantes."
                : "El tronco mostró una inclinación lateral media de " + N1(tl) + "°, lo que puede reflejar una compensación para descargar un lado; conviene correlacionar con la asimetría de rodilla.");

            if (a.ValgoIzq || a.ValgoDer)
            {
                I.Conclusiones.Add("El hallazgo principal es un valgo dinámico de rodilla" + ((a.ValgoIzq && a.ValgoDer) ? " bilateral" : (a.ValgoIzq ? " izquierdo" : " derecho")) + ", " + (a.Asimetria ? "con asimetría entre lados" : "sin asimetría marcada") + ".");
                I.Conclusiones.Add("Se recomienda trabajo de control neuromuscular, fuerza de glúteo medio y rotadores externos de cadera, y reevaluar en 4–6 semanas con el mismo montaje.");
            }
            else
            {
                I.Conclusiones.Add("La sentadilla muestra un control frontal de rodilla adecuado, sin valgo dinámico ni asimetría relevante en esta toma.");
                I.Conclusiones.Add("Adecuado como línea base; comparar contra el propio paciente en sesiones sucesivas.");
            }
            return I;
        }

        static string Bullets(List<string> a) => "<ul>" + string.Concat(a.Select(t => "<li>" + Esc(t) + "</li>")) + "</ul>";
        static string Seccion(string titulo, string cuerpo, List<string> interp) =>
            "<div class='sec'><h2>" + Esc(titulo) + "</h2>" + (cuerpo ?? "") + "<div class='interp'><div class='il'>Interpretación</div>" + Bullets(interp) + "</div></div>";

        public static string Construir(SesionResultado r, string paciente, string terapeuta, DateTime fecha)
        {
            var I = Interpretar(r);
            bool alerta = r.ValgoIzq || r.ValgoDer || r.Asimetria;
            var sb = new StringBuilder();
            sb.Append("<!doctype html><html lang='es'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Reporte 3D — Sentadilla</title>" + ESTILO + "</head><body>");
            sb.Append("<div class='h'><div><h1>Clínica Sinergia · Sentadilla 3D (Kinect)</h1><div class='s'>Análisis tridimensional del control de rodilla</div></div>"
                + "<div class='s' style='text-align:right'><b>" + Esc(paciente) + "</b><br>Sentadilla a repetición<br>" + fecha.ToString("dd/MM/yyyy HH:mm") + (string.IsNullOrEmpty(terapeuta) ? "" : "<br>Eval.: " + Esc(terapeuta)) + "</div></div>");
            sb.Append("<div class='grid'>"
                + "<div class='kpi'><div class='n'>" + r.NReps + "</div><div class='l'>repeticiones</div></div>"
                + "<div class='kpi'><div class='n'>" + N1(r.ProfMediaCm) + " cm</div><div class='l'>profundidad media</div></div>"
                + "<div class='kpi'><div class='n'>" + N2(r.RatioMedio) + "</div><div class='l'>rodilla/tobillo</div></div>"
                + "<div class='kpi'><div class='n'>" + N1(r.MkdMedioIzq) + "/" + N1(r.MkdMedioDer) + "</div><div class='l'>MKD izq/der (cm)</div></div>"
                + "<div class='kpi'><div class='n'>" + N1(r.DuracionSeg) + " s</div><div class='l'>" + N1(r.Fps) + " fps</div></div></div>");
            sb.Append(Seccion("Profundidad y ejecución", SvgDescenso(r), I.Profundidad));
            var filas = new StringBuilder();
            foreach (var rp in r.Reps)
                filas.Append("<tr><td>" + rp.N + "</td><td>" + N1(rp.ProfundidadCm) + " cm</td><td>" + N1(rp.MkdIzq) + " cm " + Lado(rp.MkdIzq) + "</td><td>" + N1(rp.MkdDer) + " cm " + Lado(rp.MkdDer) + "</td><td>" + N2(rp.RatioRodillaTobillo) + "</td><td>" + N1(rp.TroncoLateral) + "°</td></tr>");
            string tabla = "<table><tr><th>Rep</th><th>Profundidad</th><th>MKD rodilla izq</th><th>MKD rodilla der</th><th>Rodilla/Tobillo</th><th>Tronco lat.</th></tr>" + filas + "</table>";
            sb.Append(Seccion("Control frontal de rodilla (valgo dinámico)", tabla, I.Valgo));
            sb.Append(Seccion("Simetría entre lados", "", I.Simetria));
            sb.Append(Seccion("Tronco", "", I.Tronco));
            sb.Append("<div class='sec concl " + (alerta ? "alerta" : "ok") + "'><h2>Conclusiones</h2>" + Bullets(I.Conclusiones) + "</div>");
            sb.Append("<div class='note'>Cribado 3D con esqueleto de Kinect. MKD = desplazamiento medial de la rodilla respecto al tobillo, en el fondo del gesto. NO mide fuerzas (cinética) ni actividad muscular (EMG): esos estudios requieren plataformas de fuerza / electromiografía. Comparar contra el propio paciente entre sesiones con el mismo montaje.</div>");
            sb.Append("<div class='foot'><span>Clínica Sinergia · Terapeuta " + Esc(terapeuta) + "</span><span>Generado " + DateTime.Now.ToString("dd/MM/yyyy") + "</span></div></body></html>");
            return sb.ToString();
        }

        static string SvgDescenso(SesionResultado r)
        {
            if (r.SacroDescensoCm.Count < 2) return "";
            double w = 720, h = 150, pad = 26, maxD = Math.Max(10, r.SacroDescensoCm.Max());
            int n = r.SacroDescensoCm.Count; var p = new StringBuilder();
            for (int i = 0; i < n; i++)
            {
                double x = pad + (w - 2 * pad) * i / (n - 1), y = pad + (h - 2 * pad) * (r.SacroDescensoCm[i] / maxD);
                p.Append((i == 0 ? "M" : "L") + N1(x) + " " + N1(y) + " ");
            }
            return "<svg viewBox='0 0 " + N1(w) + " " + N1(h) + "' style='width:100%;height:auto'><line x1='" + pad + "' y1='" + pad + "' x2='" + pad + "' y2='" + (h - pad) + "' stroke='#c9ced9'/><line x1='" + pad + "' y1='" + (h - pad) + "' x2='" + (w - pad) + "' y2='" + (h - pad) + "' stroke='#c9ced9'/><path d='" + p + "' fill='none' stroke='#1b3a6b' stroke-width='2'/><text x='" + pad + "' y='14' font-size='10' fill='#788094'>0 cm (de pie)</text><text x='" + pad + "' y='" + (h - pad + 12) + "' font-size='10' fill='#788094'>" + N1(maxD) + " cm (fondo)</text></svg>";
        }

        const string ESTILO = "<style>:root{--navy:#1b3a6b;--gold:#c9a84c;--green:#2E7D52;--amber:#B45309;--gray:#788094;--line:#e6e9ef}"
            + "*{box-sizing:border-box}body{font-family:Segoe UI,-apple-system,Arial,sans-serif;color:#232838;margin:0;padding:24px;background:#fff;line-height:1.4}"
            + ".h{background:var(--navy);color:#fff;border-radius:12px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;border-bottom:4px solid var(--gold)}"
            + ".h h1{font-size:18px;margin:0}.h .s{font-size:12px;opacity:.9}"
            + ".grid{display:flex;gap:10px;flex-wrap:wrap;margin:14px 0}.kpi{flex:1 1 110px;border:1px solid var(--line);border-radius:12px;padding:12px}.kpi .n{font-size:22px;font-weight:800;color:var(--navy)}.kpi .l{font-size:11px;color:var(--gray)}"
            + ".sec{border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin-top:14px}.sec h2{font-size:15px;color:var(--navy);margin:0 0 8px}"
            + "table{width:100%;border-collapse:collapse;font-size:13px;margin:4px 0}th{background:var(--navy);color:#fff;text-align:left;padding:7px 9px;font-size:12px}td{padding:7px 9px;border-bottom:1px solid var(--line)}"
            + ".interp{margin-top:10px;background:#f6f8fb;border-left:3px solid var(--navy);border-radius:0 8px 8px 0;padding:8px 12px}.il{font-size:11px;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:.4px}.interp ul{margin:6px 0 0;padding-left:18px}.interp li{font-size:13px;margin:4px 0}"
            + ".concl{border-left:4px solid var(--green)}.concl.alerta{border-left-color:var(--amber);background:#FEF7EC}.concl ul{margin:6px 0 0;padding-left:18px}.concl li{font-size:13px;margin:5px 0;font-weight:500}"
            + ".note{color:var(--gray);font-size:11px;margin-top:14px;font-style:italic}.foot{border-top:2px solid var(--gold);margin-top:16px;padding-top:8px;color:var(--gray);font-size:11px;display:flex;justify-content:space-between}</style>";
    }
}
