import ExplicacionSimple from './ExplicacionSimple.jsx';
import { solucionExacta } from '../lib/ode.js';

export default function Conclusion({ resultado, params }) {
  const { final, N, k, T, t95, t99 } = resultado;
  const pctFinal = (final.rk4 / N) * 100;
  const ganaRK4 = final.errAbsRK4 <= final.errAbsHeun;
  const ganador = ganaRK4 ? 'RK4 (Runge-Kutta de 4.º orden)' : 'Heun (RK de 2.º orden)';
  const ganadorCorto = ganaRK4 ? 'RK4' : 'Heun';
  const errGanador = ganaRK4 ? final.errAbsRK4 : final.errAbsHeun;

  const plazo = Number(params.plazo) || 0;
  const enPlazo = plazo > 0 ? solucionExacta(plazo, N, k) : null;
  const pctPlazo = enPlazo != null ? (enPlazo / N) * 100 : null;

  const veredictoPlazo =
    pctPlazo == null
      ? null
      : pctPlazo >= 95
        ? { emoji: '✅', texto: 'la red SÍ llegaría a tiempo', clase: 'text-emerald-600' }
        : pctPlazo >= 80
          ? { emoji: '🟡', texto: 'la red llegaría muy justo: conviene reforzar voluntarios', clase: 'text-amber-600' }
          : { emoji: '⚠️', texto: 'la red NO llegaría a tiempo: hay que aumentar k (más voluntarios) o negociar más plazo', clase: 'text-rose-500' };

  return (
    <section className="glass p-6 md:p-8">
      <h2 className="titulo-seccion">💜 Conclusión e interpretación</h2>

      <ExplicacionSimple icono="🧸" titulo="Resumen para contar en casa">
        <ul className="list-inside list-disc space-y-1">
          <li>
            Llegaron <b>{N} peluditas</b> sin casita el día 0 del operativo.
          </li>
          <li>
            Con una pandilla de voluntarios de fuerza k = {k} al día, en <b>{T} días</b> habría{' '}
            <b>{final.rk4.toFixed(2)} peluditas con casita</b> ({pctFinal.toFixed(1)} % del total).
            🏡
          </li>
          <li>
            Para estar «casi listas» (el 95 %) se necesitan unos{' '}
            <b>{t95.toFixed(1)} días</b> de trabajo de la red.
          </li>
          {enPlazo != null && (
            <li>
              Si Zoonosis espera <b>{plazo} días</b>, para entonces habría{' '}
              <b>{enPlazo.toFixed(2)} a salvo</b> ({pctPlazo.toFixed(1)} %):{' '}
              <b className={veredictoPlazo.clase}>
                {veredictoPlazo.emoji} {veredictoPlazo.texto}
              </b>
            </li>
          )}
          <li>
            El método más confiable fue <b>{ganadorCorto}</b>: se equivocó por menos de{' '}
            <b>{errGanador < 1e-4 ? errGanador.toExponential(1) : errGanador.toFixed(4)} mascotas</b>.
            💛
          </li>
        </ul>
      </ExplicacionSimple>

      <div className="mt-4 space-y-3 text-sm leading-relaxed text-cafe-oscuro md:text-base">
        <p>
          🏡 En el operativo de <b>{params.lugar}</b> con <b>{N} mascotas</b> rescatadas, después de{' '}
          <b>{T} días</b> de trabajo de la red de voluntarios (con k = {k} 1/días), el modelo estima
          que <b>{final.rk4.toFixed(2)} mascotas estarían a salvo</b> en hogares temporales, es
          decir, el <b>{pctFinal.toFixed(1)} %</b> del total.
        </p>

        <p>
          ⏳ Como N es una asíntota, la curva <b>nunca llega exactamente al 100 %</b>: teóricamente
          el 95 % se alcanza en <b>t₉₅ ≈ {t95.toFixed(2)} días</b> y el 99 % en{' '}
          <b>t₉₉ ≈ {t99.toFixed(2)} días</b>. Por eso la meta realista se define con un umbral (por
          ejemplo, el 95 %) y no con el 100 % exacto.
        </p>

        {enPlazo != null && (
          <p>
            🏥 Si Zoonosis da un plazo de <b>{plazo} días</b>, para entonces habrían sido puestas a
            salvo <b>{enPlazo.toFixed(2)} mascotas</b> ({pctPlazo.toFixed(1)} %). Veredicto del
            modelo:{' '}
            <b className={veredictoPlazo.clase}>
              {veredictoPlazo.emoji} {veredictoPlazo.texto}
            </b>
            .
          </p>
        )}

        <p>
          🎯 Sobre los métodos numéricos: con el mismo paso h = {resultado.h.toFixed(4)} días, el de{' '}
          <b>menor error fue {ganador}</b> (error absoluto final {final.errAbsRK4.toExponential(2)}{' '}
          frente a {final.errAbsHeun.toExponential(2)} de Heun). Además, al reducir el paso a la
          mitad el error baja mucho más rápido en RK4 porque es de orden 4 (O(h⁴)), mientras que
          Heun es de orden 2 (O(h²)). <b>Conclusión: RK4 aproxima mejor la solución exacta</b>, y
          con pasos pequeños ambos métodos son confiables.
        </p>

        <p className="rounded-2xl border-2 border-amber-200 bg-amber-50/80 px-4 py-3 text-xs font-semibold text-amber-700 md:text-sm">
          ⚠️ Los parámetros son <b>hipotéticos y con fines académicos</b>: esta simulación describe
          el comportamiento del modelo matemático, no una predicción comprobada con datos reales.
        </p>
      </div>
    </section>
  );
}
