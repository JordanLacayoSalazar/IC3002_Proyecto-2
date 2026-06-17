import React, { useState } from "react"
import { Undo2 } from "lucide-react"
import { motion } from "framer-motion"
import "./styles/interfazPrincipal.css"
import {
    TIEMPO_LIMITE_DEFAULT,
    CANTIDAD_DEFAULT,
    CAPACIDAD_DEFAULT,
    ALGORITMO_POR_DEFECTO,
    CAPACIDAD_ALEATORIA_FACTOR_POR_OBJETO,
    CAPACIDAD_ALEATORIA_MINIMA,
    PESO_INICIAL_OBJETO,
    VALOR_INICIAL_OBJETO,
    PESO_INCREMENTO_OBJETO,
    VALOR_INCREMENTO_OBJETO,
    CANTIDAD_MINIMA_OBJETOS,
    CANTIDAD_MAXIMA_OBJETOS,
    PESO_OBJETO_MINIMO,
    PESO_OBJETO_MAXIMO_ALEATORIO,
    PRIORIDAD_EXACTITUD,
    VALOR_OBJETO_MINIMO,
    VALOR_OBJETO_MAXIMO_ALEATORIO,
} from "../constants.js"
import PanelPrincipal from "./panelPrincipal.jsx"
import PanelChatAgente from "./panelChatAgente.jsx"
import { Objeto } from "../types.js"

/*
 * Crea una lista inicial de objetos con pesos y valores.
 * Recibe la cantidad de objetos y devuelve una lista de nuevas instancias de la clase Objeto.
 */
function crearObjetosIniciales(cantidad) {
    let lista = []

    for (let i = 0; i < cantidad; i += 1) {
        lista.push(new Objeto(
            i + 1,
            VALOR_INICIAL_OBJETO + i * VALOR_INCREMENTO_OBJETO,
            PESO_INICIAL_OBJETO + i * PESO_INCREMENTO_OBJETO
        ))
    }

    return lista
}

/*
 * Genera una lista de objetos con pesos y valores aleatorios dentro de rangos predefinidos.
 * Recibe la cantidad deseada y devuelve la lista de objetos aleatorios.
 */
function crearObjetosAleatorios(cantidad) {
    let lista = []
    let rangoPeso = PESO_OBJETO_MAXIMO_ALEATORIO - PESO_OBJETO_MINIMO + 1
    let rangoValor = VALOR_OBJETO_MAXIMO_ALEATORIO - VALOR_OBJETO_MINIMO + 1

    for (let i = 0; i < cantidad; i += 1) {
        lista.push(new Objeto(
            i + 1,
            Math.floor(Math.random() * rangoValor) + VALOR_OBJETO_MINIMO,
            Math.floor(Math.random() * rangoPeso) + PESO_OBJETO_MINIMO
        ))
    }

    return lista
}

/*
 * Ajusta la cantidad de objetos en la lista, manteniendo los existentes o agregando nuevos.
 * Recibe la nueva cantidad y la lista anterior, devolviendo la lista ajustada al tamaño solicitado.
 */
function ajustarCantidadObjetos(cantidad, anterior) {
    let siguiente = []

    for (let i = 0; i < cantidad; i += 1) {
        siguiente[i] = anterior[i] || new Objeto(i + 1, VALOR_OBJETO_MINIMO, PESO_OBJETO_MINIMO)
    }

    return siguiente
}

/*
 * Actualiza una propiedad específica de un objeto en la lista sin mutar el estado anterior.
 * Recibe la lista previa, el índice, el atributo a cambiar y el nuevo valor, devolviendo una nueva lista actualizada.
 */
function actualizarListaObjetos(prev, idx, atributo, valor) {
    let copia = prev.slice();
    let obj = copia[idx];
    
    let nValor;
    let nPeso;

    if (atributo === "valor") {
        nValor = Number(valor);
    } else {
        nValor = obj.valor;
    }

    if (atributo === "peso") {
        nPeso = Number(valor);
    } else {
        nPeso = obj.peso;
    }

    copia[idx] = new Objeto(obj.id, nValor, nPeso);
    return copia;
}

/*
 * Valida que la cantidad de objetos se encuentre dentro de los límites mínimo y máximo permitidos.
 * Recibe un valor de entrada y devuelve la cantidad limitada por las constantes globales.
 */
function limitarCantidadObjetos(cantidad) {
    return Math.min(CANTIDAD_MAXIMA_OBJETOS, Math.max(CANTIDAD_MINIMA_OBJETOS, Number(cantidad)))
}

/*
 * Maneja la interfaz principal del sistema, gestionando los estados de los objetos y configuración.
 * Recibe la función onVolver para regresar a la interfaz de bienvenida, la API key y renderiza los paneles de control y el chat.
 */
export default function InterfazPrincipal({ onVolver, apiKey }) {
    const [algoritmo, setAlgoritmo] = useState(ALGORITMO_POR_DEFECTO)
    const [cantidad, setCantidad] = useState(CANTIDAD_DEFAULT)
    const [capacidad, setCapacidad] = useState(CAPACIDAD_DEFAULT)
    const [mochila, setMochila] = useState({valor: 0, peso: 0, contenido: []})
    const [objetos, setObjetos] = useState(function () {
        return crearObjetosIniciales(CANTIDAD_DEFAULT)
    })
    const [prioridad, setPrioridad] = useState(PRIORIDAD_EXACTITUD)
    const [tiempoLimite, setTiempoLimite] = useState(TIEMPO_LIMITE_DEFAULT)

    //Actualiza el estado de la cantidad de objetos y ajusta la lista proporcionalmente.
    function manejarCambioCantidad(valor) {
        let cantidadLimitada = limitarCantidadObjetos(valor)
        setCantidad(cantidadLimitada)
        setObjetos(function (prev) {
            return ajustarCantidadObjetos(cantidadLimitada, prev)
        })
    }

    // Dispara la actualización de un atributo de un objeto específico en la lista.
    function manejarObjetoCambio(idx, clave, valor) {
        setObjetos(function (prev) {
            return actualizarListaObjetos(prev, idx, clave, valor)
        })
    }

    // Genera una nueva configuración aleatoria de capacidad y objetos.
    function generarAleatorio() {
        let nuevos = crearObjetosAleatorios(cantidad)
        let nuevaCapacidad = Math.floor(Math.random() * (cantidad * CAPACIDAD_ALEATORIA_FACTOR_POR_OBJETO)) + CAPACIDAD_ALEATORIA_MINIMA
        setObjetos(nuevos)
        setCapacidad(nuevaCapacidad)
    }

    return (
        <div className="interfaz-principal">
            <motion.button
                className="boton-regresar"
                onClick={onVolver}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Undo2 size={20} style={{ marginRight: "5px"}} />
                Regresar
            </motion.button>
            <div className="principal-grid">
                <div className="panel-izquierdo">
                    <PanelPrincipal
                        algoritmo={algoritmo}
                        setAlgoritmo={setAlgoritmo}
                        cantidad={cantidad}
                        setCantidad={manejarCambioCantidad}
                        capacidad={capacidad}
                        setCapacidad={setCapacidad}
                        objetos={objetos}
                        onObjetoChange={manejarObjetoCambio}
                        prioridad={prioridad}
                        setPrioridad={setPrioridad}
                        tiempoLimite={tiempoLimite}
                        setTiempoLimite={setTiempoLimite}
                        onGenerarAleatorio={generarAleatorio}
                    />
                </div>

                <PanelChatAgente
                    apiKey={apiKey}
                    objetos={objetos}
                    capacidad={capacidad}
                    tiempoLimite={tiempoLimite}
                    mochila={mochila}
                    setMochila={setMochila}
                />
            </div>
        </div>
    )
}
