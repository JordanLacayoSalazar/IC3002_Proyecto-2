import { eliminarObjetosNoValidos } from '../utils.jsx'
import '../types.jsx'

export function mochilaDinamica(listaObjetos, capacidad, tiempoAceptable){
    listaObjetos = eliminarObjetosNoValidos(listaObjetos, capacidad)
    const cantidadObjetos = listaObjetos.length
    let resultado = {
        valor: 0,
        peso: 0,
        objetos: []
    }
    const inicio = performance.now()

}

function dinamicaLoop(listaObjetos, capacidad, listaIndice, mochilaActual, resultado, temporizador, inicio){
    //Verifica si el tiempo aceptable ha sido alcanzado
    if (temporizador <= performance.now() - inicio && temporizador > 0){
        if (resultado.valor > mochilaActual.valor) resultado = mochilaActual
        return resultado
    }
    //Verifica si se ha verificado todas las combinaciones posibles
    let indiceActual = listaIndice.length - 1
    if (indiceActual < 0) {
        if (mochilaActual.valor > resultado.valor) resultado = mochilaActual
        return resultado
    }

    //Si el objeto actual no esta en la mochila lo elimina del indice y verifica el anterior
    if (listaIndice[indiceActual] == 0) {
        listaIndice.splice(indiceActual, 1)
        //si el indice esta vacio retorna el resultado final
        if (indiceActual - 1 < 0) {
            if (mochilaActual.valor > resultado.valor) resultado = mochilaActual
            return resultado
        }
        //Si el objeto anterior esta en la mochila lo elimina y agrega el siguiente
        if (listaIndice[indiceActual - 1] == 1) {
            mochilaActual.valor -= listaObjetos[indiceActual - 1].valor
            mochilaActual.peso -= listaObjetos[indiceActual - 1].peso
            mochilaActual.objetos.splice(mochilaActual.objetos.length - 1, 1)
            listaIndice[indiceActual - 1] = 0
            listaIndice.push(1)
        }
        indiceActual = listaIndice.length - 1
    }

    const objetoActual = listaObjetos[indiceActual]
    let ingresoValido = true
    if (objetoActual.valor + mochilaActual.valor > capacidad) {
        ingresoValido = false
        if (mochilaActual.valor > resultado.valor) resultado = mochilaActual
        listaIndice[indiceActual] = 0
        if (indiceActual + 1 < listaObjetos.length) {
            listaIndice.push(1)
        }
    }
    if (ingresoValido){
        mochilaActual.valor += objetoActual.valor
        mochilaActual.peso += objetoActual.peso
        mochilaActual.objetos.push(objetoActual)
    }
    if (ingresoValido && indiceActual + 1 >= listaObjetos.length) {
        if (mochilaActual.valor > resultado.valor) resultado = mochilaActual
        mochilaActual.valor -= objetoActual.valor
        mochilaActual.peso -= objetoActual.peso
        mochilaActual.objetos.splice(mochilaActual.objetos.length - 1, 1)
        if (listaIndice[indiceActual - 1] != 0) {
            mochilaActual.valor -= listaObjetos[indiceActual - 1].valor
            mochilaActual.peso -= listaObjetos[indiceActual - 1].peso
            mochilaActual.objetos.splice(mochilaActual.objetos.length - 1, 1)
            listaIndice[indiceActual - 1] = 0
            listaIndice.push(1)
        }
    } else listaIndice.push(1)
    resultado = dinamicaLoop(listaObjetos, capacidad, listaIndice, mochilaActual, resultado, temporizador, inicio)
    return resultado
}