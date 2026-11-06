function Campo({ label, unidad, hint, error, children }) {
  return (
    <div>
      <label className="mb-1 flex flex-wrap items-center text-sm font-bold text-cafe-oscuro">
        {label}
        {unidad && <span className="chip-unidad">{unidad}</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1 text-[11px] font-semibold leading-snug text-cafe-oscuro/55">{hint}</p>
      )}
      {error && <p className="mt-1 text-xs font-semibold text-rose-500">⚠️ {error}</p>}
    </div>
  );
}

export default function InputPanel({
  params,
  errores,
  onChange,
  onCalcular,
  onCalcularYGuardar,
  guardando,
}) {
  return (
    <section className="glass p-6 md:p-8">
      <h2 className="titulo-seccion">📋 Datos del operativo</h2>
      <p className="mt-1 text-sm text-cafe-oscuro/80">
        Ajusta la condición inicial, los parámetros y el paso h. Las unidades aparecen junto a cada
        campo y todo se valida antes de calcular.
      </p>

      <form
        onSubmit={onCalcular}
        noValidate
        className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <Campo
          label="🏡 Lugar del rescate"
          hint="¿Dónde se hizo el operativo? Ej.: una feria, un mercado…"
          error={errores.lugar}
        >
          <input
            className="campo"
            value={params.lugar}
            onChange={onChange('lugar')}
            placeholder="Ej. Feria 16 de Julio · El Alto"
          />
        </Campo>

        <Campo
          label="🐶 Total rescatados (N)"
          unidad="mascotas"
          hint="el total de peluditas que se rescataron ese día 🐶🐱"
          error={errores.N}
        >
          <input
            type="number"
            className="campo"
            value={params.N}
            onChange={onChange('N')}
            min="1"
            step="1"
            placeholder="20"
          />
        </Campo>

        <Campo
          label="⚡ Tasa de efectividad (k)"
          unidad="1/días"
          hint="qué tan rápida es tu pandilla de voluntarios; prueba 0.25"
          error={errores.k}
        >
          <input
            type="number"
            className="campo"
            value={params.k}
            onChange={onChange('k')}
            min="0"
            step="0.05"
            placeholder="0.25"
          />
        </Campo>

        <Campo
          label="👣 Tamaño de paso (h)"
          unidad="días"
          hint="cada cuántos días la simulación da un pasito 👣 (menor = más preciso)"
          error={errores.h}
        >
          <input
            type="number"
            className="campo"
            value={params.h}
            onChange={onChange('h')}
            min="0"
            step="0.1"
            placeholder="0.5"
          />
        </Campo>

        <Campo
          label="⏱️ Tiempo de simulación (T)"
          unidad="días"
          hint="cuántos días quieres simular en total ⏱️"
          error={errores.T}
        >
          <input
            type="number"
            className="campo"
            value={params.T}
            onChange={onChange('T')}
            min="0"
            step="1"
            placeholder="7"
          />
        </Campo>

        <Campo
          label="🏥 Plazo límite de Zoonosis (opcional)"
          unidad="días"
          hint="los días que da Zoonosis antes del plazo 🏥 (déjalo vacío si no aplica)"
          error={errores.plazo}
        >
          <input
            type="number"
            className="campo"
            value={params.plazo}
            onChange={onChange('plazo')}
            min="0"
            step="1"
            placeholder="14"
          />
        </Campo>

        <div className="flex flex-wrap items-end gap-3 md:col-span-2 lg:col-span-3">
          <button type="submit" className="btn-primario">
            🐾 Calcular simulación
          </button>
          <button
            type="button"
            onClick={onCalcularYGuardar}
            disabled={guardando}
            className="btn-secundario disabled:opacity-60"
          >
            {guardando ? '⏳ Guardando…' : '💾 Calcular y Guardar en la BD'}
          </button>
        </div>
      </form>
    </section>
  );
}
