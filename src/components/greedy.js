import '../types.js'

export function mochilaGreedy(listaObjetos, capacidad, tiempoAceptable){
    listaObjetos = eliminarObjetosNoValidos(listaObjetos, capacidad)
    let valorPeso = []
    let resultado = {
        valor: 0,
        peso: 0,
        objetos: []
    }
    let nuevaLista = []
    for (let i = 0; i < listaObjetos.length; i++){
        const valorObj = listaObjetos[i].valor
        const pesoObj = listaObjetos[i].peso
        if (listaObjetos[i].peso == 0) {
            resultado.valor += listaObjetos[i].valor
            resultado.objetos.push(listaObjetos[i])
            continue
        }
        nuevaLista.push(listaObjetos[i])
        valorPeso.push(valorObj / pesoObj)
    }
    listaObjetos = nuevaLista
    const inicio = performance.now()
    resultado = greedyLoop(listaObjetos, valorPeso, capacidad, tiempoAceptable*1000, inicio, resultado)
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

function greedyLoop(listaObjetos, valorPeso, capacidad, temporizador, inicio, resultado) {
    if (temporizador <= performance.now() - inicio && temporizador > 0){
        return resultado
    }
    const largo = listaObjetos.length
    if (largo == 0){
        return resultado
    }
    let objetoMax = valorPeso[0]
    let indiceObj = 0
    for (let i = 1; i < largo; i++){
        if (objetoMax < valorPeso[i]) {
            objetoMax = valorPeso[i]
            indiceObj = i
        }
    }
    if (resultado.peso + listaObjetos[indiceObj].peso <= capacidad){
        resultado.valor += listaObjetos[indiceObj].valor
        resultado.peso += listaObjetos[indiceObj].peso
        resultado.objetos.push(listaObjetos[indiceObj])
    }
    listaObjetos.splice(indiceObj, 1)
    valorPeso.splice(indiceObj, 1)
    return greedyLoop(listaObjetos, valorPeso, capacidad, temporizador, inicio, resultado)
}