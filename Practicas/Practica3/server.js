const express = require("express");
const crypto = require("crypto");

const app = express();
app.use(express.json());

const PORT = 3000;

/* ================================
   1. mascaracteres
================================ */
app.post("/mascaracteres", (req, res) => {
    const { cadena1, cadena2 } = req.body;

    if (!cadena1 || !cadena2) {
        return res.json({ success: false, error: "Faltan parámetros" });
    }

    const resultado = cadena1.length >= cadena2.length ? cadena1 : cadena2;

    res.json({
        success: true,
        resultado
    });
});

/* ================================
   2. menoscaracteres
================================ */
app.post("/menoscaracteres", (req, res) => {
    const { cadena1, cadena2 } = req.body;

    if (!cadena1 || !cadena2) {
        return res.json({ success: false, error: "Faltan parámetros" });
    }

    const resultado = cadena1.length <= cadena2.length ? cadena1 : cadena2;

    res.json({
        success: true,
        resultado
    });
});

/* ================================
   3. numcaracteres
================================ */
app.post("/numcaracteres", (req, res) => {
    const { cadena } = req.body;

    if (!cadena) {
        return res.json({ success: false, error: "Falta la cadena" });
    }

    res.json({
        success: true,
        numeroCaracteres: cadena.length
    });
});

/* ================================
   4. palindroma
================================ */
app.post("/palindroma", (req, res) => {
    const { cadena } = req.body;

    if (!cadena) {
        return res.json({ success: false, error: "Falta la cadena" });
    }

    const limpia = cadena.toLowerCase().replace(/\s/g, "");
    const invertida = limpia.split("").reverse().join("");

    res.json({
        success: true,
        esPalindroma: limpia === invertida
    });
});

/* ================================
   5. concat
================================ */
app.post("/concat", (req, res) => {
    const { cadena1, cadena2 } = req.body;

    if (!cadena1 || !cadena2) {
        return res.json({ success: false, error: "Faltan parámetros" });
    }

    res.json({
        success: true,
        resultado: cadena1 + cadena2
    });
});

/* ================================
   6. applysha256
================================ */
app.post("/applysha256", (req, res) => {
    const { cadena } = req.body;

    if (!cadena) {
        return res.json({ success: false, error: "Falta la cadena" });
    }

    const hash = crypto.createHash("sha256")
        .update(cadena)
        .digest("hex");

    res.json({
        success: true,
        original: cadena,
        encriptado: hash
    });
});

/* ================================
   7. verifysha256
================================ */
app.post("/verifysha256", (req, res) => {
    const { cadenaNormal, cadenaHash } = req.body;

    if (!cadenaNormal || !cadenaHash) {
        return res.json({ success: false, error: "Faltan parámetros" });
    }

    const nuevoHash = crypto.createHash("sha256")
        .update(cadenaNormal)
        .digest("hex");

    res.json({
        success: true,
        coincide: nuevoHash === cadenaHash
    });
});

/* ================================
   Iniciar servidor
================================ */
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
