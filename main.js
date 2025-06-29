//VARIABLES 
const usuarioValido = "marianela";
const claveValida = "4444";

const loginDiv = document.getElementById("login");
const panelDiv = document.getElementById("panelPrincipal");
const btnLogin = document.getElementById("botonLogin");
const mensajeLogin = document.getElementById("mensajeLogin");

const formTurno = document.getElementById("formTurno");
const listaTurnos = document.getElementById("listaTurnos");

//LOCALSTORAGE
let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

//EVENTOS
btnLogin.addEventListener("click", () => {
    const usuario = document.getElementById("inputUsuario").value.trim();
    const clave = document.getElementById("inputClave").value.trim();

    if (usuario === usuarioValido && clave === claveValida) {
        loginDiv.style.display = "none";
        panelDiv.style.display = "block";
        mensajeLogin.textContent = "";
        mostrarTurnos();
    } else {
        mensajeLogin.textContent = "Usuario o clave incorrectos.";
    }
});

formTurno.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const servicio = document.getElementById("servicio").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;

    if (!nombre || !servicio || !fecha || !hora) return;

    const turno = {
        id: Date.now(),
        nombre,
        servicio,
        fecha,
        hora,
    };

    turnos.push(turno);
    localStorage.setItem("turnos", JSON.stringify(turnos));
    formTurno.reset();
    mostrarTurnos();
    const mensaje = document.createElement("p");
mensaje.textContent = "Turno reservado con éxito!";
mensaje.style.color = "green";
formTurno.appendChild(mensaje);

setTimeout(() => mensaje.remove(), 3000);

});

//FUNCIONES
function mostrarTurnos() {
    listaTurnos.innerHTML = "";

    if (turnos.length === 0) {
        listaTurnos.innerHTML = "<li>No hay turnos reservados.</li>";
        return;
    }

    turnos.forEach((turno) => {
        const li = document.createElement("li");
        li.innerHTML = `
    <strong>${turno.nombre}</strong> - ${turno.servicio}  
    ${turno.fecha}  ${turno.hora} 
    <button onclick="cancelarTurno(${turno.id})">Cancelar</button>
    `;
        listaTurnos.appendChild(li);
    });
}

function cancelarTurno(id) {
    turnos = turnos.filter((t) => t.id !== id);
    localStorage.setItem("turnos", JSON.stringify(turnos));
    mostrarTurnos();
}
