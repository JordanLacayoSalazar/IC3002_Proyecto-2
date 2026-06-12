import React from "react"
import { Lightbulb, Timer, Calculator, ChartColumnBig } from "lucide-react"
import "./styles/subpanelEstadisticas.css"

//Subpanel para mostrar comparativas de rendimiento, tiempos de ejecución y conteo de operaciones.
export default function SubPanelEstadisticas() {
    return (
        <div className="subpanel-estadisticas">
            <div className="titulo-panel">Estadísticas</div>
            <div className="descripcion-panel">
                <Lightbulb size={18} style={{ marginRight: 6 }} />
                Se compara en milisegundos la predicción de la IA frente al 
                tiempo real de ejecución local. Registra operaciones lógicas, 
                llamadas recursivas y genera gráficos del rendimiento del algoritmo usado.
            </div>
            <div className="apartado-estadistica">
                <h3>
                    <Timer size={20} style={{ marginRight: 6 }} />
                    Tiempo de ejecución
                </h3>
                <p>Tiempo estimado de ejecución por la IA vs. Tiempo real de ejecución local</p>
                <div className="texto-estadistica">Gráfico de comparación pendiente</div>
            </div>
            <div className="apartado-estadistica">
                <h3>
                    <Calculator size={20} style={{ marginRight: 6 }} />
                    Operaciones estimadas
                </h3>
                <p>Cantidad de operaciones estimadas o llamadas recursivas realizadas</p>
                <div className="texto-estadistica">Métrica pendiente</div>
            </div>
            <div className="apartado-estadistica">
                <h3>
                    <ChartColumnBig size={20} style={{ marginRight: 6 }} />
                    Gráfica de rendimiento
                </h3>
                <p>Comparación de rendimiento para el algoritmo seleccionado</p>
                <div className="texto-estadistica">Gráfico pendiente</div>
            </div>
        </div>
    )
}
