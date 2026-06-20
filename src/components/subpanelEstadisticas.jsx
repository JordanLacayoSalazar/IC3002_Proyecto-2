import { Lightbulb, Timer, Calculator, ChartColumnBig } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { obtenerNombreAlgoritmo } from "../utils.js"
import "./styles/subpanelEstadisticas.css"

const ETIQUETAS_FASES = {
    tiempoFiltradoObjetos: "Filtrado de objetos",
    tiempoOrdenamiento: "Ordenamiento",
    tiempoBuclePrincipal: "Bucle Greedy",
    tiempoCreacionTabla: "Creación de tabla",
    tiempoLlenadoTabla: "Llenado de tabla",
    tiempoReconstruccion: "Reconstrucción de solución",
    tiempoBusquedaRecursiva: "Búsqueda recursiva"
}

const COLORES_FASES = {
    tiempoFiltradoObjetos: "#38bdf8",
    tiempoOrdenamiento: "#c800ff",
    tiempoBuclePrincipal: "#ff8800",
    tiempoCreacionTabla: "#3cff00",
    tiempoLlenadoTabla: "#fbff00",
    tiempoReconstruccion: "#0400ff",
    tiempoBusquedaRecursiva: "#ff0000"
}

/*
 * Muestra las comparaciones de tiempo y operaciones, además del rendimiento
 * registrado en cada fase del algoritmo ejecutado.
 */
export default function SubPanelEstadisticas({ estadisticas, algoritmo }) {
    const datosGraficoTiempo = [
        {
            nombre: "Tiempo:",
            EstimadoIA: estadisticas.tiempoEstimadoMs,
            Real: estadisticas.tiempoRealMs,
        },
    ]

    const datosGraficoOperaciones = [
        {
            nombre: "Operaciones:",
            EstimadoIA: estadisticas.operacionesEstimadas,
            Real: estadisticas.operacionesReales,
        },
    ]

    // Procesar las fases de tiempo para la Gráfica de rendimiento
    const listaFases = Object.keys(ETIQUETAS_FASES)

    const fasesValidas = listaFases.filter(function(fase) {
        let tiempo

        // Se verifica si existe el objeto de tiempos en las estadísticas
        if (estadisticas.tiemposFases) {
            tiempo = estadisticas.tiemposFases[fase]
        } else {
            tiempo = undefined
        }

        // Si el tiempo de la fase es mayor que cero, significa que sí se usó
        if (tiempo > 0) {
            return true  // La fase se queda en la lista
        } else {
            return false // La fase se descarta
        }
    })

    const boolTieneTiempos = fasesValidas.length > 0
    let datosGraficoPastel

    if (boolTieneTiempos) {
        datosGraficoPastel = fasesValidas.map(function(fase) {
            return {
                name: ETIQUETAS_FASES[fase],
                value: Number(estadisticas.tiemposFases[fase]),
                id: fase
            }
        })
    } else {
        datosGraficoPastel = []
    }

    return (
        <div className="subpanel-estadisticas">
            <div className="titulo-panel">Estadísticas</div>
            <div className="descripcion-panel">
                <Lightbulb size={18} className="icono-apartado" />
                Se compara en milisegundos la predicción de la IA frente al 
                tiempo real de ejecución local.<br />
                También se compara la cantidad de operaciones 
                (llamadas recursivas o iteraciones) estimada por la IA y la cantidad real.<br />
                El gráfico del rendimiento muestra la duración de cada fase del algoritmo usado.
            </div>

            <div className="apartado-estadistica">
                <h3>
                    <Timer size={20} className="icono-apartado" />
                    Tiempo de ejecución
                </h3>
                <p>Tiempo estimado de ejecución por la IA vs. Tiempo real de ejecución local</p>
                {estadisticas.objetosTotales === 0 ? (
                    <div className="texto-estadistica-vacio">
                        Primero se debe resolver el problema de la mochila.
                    </div>
                ) : (
                    <div className="contenedor-grafico">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart 
                                data={datosGraficoTiempo} 
                                layout="vertical"
                                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="4 4" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="nombre" />
                                <Tooltip cursor={false} contentStyle={{ 
                                    backgroundColor: "#1F293A",
                                    borderColor: "#2d3c55",
                                    borderRadius: "8px",
                                    color: "#ffffff"
                                }}/>
                                <Legend />
                                <Bar dataKey="EstimadoIA" fill="#ffff00" name="Tiempo estimado por IA (ms)" />
                                <Bar dataKey="Real" fill="#84ff00" name="Tiempo real (ms)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            <div className="apartado-estadistica">
                <h3>
                    <Calculator size={20} className="icono-apartado" />
                    Operaciones realizadas
                </h3>
                <p>Cantidad de operaciones estimadas por la IA vs. Cantidad real de operaciones locales.</p>
                {estadisticas.objetosTotales === 0 ? (
                    <div className="texto-estadistica-vacio">
                        Primero se debe resolver el problema de la mochila.
                    </div>
                ) : (
                    <div className="contenedor-grafico">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart 
                                data={datosGraficoOperaciones} 
                                layout="vertical"
                                margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="4 4" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="nombre" />
                                <Tooltip cursor={false} contentStyle={{ 
                                    backgroundColor: "#1F293A",
                                    borderColor: "#2d3c55",
                                    borderRadius: "8px",
                                    color: "#ffffff"
                                }}/>
                                <Legend />
                                <Bar dataKey="EstimadoIA" fill="#46caef" name="Operaciones estimadas por IA" />
                                <Bar dataKey="Real" fill="#00ff59" name="Operaciones reales" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            <div className="apartado-estadistica">
                <h3>
                    <ChartColumnBig size={20} className="icono-apartado" />
                    Gráfica de rendimiento
                </h3>
                {estadisticas.objetosTotales > 0 && (
                    <p>
                        Rendimiento del algoritmo <strong>{obtenerNombreAlgoritmo(algoritmo)}</strong> con <strong>{estadisticas.objetosTotales}</strong> objetos.
                    </p>
                )}
                {boolTieneTiempos ? (
                    <div className="contenedor-grafico-rendimiento">
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <Pie
                                    data={datosGraficoPastel}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={0}
                                    outerRadius={75}
                                    paddingAngle={0}
                                    dataKey="value"
                                >
                                    {datosGraficoPastel.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={COLORES_FASES[entry.id] || "#acdb66"} 
                                        />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value) => `${value} ms`}
                                    contentStyle={{ 
                                        backgroundColor: "#1F293A",
                                        borderColor: "#2d3c55",
                                        borderRadius: "8px",
                                        color: "#ffffff"
                                    }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="texto-estadistica">
                        No se registraron tiempos.
                    </div>
                )}
            </div>
        </div>
    )
}
