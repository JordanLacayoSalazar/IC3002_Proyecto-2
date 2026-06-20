import { eliminarObjetosNoValidos, procesarObjetosPesoCero } from "../utils.js"

/*
 * Resuelve el problema mediante programación dinámica, utilizando una tabla
 * para almacenar resultados parciales y reconstruir la solución óptima final.
 */
export function mochilaDinamica(listaObjetos, capacidad, tiempoAceptable){
    let resultado = {
        valor: 0,
        peso: 0,
        objetos: [],
        operaciones: 0,
        tiempoMs: 0,
        tiemposFases: {
            tiempoFiltradoObjetos: 0,
            tiempoCreacionTabla: 0,
            tiempoLlenadoTabla: 0,
            tiempoReconstruccion: 0
        }
    }
    const inicio = performance.now()
    
    if (listaObjetos.length > 0 && capacidad > 0) {
        const inicioFiltrado = performance.now()
        listaObjetos = eliminarObjetosNoValidos(listaObjetos, capacidad)
        listaObjetos = procesarObjetosPesoCero(listaObjetos, resultado)
        resultado.tiemposFases.tiempoFiltradoObjetos = performance.now() - inicioFiltrado

        const temporizador = tiempoAceptable * 1000
        
        // Se usa el enfoque Bottom-up (tabulación)
        const inicioCreacion = performance.now()
        const tabla = crearTablaDinamica(listaObjetos.length, capacidad)
        resultado.tiemposFases.tiempoCreacionTabla = performance.now() - inicioCreacion

        const inicioLlenado = performance.now()
        const datosTabla = llenarTablaDinamica(tabla, listaObjetos, capacidad, temporizador, inicio)
        resultado.operaciones += datosTabla.operaciones
        resultado.tiemposFases.tiempoLlenadoTabla = performance.now() - inicioLlenado

        // Identificar los objetos forman parte de la solución óptima
        const inicioReconstruccion = performance.now()
        reconstruirSolucion(tabla, listaObjetos, datosTabla.numObjCompletados, capacidad, resultado)
        resultado.tiemposFases.tiempoReconstruccion = performance.now() - inicioReconstruccion
    }

    resultado.tiempoMs = performance.now() - inicio
    return resultado
}

/*
 * Inicialización de la tabla (matriz). Se llena de ceros.
 * Cada celda tabla[i][w] almacenará el valor máximo alcanzable usando 
 * los primeros "i" objetos con una capacidad límite "w".
 */
function crearTablaDinamica(numObjetos, capacidad) {
    let tabla = []
    for (let i = 0; i <= numObjetos; i++) {
        tabla[i] = []
        for (let w = 0; w <= capacidad; w++) {
            tabla[i][w] = 0
        }
    }
    return tabla
}

/*
 * Ejecuta el algoritmo de la mochila llenando la tabla de valores máximos.
 * Devuelve la cantidad de objetos procesados antes de que se agotara el tiempo.
 */
function llenarTablaDinamica(tabla, listaObjetos, capacidad, temporizador, inicio) {
    let numObjCompletados = 0
    let operaciones = 0
    for (let i = 1; i <= listaObjetos.length; i++) {
        if (temporizador <= performance.now() - inicio && temporizador > 0) break

        let objeto = listaObjetos[i - 1]
        for (let w = 1; w <= capacidad; w++) {
            operaciones++
            if (objeto.peso <= w) {
                // Se decide si conviene más incluir el objeto actual o mantener el valor anterior
                let valorSinObjeto = tabla[i - 1][w]
                let valorConObjeto = tabla[i - 1][w - objeto.peso] + objeto.valor
                tabla[i][w] = Math.max(valorSinObjeto, valorConObjeto)
            } else {
                tabla[i][w] = tabla[i - 1][w]
            }
        }
        numObjCompletados++
    }
    return { numObjCompletados, operaciones }
}

/*
 * Recorre la tabla desde la última fila para determinar qué objetos fueron
 * seleccionados basándose en los cambios de valor entre filas.
 */
function reconstruirSolucion(tabla, listaObjetos, numObjCompletados, capacidad, resultado) {
    let capacidadRestante = capacidad
    for (let i = numObjCompletados; i >= 1; i--) {
        resultado.operaciones++
        // Si el valor en la celda actual es distinto al de la fila de arriba, el objeto se incluyó
        if (tabla[i][capacidadRestante] !== tabla[i - 1][capacidadRestante]) {
            let objetoIncluido = listaObjetos[i - 1]
            resultado.objetos.push(objetoIncluido)
            resultado.valor += objetoIncluido.valor
            resultado.peso += objetoIncluido.peso
            capacidadRestante -= objetoIncluido.peso
        }
    }
}
