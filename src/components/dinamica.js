import '../types.js'

export function mochilaDinamica(listaObjetos, capacidad, tiempoAceptable){
    listaObjetos = eliminarObjetosNoValidos(listaObjetos, capacidad)
    let resultado = {
        valor: 0,
        peso: 0,
        objetos: []
    }
    const inicio = performance.now()
    resultado = dinamicaLoop(listaObjetos, capacidad, [1], { valor: 0, peso: 0, objetos: [] }, resultado, tiempoAceptable*1000, inicio)
    return resultado
}

function eliminarObjetosNoValidos(listaObjetos, capacidad) {
    let nuevaLista = []
    for (let i = 0; i < listaObjetos.length; i++){
        if (listaObjetos[i].valor == 0) continue
        if (listaObjetos[i].peso > capacidad) continue
        nuevaLista.push(listaObjetos[i])
    }
    return nuevaLista
}

function dinamicaLoop(listaObjetos, capacidad, listaIndice, mochilaActual, resultado, temporizador, inicio){
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
    let indiceActual = listaIndice.length - 1
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
        indiceActual = listaIndice.length - 1
    }

    let ingresoValido = listaIndice[indiceActual] == 1 
    const objetoActual = listaObjetos[indiceActual]
    if (objetoActual.peso + mochilaActual.peso > capacidad && ingresoValido) {
        if (mochilaActual.valor > resultado.valor) {
            resultado.valor = mochilaActual.valor
            resultado.peso = mochilaActual.peso
            resultado.objetos = mochilaActual.objetos.slice()
        }
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
        if (listaIndice[indiceActual - 1] == 1) {
            mochilaActual.valor -= listaObjetos[indiceActual - 1].valor
            mochilaActual.peso -= listaObjetos[indiceActual - 1].peso
            mochilaActual.objetos.splice(mochilaActual.objetos.length - 1, 1)
            listaIndice[indiceActual - 1] = 0
            listaIndice.push(1)
        }
    } else if (ingresoValido) listaIndice.push(1)
    resultado = dinamicaLoop(listaObjetos, capacidad, listaIndice, mochilaActual, resultado, temporizador, inicio)
    return resultado
}