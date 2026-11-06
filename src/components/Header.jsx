export default function Header() {
  return (
    <header className="glass relative overflow-hidden p-6 text-center md:p-10">
      <span className="pointer-events-none absolute -right-4 -top-8 select-none text-8xl opacity-15 md:text-9xl">
        🐶
      </span>
      <span className="pointer-events-none absolute -left-6 bottom--2 select-none text-8xl opacity-15 md:text-9xl">
        🐱
      </span>

      <p className="text-xs font-bold uppercase tracking-[0.25em] text-cafe md:text-sm">
        Métodos Numéricos · Desafío individual · EDO de primer orden
      </p>

      <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight md:text-5xl">
        <span className="text-purple-500">🐾 Huellitas a Salvo</span>
        <span className="text-orange-500">: Misión Segunda Oportunidad</span>
        <span className="text-pink-400"> ✨</span>
      </h1>

      <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed md:text-base">
        Tras un operativo en la <b>Feria 16 de Julio de El Alto</b>, varios perritos y gatitos
        rescatados de la venta ilegal quedan bajo custodia de <b>Zoonosis</b>, que solo puede
        mantenerlos un <b>tiempo límite</b>. Una <b>red comunitaria de voluntarios</b> 🏡 los busca
        hogares temporales, uno por uno, antes de que venza el plazo.
      </p>

      <div className="mx-auto mt-5 max-w-2xl rounded-2xl border-2 border-dashed border-purple-300 bg-white/50 px-4 py-3">
        <p className="text-sm font-semibold text-purple-600 md:text-base">
          ❓ Pregunta del desafío:{' '}
          <span className="text-cafe-oscuro">
            ¿cuánto tiempo necesitará la red de voluntarios para poner a salvo a las mascotas antes
            de que venza el plazo de Zoonosis?
          </span>
        </p>
      </div>

      <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-purple-500/10 px-5 py-3">
        <code className="font-mono text-base font-bold text-purple-700 md:text-lg">
          dR/dt = k·(N − R)
        </code>
        <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-cafe md:text-sm">
          condición inicial: R(0) = 0
        </span>
      </div>
    </header>
  );
}
