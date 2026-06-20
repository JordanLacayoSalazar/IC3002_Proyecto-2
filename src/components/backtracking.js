import { eliminarObjetosNoValidos, procesarObjetosPesoCero } from "../utils.js"

/*
 * Prepara la lista de objetos y hace una búsqueda recursiva por backtracking 
 * para encontrar la combinación que maximice el valor dentro de la capacidad.
 */
export function mochilaBactracking(listaObjetos, capacidad, tiempoAceptable) {
    let resultado = {
        valor: 0,
        peso: 0,
        objetos: [],
        operaciones: 0,
        tiempoMs: 0,
        tiemposFases: {
            tiempoFiltradoObjetos: 0,
            tiempoBusquedaRecursiva: 0
        }
    }
    const inicio = performance.now()
    
    if (listaObjetos.length > 0 && capacidad > 0) {
        const inicioFiltrado = performance.now()
        listaObjetos = eliminarObjetosNoValidos(listaObjetos, capacidad)
        listaObjetos = procesarObjetosPesoCero(listaObjetos, resultado)
        resultado.tiemposFases.tiempoFiltradoObjetos = performance.now() - inicioFiltrado

        const inicioBusqueda = performance.now()
        backtrackingRecursion(listaObjetos, capacidad, [1], { valor: 0, peso: 0, objetos: [] }, resultado, tiempoAceptable*1000, inicio)
        resultado.tiemposFases.tiempoBusquedaRecursiva = performance.now() - inicioBusqueda
    }
    
    resultado.tiempoMs = performance.now() - inicio
    return resultado
}

/*
 * Explora el espacio de búsqueda de forma recursiva, gestionando la inclusión
 * de objetos y verificando constantemente si se ha agotado el tiempo límite.
 */
function backtrackingRecursion(listaObjetos, capacidad, listaIndice, mochilaActual, resultado, temporizador, inicio) {
    resultado.operaciones++

    //Verifica si el tiempo aceptable ha sido alcanzado
    if (temporizador <= performance.now() - inicio && temporizador > 0){
        if (resultado.valor < mochilaActual.valor) {
            resultado.valor = mochilaActual.valor
            resultado.peso = mochilaActual.peso
            resultado.objetos = mochilaActual.objetos.slice()
        }
        return resultado
    }
    //Verifica si se ha verificado todas las combinaciones posibles
    const indiceActual = listaIndice.length - 1
    if (indiceActual < 0) {
        if (mochilaActual.valor > resultado.valor) {
            resultado.valor = mochilaActual.valor
            resultado.peso = mochilaActual.peso
            resultado.objetos = mochilaActual.objetos.slice()
        }
        return resultado
    }
    //Si el objeto actual no esta en la mochila lo elimina del indice y verifica el anterior
    if (listaIndice[indiceActual] == 0) {
        listaIndice.splice(indiceActual, 1)
        //si el indice esta vacio retorna el resultado final
        if (indiceActual - 1 < 0) {
            if (mochilaActual.valor > resultado.valor) {
                resultado.valor = mochilaActual.valor
                resultado.peso = mochilaActual.peso
                resultado.objetos = mochilaActual.objetos.slice()
            }
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
        return backtrackingRecursion(listaObjetos, capacidad, listaIndice, mochilaActual, resultado, temporizador, inicio)
    }
    //Obtiene el objeto actual y verifica si se puede agregar a la mochila
    const objetoActual = listaObjetos[indiceActual]
    if (objetoActual.peso + mochilaActual.peso > capacidad) {
        if (mochilaActual.valor > resultado.valor) {
            resultado.valor = mochilaActual.valor
            resultado.peso = mochilaActual.peso
            resultado.objetos = mochilaActual.objetos.slice()
        }
        listaIndice[indiceActual] = 0
        if (indiceActual + 1 >= listaObjetos.length) {
            return backtrackingRecursion(listaObjetos, capacidad, listaIndice, mochilaActual, resultado, temporizador, inicio)
        }
        listaIndice.push(1)
        return backtrackingRecursion(listaObjetos, capacidad, listaIndice, mochilaActual, resultado, temporizador, inicio)
    }
    //agrega el objeto a la mochila y verifica si existe el siguiente objeto
    mochilaActual.valor += objetoActual.valor
    mochilaActual.peso += objetoActual.peso
    mochilaActual.objetos.push(objetoActual)
    //si no existe el siguiente objeto elimina el actual y verifica el anterior
    if (indiceActual + 1 >= listaObjetos.length) {
        if (mochilaActual.valor > resultado.valor) {
            resultado.valor = mochilaActual.valor
            resultado.peso = mochilaActual.peso
            resultado.objetos = mochilaActual.objetos.slice()
        }
        if (indiceActual - 1 < 0) return resultado
        mochilaActual.valor -= objetoActual.valor
        mochilaActual.peso -= objetoActual.peso
        mochilaActual.objetos.splice(mochilaActual.objetos.length - 1, 1)
        listaIndice.splice(indiceActual, 1)
        if (listaIndice[indiceActual - 1] == 0) {
            return backtrackingRecursion(listaObjetos, capacidad, listaIndice, mochilaActual, resultado, temporizador, inicio)
        }
        mochilaActual.valor -= listaObjetos[indiceActual - 1].valor
        mochilaActual.peso -= listaObjetos[indiceActual - 1].peso
        mochilaActual.objetos.splice(mochilaActual.objetos.length - 1, 1)
        listaIndice[indiceActual - 1] = 0
        listaIndice.push(1)
        return backtrackingRecursion(listaObjetos, capacidad, listaIndice, mochilaActual, resultado, temporizador, inicio)
    }
    listaIndice.push(1)
    return backtrackingRecursion(listaObjetos, capacidad, listaIndice, mochilaActual, resultado, temporizador, inicio)
}
