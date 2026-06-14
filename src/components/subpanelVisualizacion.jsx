import React from "react"
import { Lightbulb } from "lucide-react"
import "./styles/subpanelVisualizacion.css"

// Crea la representación visual de un objeto individual.
function renderizarFiguraObjeto(obj) {
    let altura = Math.min(160, Math.max(72, obj.peso * 3.4))
    let ancho = Math.min(145, Math.max(76, obj.valor * 0.82))
    return (
        <div
            key={obj.id}
            className="figura-objeto"
            style={{ height: `${altura}px`, width: `${ancho}px` }}
        >
            <span>#{obj.id}</span>
            <small>Peso: {obj.peso}<br />Valor: {obj.valor}</small>
        </div>
    )
}

/*
 * Subpanel encargado de renderizar una representación gráfica de los objetos definidos.
 * La función recibe una lista de objetos a visualizar.
 */
export default function SubPanelVisualizacion({ objetos }) {
    return (
        <div className="subpanel-visualizacion">
            <div className="titulo-panel">Visualización</div>
            <div className="descripcion-panel">
                <Lightbulb size={18} style={{ marginRight: 6 }} />
                Aquí se muestra la representación de los objetos que están dentro y fuera de la mochila.
            </div>
            <div className="contenedor-visualizacion">
                <div className="seccion-objetos-graficas">
                    <h3>Representación gráfica</h3>
                    <div className="grafico-mochila">
                        <div className="icono-mochila">
                            <span>
                                Mochila
                            </span>
                            <img
                                src={`${import.meta.env.BASE_URL}icon.png`}
                                alt=""
                                aria-hidden="true"
                            />
                        </div>
                        <div className="objetos-graficos">
                            {objetos.map(renderizarFiguraObjeto)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
