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
        cargarEspecialistas();
        mensajeLogin.textContent = "";
        mostrarTurnos();
    } else {
        Swal.fire({
            icon: "error",
            title: "Error de inicio de sesión",
            text: "Usuario o clave incorrectos. Intentá de nuevo.",
            confirmButtonColor: "#dc2626",
        });
    }
});

formTurno.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const especialista = document.getElementById("especialista").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("horario").value;

    if (!nombre || !especialista || !fecha || !hora) return;
    const duplicado = turnos.some(t =>
        t.especialista === especialista &&
        t.fecha === fecha &&
        t.hora === hora
    );

    if (duplicado) {
        Swal.fire({
            icon: 'error',
            title: 'Horario ocupado',
            text: 'Ese especialista ya tiene un turno en ese horario. Elegí otro.',
            confirmButtonColor: '#dc2626'
        });
        return;
    }

    const turno = {
        id: Date.now(),
        nombre,
        especialista,
        fecha,
        hora,
    };

    turnos.push(turno);
    localStorage.setItem("turnos", JSON.stringify(turnos));
    formTurno.reset();
    mostrarTurnos();
    Swal.fire({
        icon: "success",
        title: "Turno reservado",
        text: "¡El turno fue registrado correctamente!",
        confirmButtonColor: "#8B80F9",
    });
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
        li.innerHTML = `<strong>${turno.nombre}</strong> reservó con <span class="especialista">${turno.especialista}</span><br>
    Fecha: ${turno.fecha} — Hora: ${turno.hora}
    <button onclick="cancelarTurno(${turno.id})">Cancelar</button>`;
        listaTurnos.appendChild(li);
    });
}
let especialistasData = [];
function cargarEspecialistas() {
    fetch("especialistas.json")
        .then((res) => res.json())
        .then((data) => {
            especialistasData = data;

            const especialidadSelect = document.getElementById("especialidad");
            const especialidadesUnicas = [
                ...new Set(data.map((esp) => esp.especialidad)),
            ];

            especialidadesUnicas.forEach((es) => {
                const option = document.createElement("option");
                option.value = es;
                option.textContent = es;
                especialidadSelect.appendChild(option);
            });
        })
        .catch(() => {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudieron cargar las especialidades.",
                confirmButtonColor: "#dc2626",
            });
        });
}

document.getElementById("especialidad").addEventListener("change", (e) => {
    const seleccionada = e.target.value;
    const especialistaSelect = document.getElementById("especialista");
    especialistaSelect.innerHTML =
        '<option value="">-- Seleccioná un especialista --</option>';

    const filtrados = especialistasData.filter(
        (esp) => esp.especialidad === seleccionada
    );
    filtrados.forEach((esp) => {
        const option = document.createElement("option");
        option.value = esp.nombre;
        option.textContent = esp.nombre;
        especialistaSelect.appendChild(option);
    });

    // Limpiar horarios al cambiar especialidad
    document.getElementById("horario").innerHTML =
        '<option value="">-- Seleccioná un horario disponible --</option>';
});

document.getElementById("especialista").addEventListener("change", (e) => {
    const seleccionado = e.target.value;
    const horarioSelect = document.getElementById("horario");
    horarioSelect.innerHTML =
        '<option value="">-- Seleccioná un horario disponible --</option>';
    const especialista = especialistasData.find(
        (esp) => esp.nombre === seleccionado
    );
    if (especialista) {
        especialista.horarios.forEach((h) => {
            const option = document.createElement("option");
            option.value = h;
            option.textContent = h;
            horarioSelect.appendChild(option);
        });
    }
});

function cancelarTurno(id) {
    turnos = turnos.filter((t) => t.id !== id);
    localStorage.setItem("turnos", JSON.stringify(turnos));
    mostrarTurnos();
}
document.getElementById("nombre").value =
    localStorage.getItem("nombreUsuario") || "";
document.getElementById("nombre").addEventListener("input", (e) => {
    localStorage.setItem("nombreUsuario", e.target.value);
});
