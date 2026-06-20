import { Lightbulb } from "lucide-react"
import "./styles/subpanelVisualizacion.css"

// Formatea números decimales con una cifra y conserva los números enteros.
const formatearNumero = (num) => Number.isInteger(num) ? num : Number(num).toFixed(1)

// Crea la representación visual de un objeto individual.
function renderizarFiguraObjeto(obj) {
    const esFrac = obj.esFraccionado || false
    return (
        <div
            key={obj.id}
            className={`figura-objeto ${esFrac ? "figura-objeto-fraccionado" : ""}`}
        >
            <span>#{obj.id}{esFrac ? " (Frac.)" : ""}</span>
            {esFrac ? (
                <small>
                    <strong>Original:</strong><br />
                    Peso: {formatearNumero(obj.pesoOriginal)} | Valor: {formatearNumero(obj.valorOriginal)}<br />
                    <strong>Usado:</strong><br />
                    Peso: {formatearNumero(obj.peso)} | Valor: {formatearNumero(obj.valor)}
                </small>
            ) : (
                <small>
                    Peso: {formatearNumero(obj.peso)}<br />
                    Valor: {formatearNumero(obj.valor)}
                </small>
            )}
        </div>
    )
}

/*
 * Subpanel encargado de renderizar una representación gráfica de los objetos definidos.
 * La función recibe una lista de objetos a visualizar.
 */
export default function SubPanelVisualizacion({ objetos, capacidad, mochila }) {
    const objetosDentro = mochila?.contenido || []
    const idsDentro = new Set(objetosDentro.map(o => o.id))
    const objetosFuera = objetos.filter(o => !idsDentro.has(o.id))

    return (
        <div className="subpanel-visualizacion">
            <div className="titulo-panel">Visualización</div>
            <div className="descripcion-panel">
                <Lightbulb size={18} className="icono-apartado" />
                Aquí se muestra la representación de los objetos que están dentro y fuera de la mochila.
            </div>
            <div className="contenedor-visualizacion">
                <div className="seccion-objetos-graficas">
                    <h3>Representación gráfica</h3>
                    <p>
                        {mochila
                            ? "Esta es la solución obtenida para el problema de la mochila."
                            : "Resuelva el problema de la mochila para ver la solución."}
                    </p>
                    <div className="grafico-mochila">
                        <div className="contenedor-mochila">
                            <div className="mochila-cabecera">
                                <span>Objetos dentro de la mochila</span>
                                <small className="mochila-cabecera-info">
                                    Peso: {mochila ? mochila.peso : 0} / {capacidad} | Valor: {mochila ? mochila.valor.toFixed(1) : 0}
                                </small>
                            </div>
                            <img
                                src={`${import.meta.env.BASE_URL}icon.png`}
                                alt=""
                                aria-hidden="true"
                                className="imagen-mochila"
                            />
                            
                            <div className="seccion-objetos-dentro">
                                {objetosDentro.length > 0 ? (
                                    objetosDentro.map(renderizarFiguraObjeto)
                                ) : (
                                    <div className="texto-vacio">
                                        Mochila vacía.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="seccion-objetos-fuera">
                            <h3 className="titulo-objetos-fuera">Objetos fuera de la mochila</h3>
                            <div className="objetos-graficos">
                                {objetosFuera.length > 0 ? (
                                    objetosFuera.map(renderizarFiguraObjeto)
                                ) : (
                                    <div className="texto-vacio">
                                        Todos los objetos están dentro de la mochila.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
