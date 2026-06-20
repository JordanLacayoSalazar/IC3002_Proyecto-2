import { useState } from "react"
import { Cog, Box, ImagePlay, ChartNoAxesCombined } from "lucide-react"
import SubPanelConfiguracion from "./subpanelConfiguracion.jsx"
import SubPanelVisualizacion from "./subpanelVisualizacion.jsx"
import SubPanelEstadisticas from "./subpanelEstadisticas.jsx"
import SubPanelObjetos from "./subpanelObjetos.jsx"
import "./styles/panelPrincipal.css"

/*
 * Contenedor principal de la columna izquierda que gestiona la navegación entre los distintos subpaneles.
 * Recibe los estados y funciones de la aplicación para distribuirlos en las pestañas de configuración y objetos.
 */
export default function PanelPrincipal({
    algoritmo,
    cantidad,
    setCantidad,
    capacidad,
    setCapacidad,
    objetos,
    onObjetoChange,
    prioridad,
    setPrioridad,
    tiempoLimite,
    setTiempoLimite,
    estadisticas,
    onGenerarAleatorio,
    mochila,
}) {
    const [seccionActiva, setSeccionActiva] = useState("configuracion")

    return (
        <aside className="panel-principal">
            <div className="titulo-panel">Panel Principal</div>
            <div className="botones-seccion">
                <button
                    className={`boton-subpanel ${seccionActiva === "configuracion" ? "activo" : ""}`}
                    onClick={function () { setSeccionActiva("configuracion") }}
                >
                    <Cog size={20} className="icono-apartado" />
                    Configuración
                </button>
                <button
                    className={`boton-subpanel ${seccionActiva === "objetos" ? "activo" : ""}`}
                    onClick={function () { setSeccionActiva("objetos") }}
                >
                    <Box size={20} className="icono-apartado" />
                    Mochila y objetos
                </button>
                <button
                    className={`boton-subpanel ${seccionActiva === "visualizacion" ? "activo" : ""}`}
                    onClick={function () { setSeccionActiva("visualizacion") }}
                >
                    <ImagePlay size={20} className="icono-apartado" />
                    Visualización
                </button>
                <button
                    className={`boton-subpanel ${seccionActiva === "estadisticas" ? "activo" : ""}`}
                    onClick={function () { setSeccionActiva("estadisticas") }}
                >
                    <ChartNoAxesCombined size={20} className="icono-apartado" />
                    Estadísticas
                </button>
            </div>

            <div className="contenido-panel">
                {seccionActiva === "configuracion" && (
                    <SubPanelConfiguracion
                        prioridad={prioridad}
                        setPrioridad={setPrioridad}
                        tiempoLimite={tiempoLimite}
                        setTiempoLimite={setTiempoLimite}
                    />
                )}

                {seccionActiva === "objetos" && (
                    <SubPanelObjetos
                        cantidad={cantidad}
                        setCantidad={setCantidad}
                        capacidad={capacidad}
                        setCapacidad={setCapacidad}
                        objetos={objetos}
                        onObjetoChange={onObjetoChange}
                        onGenerarAleatorio={onGenerarAleatorio}
                    />
                )}

                {seccionActiva === "visualizacion" && (
                    <SubPanelVisualizacion capacidad={capacidad} objetos={objetos} mochila={mochila} />
                )}

                {seccionActiva === "estadisticas" && (
                    <SubPanelEstadisticas estadisticas={estadisticas} algoritmo={algoritmo} />
                )}
            </div>
        </aside>
    )
}
