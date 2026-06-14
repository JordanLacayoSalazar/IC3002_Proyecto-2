import React from "react"
import { PASO_NUMERICO } from "./constants.js"

/*
 * Asegura que un valor numérico se encuentre dentro de un rango definido.
 * Recibe un valor y sus límites, y devuelve el número ajustado al rango.
 */
export function limitarValor(valor, min, max) {
    let valorNumerico = Number(valor)

    if (Number.isNaN(valorNumerico)) return min
    if (typeof max === "number") return Math.min(max, Math.max(min, valorNumerico))

    return Math.max(min, valorNumerico)
}

/*
 * Es un campo de entrada numérico con botones de incremento y decremento.
 * Recibe etiquetas, valores y el controlador de eventos onChange para renderizar cuando el número cambia.
 */
export function CampoNumerico({ label, valor, onChange, min = 0, max, paso = PASO_NUMERICO, disabled = false }) {
    // Ejecuta la disminución del valor actual basándose en el paso definido.
    function manejarDecremento() {
        onChange(limitarValor(valor - paso, min, max))
    }

    // Ejecuta el aumento del valor actual basándose en el paso definido.
    function manejarIncremento() {
        onChange(limitarValor(valor + paso, min, max))
    }

    // Procesa el cambio manual de valor desde el teclado.
    function manejarCambioManual(event) {
        onChange(limitarValor(event.target.value, min, max))
    }

    return (
        <div className={disabled ? "campo-deshabilitado" : ""}>
            <span className="etiqueta-campo">{label}</span>
            <div className="campo-numerico">
                <button
                    type="button"
                    className="boton-incremento"
                    onClick={manejarDecremento}
                    disabled={disabled}
                >
                    -
                </button>
                <input
                    type="number"
                    value={valor}
                    onChange={manejarCambioManual}
                    min={min}
                    max={max}
                    disabled={disabled}
                />
                <button
                    type="button"
                    className="boton-incremento"
                    onClick={manejarIncremento}
                    disabled={disabled}
                >
                    +
                </button>
            </div>
        </div>
    )
}
