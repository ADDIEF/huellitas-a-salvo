import { useState } from 'react';
import { bdConfigurada, obtenerHistorial } from '../lib/sheets.js';

export default function HistoryPanel() {
  const [abierto, setAbierto] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [filas, setFilas] = useState([]);

  async function cargar() {
    setAbierto(true);
    if (!bdConfigurada()) {
      setError(
        'La base de datos aún no está configurada. Sigue los pasos del README (Google Apps Script) y pega tu URL en src/lib/sheets.js → SHEET_API_URL.'
      );
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const datos = await obtenerHistorial();
      const lista = Array.isArray(datos) ? datos : datos?.data ?? [];
      setFilas(lista.slice().reverse()); // lo más nuevo primero
    } catch (err) {
      setError(`No se pudo leer la hoja de cálculo: ${err.message}`);
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="glass p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="titulo-seccion">🗄️ Historial de operativos (Base de datos)</h2>
          <p className="mt-1 text-sm text-cafe-oscuro/80">
            Cada «Calcular y Guardar» envía los parámetros y los errores a una hoja de Google Sheets
            mediante Apps Script (100 % gratuito).
          </p>
        </div>
        <button type="button" onClick={cargar} className="btn-secundario">
          {abierto ? '🔄 Actualizar' : '📋 Ver historial'}
        </button>
      </div>

      {abierto && (
        <div className="mt-4">
          {cargando && (
            <p className="rounded-2xl bg-purple-100/70 px-4 py-3 text-sm font-semibold text-purple-600">
              ⏳ Cargando registros…
            </p>
          )}

          {!cargando && error && (
            <p className="rounded-2xl border-2 border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-500">
              ⚠️ {error}
            </p>
          )}

          {!cargando && !error && filas.length === 0 && (
            <p className="rounded-2xl bg-pink-50 px-4 py-3 text-sm font-semibold text-cafe">
              🐾 Aún no hay registros guardados. Calcula una simulación y pulsa «💾 Calcular y
              Guardar en la BD».
            </p>
          )}

          {!cargando && !error && filas.length > 0 && (
            <div className="max-h-80 overflow-auto rounded-2xl border-2 border-purple-100">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="sticky top-0 bg-purple-100/95 text-purple-700 backdrop-blur">
                  <tr>
                    <th className="px-3 py-2.5 font-bold">Fecha</th>
                    <th className="px-3 py-2.5 font-bold">Lugar</th>
                    <th className="px-3 py-2.5 font-bold">N</th>
                    <th className="px-3 py-2.5 font-bold">k</th>
                    <th className="px-3 py-2.5 font-bold">h</th>
                    <th className="px-3 py-2.5 font-bold">Salvados</th>
                    <th className="px-3 py-2.5 font-bold">%</th>
                    <th className="px-3 py-2.5 font-bold">Ganador</th>
                  </tr>
                </thead>
                <tbody>
                  {filas.map((fila, idx) => (
                    <tr key={idx} className="border-t border-purple-100 hover:bg-pink-50/70">
                      <td className="px-3 py-1.5 text-cafe-oscuro/80">
                        {new Date(fila.fecha).toLocaleString('es-BO', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td className="px-3 py-1.5 font-semibold text-cafe-oscuro">{fila.lugar}</td>
                      <td className="px-3 py-1.5 font-mono">{fila.N}</td>
                      <td className="px-3 py-1.5 font-mono">{fila.k}</td>
                      <td className="px-3 py-1.5 font-mono">{fila.h}</td>
                      <td className="px-3 py-1.5 font-mono">{fila.salvados}</td>
                      <td className="px-3 py-1.5 font-mono">{fila.porcentaje} %</td>
                      <td className="px-3 py-1.5 font-bold text-purple-600">{fila.metodoGanador}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
