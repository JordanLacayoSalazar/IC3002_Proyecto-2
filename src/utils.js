/*
 * Elimina de la listaObjetos los objetos que no tienen ningún valor y los que
 * sobrepasan la capacidad de la mochila.
 */
export function eliminarObjetosNoValidos(listaObjetos, capacidad) {
    let nuevaLista = []
    for (let i = 0; i < listaObjetos.length; i++){
        if (listaObjetos[i].valor == 0) continue
        if (listaObjetos[i].peso > capacidad) continue
        nuevaLista.push(listaObjetos[i])
    }
    return nuevaLista
}

/*
 * Se agregan a la mochila los objetos que no pesan nada
 * (no afectan a la capacidad de la mochila).
 */
export function procesarObjetosPesoCero(listaObjetos, resultado) {
    let nuevaLista = []
    for (let i = 0; i < listaObjetos.length; i++) {
        let obj = listaObjetos[i]
        if (obj.peso === 0) {
            resultado.valor += obj.valor
            resultado.objetos.push(obj)
        } else {
            nuevaLista.push(obj)
        }
    }
    return nuevaLista
}

// Convierte el nombre interno del algoritmo en una etiqueta legible para el usuario.
export function obtenerNombreAlgoritmo(algoritmo) {
    if (algoritmo === "backtracking") {
        return "Backtracking"
    } else if (algoritmo === "dinamica") {
        return "Programación Dinámica"
    } else if (algoritmo === "greedy") {
        return "Greedy"
    } else {
        return algoritmo
    }
}
