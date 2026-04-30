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

// Manejo de solicitudes para obtener productos
app.get('/productos', async (request, response)=>{
    try{
        const responseDB = await pool.query(`
                                                SELECT 
                                                    productos.id,
                                                    productos.nombre,
                                                    productos.precio,
                                                    categorias.nombre AS categoria
                                                FROM productos 
                                                JOIN categorias  
                                                    ON productos.id_categoria = categorias.id; 
                                            `);
        response.json(responseDB.rows);
    }catch (error){
        console.error('Error al obtener los productos: ', error);
        response.status(500).json({ error: 'Error al obtener los productos' });
    }
})

// Manejo de solicitudes para obtener categorias
app.get('/categorias', async (request, response) => {
    try {
        const responseDB = await pool.query('SELECT id, nombre FROM categorias');
        response.json(responseDB.rows);
    } catch (error) {
        console.error('Error al obtener las categorías: ', error);
        response.status(500).json({ error: 'Error al obtener las categorías' });
    }
})

// Manejo de solicitudes de modificación de elementos
app.put('/productos/:id', async (request, response)=>{
    
    // Obtenemos los datos de la request
    const { id } = request.params;
    const { nombre, precio, id_categoria } = request.body;
    
    try {
        const result = await pool.query(
            'UPDATE productos SET nombre = $1, precio = $2, id_categoria = $3 WHERE id = $4 RETURNING *',
            // Es una forma de trabajar en postgre, donde buscamos el ID y reemplamos los otros valores por los obtenidos de la request
            [nombre, precio, id_categoria, id] // Valores a cambiar
        );
        if (result.rows.length === 0) {
            return response.status(404).json({ error: 'Producto no encontrado' });
        }
        response.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar el producto: ', error);
        response.status(500).json({ error: 'Error al actualizar el producto' });
    }
})

// Manejo de solicitudes de creación de elementos
app.post('/productos', async (request, response) => {
    const { nombre, precio, id_categoria } = request.body;

    // Validación primero
    if (!nombre || !precio || !id_categoria) {
        return response.status(400).json({ error: 'Faltan datos' });
    }

    try {
        const result = await pool.query(`
            INSERT INTO productos 
            (nombre, descripcion, precio, stock, imagen_url, id_categoria) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`,
            [
                nombre,
                'Sin descripción', // valor por defecto
                precio,
                10,
                'img/mouse.jpg',
                id_categoria
            ]
        );

        response.status(201).json(result.rows[0]);

    } catch (error) {
        console.error('Error al crear el producto: ', error);
        response.status(500).json({ error: 'Error al crear el producto' });
    }
});

app.delete('/productos/:id', async (request, response) => {
    const { id } = request.params;

    try {
        const result = await pool.query(
            `DELETE FROM productos WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return response.status(404).json({ error: 'Producto no encontrado' });
        }

        response.status(200).json(result.rows[0]);

    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        response.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
})