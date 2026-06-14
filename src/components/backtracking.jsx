import { eliminarObjetosNoValidos } from '../utils.jsx'
import { objeto } from '../types.jsx'

export function bactracking(listaObjetos, capacidad, tiempoAceptable) {
    listaObjetos = eliminarObjetosNoValidos(listaObjetos, capacidad)
    const cantidadObjetos = listaObjetos.length
    let resultado = {
        valor: 0,
        peso: 0,
        objetos: []
    }
    const inicio = performance.now()
    return backtrackingRecursion(listaObjetos, capacidad, [], { valor: 0, peso: 0, objetos: [] }, resultado, tiempoAceptable*1000, inicio)
}

function backtrackingRecursion(listaObjetos, capacidad, listaIndice, mochilaActual, resultado, temporizador, inicio) {
    //Verifica si el tiempo aceptable ha sido alcanzado
    if (temporizador <= performance.now() - inicio && temporizador > 0){
        if (resultado.valor > mochilaActual.valor) resultado = mochilaActual
        return resultado
    }
    //Verifica si se ha verificado todas las combinaciones posibles
    const indiceActual = listaIndice.length - 1
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
        return backtrackingRecursion(listaObjetos, capacidad, listaIndice, mochilaActual, resultado)
    }
    //Obtiene el objeto actual y verifica si se puede agregar a la mochila
    const objetoActual = listaObjetos[indiceActual]
    if (objetoActual.peso + mochilaActual.peso > capacidad) {
        if (mochilaActual.valor > resultado.valor) resultado = mochilaActual
        listaIndice[indiceActual] = 0
        if (indiceActual + 1 >= listaObjetos.length) {
            return backtrackingRecursion(listaObjetos, capacidad, listaIndice, mochilaActual, resultado)
        }
        listaIndice.push(1)
        return backtrackingRecursion(listaObjetos, capacidad, listaIndice, mochilaActual, resultado)
    }
    //agrega el objeto a la mochila y verifica si existe el siguiente objeto
    mochilaActual.valor += objetoActual.valor
    mochilaActual.peso += objetoActual.peso
    mochilaActual.objetos.push(objetoActual)
    //si no existe el siguiente objeto elimina el actual y verifica el anterior
    if (indiceActual + 1 >= listaObjetos.length) {
        if (mochilaActual.valor > resultado.valor) resultado = mochilaActual
        mochilaActual.valor -= objetoActual.valor
        mochilaActual.peso -= objetoActual.peso
        mochilaActual.objetos.splice(mochilaActual.objetos.length - 1, 1)
        if (listaIndice[indiceActual - 1] == 0) {
            return backtrackingRecursion(listaObjetos, capacidad, listaIndice, mochilaActual, resultado)
        }
        mochilaActual.valor -= listaObjetos[indiceActual - 1].valor
        mochilaActual.peso -= listaObjetos[indiceActual - 1].peso
        mochilaActual.objetos.splice(mochilaActual.objetos.length - 1, 1)
        listaIndice[indiceActual - 1] = 0
        listaIndice.push(1)
        return backtrackingRecursion(listaObjetos, capacidad, listaIndice, mochilaActual, resultado)
    }
    listaIndice.push(1)
    return backtrackingRecursion(listaObjetos, capacidad, listaIndice, mochilaActual, resultado)
}