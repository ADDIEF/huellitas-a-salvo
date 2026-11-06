// =====================================================================
// 🗄️ Base de datos — Google Sheets vía Apps Script (costo $0, para siempre)
//
// CÓMO CONFIGURARLA (5 minutos, guía completa en el README):
//   1. Crea una hoja de cálculo nueva en Google Sheets.
//   2. Menú Extensiones → Apps Script y pega el código de
//      apps-script/Code.gs (está en este proyecto).
//   3. Implementar → Nueva implementación → Aplicación web
//      · Ejecutar como: Yo
//      · Quién tiene acceso: Cualquier persona
//   4. Copia la URL que termina en /exec y PÉGALA AQUÍ ABAJO ⬇️
// =====================================================================

export const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbwbkCX4H12Zgr5PGTqzdrxK3EYSdhBXLUKddk8cRKl-soHuzYvOGGuHSUJHnRQdpV4X/exec';

/** true si ya pegaste la URL de tu Apps Script. */
export const bdConfigurada = () =>
  Boolean(SHEET_API_URL) && SHEET_API_URL !== 'https://script.google.com/macros/s/AKfycbwbkCX4H12Zgr5PGTqzdrxK3EYSdhBXLUKddk8cRKl-soHuzYvOGGuHSUJHnRQdpV4X/exec';

/**
 * Guarda un registro del operativo (POST).
 * Se envía como text/plain para evitar el preflight CORS de Apps Script.
 * También es compatible con servicios tipo Sheet.best si algún día
 * decides cambiar la URL.
 */
export async function guardarRegistro(registro) {
  if (!bdConfigurada()) {
    throw new Error(
      'La base de datos aún no está configurada: pega tu URL de Apps Script en SHEET_API_URL (src/lib/sheets.js).'
    );
  }
  const res = await fetch(SHEET_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(registro),
    redirect: 'follow',
  });
  if (!res.ok) {
    throw new Error(`Error ${res.status} al guardar en la hoja de cálculo.`);
  }
  return true;
}

/** Lee el historial de operativos guardados (GET). */
export async function obtenerHistorial() {
  if (!bdConfigurada()) {
    throw new Error(
      'La base de datos aún no está configurada: pega tu URL de Apps Script en SHEET_API_URL (src/lib/sheets.js).'
    );
  }
  const res = await fetch(SHEET_API_URL, { redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`Error ${res.status} al leer la hoja de cálculo.`);
  }
  return res.json();
}
