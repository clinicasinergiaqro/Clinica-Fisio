using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;
using Microsoft.Kinect;

namespace MedidorSinergia3D
{
    public partial class MainWindow : Window
    {
        KinectSensor _sensor;
        BodyFrameReader _reader;
        Body[] _bodies;
        CoordinateMapper _mapper;

        bool _recording;
        Captura _cap;
        readonly Stopwatch _sw = new Stopwatch();
        string _rutaReporte;

        // Huesos del esqueleto Kinect v2 (para dibujar).
        static readonly Tuple<JointType, JointType>[] Bones = new[]
        {
            Tuple.Create(JointType.SpineBase, JointType.SpineMid),
            Tuple.Create(JointType.SpineMid, JointType.SpineShoulder),
            Tuple.Create(JointType.SpineShoulder, JointType.Neck),
            Tuple.Create(JointType.Neck, JointType.Head),
            Tuple.Create(JointType.SpineShoulder, JointType.ShoulderLeft),
            Tuple.Create(JointType.ShoulderLeft, JointType.ElbowLeft),
            Tuple.Create(JointType.ElbowLeft, JointType.WristLeft),
            Tuple.Create(JointType.WristLeft, JointType.HandLeft),
            Tuple.Create(JointType.SpineShoulder, JointType.ShoulderRight),
            Tuple.Create(JointType.ShoulderRight, JointType.ElbowRight),
            Tuple.Create(JointType.ElbowRight, JointType.WristRight),
            Tuple.Create(JointType.WristRight, JointType.HandRight),
            Tuple.Create(JointType.SpineBase, JointType.HipLeft),
            Tuple.Create(JointType.HipLeft, JointType.KneeLeft),
            Tuple.Create(JointType.KneeLeft, JointType.AnkleLeft),
            Tuple.Create(JointType.AnkleLeft, JointType.FootLeft),
            Tuple.Create(JointType.SpineBase, JointType.HipRight),
            Tuple.Create(JointType.HipRight, JointType.KneeRight),
            Tuple.Create(JointType.KneeRight, JointType.AnkleRight),
            Tuple.Create(JointType.AnkleRight, JointType.FootRight),
        };

        public MainWindow()
        {
            InitializeComponent();
            try
            {
                _sensor = KinectSensor.GetDefault();
                if (_sensor == null) { txtEstado.Text = "⚠️ No se encontró un Kinect. Conéctalo (v2 + adaptador USB3) y reabre."; return; }
                _mapper = _sensor.CoordinateMapper;
                _reader = _sensor.BodyFrameSource.OpenReader();
                _reader.FrameArrived += Reader_FrameArrived;
                _sensor.IsAvailableChanged += (s, e) =>
                {
                    if (!_sensor.IsAvailable && !_recording)
                        txtEstado.Text = "⚠️ Kinect no disponible. Revisa el cable/adaptador USB3.";
                };
                _sensor.Open();
                txtEstado.Text = "Colócate DE FRENTE al Kinect, cuerpo completo. Esperando esqueleto…";
            }
            catch (Exception ex) { txtEstado.Text = "⚠️ Error al iniciar Kinect: " + ex.Message; }
        }

        void Reader_FrameArrived(object sender, BodyFrameArrivedEventArgs e)
        {
            using (var frame = e.FrameReference.AcquireFrame())
            {
                if (frame == null) return;
                if (_bodies == null) _bodies = new Body[frame.BodyFrameSource.BodyCount];
                frame.GetAndRefreshBodyData(_bodies);
            }
            var body = _bodies.FirstOrDefault(b => b != null && b.IsTracked);
            DibujarEsqueleto(body);

            if (body == null)
            {
                if (!_recording) { btnGrabar.IsEnabled = false; txtEstado.Text = "Sin esqueleto. Colócate DE FRENTE, cuerpo completo en cuadro."; }
                return;
            }
            if (!_recording) { btnGrabar.IsEnabled = true; txtEstado.Text = "✓ Detectado — listo para grabar la sentadilla."; }

            if (_recording && _cap != null)
            {
                var js = new V3[25];
                for (int i = 0; i < 25; i++)
                {
                    var p = body.Joints[(JointType)i].Position;
                    js[i] = new V3(p.X, p.Y, p.Z);
                }
                _cap.Frames.Add(js);
                _cap.Tiempos.Add((float)_sw.Elapsed.TotalSeconds);
                txtEstado.Text = "⏺ Grabando · " + _cap.Frames.Count + " cuadros";
            }
        }

        void DibujarEsqueleto(Body body)
        {
            cvSkel.Children.Clear();
            if (body == null || _mapper == null) return;
            Func<JointType, Point?> P = jt =>
            {
                var cs = body.Joints[jt].Position;
                if (cs.Z < 0.1f) cs.Z = 0.1f;
                var d = _mapper.MapCameraPointToDepthSpace(cs);
                if (float.IsInfinity(d.X) || float.IsInfinity(d.Y) || float.IsNaN(d.X) || float.IsNaN(d.Y)) return null;
                return new Point(d.X, d.Y);
            };
            foreach (var b in Bones)
            {
                var a = P(b.Item1); var c = P(b.Item2);
                if (a == null || c == null) continue;
                cvSkel.Children.Add(new Line
                {
                    X1 = a.Value.X, Y1 = a.Value.Y, X2 = c.Value.X, Y2 = c.Value.Y,
                    Stroke = new SolidColorBrush(Color.FromRgb(61, 220, 151)), StrokeThickness = 3
                });
            }
            for (int i = 0; i < 25; i++)
            {
                var p = P((JointType)i); if (p == null) continue;
                var el = new Ellipse { Width = 9, Height = 9, Fill = new SolidColorBrush(Color.FromRgb(201, 168, 76)) };
                Canvas.SetLeft(el, p.Value.X - 4.5); Canvas.SetTop(el, p.Value.Y - 4.5);
                cvSkel.Children.Add(el);
            }
        }

        void btnGrabar_Click(object sender, RoutedEventArgs e)
        {
            if (!_recording)
            {
                _cap = new Captura();
                _sw.Restart();
                _recording = true;
                btnGrabar.Content = "⏹ Detener";
                btnReporte.IsEnabled = false;
                panelRes.Visibility = Visibility.Collapsed;
            }
            else
            {
                _recording = false;
                _sw.Stop();
                btnGrabar.Content = "⏺ Grabar";
                double secs = _sw.Elapsed.TotalSeconds;
                _cap.Fps = (secs > 0.1 && _cap.Frames.Count > 1) ? (float)(_cap.Frames.Count / secs) : 30f;
                if (_cap.Frames.Count < 15) { txtEstado.Text = "⚠️ Muy pocos cuadros. Repite con el cuerpo completo en cuadro."; return; }

                var res = SquatEngine.Analizar(_cap);
                GuardarYReportar(res);
            }
        }

        void GuardarYReportar(SesionResultado res)
        {
            string pac = string.Join("_", txtPaciente.Text.Split(Path.GetInvalidFileNameChars()));
            if (string.IsNullOrWhiteSpace(pac)) pac = "paciente";
            string dir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "MedidorSinergia3D");
            Directory.CreateDirectory(dir);
            string stamp = DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss");
            string baseName = pac + "_SENTADILLA_" + stamp;

            try { _cap.Guardar(Path.Combine(dir, baseName + ".dat")); } catch { }
            string html = ReportBuilder.Construir(res, txtPaciente.Text, txtTerapeuta.Text, DateTime.Now);
            _rutaReporte = Path.Combine(dir, baseName + ".html");
            try { File.WriteAllText(_rutaReporte, html); } catch { _rutaReporte = null; }

            string flag = "";
            if (res.ValgoIzq) flag += "  ⚠️ valgo izq";
            if (res.ValgoDer) flag += "  ⚠️ valgo der";
            if (res.Asimetria) flag += "  ⚠️ asimetría";
            txtRes.Text = string.Format(
                "{0} reps · prof media {1} cm · rodilla/tobillo {2}{3}\nMKD rodilla izq {4} cm · der {5} cm  (+ = valgo)\nGuardado en: {6}",
                res.NReps, res.ProfMediaCm, res.RatioMedio, flag,
                res.MkdMedioIzq, res.MkdMedioDer, dir);
            panelRes.Visibility = Visibility.Visible;
            btnReporte.IsEnabled = _rutaReporte != null;
            txtEstado.Text = "✓ Sesión analizada y guardada (" + _cap.Frames.Count + " cuadros, " + res.Fps.ToString("0.#") + " fps)";
        }

        void btnReporte_Click(object sender, RoutedEventArgs e)
        {
            if (!string.IsNullOrEmpty(_rutaReporte) && File.Exists(_rutaReporte))
                try { Process.Start(new ProcessStartInfo(_rutaReporte) { UseShellExecute = true }); } catch { }
        }

        void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            try { if (_reader != null) _reader.Dispose(); } catch { }
            try { if (_sensor != null) _sensor.Close(); } catch { }
        }
    }
}
