import { eliminarObjetosNoValidos } from '../utils.jsx'
import '../types.jsx'

export function greedy(listaObjetos, capacidad, tiempoAceptable){
    listaObjetos = eliminarObjetosNoValidos(listaObjetos, capacidad)
    let valorPeso = []
    for (i = 0; i < listaObjetos.length; i++){
        const valorObj = listaObjetos[i].valor
        const pesoObj = listaObjetos[i].peso
        valorPeso.push(valorObj / pesoObj)
    }
    let resultado = {
        valor: 0,
        peso: 0,
        objetos: []
    }
    const inicio = performance.now()
    resultado = greedyLoop(listaObjetos, valorPeso, capacidad, tiempoAceptable*1000, inicio, resultado)
    return resultado
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
    for (i = 0; i < largo; i++){
        if (objetoMax < valorPeso[i]) {
            objetoMax = valorPeso[i]
            indiceObj = i
        }
    }
    if (resultado.valor + listaObjetos[indiceObj].valor <= capacidad - resultado.valor){
        resultado.valor += listaObjetos[indiceObj].valor
        resultado.peso += listaObjetos[indiceObj].peso
        resultado.objetos.push(listaObjetos[indiceObj])
    }
    listaObjetos.splice(indiceObj, 1)
    return greedyLoop(listaObjetos, valorPeso, capacidad, tiempo, inicio, resultado)
}