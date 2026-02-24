const express = require('express');
const app = express();

const PORT = 3000;

// Ruta GET para número aleatorio simple
app.get('/random', (req, res) => {
    const numero = Math.floor(Math.random() * 100) + 1;
    res.json({
        numero: numero
    });
});

// Ruta GET con parámetros (min y max)
app.get('/random/:min/:max', (req, res) => {
    const min = parseInt(req.params.min);
    const max = parseInt(req.params.max);

    if (isNaN(min) || isNaN(max)) {
        return res.status(400).json({
            error: "Los parámetros deben ser números"
        });
    }

    const numero = Math.floor(Math.random() * (max - min + 1)) + min;

    res.json({
        min: min,
        max: max,
        numero: numero
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
