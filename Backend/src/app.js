// Importamos dependencias
import express from "express";
import cors from "cors";
const app = express();
const PUERTO = process.env.PORT || 3000;
// 

// Dependencias de postgreSQL
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'CasaBuffa',
    password: '1889',
    port: 5432,
});

// 


app.use(cors()); // Habilitamos CORS para permitir solicitudes desde el frontend
app.use(express.json()); // Middleware para parsear JSON

app.get('/', (request, response) => {
    response.send('El servidor está funcionando correctamente!');
})

app.get('/productos', async (request, response)=>{
    try{
        const responseDB = await pool.query('SELECT * FROM productos');
        response.json(responseDB.rows);
    }catch (error){
        console.error('Error al obtener los productos: ', error);
        response.status(500).json({ error: 'Error al obtener los productos' });
    }
})

app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
})