import { useEffect, useRef, useState } from "react"
import { SendHorizontal, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Mensaje } from "../types.js"
import { obtenerNombreAlgoritmo } from "../utils.js"
import { mochilaBactracking } from "./backtracking.js"
import { mochilaDinamica } from "./dinamica.js"
import { mochilaGreedy } from "./greedy.js"
import {
    MODELO_GEMINI_IA,
    PRIORIDAD_EXACTITUD,
    PRIORIDAD_VELOCIDAD,
} from "../constants.js"
import parametrosAgenteSchema from "./parametrosAgenteSchema.json"
import respuestaAgenteSchema from "./respuestaAgenteSchema.json"
import "./styles/panelChatAgente.css"

// El prompt principal define las reglas de selección y el formato de respuesta del agente.
import promptPrincipal from "./promptPrincipal.txt?raw"

/*
 * Renderiza un componente de burbuja de chat basado en el autor del mensaje.
 * Recibe el objeto mensaje y el índice para las animaciones.
 */
function renderizarMensaje(msg, idx) {
    return (
        <motion.div
            key={msg.id}
            className={`burbuja-chat ${msg.autor}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            style={{ whiteSpace: "pre-wrap" }}
        >
            {msg.texto}
        </motion.div>
    )
}

// Renderiza un mensaje de estado temporal con un ícono de carga.
function renderizarEstado(texto) {
    if (!texto) return null

    return (
        <motion.div
            className="burbuja-chat status"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <Loader2 size={16} className="animacion-spin" style={{ marginRight: "8px", flexShrink: 0 }} />
            {texto}
        </motion.div>
    )
}

// Crea el contenido que se envía a Gemini como mensaje del usuario.
function crearContenidoUsuario(texto) {
    return {
        role: "user",
        parts: [{ text: texto }],
    }
}

// Define la herramienta que Gemini puede invocar para ejecutar un algoritmo local.
function obtenerHerramientas() {
    return [
        {
            functionDeclarations: [
                {
                    name: "resolver_mochila",
                    description:
                        "Resuelve el problema de la mochila usando backtracking, dinamica o greedy y devuelve el resultado en JSON.",
                    parameters: parametrosAgenteSchema,
                },
            ],
        },
    ]
}

// Aplica el esquema que obliga al agente a responder con un JSON válido.
function obtenerConfiguracionJson() {
    return {
        responseMimeType: "application/json",
        responseSchema: respuestaAgenteSchema,
    }
}

/*
 * Intenta convertir el texto devuelto por Gemini en un objeto estructurado.
 * Si Gemini incumple el formato, crea una respuesta segura para que React no falle.
 */
function parsearRespuestaEstructurada(textoRespuesta) {
    try {
        return JSON.parse(textoRespuesta)
    } catch (error) {
        console.error("La respuesta del agente no cumple el schema JSON esperado.", error)
        return {
            algoritmoSeleccionado: "invalido",
            tiempoEstimadoMs: 0,
            operacionesEstimadas: 0,
            complejidadTemporal: "No disponible",
            justificacion: textoRespuesta,
        }
    }
}

// Convierte el objeto JSON del agente en un mensaje natural para mostrar en el chat.
function formatearRespuestaEstructurada(respuesta) {
    if (respuesta.algoritmoSeleccionado === "invalido") {
        return respuesta.justificacion
    }

    const lineas = [
        `Seleccioné el algoritmo: ${obtenerNombreAlgoritmo(respuesta.algoritmoSeleccionado)}.`,
        `Tiempo estimado: ${respuesta.tiempoEstimadoMs} ms`,
        `Operaciones estimadas: ${respuesta.operacionesEstimadas}`,
        `Complejidad temporal: ${respuesta.complejidadTemporal}`,
        "",
        `Justificación: ${respuesta.justificacion}`,
    ]

    return lineas.join("\n")
}

// Crea una respuesta determinista cuando el problema no requiere ejecutar un algoritmo.
function crearRespuestaSinSolucion(objetos) {
    const sinObjetos = objetos.length === 0

    return {
        algoritmoSeleccionado: "ninguno",
        tiempoEstimadoMs: 0,
        operacionesEstimadas: 0,
        complejidadTemporal: "O(1)",
        justificacion: sinObjetos
            ? "No existen objetos para incluir en la mochila."
            : "La capacidad de la mochila es cero, por lo tanto no es posible incluir ningún objeto.",
    }
}

// Convierte el valor interno de prioridad al texto utilizado por las reglas del agente.
function obtenerNombrePrioridad(prioridad) {
    if (prioridad === PRIORIDAD_EXACTITUD) return "Máxima Exactitud"
    if (prioridad === PRIORIDAD_VELOCIDAD) return "Velocidad Máxima"
    return prioridad
}

/*
 * Ejecuta localmente el algoritmo solicitado por Gemini.
 * Recibe el nombre de la función, sus argumentos y los datos actuales de la interfaz.
 */
function ejecutarFuncionLocal(nombre, args, objetosActuales, capacidadActual, tiempoLimiteActual) {
    if (nombre !== "resolver_mochila") {
        return {
            error: `Función desconocida: ${nombre}`,
        }
    }

    const algoritmo = String(args?.algoritmo || "backtracking").toLowerCase()
    const capacidad = Number(args?.capacidad ?? capacidadActual)
    const tiempoLimite = Number(args?.tiempoLimite ?? tiempoLimiteActual)
    const objetos = Array.isArray(args?.objetos) ? args.objetos : objetosActuales

    let resultado

    if (algoritmo.includes("back")) {
        resultado = mochilaBactracking(objetos, capacidad, tiempoLimite)
    } else if (algoritmo.includes("dinam")) {
        resultado = mochilaDinamica(objetos, capacidad, tiempoLimite)
    } else if (algoritmo.includes("greedy")) {
        resultado = mochilaGreedy(objetos, capacidad, tiempoLimite)
    } else {
        resultado = {
            error: `Algoritmo no reconocido: ${args?.algoritmo}`,
        }
    }

    return {
        nombreFuncion: nombre,
        algoritmo,
        capacidad,
        tiempoLimite,
        resultado,
    }
}

// Implementa la ventana de chat para la interacción con el Agente de IA.
export default function PanelChatAgente({ genAI, objetos, capacidad, prioridad, tiempoLimite, setMochila, setAlgoritmo, setEstadisticas}) {
    const [entrada, setEntrada] = useState("")
    const [mensajes, setMensajes] = useState([
        new Mensaje(0, "bot", "El agente está listo para recibir tu mensaje."),
    ])
    const contenedorRef = useRef(null)
    const [estado, setEstado] = useState(null)
    const modeloAiRef = useRef(null)

    // Inicializa el modelo de Gemini cuando existe una API Key configurada.
    useEffect(() => {
        if (genAI) {
            modeloAiRef.current = genAI.getGenerativeModel({
                model: MODELO_GEMINI_IA
            })
        }
    }, [genAI])

    // Mantiene el scroll del chat al final cada vez que aparece un mensaje nuevo.
    useEffect(() => {
        if (contenedorRef.current) {
            contenedorRef.current.scrollTop = contenedorRef.current.scrollHeight
        }
    }, [mensajes])

    // Combina la consulta, las herramientas disponibles y las instrucciones del prompt principal.
    function prepararPeticion(promptInput) {
        return {
            contents: [crearContenidoUsuario(promptInput)],
            tools: obtenerHerramientas(),
            toolConfig: {
                functionCallingConfig: { mode: "AUTO" },
            },
            systemInstruction: promptPrincipal,
        }
    }

    // Procesa las llamadas a funciones devueltas por la IA y actualiza el estado de la aplicación.
    async function procesarLlamadas(llamadas, promptOriginal) {
        if (objetos.length === 0 || capacidad === 0) {
            setAlgoritmo("ninguno")
            setMochila(null)
            setEstadisticas({
                tiempoRealMs: 0,
                operacionesReales: 0,
                objetosTotales: 0,
                tiempoEstimadoMs: 0,
                operacionesEstimadas: 0,
                tiemposFases: {},
            })
            return crearRespuestaSinSolucion(objetos)
        }

        setEstado("Ejecutando algoritmo local...")
        const llamada = llamadas[0]
        const resultadoFuncion = ejecutarFuncionLocal(
            llamada.name,
            llamada.args,
            objetos,
            capacidad,
            tiempoLimite
        )
        setEstado("Calculando estadísticas...")

        setAlgoritmo(resultadoFuncion.algoritmo)
        setMochila({
            valor: resultadoFuncion.resultado.valor,
            peso: resultadoFuncion.resultado.peso,
            contenido: resultadoFuncion.resultado.objetos,
            operaciones: resultadoFuncion.resultado.operaciones
        })

        setEstadisticas({
            tiempoRealMs: resultadoFuncion.resultado.tiempoMs,
            operacionesReales: resultadoFuncion.resultado.operaciones,
            objetosTotales: objetos.length,
            tiempoEstimadoMs: 0,
            operacionesEstimadas: 0,
            tiemposFases: resultadoFuncion.resultado.tiemposFases || {},
        })

        setEstado("Generando respuesta...")
        const requestSeguimiento = {
            contents: [
                crearContenidoUsuario(
                    `${promptOriginal}\n\nResultado local de resolver_mochila:\n${JSON.stringify(resultadoFuncion)}`
                ),
            ],
            systemInstruction: promptPrincipal,
            generationConfig: obtenerConfiguracionJson(),
        }

        const followUpResult = await modeloAiRef.current.generateContent(requestSeguimiento)
        return parsearRespuestaEstructurada(followUpResult.response.text())
    }

    // Envía el mensaje del usuario, gestiona la comunicación con Gemini y actualiza el chat.
    async function enviarMensaje() {
        if (entrada.trim() === "" || !modeloAiRef.current || estado !== null) return

        setEstado("Analizando mensaje de usuario...")
        const mensajeUsuario = new Mensaje(mensajes.length, "usuario", entrada)
        setMensajes((prev) => [...prev, mensajeUsuario])
        setEstado("Analizando los datos del problema...")
        const nombrePrioridad = obtenerNombrePrioridad(prioridad)
        // Incluye los datos que el prompt utiliza para seleccionar el algoritmo.
        const prompt = `
            N=${objetos.length}, W=${capacidad}, Prioridad="${nombrePrioridad}", Tiempo Límite=${tiempoLimite}s.
            Objetos: ${JSON.stringify(objetos.map(o => ({v: o.valor, w: o.peso})))}
            Query=> ${entrada}
        `
        const request = prepararPeticion(prompt)
        setEntrada("")

        try {
            setEstado("Pensando...")
            const resultadoPrompt = await modeloAiRef.current.generateContent(request)
            const respuesta = await resultadoPrompt.response
            const llamadas = respuesta.functionCalls?.()
            let respuestaEstructurada = null

            if (llamadas && llamadas.length > 0) {
                respuestaEstructurada = await procesarLlamadas(llamadas, prompt)
            } else {
                const respuestaJson = parsearRespuestaEstructurada(respuesta.text())

                if (
                    respuestaJson.algoritmoSeleccionado === "invalido"
                    || respuestaJson.algoritmoSeleccionado === "ninguno"
                ) {
                    respuestaEstructurada = respuestaJson
                    if (respuestaJson.algoritmoSeleccionado === "ninguno") {
                        setAlgoritmo("ninguno")
                        setMochila(null)
                        setEstadisticas({
                            tiempoRealMs: 0,
                            operacionesReales: 0,
                            objetosTotales: 0,
                            tiempoEstimadoMs: respuestaJson.tiempoEstimadoMs,
                            operacionesEstimadas: 0,
                            tiemposFases: {},
                        })
                    }
                } else {
                    respuestaEstructurada = await procesarLlamadas([{
                        name: "resolver_mochila",
                        args: {
                            algoritmo: respuestaJson.algoritmoSeleccionado,
                            capacidad,
                            objetos,
                            tiempoLimite,
                        },
                    }], prompt)
                }
            }

            setEstado("Análisis completado.")
            const textoBot = formatearRespuestaEstructurada(respuestaEstructurada)
            setEstadisticas(prev => ({
                ...prev,
                tiempoEstimadoMs: respuestaEstructurada.tiempoEstimadoMs,
                operacionesEstimadas: respuestaEstructurada.operacionesEstimadas,
            }))
            setTimeout(() => setEstado(null), 500) // Limpia el estado después de un momento
            setMensajes((prev) => [...prev, new Mensaje(prev.length, "bot", textoBot)])
        } catch (error) {
            if (error.message.includes("429")) {
                setMensajes((prev) => [...prev, new Mensaje(prev.length, "bot", "Error al procesar la solicitud: Se ha alcanzado el límite de solicitudes de la API.")])
            }
            else if (error.message.includes("503")) {
                setMensajes((prev) => [...prev, new Mensaje(prev.length, "bot", "Error al procesar la solicitud: El modelo de Google Gemini está experimentando una alta demanda. Intente de nuevo en unos minutos.")])
            }
            else {
                setMensajes((prev) => [...prev, new Mensaje(prev.length, "bot", "Error desconocido al procesar la solicitud.")])
            }
            setEstado(null)
        }
    }

    //Gestiona el evento de presionar una tecla en el campo de entrada.
    function manejarTeclaPresionada(event) {
        if (event.key === "Enter") {
            enviarMensaje()
        }
    }

    //Actualiza el estado de la entrada de texto según lo que escribe el usuario.
    function manejarCambioEntrada(event) {
        setEntrada(event.target.value)
    }

    return (
        <main className="panel-chat">
            <div className="titulo-panel">Chat del agente</div>
            <div className="contenedor-chat" ref={contenedorRef}>
                <AnimatePresence>
                    {mensajes.map(renderizarMensaje)}
                    {renderizarEstado(estado)}
                </AnimatePresence>
                <div className="area-mensaje">
                    <input
                         className="entrada-mensaje"
                         placeholder="Escribir mensaje..."
                         value={entrada}
                         onChange={manejarCambioEntrada}
                         onKeyDown={manejarTeclaPresionada}
                         disabled={estado !== null}
                     />
                     <motion.button
                         className="boton-enviar"
                         onClick={enviarMensaje}
                         disabled={estado !== null}
                         whileHover={estado === null ? { scale: 1.05 } : {}}
                         whileTap={estado === null ? { scale: 0.95 } : {}}
                     >
                         <SendHorizontal size={20} className="icono-apartado" />
                         Enviar
                     </motion.button>
                </div>
            </div>
        </main>
    )
}
