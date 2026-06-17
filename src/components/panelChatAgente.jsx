import React, { useEffect, useRef, useState } from "react"
import { SendHorizontal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import "./styles/panelChatAgente.css"
import { Mensaje } from "../types.js"
import { GoogleGenerativeAI, FunctionCallingMode, SchemaType } from "@google/generative-ai"
import { mochilaBactracking } from "./backtracking.js"
import { mochilaDinamica } from "./dinamica.js"
import { mochilaGreedy } from "./greedy.js"

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
        >
            {msg.texto}
        </motion.div>
    )
}

function crearContenidoUsuario(texto) {
    return {
        role: "user",
        parts: [{ text: texto }],
    }
}

function obtenerHerramientas() {
    return [
        {
            functionDeclarations: [
                {
                    name: "resolver_mochila",
                    description:
                        "Resuelve el problema de la mochila usando backtracking, dinamica o greedy y devuelve el resultado en JSON.",
                    parameters: {
                        type: SchemaType.OBJECT,
                        properties: {
                            algoritmo: {
                                type: SchemaType.STRING,
                                description: "Algoritmo a usar: backtracking, dinamica o greedy.",
                            },
                            capacidad: {
                                type: SchemaType.INTEGER,
                                description: "Capacidad maxima de la mochila.",
                            },
                            tiempoLimite: {
                                type: SchemaType.NUMBER,
                                description: "Tiempo maximo en segundos para la ejecucion del algoritmo (0 = sin limite).",
                            },
                            objetos: {
                                type: SchemaType.ARRAY,
                                description: "Lista de objetos disponibles.",
                                items: {
                                    type: SchemaType.OBJECT,
                                    properties: {
                                        id: { type: SchemaType.INTEGER },
                                        valor: { type: SchemaType.INTEGER },
                                        peso: { type: SchemaType.INTEGER },
                                    },
                                    required: ["id", "valor", "peso"],
                                },
                            },
                        },
                        required: ["algoritmo", "capacidad", "objetos"],
                    },
                },
            ],
        },
    ]
}

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

    let resultado = { valor: 0, peso: 0, objetos: [] }

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
export default function PanelChatAgente({ apiKey, objetos, capacidad, tiempoLimite, mochila, setMochila}) {
    const [entrada, setEntrada] = useState("")
    const [mensajes, setMensajes] = useState([
        new Mensaje(0, "bot", "El agente está listo para recibir tu mensaje."),
    ])
    const contenedorRef = useRef(null)
    const genAIRef = useRef(null)
    const modeloAiRef = useRef(null)
    const prompPrincipal =
        'Solo responde al texto que comienza despues de "Query=>" y solo despues de eso. La respuesta debe estar basada tambien en la mejor forma de solucionar el problema de la mochila planteado seleccionando uno de estos metodos: backtracking, dinamico y greedy. Debe incluir el tiempo esperado para la solucion en la respuesta.'

    useEffect(() => {
        if (apiKey && apiKey.trim() !== "") {
            genAIRef.current = new GoogleGenerativeAI(apiKey)
            modeloAiRef.current = genAIRef.current.getGenerativeModel({
                model: "gemini-2.0-flash",
            })
        }
    }, [apiKey])

    useEffect(() => {
        if (contenedorRef.current) {
            contenedorRef.current.scrollTop = contenedorRef.current.scrollHeight
        }
    }, [mensajes])

    async function enviarMensaje() {
        if (entrada.trim() === "") return

        const mensajeUsuario = new Mensaje(mensajes.length, "usuario", entrada)
        setMensajes((prev) => [...prev, mensajeUsuario])

        if (!modeloAiRef.current) {
            console.error("Modelo AI no inicializado")
            setEntrada("")
            return
        }

        const prompt = `Query=> ${entrada}`
        const request = {
            contents: [crearContenidoUsuario(prompt)],
            tools: obtenerHerramientas(),
            toolConfig: {
                functionCallingConfig: {
                    mode: FunctionCallingMode.AUTO,
                },
            },
            systemInstruction: prompPrincipal,
        }

        try {
            const resultadoPromp = await modeloAiRef.current.generateContent(request)
            const respuesta = await resultadoPromp.response
            const llamadas = respuesta.functionCalls?.()

            if (llamadas && llamadas.length > 0) {
                const llamada = llamadas[0]
                const resultadoFuncion = ejecutarFuncionLocal(
                    llamada.name,
                    llamada.args,
                    objetos,
                    capacidad,
                    tiempoLimite
                )

                setMochila({
                    valor: resultadoFuncion.resultado.valor,
                    peso: resultadoFuncion.resultado.peso,
                    contenido: resultadoFuncion.resultado.objetos
                })

                const functionResponsePart = {
                    role: "function",
                    parts: [
                        {
                            functionResponse: {
                                name: llamada.name,
                                response: resultadoFuncion,
                            },
                        },
                    ],
                }

                const followUpRequest = {
                    contents: [crearContenidoUsuario(prompt), functionResponsePart],
                    tools: obtenerHerramientas(),
                    toolConfig: {
                        functionCallingConfig: {
                            mode: FunctionCallingMode.AUTO,
                        },
                    },
                    systemInstruction: prompPrincipal,
                }

                const followUpResult = await modeloAiRef.current.generateContent(followUpRequest)
                const followUpResponse = await followUpResult.response
                const textoFinal = followUpResponse.text()
                const mensajeBot = new Mensaje(mensajes.length + 1, "bot", textoFinal)
                setMensajes((prev) => [...prev, mensajeBot])
            } else {
                const textoResp = respuesta.text()
                const mensajeBot = new Mensaje(mensajes.length + 1, "bot", textoResp)
                setMensajes((prev) => [...prev, mensajeBot])
            }
        } catch (err) {
            console.error("No se ha obtenido una respuesta de la ia", err)
            const mensajeError = new Mensaje(
                mensajes.length + 1,
                "bot",
                "Ha ocurrido un error al procesar la solicitud de la IA."
            )
            setMensajes((prev) => [...prev, mensajeError])
        }

        setEntrada("")
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
                </AnimatePresence>
                <div className="area-mensaje">
                    <input
                        className="entrada-mensaje"
                        placeholder="Escribir mensaje..."
                        value={entrada}
                        onChange={manejarCambioEntrada}
                        onKeyDown={manejarTeclaPresionada}
                    />
                    <motion.button
                        className="boton-enviar"
                        onClick={enviarMensaje}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <SendHorizontal size={20} style={{ marginRight: "5px" }} />
                        Enviar
                    </motion.button>
                </div>
            </div>
        </main>
    )
}
