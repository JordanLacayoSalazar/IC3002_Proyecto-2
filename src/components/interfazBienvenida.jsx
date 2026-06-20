import { useState } from "react"
import { Play, Eye, EyeOff, Loader2 } from "lucide-react"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { MODELO_GEMINI_IA } from "../constants.js"
import "../App.css"
import "./styles/interfazBienvenida.css"

/*
 * Muestra la interfaz de inicio del proyecto que incluye información académica y captura de API Key.
 * Recibe la función onIniciar que se ejecuta cuando el usuario hace clic en el botón Comenzar.
 */
export default function InterfazBienvenida({ onIniciar }) {
    const [mostrarApiKey, setMostrarApiKey] = useState(false)
    const [apiKey, setApiKey] = useState("")
    const [validandoApiKey, setValidandoAPIKey] = useState(false)

    // Valida la API Key ingresada y abre la interfaz principal cuando es correcta.
    async function manejarClic() {
        if (validandoApiKey) return

        if (apiKey.trim() === "") {
            alert("Por favor, ingrese su API Key para continuar.")
            return
        }

        setValidandoAPIKey(true)
        try {
            // Crear la instancia de IA
            const instanciaIA = new GoogleGenerativeAI(apiKey)
            const modeloPrueba = instanciaIA.getGenerativeModel({
                model: MODELO_GEMINI_IA 
            })
            
            // Validación de la API Key
            const resultado = await modeloPrueba.generateContent({
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: "ok" }
                        ]
                    }
                ]
            })

            const respuesta = await resultado.response
            const texto = respuesta.text()

            // Si no responde texto válido, hay un error
            if (!texto) {
                alert("Error: El modelo no devolvió una respuesta válida al verificar la API Key. Por favor, intente de nuevo.")
                return
            }

            // API Key válida
            onIniciar(instanciaIA)
        } catch (error) {
            if (error.message.includes("429")) {
                alert("Error: Se ha alcanzado el límite de solicitudes de la API.")
            } 
            if (error.message.includes("503")) {
                alert("Error: El modelo de Google Gemini está experimentando una alta demanda. Intente de nuevo en unos minutos.")
            }
            else {
                alert("Error: La API Key proporcionada no es válida o no tiene acceso al servicio de Gemini. Por favor, intente de nuevo.")
            }
        } finally {
            setValidandoAPIKey(false)
        }
    }

    let iconoBoton
    if (validandoApiKey) {
        iconoBoton = <Loader2 size={25} className="animacion-spin" style={{ marginRight: "10px" }} />
    } else {
        iconoBoton = <Play size={25} fill="currentColor" style={{ marginRight: "10px" }} />
    }

    return (
        <section className="interfaz-bienvenida">
            <div className="panel-bienvenida">
                <span className="info-curso">
                    Instituto Tecnológico de Costa Rica<br />
                    IC3002 - Análisis de Algoritmos<br />
                    I Semestre 2026
                </span>
                <h1>
                    Proyecto 2:<br />
                    Agente de IA para el problema de la mochila
                </h1>
                <p className="nombres-integrantes">
                    Jordan Javier Lacayo Salazar<br />
                    Rasheed Carmichael Bennett Lewis
                </p>
                <label className="campo-api-key">
                    Clave API de Google Gemini AI
                    <div className="control-api-key">
                        <input
                            type={mostrarApiKey ? "text" : "password"}
                            placeholder="Ingrese su API Key..."
                            autoComplete="off"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                        <button
                            type="button"
                            className="boton-visibilidad-api"
                            aria-label={mostrarApiKey ? "Ocultar API Key" : "Mostrar API Key"}
                            onClick={function () { setMostrarApiKey(!mostrarApiKey) }}
                        >
                            {mostrarApiKey ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                    </div>
                </label>
                <button 
                    className="boton-comenzar" 
                    onClick={manejarClic}
                    disabled={validandoApiKey}
                    aria-busy={validandoApiKey}
                >
                    {iconoBoton}
                    {validandoApiKey ? "Validando API Key..." : "Comenzar"}
                </button>
            </div>
        </section>
    )
}
