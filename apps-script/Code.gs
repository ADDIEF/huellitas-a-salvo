// =====================================================================
// 🐾 Huellitas a Salvo — Mini-backend con Google Apps Script (GRATIS)
//
// CÓMO USARLO (5 minutos):
//   1. Abre tu hoja de cálculo de Google Sheets.
//   2. Menú: Extensiones → Apps Script.
//   3. Borra lo que haya y pega ESTE archivo completo.
//   4. Guarda (💾) y luego: Implementar → Nueva implementación
//      · Tipo: Aplicación web
//      · Ejecutar como: Yo
//      · Quién tiene acceso: Cualquier persona
//   5. Copia la URL que termina en /exec
//   6. Pégala en el proyecto:  src/lib/sheets.js → SHEET_API_URL
//
// La hoja "Registros" se crea sola con sus encabezados al primer uso.
// =====================================================================

const NOMBRE_HOJA = 'Registros';
const ENCABEZADOS = [
  'fecha',
  'lugar',
  'N',
  'k',
  'h',
  'T',
  'salvados',
  'porcentaje',
  'errAbsHeun',
  'errRelHeun',
  'errAbsRK4',
  'errRelRK4',
  'metodoGanador',
];

function obtenerHoja() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = libro.getSheetByName(NOMBRE_HOJA);
  if (!hoja) {
    hoja = libro.insertSheet(NOMBRE_HOJA);
    hoja.appendRow(ENCABEZADOS);
  }
  return hoja;
}

// POST: guarda un registro enviado por la web
function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const hoja = obtenerHoja();
    hoja.appendRow([
      new Date(),
      d.lugar,
      d.N,
      d.k,
      d.h,
      d.T,
      d.salvados,
      d.porcentaje,
      d.errAbsHeun,
      d.errRelHeun,
      d.errAbsRK4,
      d.errRelRK4,
      d.metodoGanador,
    ]);
    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(error) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// GET: devuelve el historial completo como JSON
function doGet() {
  const hoja = obtenerHoja();
  const valores = hoja.getDataRange().getValues();
  const filas = [];
  for (let i = 1; i < valores.length; i++) {
    const fila = valores[i];
    if (String(fila[0] ?? '').trim() === '') continue;
    const obj = {};
    ENCABEZADOS.forEach((columna, j) => {
      obj[columna] = fila[j] instanceof Date ? fila[j].toISOString() : fila[j];
    });
    filas.push(obj);
  }
  return ContentService.createTextOutput(JSON.stringify(filas)).setMimeType(
    ContentService.MimeType.JSON
  );
}
