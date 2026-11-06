# 🐾 Huellitas a Salvo: Misión Segunda Oportunidad

Simulación web de un problema comunitario real modelado con una **EDO lineal de primer orden con
condición inicial**, resuelta de tres formas: **solución analítica**, **Heun (RK2)** y
**Runge-Kutta de 4.º orden (RK4)**, con comparación de errores y base de datos en Google Sheets.

- **Materia:** Métodos Numéricos — Desafío individual
- **Tema:** Bienestar animal (reencuentro y adopción de mascotas)
- **Comunidad beneficiaria:** El Alto (operativo en la Feria 16 de Julio)

---

## 1. Problema y contexto

Tras un operativo en la Feria 16 de Julio de El Alto, varias mascotas rescatadas de la venta ilegal
quedan bajo custodia de Zoonosis, que solo puede mantenerlas un **tiempo límite**. Una **red
comunitaria de voluntarios** busca hogares temporales, una por una.

**Pregunta del desafío:** ¿cuánto tiempo necesitará la red de voluntarios para poner a salvo a las
mascotas antes de que venza el plazo de Zoonosis?

## 2. Modelo matemático

$$\frac{dR}{dt} = k\,(N - R), \qquad R(0) = 0$$

| Variable / parámetro | Significado | Unidad |
|---|---|---|
| `R(t)` | Mascotas puestas a salvo en hogares temporales | mascotas |
| `t` | Tiempo transcurrido desde el operativo | días |
| `N` | Total de mascotas rescatadas | mascotas |
| `k` | Tasa de efectividad de la red de voluntarios | 1/días |

**Justificación:** la velocidad de rescate es proporcional a las mascotas que aún faltan por
colocar (N − R): al inicio la red trabaja rápido; cuando casi todas están a salvo, el ritmo cae.

### Solución analítica

$$R(t) = N\left(1 - e^{-kt}\right)$$

**Comprobación por sustitución:**
- `dR/dt = N·k·e^(−kt)` y `k·(N − R) = k·(N − N·(1 − e^(−kt))) = k·N·e^(−kt)` ✔ coinciden.
- `R(0) = N·(1 − e⁰) = 0 = y₀` ✔ cumple la condición inicial.

**Nota:** N es una asíntota: la curva nunca alcanza exactamente el 100 %. El 95 % se alcanza en
`t₉₅ = −ln(0.05)/k ≈ 3/k` días y el 99 % en `t₉₉ = −ln(0.01)/k ≈ 4.6/k` días.

### Métodos numéricos (implementados desde cero en `src/lib/ode.js`)

**Heun (RK2):**
```
y*    = yₙ + h·f(tₙ, yₙ)
yₙ₊₁  = yₙ + (h/2)·[f(tₙ, yₙ) + f(tₙ₊₁, y*)]        (error global O(h²))
```

**Runge-Kutta 4:**
```
k₁ = f(tₙ, yₙ)              k₃ = f(tₙ + h/2, yₙ + (h/2)·k₂)
k₂ = f(tₙ + h/2, yₙ + (h/2)·k₁)   k₄ = f(tₙ + h, yₙ + h·k₃)
yₙ₊₁ = yₙ + (h/6)·(k₁ + 2k₂ + 2k₃ + k₄)            (error global O(h⁴))
```

La app compara ambos métodos con el mismo `h`, calcula el **error absoluto** y el **error relativo
porcentual** frente a la analítica (mostrando «—» cuando la exacta es 0), y repite todo con
`h₂ = h₁/2` para comparar **dos tamaños de paso** (reducción teórica ≈ ×4 en Heun y ≈ ×16 en RK4).

## 3. Cómo ejecutar el proyecto

```bash
# 1) Instalar dependencias
npm install

# 2) Servidor de desarrollo (abre http://localhost:5173/huellitas-a-salvo/)
npm run dev

# 3) Build de producción (carpeta dist/)
npm run build

# 4) Previsualizar el build localmente
npm run preview
```

## 4. Base de datos en Google Sheets (costo $0)

Se usa un **Apps Script Web App** como mini-backend (lectura y escritura gratis para siempre):

1. Crea una hoja de cálculo nueva en [Google Sheets](https://sheets.google.com).
2. Menú **Extensiones → Apps Script**.
3. Borra el contenido y pega el código de [`apps-script/Code.gs`](apps-script/Code.gs).
4. Guarda (💾) → **Implementar → Nueva implementación → Aplicación web**:
   - *Ejecutar como:* **Yo**
   - *Quién tiene acceso:* **Cualquier persona**
5. Copia la URL que termina en **/exec**.
6. Pégala en [`src/lib/sheets.js`](src/lib/sheets.js):
   ```js
   export const SHEET_API_URL = 'https://script.google.com/macros/s/.../exec';
   ```
7. Vuelve a desplegar (cada cambio en `sheets.js` requiere un nuevo deploy de la web).

> Sin URL configurada, la simulación funciona igual; solo se deshabilita guardar/leer la BD.

## 5. Publicación en GitHub Pages

1. Crea un repositorio llamado **`huellitas-a-salvo`** en GitHub
   (si usas otro nombre, edita `base` en [`vite.config.js`](vite.config.js)).
2. Sube el código:
   ```bash
   git init -b main
   git add .
   git commit -m "🐾 Huellitas a Salvo: simulador EDO + Heun + RK4"
   git remote add origin https://github.com/TU_USUARIO/huellitas-a-salvo.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Cada `git push` ejecutará automáticamente el workflow
   [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) y publicará la app en:
   `https://TU_USUARIO.github.io/huellitas-a-salvo/`

## 6. Estructura del proyecto

```
huellitas-a-salvo/
├── apps-script/Code.gs        ← mini-backend de la BD (pegar en Apps Script)
├── .github/workflows/deploy.yml ← auto-deploy a GitHub Pages
├── src/
│   ├── App.jsx                ← layout, estado y flujo principal
│   ├── config.js              ← nombre del estudiante, materia, etc.
│   ├── lib/
│   │   ├── ode.js             ← f(t,R), analítica, Heun, RK4, errores, validación
│   │   └── sheets.js          ← POST/GET a la hoja (SHEET_API_URL)
│   └── components/
│       ├── Header.jsx         ← problema, pregunta del desafío y la EDO
│       ├── Methodology.jsx    ← variables, unidades, comprobación, supuestos
│       ├── InputPanel.jsx     ← formulario con validación y unidades
│       ├── ChartPanel.jsx     ← gráfica (Recharts) con plazo de Zoonosis
│       ├── TablePanel.jsx     ← tabla iterativa con errores
│       ├── ErrorCards.jsx     ← errores finales + comparación h₁ vs h₂
│       ├── Conclusion.jsx     ← interpretación automática
│       └── HistoryPanel.jsx   ← historial leído desde la BD
└── index.html
```

## 7. Aclaración de calidad

Los parámetros son **hipotéticos y con fines académicos**. La simulación describe el comportamiento
del modelo matemático y la precisión de los métodos numéricos; **no es una predicción comprobada
con datos reales**.

---

✍️ *Autora: Adriana Valeria Fernandez Flores — Mención: Desarrollo de Software · Métodos Numéricos, Gestión 2026.*
