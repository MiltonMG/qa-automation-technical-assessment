
/**
 * La regex: /Total: \$[\d.]+/
 * ----------------------------
 * Esta expresión busca un texto que muestre el total del precio en pantalla.
 * Analicemos cada parte como si fuera una oración:
 *
 *   /  ...  /
 *   │       └─ Cierre: le dice a JavaScript que aquí termina el patrón.
 *   └───────── Apertura: le dice a JavaScript que aquí empieza un patrón regex.
 *
 *   T o t a l :
 *   └──────────── Texto literal. Busca exactamente la palabra "Total: " con
 *                 el espacio incluido. No acepta variaciones como "total:" o "TOTAL:".
 *
 *   \$
 *   └── El símbolo de dólar $. Se escribe con \ adelante porque en regex el $
 *       solo significa "fin de línea". El \ le dice: "tómalo como símbolo literal".
 *
 *   [ \d . ]
 *   │  │   └─ Un punto (.). Dentro de [ ] el punto es literal, no especial.
 *   │  └───── \d significa cualquier dígito del 0 al 9.
 *   └──────── Los corchetes [ ] significan: "acepta cualquier cosa de esta lista".
 *             Entonces [\d.] = "un dígito O un punto".
 *
 *   +
 *   └── Significa "uno o más veces". Le dice que el patrón [\d.] puede repetirse.
 *       Sin el +, solo buscaría un único carácter.
 *
 *
 * Ejemplos de texto que SÍ hacen match:
 *   ✅  "Total: $29.99"
 *   ✅  "Total: $5"
 *   ✅  "Total: $100.00"
 *   ✅  "Total: $0.50"
 *
 * Ejemplos de texto que NO hacen match:
 *   ❌  "total: $29.99"   → la T debe ser mayúscula
 *   ❌  "Total: 29.99"    → falta el símbolo $
 *   ❌  "Total: $"        → falta al menos un dígito después del $
 */
const validarPrecioRegex = /Total: \$[\d.]+/;


export { validarPrecioRegex };