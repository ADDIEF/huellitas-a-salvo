/**
 * 🧸 Caja de "explicación en palabras sencillas".
 * Acompaña a la explicación matemática con lenguaje para todo el público,
 * y puede recibir valores vivos de la simulación actual.
 */
export default function ExplicacionSimple({
  titulo = 'En palabras sencillas',
  icono = '💛',
  children,
}) {
  return (
    <div className="mt-4 rounded-2xl border-2 border-dashed border-pink-300/70 bg-gradient-to-br from-rosita-suave/70 to-lila-suave/60 p-4">
      <p className="font-display text-sm font-bold text-pink-600">
        {icono} {titulo}
        <span className="ml-2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-pink-400">
          explicación para todos
        </span>
      </p>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-cafe-oscuro">{children}</div>
    </div>
  );
}
