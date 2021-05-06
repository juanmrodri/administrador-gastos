// variables y selectores

const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");
// eventos
eventListeners();
function eventListeners() {
  document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
  formulario.addEventListener("submit", agregarGasto);
}

// clases

class Presupuesto {
  constructor(presupuesto) {
    // le pasamos presupuesto pero con el Numbre() para asegurarnos que sea un valor numerico
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }
  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  }
  calcularRestante() {
    // usamos el array method reduce() para saber cual es el presupuesto gastado
    // recordar que reduce() nos pide 2 parametros, acá le pasamos el total que tenemos y el gasto que se realiza
    const gastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    this.restante = this.presupuesto - gastado;
  }

  eliminarGasto(id) {
    this.gastos = this.gastos.filter((gasto) => gasto.id !== id); // vamos a iterar sobre cada gasto y vamos a obtener el id, nos traemos todos menos el id que estamos seleccionando, y que será el eliminado
    this.calcularRestante();
  }
}

class Ui {
  insertarPresupuesto(cantidad) {
    const { presupuesto, restante } = cantidad;
    // agregar al html
    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
  }
  imprimirAlerta(mensaje, tipo) {
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert");
    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    // mensaje de error

    divMensaje.textContent = mensaje;

    // insertar en el HTML

    document.querySelector(".primario").insertBefore(divMensaje, formulario);

    // sacamos el mensaje del HTML

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }

  mostrarGastos(gastos) {
    this.limpiarHtml(); // muy importante el this. acá

    // iterar sobre los gastos

    gastos.forEach((gasto) => {
      const { cantidad, nombre, id } = gasto;

      // creamos un li

      const nuevoGasto = document.createElement("li");
      nuevoGasto.className =
        "list-group d-flex justify-content-between align-items-center"; // aca usamos className, porque tenemos muchas clases por agregar
      //nuevoGasto.setAttribute("data-id", id); // le mandamos el id de "data-id"
      nuevoGasto.style.flexDirection = "row";
      nuevoGasto.style.padding = "2px";
      nuevoGasto.dataset.id = id; // estas lineas (68 y 69), hacen lo mismo, solo que la vieja forma de hacerlo es 68 y 69 la nueva
      // agregar al HTML del gasto
      nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>`;

      // boton de borrar el gasto
      const btnBorrar = document.createElement("button");
      btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
      btnBorrar.textContent = "x";
      btnBorrar.onclick = () => {
        eliminarGasto(id); // tener en cuenta que acá esta en una arrow func. para que espere realmente a que el click ejecute  esta funcion
      };

      nuevoGasto.appendChild(btnBorrar);

      // agregar al HTML

      gastoListado.appendChild(nuevoGasto);
    });
  }
  limpiarHtml() {
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
    }
  }

  actualizarRestante(restante) {
    // agregar al html
    document.querySelector("#restante").textContent = restante;
  }

  comprobarPresupuesto(presupuestoObj) {
    const { presupuesto, restante } = presupuestoObj;
    const restanteDiv = document.querySelector(".restante");

    // comprobar que gastamos el 75% del presupuesto
    if (presupuesto / 4 > restante) {
      // la logica de esta cuenta es la siguiente, en el hipotetico caso de que tuviera 100 de presupuesto, si yo lo divido por 4, me da 25, una cuarta parte digamos, si eso que da de resultado esta fraccion, es mayor al restante, es decir, si te quedan 24 ponele, ya se gasto un 75% del presupuesto
      restanteDiv.classList.remove("alert-success", "alert-warning");
      restanteDiv.classList.add("alert-danger");
    } else if (presupuesto / 2 > restante) {
      // aca es la misma logica pero con el 50%
      restanteDiv.classList.remove("alert-success");
      restanteDiv.classList.add("alert-warning");
    } else {
      // esto sucederia si no se da nada de lo de arriba, y sirve por si reembolsamos plata, es decir, eliminamos algo de la lista, te devuelve la guita, y se vuelve amarillo o verde segun lo que devuelva
      restanteDiv.classList.remove("alert-danger", "alert-warning");
      restanteDiv.classList.add("alert-success");
    }

    // si el total es 0 o menor

    if (restante <= 0) {
      ui.imprimirAlerta("El presupuesto se ha agotado", "error");
      formulario.querySelector('button[type="submit"]').disabled = true;
    }
  }
}

// instanciar

const ui = new Ui();

let presupuesto; // ver video 170 de ser necesario, pero aca definimos la variable unicamente

// funciones

function preguntarPresupuesto() {
  const presupuestoUsuario = prompt("¿Cuál es tu presupuesto?");

  //console.log(parseFloat(presupuestoUsuario));

  // validamos con estas cuatro posibilidades, ya que el campo vacio es una opcion
  // pero si se toca cancelar el valor es null
  // y por ultimo el es isNan, ya que pueden tirar letras, y eso tiraria un Nan,
  // el isNan justamente tira un true si el valor es Nan
  // el <= 0 va por si llegan a ingresar un valor negativo o 0
  if (
    presupuestoUsuario === "" ||
    presupuestoUsuario === null ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario <= 0
  ) {
    // evitamos que quede vacio, matandolo a reloadeadas
    window.location.reload();
  }

  // una vez que pasó la validacion
  // esta es la variable de la linea 22, pasa que si la definimos aca adentro, solo va a estar disponible en esta funcion
  presupuesto = new Presupuesto(presupuestoUsuario);
  ui.insertarPresupuesto(presupuesto);
}

// añade gastos

function agregarGasto(e) {
  e.preventDefault();

  // leer los datos del formularo
  const nombre = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);

  // validar campos
  if (nombre === "" || cantidad === "") {
    ui.imprimirAlerta("Ambos campos son obligatorios", "error");
  } else if (cantidad <= "0" || isNaN(cantidad)) {
    ui.imprimirAlerta("Cantidad no válida", "error");
    return;
  }
  /*
    esto es lo contrario a destructuring,
    en destructing seria asi
    
    const {nombre, cantidad} = gasto, que significa que extrae nombre y cantidad de gasto

    aca, lo que sucede es que se está uniendo nombre y cantidad a gasto
    se lo conoce como object literal enhancement

    tambien es como tener esto ehh

    const gasto = { 
      
      nombre: nombre, 
      cantidad: cantidad, 
      id: Date.now() 
    
    };

     y cuando las key son iguales que los value, se puede poner una sola palabra, pero en este caso, este objeto, toma los valores definidos arriba, en las variables de las lineas 95 y 96

  */

  // generar un objeto con el gasto
  const gasto = { nombre, cantidad, id: Date.now() };
  // añade un nuevo gasto

  presupuesto.nuevoGasto(gasto);
  ui.imprimirAlerta("Gasto agregado correctamente"); // no hace falta agregarle nada, ya que si no es error cae en el success

  // imprimir los gastos
  const { gastos, restante } = presupuesto; // hacemos un destructuring, sacamos gastos, de presupuesto, para poder pasarlo abajo, ya que si le pasamos presupuesto, referenciamos linea 15, y estamos pasando todo el objeto completo
  ui.mostrarGastos(gastos);

  ui.actualizarRestante(restante);

  ui.comprobarPresupuesto(presupuesto); // le pasamos todo el presupuesto porque estamos comprobando lo que gastamos, con todo el presupuesto original

  // reinicia formulario
  formulario.reset();
}

function eliminarGasto(id) {
  // elimina el gasto del objeto
  presupuesto.eliminarGasto(id);
  // elimina los gastos del HTML
  const { gastos, restante } = presupuesto; // extraemos gastos de presupuesto
  ui.mostrarGastos(gastos);

  ui.actualizarRestante(restante);

  ui.comprobarPresupuesto(presupuesto); // esta toma todo el objeto
}
