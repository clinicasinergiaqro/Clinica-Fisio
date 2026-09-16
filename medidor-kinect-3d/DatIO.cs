using System;
using System.Collections.Generic;
using System.IO;

namespace MedidorSinergia3D
{
    // Punto 3D en el espacio de la cámara del Kinect (metros, Y hacia arriba).
    public struct V3
    {
        public float X, Y, Z;
        public V3(float x, float y, float z) { X = x; Y = y; Z = z; }
    }

    // Una captura de esqueleto: cabecera + frames. Formato .dat COMPATIBLE con MedidorOne:
    //   int32 numArticulaciones (=25), int32 numFrames,
    //   luego por frame: float col0 (tiempo s), float col1 (fps), y 25*(x,y,z) float32.
    public class Captura
    {
        public int NumJoints = 25;
        public float Fps = 30f;
        public List<V3[]> Frames = new List<V3[]>();   // cada frame: NumJoints joints (x,y,z) en metros
        public List<float> Tiempos = new List<float>(); // segundos por frame

        public void Guardar(string ruta)
        {
            using (var bw = new BinaryWriter(File.Open(ruta, FileMode.Create)))
            {
                bw.Write(NumJoints);
                bw.Write(Frames.Count);
                for (int i = 0; i < Frames.Count; i++)
                {
                    bw.Write(i < Tiempos.Count ? Tiempos[i] : 0f);   // col0 = tiempo (s)
                    bw.Write(Fps);                                    // col1 = fps
                    var js = Frames[i];
                    for (int j = 0; j < NumJoints; j++) { bw.Write(js[j].X); bw.Write(js[j].Y); bw.Write(js[j].Z); }
                }
            }
        }

        // Lee tanto los .dat de esta app como los antiguos de MedidorOne (col0 se ignora, col1 = fps).
        public static Captura Cargar(string ruta)
        {
            var c = new Captura();
            using (var br = new BinaryReader(File.Open(ruta, FileMode.Open)))
            {
                c.NumJoints = br.ReadInt32();
                int nf = br.ReadInt32();
                for (int i = 0; i < nf; i++)
                {
                    float t = br.ReadSingle();      // col0 (tiempo / ignorado en archivos viejos)
                    float fps = br.ReadSingle();    // col1 = fps
                    c.Fps = (fps > 1f && fps < 240f) ? fps : c.Fps;
                    c.Tiempos.Add(t);
                    var js = new V3[c.NumJoints];
                    for (int j = 0; j < c.NumJoints; j++)
                        js[j] = new V3(br.ReadSingle(), br.ReadSingle(), br.ReadSingle());
                    c.Frames.Add(js);
                }
            }
            return c;
        }
    }
}
