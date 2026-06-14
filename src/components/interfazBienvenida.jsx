import React, { useState } from "react"
import { Play, Eye, EyeOff } from "lucide-react"
import "../App.css"
import "./styles/interfazBienvenida.css"

/*
 * Muestra la interfaz de inicio del proyecto que incluye información académica y captura de API Key.
 * Recibe la función onIniciar que se ejecuta cuando el usuario hace clic en el botón Comenzar.
 */
export default function InterfazBienvenida({ onIniciar }) {
    const [mostrarApiKey, setMostrarApiKey] = useState(false)

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
                <button className="boton-comenzar" onClick={onIniciar}>
                    <Play size={25} fill="currentColor" style={{ marginRight: "10px"}} />
                    Comenzar
                </button>
            </div>
        </section>
    )
}
