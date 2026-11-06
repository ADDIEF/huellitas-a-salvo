import ExplicacionSimple from './ExplicacionSimple.jsx';

const fmtError = (v) => {
  if (v == null) return '—';
  if (v !== 0 && Math.abs(v) < 1e-4) return v.toExponential(2);
  return v.toFixed(6);
};

const factor = (a, b) => (a > 0 && b > 0 ? a / b : null);

const fmtFactor = (f) => {
  if (f == null) return '—';
  return `×${f >= 1000 ? f.toExponential(1) : f.toFixed(1)}`;
};

function TarjetaError({ titulo, emoji, borde, textoTitulo, errAbs, errRel }) {
  return (
    <div className={`rounded-2xl border-2 ${borde} bg-white/60 p-5`}>
      <p className={`font-display text-lg font-bold ${textoTitulo}`}>
        {emoji} {titulo}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3 text-center">
        <div className="rounded-xl bg-white/80 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-cafe/70">
            Error absoluto final
          </p>
          <p className="mt-1 font-mono text-lg font-bold text-cafe-oscuro">{fmtError(errAbs)}</p>
        </div>
        <div className="rounded-xl bg-white/80 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-cafe/70">
            Error relativo final
          </p>
          <p className="mt-1 font-mono text-lg font-bold text-cafe-oscuro">
            {errRel == null ? '—' : `${fmtError(errRel)} %`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ErrorCards({ final, comparacion }) {
  const { h1, h2 } = comparacion;
  const factorHeun = factor(h1.errHeun, h2.errHeun);
  const factorRK4 = factor(h1.errRK4, h2.errRK4);

  return (
    <section className="glass p-6 md:p-8">
      <h2 className="titulo-seccion">🎯 Errores frente a la solución analítica</h2>
      <p className="mt-1 text-sm text-cafe-oscuro/80">
        Error absoluto y relativo porcentual en el punto final t = {final.t.toFixed(2)} días, con el
        tamaño de paso elegido (h₁).
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <TarjetaError
          titulo="Heun (RK2)"
          emoji="🩷"
          borde="border-pink-200"
          textoTitulo="text-pink-600"
          errAbs={final.errAbsHeun}
          errRel={final.errRelHeun}
        />
        <TarjetaError
          titulo="Runge-Kutta 4"
          emoji="💚"
          borde="border-teal-200"
          textoTitulo="text-teal-600"
          errAbs={final.errAbsRK4}
          errRel={final.errRelRK4}
        />
      </div>

      {/* Comparación con dos tamaños de paso (requisito de la guía) */}
      <div className="mt-6 rounded-2xl border-2 border-purple-200 bg-white/60 p-5">
        <p className="font-display text-lg font-bold text-purple-600">
          ⚖️ Comparación con dos tamaños de paso
        </p>
        <p className="mt-1 text-sm text-cafe-oscuro/80">
          Se repite la simulación con h₂ = h₁/2. Teoría: al dividir h entre 2, el error de un método
          O(h²) baja ≈ ×4 y el de uno O(h⁴) baja ≈ ×16.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] text-center text-sm">
            <thead>
              <tr className="bg-purple-100/70 text-purple-700">
                <th className="rounded-l-xl px-4 py-2 font-bold">Tamaño de paso</th>
                <th className="px-4 py-2 font-bold">Error final Heun</th>
                <th className="rounded-r-xl px-4 py-2 font-bold">Error final RK4</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-purple-100">
                <td className="px-4 py-2 font-mono font-bold text-cafe">
                  h₁ = {h1.h.toFixed(4)} días
                </td>
                <td className="px-4 py-2 font-mono text-pink-600">{fmtError(h1.errHeun)}</td>
                <td className="px-4 py-2 font-mono text-teal-600">{fmtError(h1.errRK4)}</td>
              </tr>
              <tr className="border-t border-purple-100">
                <td className="px-4 py-2 font-mono font-bold text-cafe">
                  h₂ = {h2.h.toFixed(4)} días
                </td>
                <td className="px-4 py-2 font-mono text-pink-600">{fmtError(h2.errHeun)}</td>
                <td className="px-4 py-2 font-mono text-teal-600">{fmtError(h2.errRK4)}</td>
              </tr>
              <tr className="border-t-2 border-purple-200 bg-purple-50/60">
                <td className="px-4 py-2 font-bold text-purple-600">
                  Reducción al dividir h entre 2
                </td>
                <td className="px-4 py-2 font-mono font-bold text-pink-600">
                  {fmtFactor(factorHeun)}
                </td>
                <td className="px-4 py-2 font-mono font-bold text-teal-600">
                  {fmtFactor(factorRK4)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ExplicacionSimple icono="🧸" titulo="¿Qué significa esto en la vida real?">
        <p>
          Piensa en los errores como <b>la distancia entre la respuesta exacta y la estimada</b>,
          medida en mascotas. Con tus datos de ahora: al final del operativo la verdad dice que{' '}
          <b>{final.exacta.toFixed(2)} peluditas</b> están a salvo; Heun responde{' '}
          <b>{final.heun.toFixed(2)}</b> (se equivocó por{' '}
          <b>{fmtError(final.errAbsHeun)}</b>
          {final.errRelHeun != null && (
            <>
              , un <b>{final.errRelHeun < 0.01 ? final.errRelHeun.toExponential(1) : final.errRelHeun.toFixed(4)} %</b>
            </>
          )}
          ) y RK4 responde <b>{final.rk4.toFixed(2)}</b> (se equivocó por{' '}
          <b>{fmtError(final.errAbsRK4)}</b>). Como las mascotas se cuentan de una en una, un error
          tan pequeño <b>no cambia ninguna decisión real</b>: ambos métodos son confiables para
          planear el operativo. 💛
        </p>
        <p>
          ¿Y el truco de los dos pasos? Es como <b>revisar el mapa el doble de seguido</b> durante
          el viaje: en tu propia simulación, al usar pasos la mitad de grandes, el error de Heun
          bajó <b>{fmtFactor(factorHeun)}</b> y el de RK4 <b>{fmtFactor(factorRK4)}</b>. RK4
          mejora muchísimo más porque es el método más cuidadoso. 🧭
        </p>
      </ExplicacionSimple>
    </section>
  );
}
