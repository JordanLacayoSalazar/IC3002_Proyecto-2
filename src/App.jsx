import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import "./App.css"
import InterfazBienvenida from "./components/interfazBienvenida"
import InterfazPrincipal from "./components/interfazPrincipal"

// Punto de entrada del componente App que gestiona el estado de inicio y las transiciones de vista.
function App() {
    const [iniciado, setIniciado] = useState(false)
    const [genAI, setGenAI] = useState(null)

    //Cambia el estado para mostrar la interfaz principal.
    function iniciarApp(instanciaIA) { 
        setGenAI(instanciaIA)
        setIniciado(true) 
    }

    //Cambia el estado para volver a la interfaz de bienvenida.
    function volverABienvenida() {
        const boolVolver = confirm("¿Estás seguro de que deseas salir? No se guardarán los cambios.")
        if (boolVolver) setIniciado(false)
    }

    return (
        <div className={`contenedor-app ${iniciado ? "contenedor-app--principal" : "contenedor-app--inicio"}`}>
            <AnimatePresence mode="popLayout">
                {!iniciado && (
                    <motion.div
                        key="bienvenida"
                        className="vista-transicion"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.32, ease: "easeInOut" }}
                    >
                        <InterfazBienvenida onIniciar={iniciarApp} />
                    </motion.div>
                )}
                {iniciado && (
                    <motion.div
                        key="principal"
                        className="vista-transicion"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.32, ease: "easeInOut" }}
                    >
                        <InterfazPrincipal onVolver={volverABienvenida} genAI={genAI} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default App
