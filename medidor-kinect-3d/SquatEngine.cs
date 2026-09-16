using System;
using System.Collections.Generic;
using System.Linq;

namespace MedidorSinergia3D
{
    // Índices JointType de Kinect v2
    public static class J
    {
        public const int SpineBase = 0, SpineShoulder = 20, ShoulderLeft = 4, ShoulderRight = 8;
        public const int HipLeft = 12, KneeLeft = 13, AnkleLeft = 14;
        public const int HipRight = 16, KneeRight = 17, AnkleRight = 18;
    }

    public class RepMetrica
    {
        public int N;
        public double ProfundidadCm;
        public double MkdIzq, MkdDer;        // desplazamiento medial de rodilla (cm), + = se mete PASADO el tobillo (valgo)
        public double RatioRodillaTobillo;   // <1 = rodillas se meten (valgo dinámico)
        public double TroncoLateral;         // ° de inclinación lateral en el fondo
    }

    public class SesionResultado
    {
        public int NReps;
        public double DuracionSeg, Fps;
        public double ProfMediaCm, RatioMedio, MkdMedioIzq, MkdMedioDer;
        public bool ValgoIzq, ValgoDer, Asimetria;
        public List<RepMetrica> Reps = new List<RepMetrica>();
        public List<double> SacroDescensoCm = new List<double>();  // curva por frame (para gráfica)
        public List<double> TiempoSeg = new List<double>();

        // Umbrales clínicos (cribado, comparar contra el propio paciente entre sesiones):
        public const double UMBRAL_VALGO_CM = 3.0;   // rodilla se mete >3 cm pasado el tobillo
        public const double UMBRAL_ASIM_CM = 4.0;    // diferencia izq/der > 4 cm
    }

    public static class SquatEngine
    {
        static double[] Med5(IList<double> s)
        {
            var o = new double[s.Count];
            for (int k = 0; k < s.Count; k++)
            {
                int a = Math.Max(0, k - 2), b = Math.Min(s.Count - 1, k + 2);
                var w = new List<double>();
                for (int q = a; q <= b; q++) w.Add(s[q]);
                w.Sort();
                o[k] = w[w.Count / 2];
            }
            return o;
        }

        // MKD por lado (cm): cuánto se mete la rodilla PASADO el tobillo hacia la línea media.
        // + = valgo (rodilla más adentro que el tobillo); − = rodilla por fuera (normal).
        static double Mkd(V3 knee, V3 ank, double midX)
        {
            return (Math.Abs(ank.X - midX) - Math.Abs(knee.X - midX)) * 100.0;
        }

        public static SesionResultado Analizar(Captura cap)
        {
            var R = new SesionResultado { Fps = cap.Fps, NReps = 0 };
            int n = cap.Frames.Count;
            if (n < 10) return R;
            R.DuracionSeg = n / (cap.Fps > 1 ? cap.Fps : 30.0);

            var sacY = Med5(cap.Frames.Select(f => (double)f[J.SpineBase].Y).ToList());
            double stand = sacY.OrderBy(v => v).ElementAt((int)(0.9 * (n - 1)));
            var desc = sacY.Select(y => (stand - y) * 100.0).ToList();   // cm de descenso
            for (int i = 0; i < n; i++)
            {
                R.SacroDescensoCm.Add(desc[i]);
                R.TiempoSeg.Add(i / (cap.Fps > 1 ? cap.Fps : 30.0));
            }

            // Detección de repeticiones por el descenso del sacro (histéresis).
            const double enter = 18, exit = 8;
            bool inrep = false; double peak = -1; int kpk = -1;
            var reps = new List<Tuple<int, double>>();
            for (int k = 0; k < n; k++)
            {
                double dv = desc[k];
                if (!inrep && dv > enter) { inrep = true; peak = dv; kpk = k; }
                else if (inrep)
                {
                    if (dv > peak) { peak = dv; kpk = k; }
                    if (dv < exit) { reps.Add(Tuple.Create(kpk, peak)); inrep = false; peak = -1; }
                }
            }
            if (inrep) reps.Add(Tuple.Create(kpk, peak));
            R.NReps = reps.Count;

            var deps = new List<double>(); var rats = new List<double>(); var mLs = new List<double>(); var mRs = new List<double>();
            int repn = 0;
            foreach (var rp in reps)
            {
                int kb = rp.Item1; double pk = rp.Item2;   // el FONDO de la repetición
                var fb = cap.Frames[kb];
                double midX = (fb[J.HipLeft].X + fb[J.HipRight].X) / 2.0;
                double mkdL = Mkd(fb[J.KneeLeft], fb[J.AnkleLeft], midX);
                double mkdR = Mkd(fb[J.KneeRight], fb[J.AnkleRight], midX);
                double sepK = Math.Abs(fb[J.KneeRight].X - fb[J.KneeLeft].X) * 100;
                double sepA = Math.Abs(fb[J.AnkleRight].X - fb[J.AnkleLeft].X) * 100;
                double ratio = sepA > 1e-6 ? sepK / sepA : 0;
                var sb = fb[J.SpineBase]; var ss = fb[J.SpineShoulder];
                double troncoLat = Math.Atan2(ss.X - sb.X, ss.Y - sb.Y) * 180.0 / Math.PI;
                R.Reps.Add(new RepMetrica
                {
                    N = ++repn, ProfundidadCm = Math.Round(pk, 1),
                    MkdIzq = Math.Round(mkdL, 1), MkdDer = Math.Round(mkdR, 1),
                    RatioRodillaTobillo = Math.Round(ratio, 2), TroncoLateral = Math.Round(troncoLat, 1)
                });
                deps.Add(pk); rats.Add(ratio); mLs.Add(mkdL); mRs.Add(mkdR);
            }
            if (deps.Count > 0)
            {
                R.ProfMediaCm = Math.Round(deps.Average(), 1);
                R.RatioMedio = Math.Round(rats.Average(), 2);
                R.MkdMedioIzq = Math.Round(mLs.Average(), 1);
                R.MkdMedioDer = Math.Round(mRs.Average(), 1);
                R.ValgoIzq = R.MkdMedioIzq > SesionResultado.UMBRAL_VALGO_CM;
                R.ValgoDer = R.MkdMedioDer > SesionResultado.UMBRAL_VALGO_CM;
                R.Asimetria = Math.Abs(R.MkdMedioIzq - R.MkdMedioDer) > SesionResultado.UMBRAL_ASIM_CM;
            }
            return R;
        }
    }
}
