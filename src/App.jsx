import { useRef, useState } from 'react';
import Header from './components/Header.jsx';
import Methodology from './components/Methodology.jsx';
import InputPanel from './components/InputPanel.jsx';
import ChartPanel from './components/ChartPanel.jsx';
import TablePanel from './components/TablePanel.jsx';
import ErrorCards from './components/ErrorCards.jsx';
import Conclusion from './components/Conclusion.jsx';
import HistoryPanel from './components/HistoryPanel.jsx';
import { compararPasos, simular, validarEntradas } from './lib/ode.js';
import { bdConfigurada, guardarRegistro } from './lib/sheets.js';
import { CARRERA, GESTION, MATERIA, NOMBRE_ESTUDIANTE } from './config.js';

const PARAMS_INICIALES = {
  lugar: 'Feria 16 de Julio · El Alto',
  N: 20,
  k: 0.25,
  h: 0.5,
  T: 7,
  plazo: 14,
};

export default function App() {
  const [params, setParams] = useState(PARAMS_INICIALES);
  const [errores, setErrores] = useState({});
  const [resultado, setResultado] = useState(null);
  const [comparacion, setComparacion] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mensajeBD, setMensajeBD] = useState(null);
  const resultadosRef = useRef(null);

  const cambiar = (campo) => (evento) =>
    setParams((prev) => ({ ...prev, [campo]: evento.target.value }));

  /** Valida, ejecuta los 3 métodos y guarda el resultado en el estado. */
  function ejecutar(datos) {
    const numero = {
      N: Number(datos.N),
      k: Number(datos.k),
      h: Number(datos.h),
      T: Number(datos.T),
      plazo: Number(datos.plazo) || 0,
    };
    const res = simular(numero);
    setResultado(res);
    setComparacion(compararPasos(numero));
    setTimeout(
      () => resultadosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      80
    );
    return res;
  }

  function handleCalcular(evento) {
    evento.preventDefault();
    const errs = validarEntradas(params);
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;
    ejecutar(params);
  }

  async function handleCalcularYGuardar(evento) {
    evento.preventDefault();
    const errs = validarEntradas(params);
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;

    const res = ejecutar(params);

    if (!bdConfigurada()) {
      setMensajeBD({
        tipo: 'aviso',
        texto:
          '💾 La simulación se calculó, pero la BD aún no está configurada: pega tu URL de Apps Script en src/lib/sheets.js → SHEET_API_URL (guía en el README).',
      });
      return;
    }

    setGuardando(true);
    setMensajeBD(null);
    try {
      const ganador = res.final.errAbsRK4 <= res.final.errAbsHeun ? 'RK4' : 'Heun';
      await guardarRegistro({
        lugar: String(params.lugar).trim(),
        N: Number(params.N),
        k: Number(params.k),
        h: Number(res.h),
        T: Number(params.T),
        salvados: Number(res.final.rk4.toFixed(3)),
        porcentaje: Number(((res.final.rk4 / Number(params.N)) * 100).toFixed(2)),
        errAbsHeun: res.final.errAbsHeun,
        errRelHeun: res.final.errRelHeun ?? '',
        errAbsRK4: res.final.errAbsRK4,
        errRelRK4: res.final.errRelRK4 ?? '',
        metodoGanador: ganador,
      });
      setMensajeBD({
        tipo: 'ok',
        texto: '🏡 ¡Registro guardado en la base de datos con éxito!',
      });
    } catch (err) {
      setMensajeBD({ tipo: 'error', texto: `No se pudo guardar: ${err.message}` });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-8 md:py-12">
      {/* Huellitas decorativas flotantes */}
      <span className="pointer-events-none absolute left-0 top-40 animate-flotar select-none text-4xl opacity-25">
        🐾
      </span>
      <span
        className="pointer-events-none absolute right-2 top-96 animate-flotar select-none text-5xl opacity-20"
        style={{ animationDelay: '1.5s' }}
      >
        🐾
      </span>
      <span
        className="pointer-events-none absolute bottom-1/3 left-6 animate-flotar select-none text-3xl opacity-20"
        style={{ animationDelay: '3s' }}
      >
        ✨
      </span>

      <div className="space-y-8">
        <Header />
        <Methodology params={params} />
        <InputPanel
          params={params}
          errores={errores}
          onChange={cambiar}
          onCalcular={handleCalcular}
          onCalcularYGuardar={handleCalcularYGuardar}
          guardando={guardando}
        />

        {mensajeBD && (
          <div
            className={`rounded-2xl border-2 px-4 py-3 text-sm font-semibold ${
              mensajeBD.tipo === 'ok'
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                : mensajeBD.tipo === 'aviso'
                  ? 'border-amber-300 bg-amber-50 text-amber-700'
                  : 'border-rose-300 bg-rose-50 text-rose-500'
            }`}
          >
            {mensajeBD.texto}
          </div>
        )}

        <div ref={resultadosRef} className="space-y-8">
          {resultado && comparacion && (
            <>
              <ChartPanel resultado={resultado} plazo={Number(params.plazo) || 0} />
              <ErrorCards final={resultado.final} comparacion={comparacion} />
              <Conclusion resultado={resultado} params={params} />
              <TablePanel filas={resultado.filas} />
            </>
          )}
        </div>

        <HistoryPanel />

        <footer className="glass p-6 text-center text-sm">
          <p className="font-display text-lg font-bold text-purple-600">
            🐾 Huellitas a Salvo: Misión Segunda Oportunidad
          </p>
          <p className="mt-1 text-cafe-oscuro/80">
            {NOMBRE_ESTUDIANTE} · {CARRERA} · {MATERIA} · {GESTION}
          </p>
          <p className="mt-1 text-xs text-cafe-oscuro/60">
            Parámetros hipotéticos con fines académicos · Hecho con 💜, React y métodos numéricos
          </p>
        </footer>
      </div>
    </div>
  );
}
