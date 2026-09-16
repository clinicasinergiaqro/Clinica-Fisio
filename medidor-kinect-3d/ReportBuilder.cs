using System;
using System.Text;
using System.Linq;
using System.Globalization;

namespace MedidorSinergia3D
{
    // Genera un reporte HTML mejorado (se abre en el navegador / se imprime a PDF).
    public static class ReportBuilder
    {
        static string F(double v, int d = 1) => Math.Round(v, d).ToString(d == 2 ? "0.00" : "0.#", CultureInfo.InvariantCulture);
        static string Lado(double mkd) => mkd > 0 ? "medial (valgo)" : "lateral";

        public static string Construir(SesionResultado r, string paciente, string terapeuta, DateTime fecha)
        {
            var sb = new StringBuilder();
            bool alerta = r.ValgoIzq || r.ValgoDer || r.Asimetria;

            sb.Append(@"<!doctype html><html lang='es'><head><meta charset='utf-8'>
<meta name='viewport' content='width=device-width,initial-scale=1'>
<title>Reporte Kinect 3D — Sentadilla</title>
<style>
:root{--navy:#1b3a6b;--gold:#c9a84c;--green:#2E7D52;--gray:#788094;--line:#e6e9ef}
*{box-sizing:border-box}body{font-family:-apple-system,Segoe UI,Arial,sans-serif;color:#232838;margin:0;padding:24px;background:#fff}
.h{background:var(--navy);color:#fff;border-radius:12px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;border-bottom:4px solid var(--gold)}
.h h1{font-size:19px;margin:0}.h .s{font-size:13px;opacity:.85}
.grid{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}
.kpi{flex:1 1 120px;border:1px solid var(--line);border-radius:12px;padding:12px}
.kpi .n{font-size:24px;font-weight:800;color:var(--navy)}.kpi .l{font-size:12px;color:var(--gray)}
.card{border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin-top:14px}
table{width:100%;border-collapse:collapse;margin-top:8px;font-size:13px}
th{background:var(--navy);color:#fff;text-align:left;padding:8px 10px;font-size:12px}
td{padding:8px 10px;border-bottom:1px solid var(--line);font-variant-numeric:tabular-nums}
.flag{border-radius:12px;padding:12px 16px;margin-top:14px;background:#FEF3C7;border:1px solid #F0D678;color:#5a4a1e;font-size:13px}
.ok{background:#E7F5EC;border-color:#B7E0C6;color:#1e5a37}
.note{color:var(--gray);font-size:11px;margin-top:14px;font-style:italic}
.foot{border-top:2px solid var(--gold);margin-top:18px;padding-top:8px;color:var(--gray);font-size:11px;display:flex;justify-content:space-between}
</style></head><body>");

            sb.Append($@"<div class='h'><div><h1>Clínica Sinergia · Sentadilla 3D (Kinect)</h1>
<div class='s'>Análisis tridimensional con esqueleto</div></div>
<div class='s' style='text-align:right'>{System.Net.WebUtility.HtmlEncode(paciente)}<br>{fecha:dd/MM/yyyy HH:mm}</div></div>");

            sb.Append($@"<div class='grid'>
<div class='kpi'><div class='n'>{r.NReps}</div><div class='l'>repeticiones</div></div>
<div class='kpi'><div class='n'>{F(r.ProfMediaCm)} cm</div><div class='l'>profundidad media (sacro)</div></div>
<div class='kpi'><div class='n'>{F(r.RatioMedio, 2)}</div><div class='l'>rodilla/tobillo (&lt;1 = valgo)</div></div>
<div class='kpi'><div class='n'>{F(r.MkdMedioIzq)}/{F(r.MkdMedioDer)}</div><div class='l'>MKD izq/der (cm, + = valgo)</div></div>
<div class='kpi'><div class='n'>{F(r.DuracionSeg)} s</div><div class='l'>duración · {F(r.Fps)} fps</div></div></div>");

            sb.Append(@"<div class='card'><b>Por repetición</b><table><tr><th>Rep</th><th>Profundidad</th>
<th>MKD rodilla izq</th><th>MKD rodilla der</th><th>Rodilla/Tobillo</th><th>Tronco lateral</th></tr>");
            foreach (var rp in r.Reps)
                sb.Append($@"<tr><td>{rp.N}</td><td>{F(rp.ProfundidadCm)} cm</td>
<td>{F(rp.MkdIzq)} cm {Lado(rp.MkdIzq)}</td>
<td>{F(rp.MkdDer)} cm {Lado(rp.MkdDer)}</td>
<td>{F(rp.RatioRodillaTobillo, 2)}</td><td>{F(rp.TroncoLateral)}°</td></tr>");
            sb.Append("</table></div>");

            sb.Append(GraficaDescenso(r));

            if (alerta)
            {
                sb.Append("<div class='flag'><b>Hallazgos:</b> ");
                if (r.ValgoIzq) sb.Append($"valgo dinámico de rodilla IZQUIERDA (se mete {F(r.MkdMedioIzq)} cm pasado el tobillo). ");
                if (r.ValgoDer) sb.Append($"valgo dinámico de rodilla DERECHA (se mete {F(r.MkdMedioDer)} cm pasado el tobillo). ");
                if (r.Asimetria) sb.Append($"asimetría izq/der (MKD {F(r.MkdMedioIzq)} vs {F(r.MkdMedioDer)} cm). ");
                sb.Append("Comparar contra el propio paciente entre sesiones con el mismo montaje.</div>");
            }
            else sb.Append("<div class='flag ok'>Sin valgo dinámico marcado ni asimetría relevante en esta toma (rodillas por fuera de los tobillos).</div>");

            sb.Append(@"<div class='note'>Kinect v2 (3D con esqueleto): mejor que 2D en profundidad y planos, pero NO mide fuerzas (cinética) ni actividad muscular (EMG). Cribado y seguimiento; no reemplaza el laboratorio con plataformas de fuerza. MKD = desplazamiento medial de la rodilla respecto al tobillo, medido en el fondo; ratio y separación también en el fondo.</div>");
            sb.Append($@"<div class='foot'><span>Clínica Sinergia · Terapeuta {System.Net.WebUtility.HtmlEncode(terapeuta ?? "")}</span><span>Generado {DateTime.Now:dd/MM/yyyy}</span></div>");
            sb.Append("</body></html>");
            return sb.ToString();
        }

        static string GraficaDescenso(SesionResultado r)
        {
            if (r.SacroDescensoCm.Count < 2) return "";
            double w = 720, h = 160, pad = 28;
            double maxD = Math.Max(10, r.SacroDescensoCm.Max());
            int n = r.SacroDescensoCm.Count;
            var pts = new StringBuilder();
            for (int i = 0; i < n; i++)
            {
                double x = pad + (w - 2 * pad) * i / (n - 1);
                double y = pad + (h - 2 * pad) * (r.SacroDescensoCm[i] / maxD);
                pts.Append((i == 0 ? "M" : "L") + F(x) + " " + F(y) + " ");
            }
            return $@"<div class='card'><b>Descenso del sacro (cm) en el tiempo</b>
<svg viewBox='0 0 {F(w)} {F(h)}' style='width:100%;height:auto'>
<line x1='{pad}' y1='{pad}' x2='{pad}' y2='{h - pad}' stroke='#c9ced9'/>
<line x1='{pad}' y1='{h - pad}' x2='{w - pad}' y2='{h - pad}' stroke='#c9ced9'/>
<path d='{pts}' fill='none' stroke='#1b3a6b' stroke-width='2'/>
<text x='{pad}' y='16' font-size='10' fill='#788094'>0 cm (de pie)</text>
<text x='{pad}' y='{h - pad + 12}' font-size='10' fill='#788094'>{F(maxD)} cm (fondo)</text>
</svg></div>";
        }
    }
}
