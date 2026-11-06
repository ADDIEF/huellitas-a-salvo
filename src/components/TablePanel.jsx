const MAX_FILAS_VISIBLES = 300;

const fmt4 = (v) => (v == null ? '—' : v.toFixed(4));

const fmtError = (v) => {
  if (v == null) return '—';
  if (v !== 0 && Math.abs(v) < 1e-4) return v.toExponential(2);
  return v.toFixed(6);
};

export default function TablePanel({ filas }) {
  const visibles = filas.slice(0, MAX_FILAS_VISIBLES);
  const ejemplo = filas[filas.length - 1];

  return (
    <section className="glass p-6 md:p-8">
      <h2 className="titulo-seccion">🔢 Tabla comparativa por pasos</h2>
      <p className="mt-1 text-sm text-cafe-oscuro/80">
        Cada iteración de Heun y RK4 frente a la solución analítica, con el error absoluto y el
        error relativo porcentual. Cuando la solución exacta es 0 (en t = 0), el error relativo se
        muestra como «—», tal como indica la guía.
      </p>

      <details className="mt-3 rounded-2xl border-2 border-dashed border-pink-300/70 bg-gradient-to-br from-rosita-suave/60 to-lila-suave/50 p-4">
        <summary className="cursor-pointer font-display text-sm font-bold text-pink-600">
          🧸 ¿Cómo leo esta tabla? (toca para abrir)
        </summary>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-relaxed text-cafe-oscuro">
          <li>
            <b>Paso (i)</b>: cada ronda del juego — cuántos pasitos lleva dada la simulación.
          </li>
          <li>
            <b>t</b>: el día en el que vamos. <b>Analítica</b>: la respuesta exacta, la «verdad» de
            las matemáticas.
          </li>
          <li>
            <b>Heun</b> y <b>RK4</b>: lo que cada método estima dando pasitos de h días.
          </li>
          <li>
            <b>|e|</b>: por cuántas mascotas se equivocó (diferencia entre la verdad y su
            respuesta).
          </li>
          <li>
            <b>% e</b>: ese mismo error en porcentaje, más fácil de comparar entre días.
          </li>
        </ul>
        {ejemplo && (
          <p className="mt-2 rounded-xl bg-white/70 px-3 py-2 text-sm leading-relaxed text-cafe-oscuro/95">
            💛 <b>Ejemplo con tus datos</b> (última fila): en el día <b>{ejemplo.t.toFixed(2)}</b>,
            la verdad dice <b>{ejemplo.exacta.toFixed(2)}</b> peluditas a salvo; Heun responde{' '}
            <b>{ejemplo.heun.toFixed(2)}</b> y RK4 <b>{ejemplo.rk4.toFixed(2)}</b>. O sea, RK4 se
            equivocó por apenas <b>{ejemplo.errAbsRK4 < 1e-4 ? ejemplo.errAbsRK4.toExponential(1) : ejemplo.errAbsRK4.toFixed(4)} mascotas</b>:
            ¡prácticamente clavado! 🎯
          </p>
        )}
      </details>

      <div className="mt-4 max-h-96 overflow-auto rounded-2xl border-2 border-purple-100">
        <table className="w-full min-w-[760px] text-right text-sm">
          <thead className="sticky top-0 bg-purple-100/95 text-purple-700 backdrop-blur">
            <tr>
              <th className="px-3 py-2.5 text-center font-bold">i</th>
              <th className="px-3 py-2.5 font-bold">t (días)</th>
              <th className="px-3 py-2.5 font-bold">Analítica</th>
              <th className="px-3 py-2.5 font-bold text-pink-600">Heun</th>
              <th className="px-3 py-2.5 font-bold text-teal-600">RK4</th>
              <th className="px-3 py-2.5 font-bold">|e| Heun</th>
              <th className="px-3 py-2.5 font-bold">% e Heun</th>
              <th className="px-3 py-2.5 font-bold">|e| RK4</th>
              <th className="px-3 py-2.5 font-bold">% e RK4</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((fila) => (
              <tr
                key={fila.i}
                className="border-t border-purple-100 transition hover:bg-pink-50/70"
              >
                <td className="px-3 py-1.5 text-center font-semibold text-cafe">{fila.i}</td>
                <td className="px-3 py-1.5 font-mono text-cafe-oscuro">{fila.t.toFixed(2)}</td>
                <td className="px-3 py-1.5 font-mono font-semibold text-purple-600">
                  {fila.exacta.toFixed(4)}
                </td>
                <td className="px-3 py-1.5 font-mono text-pink-600">{fila.heun.toFixed(4)}</td>
                <td className="px-3 py-1.5 font-mono text-teal-600">{fila.rk4.toFixed(4)}</td>
                <td className="px-3 py-1.5 font-mono text-cafe-oscuro/80">
                  {fmtError(fila.errAbsHeun)}
                </td>
                <td className="px-3 py-1.5 font-mono text-cafe-oscuro/80">
                  {fmtError(fila.errRelHeun)}
                </td>
                <td className="px-3 py-1.5 font-mono text-cafe-oscuro/80">
                  {fmtError(fila.errAbsRK4)}
                </td>
                <td className="px-3 py-1.5 font-mono text-cafe-oscuro/80">
                  {fmtError(fila.errRelRK4)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filas.length > visibles.length && (
        <p className="mt-2 text-xs font-semibold text-cafe/80">
          👀 Mostrando las primeras {visibles.length} de {filas.length} filas ({filas.length - 1}
          pasos). Todos los cálculos se realizan con la tabla completa.
        </p>
      )}
    </section>
  );
}
