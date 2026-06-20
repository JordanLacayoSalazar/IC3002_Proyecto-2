import { Lightbulb } from "lucide-react"
import {
    PASO_DECIMAL_NUMERICO,
    PRIORIDAD_EXACTITUD,
    PRIORIDAD_VELOCIDAD,
    TIEMPO_LIMITE_MINIMO,
} from "../constants.js"
import { CampoNumerico } from "../utils.jsx"
import "./styles/subpanelConfiguracion.css"

/*
 * Subpanel de configuración para seleccionar el algoritmo y definir las restricciones de tiempo y precisión.
 * Recibe los estados de configuración global.
 */
export default function SubPanelConfiguracion({
    prioridad,
    setPrioridad,
    tiempoLimite,
    setTiempoLimite,
}) {

    return (
        <aside className="subpanel-configuracion">
            <div className="titulo-panel">Configuración</div>
            <div className="descripcion-panel">
                <Lightbulb size={18} className="icono-apartado" />
                Configure las restricciones de negocio.
            </div>

            <div className="campo-formulario">
                <div className="subheading">Restricciones de Negocio</div>
                <div className="selector-prioridad">
                    <button
                        type="button"
                        className={`boton-prioridad ${prioridad === PRIORIDAD_EXACTITUD ? "activo" : ""}`}
                        onClick={() => setPrioridad(PRIORIDAD_EXACTITUD)}
                    >
                        Máxima Exactitud
                    </button>
                    <button
                        type="button"
                        className={`boton-prioridad ${prioridad === PRIORIDAD_VELOCIDAD ? "activo" : ""}`}
                        onClick={() => setPrioridad(PRIORIDAD_VELOCIDAD)}
                    >
                        Velocidad Máxima
                    </button>
                </div>
                <CampoNumerico
                    label="Tiempo límite (s)"
                    valor={tiempoLimite}
                    onChange={setTiempoLimite}
                    min={TIEMPO_LIMITE_MINIMO}
                    paso={PASO_DECIMAL_NUMERICO}
                />
            </div>

        </aside>
    )
}
