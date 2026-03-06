const express = require('express');
const app = express();

// ==========================================
// CONFIGURACIÓN
// ==========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de registro de peticiones
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
});

// Base de datos en memoria
let tareas = [];
let contadorID = 1;

// Función para respuesta estándar
function respuesta(res, estado, data) {
    res.json({
        estado: estado,
        timestamp: new Date(),
        data: data
    });
}

// ==========================================
// RUTA RAÍZ
// ==========================================
app.get("/", (req, res) => {
    respuesta(res, "exito", {
        mensaje: "API funcionando correctamente",
        endpoints: [
            "/api/saludo",
            "/api/calcular",
            "/api/tareas",
            "/api/validar-password",
            "/api/convertir-temperatura",
            "/api/buscar",
            "/api/contar-palabras"
        ]
    });
});

// ==========================================
// EJERCICIO 1: SALUDO
// ==========================================
app.post("/api/saludo", (req, res) => {
    try {

        const { nombre } = req.body;

        if (!nombre || nombre.trim() === "") {
            throw new Error("Debes enviar un nombre.");
        }

        respuesta(res, "exito", {
            saludo: `Hola ${nombre}, bienvenido a nuestra API`
        });

    } catch (error) {
        res.status(400).json({ estado: "error", mensaje: error.message });
    }
});

// ==========================================
// EJERCICIO 2: CALCULADORA
// ==========================================
app.post("/api/calcular", (req, res) => {
    try {

        const a = Number(req.body.a);
        const b = Number(req.body.b);
        const operacion = req.body.operacion;

        if (isNaN(a) || isNaN(b)) {
            throw new Error("Los valores deben ser números.");
        }

        let resultado;

        switch (operacion) {
            case "suma":
                resultado = a + b;
                break;

            case "resta":
                resultado = a - b;
                break;

            case "multiplicacion":
                resultado = a * b;
                break;

            case "division":
                if (b === 0) throw new Error("No se puede dividir entre 0");
                resultado = a / b;
                break;

            default:
                throw new Error("Operación inválida");
        }

        respuesta(res, "exito", { resultado });

    } catch (error) {
        res.status(400).json({ estado: "error", mensaje: error.message });
    }
});

// ==========================================
// EJERCICIO 3: CRUD TAREAS
// ==========================================

// Crear tarea
app.post("/api/tareas", (req, res) => {

    const { titulo } = req.body;

    if (!titulo) {
        return res.status(400).json({ estado: "error", mensaje: "Título requerido" });
    }

    const nueva = {
        id: contadorID++,
        titulo: titulo,
        completada: false
    };

    tareas.push(nueva);

    respuesta(res, "exito", nueva);
});

// Listar tareas
app.get("/api/tareas", (req, res) => {
    respuesta(res, "exito", tareas);
});

// Actualizar tarea
app.put("/api/tareas/:id", (req, res) => {

    const id = Number(req.params.id);
    const tarea = tareas.find(t => t.id === id);

    if (!tarea) {
        return res.status(404).json({ estado: "error", mensaje: "Tarea no encontrada" });
    }

    if (req.body.titulo !== undefined) {
        tarea.titulo = req.body.titulo;
    }

    if (req.body.completada !== undefined) {
        tarea.completada = req.body.completada;
    }

    respuesta(res, "exito", tarea);
});

// Eliminar tarea
app.delete("/api/tareas/:id", (req, res) => {

    const id = Number(req.params.id);
    const index = tareas.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ estado: "error", mensaje: "Tarea no encontrada" });
    }

    const eliminada = tareas.splice(index, 1);

    respuesta(res, "exito", eliminada[0]);
});

// ==========================================
// EJERCICIO 4: VALIDADOR DE PASSWORD
// ==========================================
app.post("/api/validar-password", (req, res) => {

    const password = req.body.password || "";
    let errores = [];

    if (password.length < 8) errores.push("mínimo 8 caracteres");
    if (!/[A-Z]/.test(password)) errores.push("una mayúscula");
    if (!/[a-z]/.test(password)) errores.push("una minúscula");
    if (!/[0-9]/.test(password)) errores.push("un número");

    respuesta(res, "exito", {
        valida: errores.length === 0,
        errores
    });
});

// ==========================================
// EJERCICIO 5: CONVERSOR TEMPERATURA
// ==========================================
app.post("/api/convertir-temperatura", (req, res) => {

    const valor = Number(req.body.valor);
    const desde = (req.body.desde || "").toUpperCase();
    const hacia = (req.body.hacia || "").toUpperCase();

    if (isNaN(valor)) {
        return res.status(400).json({ estado: "error", mensaje: "Valor inválido" });
    }

    let celsius;

    if (desde === "C") celsius = valor;
    if (desde === "F") celsius = (valor - 32) * 5 / 9;
    if (desde === "K") celsius = valor - 273.15;

    let resultado;

    if (hacia === "C") resultado = celsius;
    if (hacia === "F") resultado = (celsius * 9 / 5) + 32;
    if (hacia === "K") resultado = celsius + 273.15;

    respuesta(res, "exito", {
        original: valor,
        convertido: Number(resultado.toFixed(2)),
        desde,
        hacia
    });
});

// ==========================================
// EJERCICIO 6: BUSCADOR EN ARRAY
// ==========================================
app.post("/api/buscar", (req, res) => {

    const { array, elemento } = req.body;

    if (!Array.isArray(array)) {
        return res.status(400).json({ estado: "error", mensaje: "Debe ser un arreglo" });
    }

    const indice = array.indexOf(elemento);

    respuesta(res, "exito", {
        encontrado: indice !== -1,
        indice,
        tipo: typeof elemento
    });
});

// ==========================================
// EJERCICIO 7: CONTADOR DE PALABRAS
// ==========================================
app.post("/api/contar-palabras", (req, res) => {

    const texto = req.body.texto;

    if (typeof texto !== "string") {
        return res.status(400).json({ estado: "error", mensaje: "Texto inválido" });
    }

    const palabras = texto.trim().split(/\s+/).filter(Boolean);

    const unicas = new Set(
        palabras.map(p => p.toLowerCase())
    );

    respuesta(res, "exito", {
        palabras: palabras.length,
        caracteres: texto.length,
        palabrasUnicas: unicas.size
    });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
app.listen(3000, () => {
    console.log("Servidor API iniciado en puerto 3000");
});
