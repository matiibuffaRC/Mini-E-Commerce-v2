// Importamos dependencias
import express from "express";
import cors from "cors";
const app = express();
const PUERTO = process.env.PORT || 3000;
// 


app.use(cors()); // Habilitamos CORS para permitir solicitudes desde el frontend
app.use(express.json()); // Middleware para parsear JSON

app.get('/', (request, response) => {
    response.send('El servidor está funcionando correctamente!');
})

app.get('/products', (request, response) => {
    response.json(products);
})


app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
})