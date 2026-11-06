import { useMemo } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ExplicacionSimple from './ExplicacionSimple.jsx';

const COLOR_ANALITICA = '#7C3AED'; // violeta
const COLOR_HEUN = '#F472B6'; // rosado
const COLOR_RK4 = '#2DD4BF'; // verde menta
const COLOR_PLAZO = '#F97316'; // naranja
const COLOR_META = '#10B981'; // esmeralda

export default function ChartPanel({ resultado, plazo }) {
  // Si hay demasiados pasos, se muestrea la curva para mantener la web fluida.
  const datos = useMemo(() => {
    const filas = resultado.filas;
    const MAX_PUNTOS = 400;
    if (filas.length <= MAX_PUNTOS) return filas;
    const salto = Math.ceil(filas.length / MAX_PUNTOS);
    const muestra = filas.filter((_, idx) => idx % salto === 0);
    const ultima = filas[filas.length - 1];
    if (muestra[muestra.length - 1]?.i !== ultima.i) muestra.push(ultima);
    return muestra;
  }, [resultado]);

  const mostrarPlazo = plazo > 0 && plazo <= resultado.T;

  return (
    <section className="glass p-6 md:p-8">
      <h2 className="titulo-seccion">📈 Evolución del rescate</h2>
      <p className="mt-1 text-sm text-cafe-oscuro/80">
        Solución analítica exacta frente a Heun y RK4. La línea punteada naranja marca el plazo
        límite de Zoonosis y la verde, la meta del 95 %.
      </p>

      <div className="mt-4 h-80 w-full md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={datos} margin={{ top: 10, right: 25, bottom: 15, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E9D5FF" />
            <XAxis
              dataKey="t"
              type="number"
              domain={[0, resultado.T]}
              tickFormatter={(t) => Number(t).toFixed(1)}
              label={{ value: 't (días)', position: 'insideBottom', offset: -8, fill: '#A47148' }}
              tick={{ fill: '#A47148', fontSize: 12 }}
            />
            <YAxis
              label={{ value: 'R (mascotas)', angle: -90, position: 'insideLeft', fill: '#A47148' }}
              tick={{ fill: '#A47148', fontSize: 12 }}
            />
            <Tooltip
              formatter={(value, name) => [`${Number(value).toFixed(3)} mascotas`, name]}
              labelFormatter={(t) => `t = ${Number(t).toFixed(2)} días`}
              contentStyle={{
                borderRadius: 16,
                border: '2px solid #E9D5FF',
                background: 'rgba(255,255,255,0.95)',
                fontFamily: 'Quicksand, sans-serif',
              }}
            />
            <Legend wrapperStyle={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }} />

            <ReferenceLine
              x={plazo}
              stroke={COLOR_PLAZO}
              strokeDasharray="6 6"
              strokeWidth={2}
              label={{
                value: '🏥 Plazo Zoonosis',
                position: 'top',
                fill: COLOR_PLAZO,
                fontSize: 12,
                fontWeight: 700,
              }}
            />
            <ReferenceLine
              y={resultado.N * 0.95}
              stroke={COLOR_META}
              strokeDasharray="4 4"
              label={{
                value: '✨ 95 % meta',
                position: 'right',
                fill: COLOR_META,
                fontSize: 12,
                fontWeight: 700,
              }}
            />

            <Line
              type="monotone"
              dataKey="exacta"
              name="Solución analítica"
              stroke={COLOR_ANALITICA}
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="heun"
              name="Heun (RK2)"
              stroke={COLOR_HEUN}
              strokeWidth={2}
              dot={{ r: 2 }}
            />
            <Line
              type="monotone"
              dataKey="rk4"
              name="RK4"
              stroke={COLOR_RK4}
              strokeWidth={2}
              dot={{ r: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {!mostrarPlazo && plazo > 0 && (
        <p className="mt-2 text-xs font-semibold text-amber-600">
          ℹ️ El plazo ({plazo} días) está fuera del intervalo simulado [0, {resultado.T} días], por
          lo que no se dibuja la línea.
        </p>
      )}

      <ExplicacionSimple icono="🧸" titulo="¿Qué estoy viendo en esta gráfica?">
        <p>
          La <b>curva violeta</b> es la respuesta exacta de las matemáticas: cuántas peluditas
          tendrían casita en cada día. Las <b>bolitas rosas</b> (Heun) y las <b>verdes</b> (RK4)
          son dos formas de estimarla dando pasitos de{' '}
          <b>{resultado.h.toFixed(2)} día(s)</b>: mientras más juntitas estén de la curva violeta,
          mejor lo hizo el método. 💛
        </p>
        <p>
          ✨ Con los datos de esta simulación: al día <b>{resultado.T}</b>,{' '}
          <b>{resultado.final.rk4.toFixed(2)} de {resultado.N}</b> peluditas tendrían casita, es
          decir, el <b>{((resultado.final.rk4 / resultado.N) * 100).toFixed(1)} %</b> del total.
        </p>
        <p>
          La <b>línea verde punteada</b> es la meta del 95 %: cruzarla significa «casi todas a
          salvo». {plazo > 0
            ? <>La <b>línea naranja</b> es el plazo límite de Zoonosis: si la curva la cruza antes
          de esa fecha, ¡la red llega a tiempo! 🏥</>
            : 'Agrega un plazo de Zoonosis en el formulario para ver también esa fecha límite. 🏥'}
        </p>
      </ExplicacionSimple>
    </section>
  );
}
