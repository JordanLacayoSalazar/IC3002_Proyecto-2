// Representa los elementos del problema de la mochila.
export class Objeto {
    constructor(id, valor, peso) {
        this.id = id;
        this.valor = valor;
        this.peso = peso;
    }
}

// Representa un mensaje dentro de la conversación del chat. El autor puede ser "usuario" o "bot".
export class Mensaje {
    constructor(id, autor, texto) {
        this.id = id;
        this.autor = autor;
        this.texto = texto;
    }
}
