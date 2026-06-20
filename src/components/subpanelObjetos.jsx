import { Lightbulb, Dices } from "lucide-react"
import { motion } from "framer-motion"
import {
    CAPACIDAD_MINIMA,
    CANTIDAD_MAXIMA_OBJETOS,
    CANTIDAD_MINIMA_OBJETOS,
    PASO_ENTERO_NUMERICO,
    PESO_OBJETO_MINIMO,
    VALOR_OBJETO_MINIMO,
} from "../constants.js"
import { CampoNumerico } from "../utils.jsx"
import "./styles/subpanelObjetos.css"

/*
 * Subpanel lateral para gestionar la capacidad de la mochila y la lista de objetos disponibles.
 * Recibe la configuración actual de objetos y permite editar sus pesos y valores manualmente.
 */
export default function SubPanelObjetos({
    cantidad,
    setCantidad,
    capacidad,
    setCapacidad,
    objetos,
    onObjetoChange,
    onGenerarAleatorio,
}) {

    // Crea el componente visual para cada objeto de la lista.
    function renderizarObjeto(it, idx) {
        // Reduce el peso del objeto actual.
        function bajarPeso() {
            onObjetoChange(idx, "peso", Math.max(PESO_OBJETO_MINIMO, it.peso - PASO_ENTERO_NUMERICO))
        }
        // Aumenta el peso del objeto actual.
        function subirPeso() {
            onObjetoChange(idx, "peso", it.peso + PASO_ENTERO_NUMERICO)
        }
        // Reduce el valor del objeto actual.
        function bajarValor() {
            onObjetoChange(idx, "valor", Math.max(VALOR_OBJETO_MINIMO, it.valor - PASO_ENTERO_NUMERICO))
        }
        // Aumenta el valor del objeto actual.
        function subirValor() {
            onObjetoChange(idx, "valor", it.valor + PASO_ENTERO_NUMERICO)
        }

        return (
            <div key={it.id} className="fila-objeto">
                <div className="id-objeto">#{it.id}</div>
                <div className="campo-objeto">
                    <div className="campo-numerico">
                        <motion.button type="button" className="boton-incremento" onClick={bajarPeso} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>−</motion.button>
                        <div style={{ fontSize: "0.9rem", textAlign: "center", flex: 1 }}>Peso: {it.peso}</div>
                        <motion.button type="button" className="boton-incremento" onClick={subirPeso} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>+</motion.button>
                    </div>
                </div>
                <div className="campo-objeto">
                    <div className="campo-numerico">
                        <motion.button type="button" className="boton-incremento" onClick={bajarValor} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>−</motion.button>
                        <div style={{ fontSize: "0.9rem", textAlign: "center", flex: 1 }}>Valor: {it.valor}</div>
                        <motion.button type="button" className="boton-incremento" onClick={subirValor} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>+</motion.button>
                    </div>
                </div>
            </div>
        )
    }

    // Gestiona el cambio de cantidad desde el input de rango.
    function manejarCambioCantidad(event) {
        setCantidad(Number(event.target.value))
    }

    return (
        <aside className="subpanel-objetos">
            <div className="titulo-panel">Mochila y objetos</div>
            <div className="descripcion-panel">
                <Lightbulb size={18} style={{ marginRight: 6 }} />
                Ajuste la cantidad de objetos. Modifique 
                manualmente la capacidad de la mochila, y 
                los pesos y valores de los objetos, o genérelos aleatoriamente.
            </div>

            <div className="campo-formulario">
                <label>Cantidad de objetos: {cantidad}</label>
                <input
                    type="range"
                    min={CANTIDAD_MINIMA_OBJETOS}
                    max={CANTIDAD_MAXIMA_OBJETOS}
                    value={cantidad}
                    onChange={manejarCambioCantidad}
                />
            </div>

            <div className="lista-objetos">
                <div className="campo-formulario">
                    <motion.button
                        className="boton-generar-aleatorio"
                        onClick={onGenerarAleatorio}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Dices size={18} style={{ marginRight: 6 }} />
                        Generar capacidad, pesos y valores aleatorios
                    </motion.button>
                </div>

                <div className="campo-formulario">
                    <CampoNumerico
                        label="Peso de la mochila (W)"
                        valor={capacidad}
                        onChange={setCapacidad}
                        min={CAPACIDAD_MINIMA}
                    />
                </div>

                <div className="fila-encabezado" />
                <span className="etiqueta-campo">Objetos</span>
                {objetos.map(renderizarObjeto)}
            </div>
        </aside>
    )
}
