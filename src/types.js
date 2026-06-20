// Representa los elementos del problema de la mochila.
export class Objeto {
    // Inicializa un objeto con su identificador, valor, peso y estado de fraccionamiento.
    constructor(id, valor, peso) {
        this.id = id;
        this.valor = valor;
        this.peso = peso;
        this.esFraccionado = false;
    }
    // Permite cambiar el valor del objeto.
    setValor(nuevoValor) { this.valor = nuevoValor }

    // Permite cambiar el peso del objeto.
    setPeso(nuevoPeso) { this.peso = nuevoPeso }

    /*
     * Bandera que permite diferenciar los objetos originales de los objetos que
     * fueron fraccionados por el algoritmo Greedy.
     */
    setFraccionado(booleano) { this.esFraccionado = booleano }
}

// Representa un mensaje dentro de la conversación del chat. El autor puede ser "usuario" o "bot".
export class Mensaje {
    // Inicializa un mensaje con identificador, autor y contenido.
    constructor(id, autor, texto) {
        this.id = id;
        this.autor = autor;
        this.texto = texto;
    }
}
