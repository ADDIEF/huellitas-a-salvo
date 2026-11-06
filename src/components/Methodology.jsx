import ExplicacionSimple from './ExplicacionSimple.jsx';

const VARIABLES = [
  ['R(t)', 'Mascotas puestas a salvo en hogares temporales', 'mascotas'],
  ['t', 'Tiempo transcurrido desde el operativo', 'días'],
  ['N', 'Total de mascotas rescatadas en el operativo', 'mascotas'],
  ['k', 'Tasa de efectividad de la red de voluntarios', '1/días'],
];

const EN_SIMPLE_VARIABLES = [
  ['🏡 R', 'el marcador del juego: cuántas peluditas ya tienen casita.'],
  ['📅 t', 'los días que han pasado desde el operativo.'],
  ['🐶 N', 'el total de peluditas que se rescataron ese día.'],
  ['⚡ k', 'la fuerza de tu pandilla de voluntarios: entre mayor sea k, más rápido encuentran casitas.'],
];

const SUPUESTOS = [
  'La tasa k se mantiene constante durante todo el operativo: la red conserva su capacidad de búsqueda.',
  'Cada mascota se salva una única vez y no hay retornos ni abandonos durante el plazo.',
  'El rescate es más rápido al principio (quedan muchas mascotas por colocar) y se frena al final, porque dR/dt = k·(N − R) disminuye cuando R se acerca a N.',
  'R se trata como magnitud continua: aproximación estándar al modelar cantidades discretas con una EDO.',
  'Los parámetros son hipotéticos y con fines académicos: la simulación no es una predicción con datos reales.',
];

const GLOSARIO = [
  [
    'EDO (Ecuación Diferencial Ordinaria)',
    'Una fórmula que describe cómo cambia algo con el tiempo. Aquí: cómo cambia el número de peluditas salvadas, día a día.',
  ],
  [
    'Condición inicial R(0) = 0',
    'El punto de partida de la historia: el día 0, ninguna peludita tiene casita todavía.',
  ],
  [
    'Solución analítica',
    'La fórmula «mágica» que da la respuesta exacta en cualquier día, sin necesidad de simular paso a paso.',
  ],
  [
    'Paso h',
    'El tamaño del pasito que da la simulación. Pasitos pequeños = revisar el avance más seguido = más precisión (pero más cálculos).',
  ],
  [
    'Error absoluto',
    'Por cuántas mascotas se equivocó el método: la diferencia entre la respuesta exacta y la estimada.',
  ],
  [
    'Error relativo %',
    'Ese mismo error convertido en porcentaje, para saber si es grande o pequeño comparado con el total.',
  ],
  [
    'Asíntota',
    'Un valor al que la curva se acerca cada vez más sin tocarlo jamás: aquí llegar al 100 % exacto es imposible en tiempo finito, y por eso se usa la meta del 95 %.',
  ],
];

export default function Methodology({ params = {} }) {
  const nActual = Number(params.N);
  const kActual = Number(params.k);
  const hayDatos = Number.isFinite(nActual) && Number.isFinite(kActual);

  return (
    <section className="glass p-6 md:p-8">
      <h2 className="titulo-seccion">📐 Modelo matemático</h2>
      <p className="mt-1 text-sm text-cafe-oscuro/80">
        Ecuación diferencial ordinaria <b>lineal de primer orden</b> con condición inicial, y su
        verificación paso a paso.
      </p>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* Columna izquierda: la EDO y sus variables */}
        <div className="space-y-4">
          <div className="rounded-2xl border-2 border-purple-200 bg-white/60 p-4">
            <p className="font-bold text-purple-600">🧾 La EDO y la condición inicial</p>
            <p className="mt-2 font-mono text-lg font-bold text-cafe-oscuro">
              dR/dt = k·(N − R),&nbsp;&nbsp;R(0) = 0
            </p>
            <p className="mt-2 text-sm leading-relaxed text-cafe-oscuro/85">
              Se justifica porque la <b>velocidad de rescate</b> (mascotas/día) es proporcional a
              las mascotas que <b>aún faltan</b> por colocar (N − R): con muchas pendientes, la red
              trabaja rápido; cuando casi todas están a salvo, el ritmo cae. La condición inicial
              R(0) = 0 significa que, al comenzar el operativo, <b>ninguna mascota tiene hogar
              temporal todavía</b>.
            </p>
            <p className="mt-3 rounded-xl bg-purple-50/80 px-3 py-2 text-sm leading-relaxed text-cafe-oscuro/90">
              💛 <b>En simple:</b> la app cuenta cuántas peluditas se salvan <b>por día</b>. Si
              todavía quedan muchas sin casita, la pandilla avanza rapidito; cuando casi todas
              tienen casa, ya casi no queda trabajo y el ritmo baja solito. El «R(0) = 0» solo dice
              que al inicio <b>nadie</b> tiene casita aún. 🐾
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border-2 border-purple-200 bg-white/60">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-purple-100/70 text-purple-700">
                  <th className="px-4 py-2 font-bold">Variable</th>
                  <th className="px-4 py-2 font-bold">Significado</th>
                  <th className="px-4 py-2 font-bold">Unidad</th>
                </tr>
              </thead>
              <tbody>
                {VARIABLES.map(([simbolo, significado, unidad]) => (
                  <tr key={simbolo} className="border-t border-purple-100">
                    <td className="px-4 py-2 font-mono font-bold text-cafe">{simbolo}</td>
                    <td className="px-4 py-2 text-cafe-oscuro/90">{significado}</td>
                    <td className="px-4 py-2 font-semibold text-purple-500">{unidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Versión en palabras sencillas de cada variable */}
          <div className="rounded-2xl border-2 border-dashed border-pink-300/70 bg-gradient-to-br from-rosita-suave/70 to-lila-suave/60 p-4">
            <p className="font-display text-sm font-bold text-pink-600">
              🧸 ¿Qué es cada letra? (en palabras sencillas)
            </p>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-cafe-oscuro">
              {EN_SIMPLE_VARIABLES.map(([letra, texto]) => (
                <li key={letra}>
                  <b className="text-pink-600">{letra}</b> {texto}
                </li>
              ))}
            </ul>
            {hayDatos && (
              <p className="mt-3 rounded-xl bg-white/70 px-3 py-2 text-sm font-semibold text-cafe-oscuro/90">
                ✨ Con los datos de ahora en la app: <b>{nActual} peluditas</b> rescatadas y una
                pandilla con fuerza <b>k = {kActual} por día</b>. Cambia los números en el
                formulario y todo se recalcula al instante.
              </p>
            )}
          </div>
        </div>

        {/* Columna derecha: solución analítica + comprobación */}
        <div className="space-y-4">
          <div className="rounded-2xl border-2 border-pink-200 bg-white/60 p-4">
            <p className="font-bold text-pink-600">✨ Solución analítica exacta</p>
            <p className="mt-2 text-sm text-cafe-oscuro/85">
              La EDO es <b>separable e lineal</b>. Integrando dR/(N − R) = k·dt se obtiene:
            </p>
            <p className="mt-2 text-center font-mono text-lg font-bold text-pink-600">
              R(t) = N·(1 − e^(−k·t))
            </p>
            <p className="mt-3 rounded-xl bg-pink-50/80 px-3 py-2 text-sm leading-relaxed text-cafe-oscuro/90">
              💛 <b>En simple:</b> es la fórmula que responde directo «¿cuántas peluditas tendrán
              casita el día que yo quiera?», sin simular día por día. Es como conocer el final del
              cuento sin leerlo página por página. 📖
            </p>
          </div>

          <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/80 p-4 text-sm">
            <p className="font-bold text-emerald-700">✔ Comprobación por sustitución</p>
            <p className="mt-2 font-mono text-[13px] leading-relaxed text-emerald-800/90">
              dR/dt = N·k·e^(−kt) <br />
              k·(N − R) = k·(N − N·(1 − e^(−kt))) = k·N·e^(−kt) <br />
              → ambas expresiones coinciden ✔
            </p>
            <p className="mt-2 font-mono text-[13px] text-emerald-800/90">
              R(0) = N·(1 − e⁰) = N·(1 − 1) = 0 = y₀ ✔ cumple la condición inicial
            </p>
            <p className="mt-3 rounded-xl bg-white/70 px-3 py-2 text-cafe-oscuro/90">
              💛 <b>En simple:</b> hicimos la «prueba de la devolución»: metemos nuestra fórmula en
              la ecuación original y comprobamos que encaja perfecto, como una llave en su
              cerradura. 🔑
            </p>
          </div>
        </div>
      </div>

      {/* Métodos numéricos */}
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-pink-200 bg-pink-50/80 p-4 text-sm">
          <p className="font-bold text-pink-600">🧮 Heun (Runge-Kutta de 2.º orden)</p>
          <p className="mt-2 font-mono text-[13px] leading-relaxed text-cafe-oscuro">
            y* = yₙ + h·f(tₙ, yₙ) <br />
            yₙ₊₁ = yₙ + (h/2)·[f(tₙ, yₙ) + f(tₙ₊₁, y*)]
          </p>
          <p className="mt-2 text-xs text-cafe-oscuro/75">
            Predice con Euler y corrige promediando dos pendientes. Error global <b>O(h²)</b>.
          </p>
          <p className="mt-2 rounded-xl bg-white/70 px-3 py-2 text-xs leading-relaxed text-cafe-oscuro/90">
            💛 <b>En simple:</b> Heun mira el mapa <b>una vez</b>, se hace una idea del camino y
            luego corrige con el promedio. Es rápido, pero a veces se pasa de largo un poquito. 🗺️
          </p>
        </div>
        <div className="rounded-2xl border-2 border-teal-200 bg-teal-50/80 p-4 text-sm">
          <p className="font-bold text-teal-600">🧮 Runge-Kutta de 4.º orden (RK4)</p>
          <p className="mt-2 font-mono text-[13px] leading-relaxed text-cafe-oscuro">
            k₁…k₄ en tₙ, tₙ+h/2 y tₙ+h <br />
            yₙ₊₁ = yₙ + (h/6)·(k₁ + 2k₂ + 2k₃ + k₄)
          </p>
          <p className="mt-2 text-xs text-cafe-oscuro/75">
            Promedia cuatro pendientes. Error global <b>O(h⁴)</b>: mucho más preciso.
          </p>
          <p className="mt-2 rounded-xl bg-white/70 px-3 py-2 text-xs leading-relaxed text-cafe-oscuro/90">
            💛 <b>En simple:</b> RK4 mira el mapa <b>cuatro veces</b> antes de dar cada paso (al
            inicio, dos veces a la mitad y al final) y promedia todo. Se tarda un poquito más,
            pero casi nunca se equivoca. 🧭
          </p>
        </div>
      </div>

      {/* Supuestos */}
      <div className="mt-5 rounded-2xl border-2 border-amber-200 bg-amber-50/80 p-4">
        <p className="font-bold text-amber-700">📌 Supuestos y aclaraciones</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-cafe-oscuro/90">
          {SUPUESTOS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>

      {/* Mini diccionario para público general */}
      <details className="mt-5 rounded-2xl border-2 border-dashed border-pink-300/70 bg-white/60 p-4">
        <summary className="cursor-pointer font-display text-sm font-bold text-pink-600">
          📖 Mini-diccionario (toca para abrir las definiciones fáciles)
        </summary>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-cafe-oscuro">
          {GLOSARIO.map(([termino, definicion]) => (
            <li key={termino}>
              <b className="text-purple-600">{termino}:</b> {definicion}
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
