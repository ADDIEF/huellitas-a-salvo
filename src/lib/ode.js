// =====================================================================
// 🐾 Huellitas a Salvo — Motor numérico
//
// EDO a resolver:  dR/dt = k·(N − R)      con condición inicial R(0) = 0
//
//   R(t): mascotas puestas a salvo en hogares temporales  [mascotas]
//   t   : tiempo transcurrido desde el operativo          [días]
//   N   : total de mascotas rescatadas                    [mascotas]
//   k   : tasa de efectividad de la red de voluntarios    [1/días]
//
// Métodos implementados desde cero:
//   · Solución analítica exacta:  R(t) = N·(1 − e^(−k·t))
//   · Heun (Runge-Kutta de 2.º orden)
//   · Runge-Kutta clásico de 4.º orden (RK4)
// =====================================================================

/** Límite de pasos para no congelar el navegador. */
export const MAX_PASOS = 5000;

/**
 * Lado derecho de la EDO: f(t, R) = k·(N − R).
 * La velocidad de rescate es proporcional a las mascotas que aún faltan
 * por colocar: al inicio es alta y se frena cuando casi todas están a salvo.
 */
export const f = (t, R, N, k) => k * (N - R);

/**
 * Solución analítica exacta: R(t) = N·(1 − e^(−k·t)).
 *
 * Comprobación por sustitución:
 *   dR/dt = N·k·e^(−kt)
 *   k·(N − R) = k·(N − N·(1 − e^(−kt))) = k·N·e^(−kt)   ✔ coincide
 *   R(0) = N·(1 − e⁰) = N·(1 − 1) = 0 = y₀              ✔ cumple la CI
 */
export const solucionExacta = (t, N, k) => N * (1 - Math.exp(-k * t));

/**
 * Método de Heun (Runge-Kutta de 2.º orden).
 *
 *   Predictor:  y*  = yₙ + h·f(tₙ, yₙ)
 *   Corrector:  yₙ₊₁ = yₙ + (h/2)·[f(tₙ, yₙ) + f(tₙ₊₁, y*)]
 *
 * Error local O(h³) · Error global O(h²)
 */
export function heun(N, k, y0, h, pasos) {
  const valores = new Array(pasos + 1);
  valores[0] = y0;
  let y = y0;
  for (let i = 1; i <= pasos; i++) {
    const t0 = (i - 1) * h;
    const t1 = i * h;
    const yPred = y + h * f(t0, y, N, k); // 1) predice con Euler
    y = y + (h / 2) * (f(t0, y, N, k) + f(t1, yPred, N, k)); // 2) corrige
    valores[i] = y;
  }
  return valores;
}

/**
 * Método clásico de Runge-Kutta de 4.º orden (RK4).
 *
 *   k₁ = f(tₙ, yₙ)
 *   k₂ = f(tₙ + h/2, yₙ + (h/2)·k₁)
 *   k₃ = f(tₙ + h/2, yₙ + (h/2)·k₂)
 *   k₄ = f(tₙ + h,   yₙ + h·k₃)
 *   yₙ₊₁ = yₙ + (h/6)·(k₁ + 2k₂ + 2k₃ + k₄)
 *
 * Error local O(h⁵) · Error global O(h⁴)
 */
export function rk4(N, k, y0, h, pasos) {
  const valores = new Array(pasos + 1);
  valores[0] = y0;
  let y = y0;
  for (let i = 1; i <= pasos; i++) {
    const t0 = (i - 1) * h;
    const k1 = f(t0, y, N, k);
    const k2 = f(t0 + h / 2, y + (h / 2) * k1, N, k);
    const k3 = f(t0 + h / 2, y + (h / 2) * k2, N, k);
    const k4 = f(t0 + h, y + h * k3, N, k);
    y = y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    valores[i] = y;
  }
  return valores;
}

const errorAbsoluto = (exacto, aprox) => Math.abs(exacto - aprox);

// La guía pide el error relativo % solo cuando el valor exacto no es cero
// (en t = 0 la solución exacta es 0 y la división no está definida → null).
const errorRelativo = (exacto, aprox) =>
  exacto !== 0 ? (Math.abs(exacto - aprox) / Math.abs(exacto)) * 100 : null;

/**
 * Ejecuta la simulación completa (analítica + Heun + RK4) en [0, T].
 *
 * Si T/h no da un número entero de pasos, h se ajusta ligeramente
 * (hEfectivo = T/pasos) para que la última iteración caiga exactamente
 * en T — criterio estándar cuando se fija el intervalo de simulación.
 */
export function simular({ N, k, h, T, y0 = 0 }) {
  const pasos = Math.min(Math.max(Math.round(T / h), 1), MAX_PASOS);
  const hEfectivo = T / pasos;

  const arrHeun = heun(N, k, y0, hEfectivo, pasos);
  const arrRK4 = rk4(N, k, y0, hEfectivo, pasos);

  const filas = new Array(pasos + 1);
  for (let i = 0; i <= pasos; i++) {
    const t = i * hEfectivo;
    const exacta = solucionExacta(t, N, k);
    filas[i] = {
      i,
      t,
      exacta,
      heun: arrHeun[i],
      rk4: arrRK4[i],
      errAbsHeun: errorAbsoluto(exacta, arrHeun[i]),
      errRelHeun: errorRelativo(exacta, arrHeun[i]),
      errAbsRK4: errorAbsoluto(exacta, arrRK4[i]),
      errRelRK4: errorRelativo(exacta, arrRK4[i]),
    };
  }

  const final = filas[pasos];
  return {
    N,
    k,
    T,
    y0,
    h: hEfectivo,
    pasos,
    filas,
    final: {
      t: final.t,
      exacta: final.exacta,
      heun: final.heun,
      rk4: final.rk4,
      errAbsHeun: final.errAbsHeun,
      errRelHeun: final.errRelHeun,
      errAbsRK4: final.errAbsRK4,
      errRelRK4: final.errRelRK4,
    },
    // Tiempos teóricos para alcanzar el 95 % y el 99 % de N:
    // N·(1 − e^(−kt)) = p·N  ⟺  t = −ln(1 − p)/k
    t95: -Math.log(0.05) / k,
    t99: -Math.log(0.01) / k,
  };
}

/**
 * Repite la simulación con el paso h₁ y con h₂ = h₁/2, para comparar los
 * errores globales finales (la guía exige comparar al menos dos tamaños
 * de paso). Teoría: al dividir h entre 2, el error O(h²) baja ≈ ×4 y el
 * O(h⁴) baja ≈ ×16.
 */
export function compararPasos({ N, k, h, T }) {
  const r1 = simular({ N, k, h, T });
  const r2 = simular({ N, k, h: h / 2, T });
  return {
    h1: { h: r1.h, errHeun: r1.final.errAbsHeun, errRK4: r1.final.errAbsRK4 },
    h2: { h: r2.h, errHeun: r2.final.errAbsHeun, errRK4: r2.final.errAbsRK4 },
  };
}

/**
 * Validación básica de entradas del formulario.
 * Devuelve un objeto { campo: mensaje } — vacío si todo es válido.
 */
export function validarEntradas({ lugar, N, k, h, T, plazo }) {
  const e = {};

  if (!String(lugar ?? '').trim()) {
    e.lugar = 'Indica el lugar del operativo 🐾';
  }

  const n = Number(N);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 1 || n > 10000) {
    e.N = 'N debe ser un entero entre 1 y 10 000 [mascotas].';
  }

  const kk = Number(k);
  if (!Number.isFinite(kk) || kk <= 0 || kk > 10) {
    e.k = 'k debe ser mayor que 0 y como máximo 10 [1/días].';
  }

  const tt = Number(T);
  if (!Number.isFinite(tt) || tt <= 0 || tt > 365) {
    e.T = 'T debe estar entre 0 (excluido) y 365 [días].';
  }

  const hh = Number(h);
  if (!Number.isFinite(hh) || hh <= 0) {
    e.h = 'h debe ser mayor que 0 [días].';
  } else if (Number.isFinite(tt) && tt > 0) {
    if (hh > tt) {
      e.h = 'h no puede ser mayor que el tiempo total T.';
    } else {
      const pasos = Math.round(tt / hh);
      if (pasos > MAX_PASOS) {
        e.h = `Con h = ${hh} y T = ${tt} habría ${pasos} pasos (máx. ${MAX_PASOS}). Aumenta h o reduce T.`;
      }
    }
  }

  if (plazo !== '' && plazo != null) {
    const p = Number(plazo);
    if (!Number.isFinite(p) || p <= 0 || p > 365) {
      e.plazo = 'El plazo debe estar entre 0 (excluido) y 365 [días].';
    }
  }

  return e;
}
