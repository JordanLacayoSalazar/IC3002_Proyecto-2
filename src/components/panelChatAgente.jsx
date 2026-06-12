import React, { useEffect, useRef, useState } from "react"
import { SendHorizontal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import "./styles/panelChatAgente.css"
import { Mensaje } from "../types.js"

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

// Implementa la ventana de chat para la interacción con el Agente de IA.
export default function PanelChatAgente() {
    const [entrada, setEntrada] = useState("")
    const [mensajes, setMensajes] = useState([
        new Mensaje(0, "bot", "El agente está listo para recibir tu mensaje."),
    ])
    const contenedorRef = useRef(null)

    useEffect(function () {
        if (contenedorRef.current) {
            contenedorRef.current.scrollTop = contenedorRef.current.scrollHeight
        }
    }, [mensajes])

    //Procesa y añade un nuevo mensaje del usuario a la conversación.
    function enviarMensaje() {
        if (entrada.trim() === "") return
        let nuevoMensaje = new Mensaje(mensajes.length, "usuario", entrada)
        setMensajes([...mensajes, nuevoMensaje])
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
                        <SendHorizontal size={20} style={{ marginRight: "5px"}} />
                        Enviar
                    </motion.button>
                </div>
            </div>
        </main>
    )
}
