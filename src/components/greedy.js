import { eliminarObjetosNoValidos, procesarObjetosPesoCero } from "../utils.js"
import { Objeto } from "../types.js"

/*
 * Ordena los objetos por densidad de valor y ejecuta la lógica Greedy para
 * completar la mochila, permitiendo soluciones fraccionarias si es necesario.
 */
export function mochilaGreedy(listaObjetos, capacidad, tiempoAceptable){
    let resultado = {
        valor: 0,
        peso: 0,
        objetos: [],
        operaciones: 0,
        tiempoMs: 0,
        tiemposFases: {
            tiempoFiltradoObjetos: 0,
            tiempoOrdenamiento: 0,
            tiempoBuclePrincipal: 0
        }
    }
    const inicio = performance.now()
    
    if (listaObjetos.length > 0 && capacidad > 0) {
        const inicioFiltrado = performance.now()
        listaObjetos = eliminarObjetosNoValidos(listaObjetos, capacidad)
        listaObjetos = procesarObjetosPesoCero(listaObjetos, resultado)
        resultado.tiemposFases.tiempoFiltradoObjetos = performance.now() - inicioFiltrado

        // Ordenar la lista de objetos según su densidad de valor (valor/peso) de mayor a menor
        const inicioOrdenamiento = performance.now()
        listaObjetos.sort(function (a, b) {
            resultado.operaciones++
            return compararValorPeso(a, b)
        })
        resultado.tiemposFases.tiempoOrdenamiento = performance.now() - inicioOrdenamiento

        const inicioBucle = performance.now()
        greedyLoop(listaObjetos, capacidad, tiempoAceptable*1000, inicio, resultado)
        resultado.tiemposFases.tiempoBuclePrincipal = performance.now() - inicioBucle
    }

    resultado.tiempoMs = performance.now() - inicio
    return resultado
}

// Se resta B menos A para ordenar de mayor a menor
function compararValorPeso(a, b) {
    let densidadA = a.valor / a.peso
    let densidadB = b.valor / b.peso
    return densidadB - densidadA
}

/*
 * Añade objetos a la mochila de forma recursiva según el orden de densidad.
 * Si un objeto no cabe entero, toma la fracción necesaria para llenar el espacio.
 */
function greedyLoop(listaObjetos, capacidad, temporizador, inicio, resultado) {
    resultado.operaciones++

    if (temporizador <= performance.now() - inicio && temporizador > 0){
        return resultado
    }

    if (listaObjetos.length === 0) {
        return resultado
    }

    // Como la lista ya está ordenada, el objeto con mayor densidad es siempre el primero
    const objetoActual = listaObjetos[0]
    const espacioDisponible = capacidad - resultado.peso

    if (objetoActual.peso <= espacioDisponible) {
        // El objeto cabe completo
        resultado.valor += objetoActual.valor
        resultado.peso += objetoActual.peso
        resultado.objetos.push(objetoActual)
        listaObjetos.splice(0, 1)
        return greedyLoop(listaObjetos, capacidad, temporizador, inicio, resultado)
    } else {
        // Mochila fraccionaria. Se toma solo la parte que cabe en la mochila
        if (espacioDisponible > 0) {
            // Se crea una copia fraccionada sin modificar el objeto original.
            const valorFraccionado = (espacioDisponible / objetoActual.peso) * objetoActual.valor
            const objetoFraccionado = new Objeto(objetoActual.id, valorFraccionado, espacioDisponible)
            objetoFraccionado.pesoOriginal = objetoActual.peso
            objetoFraccionado.valorOriginal = objetoActual.valor
            objetoFraccionado.setFraccionado(true)

            resultado.valor += objetoFraccionado.valor
            resultado.peso += objetoFraccionado.peso
            resultado.objetos.push(objetoFraccionado)
        }
        return resultado
    }
}
