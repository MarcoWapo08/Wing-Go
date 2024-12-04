import express from "express";
import { conexion } from "./db.js";
import { fileURLToPath } from "url";
import path from "path";
import expressSession from 'express-session';

// Configuración de Express
const app = express();
const port = 4000;
app.use(express.json());

// Configuración de las sesiones
app.use(expressSession({
    secret: 'clave-secreta', // Cambia esto por algo más seguro
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,  // No usar "secure: true" ya que HTTPS no está habilitado
        httpOnly: true, // La cookie solo puede ser accedida por el servidor
        maxAge: 1000 * 60 * 60 * 24 // Duración de la cookie (1 día en milisegundos)
    }
}));

// Obtener el directorio de la ruta del archivo actual
const _dirname = path.dirname(fileURLToPath(import.meta.url));

// Tomar archivos estáticos desde la carpeta "pages"
app.use(express.static(path.join(_dirname, "../pages")));

// Middleware para pasar la conexión a las rutas
app.use((req, res, next) => {
    req.myconexion = conexion;
    next();
});

// Ruta para servir el archivo index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "index.html"));
});
// Ruta para consultar id, correo y contraseña en la base de datos
app.post('/login', (req, res) => {
    const { correo, contraseña } = req.body;
    
    if (!correo || !contraseña) {
        return res.status(400).send('Correo y contraseña son requeridos.');
    }
    

    const query = 'SELECT id FROM usuarios WHERE correo = ? AND contraseña = ?';

    conexion.query(query, [correo, contraseña])
        .then(([results]) => {
            if (results.length > 0) {
                const usuario = results[0];

                if (usuario) {
                    const id_usuario = usuario.id;

                    // Guardar el ID en la sesión
                    req.session.idUsuario = id_usuario;
                    console.log(`ID de usuario guardado en la sesión: ${id_usuario}`);  // Log para verificar
                    return res.status(200).send('Inicio de sesión exitoso');
                } else {
                    return res.status(401).send('Credenciales incorrectas');
                }
            } else {
                return res.status(401).send('Credenciales incorrectas');
            }
        })
        .catch(err => {
            console.error('Error al verificar los datos de inicio de sesión:', err);
            return res.status(500).send('Error en el servidor');
        });
});

// Ruta para registrarte
app.post('/registro', (req, res) => {
  const { nombre, paterno, materno, telefono, correo, contraseña } = req.body;
  console.log('Datos recibidos:', { nombre, paterno, materno, telefono, correo, contraseña });  // Agrega este log para depuración

  // Validación simple para asegurar que se reciban los datos necesarios
  if (!nombre || !paterno || !materno || !telefono || !correo || !contraseña) {
      return res.status(400).send('Faltan datos.');
  }

  // Consulta SQL para insertar los datos del cliente
  const query = 'INSERT INTO usuarios (nombres, ap_pa, ap_ma, telefono, correo, contraseña) VALUES (?, ?, ?, ?, ?, ?)';

  conexion.execute(query, [nombre, paterno, materno, telefono, correo, contraseña])
      .then(() => {
          res.status(201).send('Cliente insertado correctamente');
      })
      .catch(err => {
          console.error('Error al insertar los datos:', err);
          res.status(500).send('Error al insertar en la base de datos');
      });
});

// Ruta para obtener el id_usuario desde la sesión
app.get('/api/usuario', (req, res) => {
    if (req.session.idUsuario) {
        res.json({ id_usuario: req.session.idUsuario });
    } else {
        res.status(401).json({ message: 'Usuario no autenticado' });
    }
});

// Ruta para consultar los platillos disponibles
app.get('/api/platillos', (req, res) => {
    const query = 'SELECT * FROM platillos';

    // Ejecutar la consulta a la base de datos
    conexion.execute(query)
        .then(([results]) => {
            // Convertir la imagen binaria a base64 para cada platillo
            const platillosConImagen = results.map(platillo => {
                // Convertir la imagen binaria (longblob) a base64
                const fotoBase64 = platillo.foto.toString('base64');
                
                // Añadir la cadena base64 al objeto platillo
                return {
                    ...platillo,
                    foto: `data:image/jpeg;base64,${fotoBase64}`  // Ajusta el tipo MIME si la imagen no es JPEG
                };
            });

            // Enviar la lista de platillos con la imagen como base64
            res.json(platillosConImagen);
        })
        .catch(err => {
            console.error('Error al obtener los platillos:', err);
            res.status(500).json({ error: 'Error al obtener los platillos' });
        });
});
// Ruta para pedir un platillo
app.post('/api/pedir', async (req, res) => {
    const id_usuario = req.session.idUsuario; // Obtener el ID de usuario desde la sesión
    const { id_platillo, cantidad, precio, detalles, total } = req.body; // Datos enviados desde el cliente

    if (!id_usuario) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    if (!id_platillo || !cantidad || !precio || !total) {
        return res.status(400).json({ message: 'Faltan datos para realizar el pedido' });
    }

    try {
        // Insertar una nueva orden en la tabla `ordenes`
        const query = `
            INSERT INTO ordenes (id_usuario, id_platillo, cantidad, precio, detalles, total)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await conexion.execute(query, [id_usuario, id_platillo, cantidad, precio, detalles || null, total]);

        res.status(201).json({ success: true});
    } catch (error) {
        console.error('Error al procesar el pedido:', error);
        res.status(500).json({ message: 'Error al realizar el pedido' });
    }
});

// Ruta para guardar en el carrito
app.post('/api/guardarCarrito', async (req, res) => {
    const id_usuario = req.session.idUsuario;
    const { id_platillo, cantidad, precio, total, detalles } = req.body;

    if (!id_usuario) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    if (!id_platillo || !cantidad || !precio || !total) {
        return res.status(400).json({ message: 'Faltan datos para agregar al carrito' });
    }

    try {
        // Insertar el artículo en el carrito
        const query = `
            INSERT INTO carrito (id_usuario, id_platillo, cantidad, precio, detalles, total)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await conexion.execute(query, [id_usuario, id_platillo, cantidad, precio, detalles || null, total]);

        res.status(201).json({ success: true});
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        res.status(500).json({ message: 'Error al agregar al carrito' });
    }
});
// Ruta para mostrar el carrito
app.post('/api/mostrarCarritos', async (req, res) => {
    const id_usuario = req.session.idUsuario;

    if (id_usuario) {
        const query = `
            SELECT 
                c.id AS carrito_id,
                c.id_platillo,
                c.cantidad,
                c.precio AS precio_individual,
                c.total,
                c.fecha_agregado,
                p.nombre_platillo,
                p.descripcion,
                p.foto,
                c.detalles
            FROM 
                carrito c
            INNER JOIN 
                platillos p
            ON 
                c.id_platillo = p.id
            WHERE 
                c.id_usuario = ?;
        `;

        try {
            const [rows, fields] = await conexion.query(query, [id_usuario]);

            // Convertir la imagen binaria a Base64 y añadirla al objeto de cada pedido
            const carritosConImagenBase64 = rows.map(carrito => {
                if (carrito.foto) {
                    const fotoBase64 = carrito.foto.toString('base64');
                    carrito.foto = `data:image/jpeg;base64,${fotoBase64}`;  // Formatear con el encabezado
                }
                return carrito;
            });

            // Enviar la respuesta con los pedidos y las imágenes en Base64
            res.json({
                usuario_id: id_usuario,
                carritos: carritosConImagenBase64
            });
        } catch (err) {
            console.error('Error al obtener los carritos:', err);
            res.status(500).json({ error: 'Error al obtener los carritos' });
        }
    } else {
        console.log('Usuario no autenticado');  // Log cuando no hay sesión activa
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }
});
// Ruta para eliminar del carrito
app.delete('/api/carrito/eliminar', async (req, res) => {
    const id_usuario = req.session.idUsuario; // Obtener el usuario desde la sesión
    const { carrito_id } = req.body; // Obtener el ID del carrito a eliminar

    if (!id_usuario) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    if (!carrito_id) {
        return res.status(400).json({ message: 'ID del carrito es requerido' });
    }

    try {
        const query = 'DELETE FROM carrito WHERE id = ? AND id_usuario = ?';
        await conexion.execute(query, [carrito_id, id_usuario]);
        res.status(200).json({ success: true});
    } catch (error) {
        console.error('Error al eliminar el elemento del carrito:', error);
        res.status(500).json({ message: 'Error al eliminar el elemento del carrito' });
    }
});
// Ruta para mostrar los pedidos en proceso
app.post('/api/mostrarPedidos', async (req, res) => {
    const id_usuario = req.session.idUsuario;

    if (id_usuario) {
        const query = `
            SELECT 
                o.id AS orden_id,
                o.cantidad,
                o.precio AS precio_individual,
                o.total,
                o.fecha_orden,
                o.estado,
                p.nombre_platillo,
                p.descripcion,
                p.foto,  -- No usamos TO_BASE64 en la consulta, lo haremos en el servidor
                o.detalles
            FROM 
                ordenes o
            JOIN 
                platillos p ON o.id_platillo = p.id
            WHERE 
                o.id_usuario = ? AND o.estado = 'En proceso'
        `;

        try {
            const [rows, fields] = await conexion.query(query, [id_usuario]);

            // Convertir la imagen binaria a Base64 y añadirla al objeto de cada pedido
            const pedidosConImagenBase64 = rows.map(pedido => {
                if (pedido.foto) {
                    const fotoBase64 = pedido.foto.toString('base64');
                    pedido.foto = `data:image/jpeg;base64,${fotoBase64}`;  // Formatear con el encabezado
                }
                return pedido;
            });

            // Enviar la respuesta con los pedidos y las imágenes en Base64
            res.json({
                usuario_id: id_usuario,
                pedidos: pedidosConImagenBase64
            });
        } catch (err) {
            console.error('Error al obtener los pedidos:', err);
            res.status(500).json({ error: 'Error al obtener los pedidos' });
        }
    } else {
        console.log('Usuario no autenticado');  // Log cuando no hay sesión activa
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }
});
// Ruta para cancelar pedidos
app.post('/api/pedidos/cancelar', async (req, res) => {
    const id_usuario = req.session.idUsuario; // ID del usuario desde la sesión
    const { orden_id } = req.body; // ID del pedido enviado desde el cliente

    if (!id_usuario) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    if (!orden_id) {
        return res.status(400).json({ message: 'ID del pedido es requerido' });
    }

    try {
        const query = `
            UPDATE ordenes
            SET estado = 'Cancelado', fecha_cancelado = CURRENT_TIMESTAMP
            WHERE id = ? AND id_usuario = ? AND estado = 'En proceso';
        `;

        const [result] = await conexion.execute(query, [orden_id, id_usuario]);

        if (result.affectedRows > 0) {
            res.json({ success: true });
        } else {
            res.status(400).json({success: false });
        }
    } catch (error) {
        console.error('Error al cancelar el pedido:', error);
        res.status(500).json({ message: 'Error al cancelar el pedido' });
    }
});
// Ruta para mostrar el historial
app.post('/api/mostrarHistoriales', async (req, res) => {
    const id_usuario = req.session.idUsuario;  // Obtener el ID del usuario desde la sesión

    if (!id_usuario) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const query = `
        SELECT 
            o.id AS id_orden,
            o.id_usuario,
            o.cantidad,
            o.precio AS precio_individual,
            o.total,
            o.fecha_orden,
            o.fecha_completado,
            o.fecha_cancelado,
            o.estado,
            p.nombre_platillo,
            p.descripcion,
            p.foto,
            o.detalles
        FROM 
            ordenes o
        JOIN 
            platillos p ON o.id_platillo = p.id
        WHERE 
            o.id_usuario = ? 
            AND (o.estado = 'Completado' OR o.estado = 'Cancelado')
        ORDER BY 
            o.fecha_orden DESC
    `;

    try {
        const [rows] = await conexion.execute(query, [id_usuario]);

        // Convertir la imagen binaria a Base64 y añadirla al objeto de cada pedido
        const historialConImagenBase64 = rows.map(historial => {
            if (historial.foto) {
                const fotoBase64 = historial.foto.toString('base64');
                historial.foto = `data:image/jpeg;base64,${fotoBase64}`;  // Formatear con el encabezado
            }
            return historial;
        });

        // Enviar la respuesta con el historial de pedidos y las imágenes en Base64
        res.json({ historial: historialConImagenBase64 });
    } catch (err) {
        console.error('Error al obtener el historial de pedidos:', err);
        res.status(500).json({ message: 'Error al obtener el historial' });
    }
});
// Ruta para eliminar un pedido del historial
app.delete('/api/historialPedidosBorrar', async (req, res) => {
    const id_usuario = req.session.idUsuario; // Obtener el usuario desde la sesión
    const { id_orden } = req.body;  // ID del pedido que se quiere eliminar

    if (!id_usuario) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    if (!id_orden) {
        return res.status(400).json({ message: 'El ID del pedido es requerido' });
    }

    try {
        // Eliminar el pedido de la base de datos
        const query = 'DELETE FROM ordenes WHERE id = ? AND id_usuario = ?';
        const [result] = await conexion.execute(query, [id_orden, id_usuario]);

        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Pedido eliminado del historial' });
        } else {
            res.status(400).json({ message: 'No se pudo eliminar el pedido. Puede que ya esté eliminado o no exista.' });
        }
    } catch (error) {
        console.error('Error al eliminar el pedido:', error);
        res.status(500).json({ message: 'Error al eliminar el pedido del historial' });
    }
});
// Ruta para mostrar la cantidad de pedidos en el carrito
app.get('/api/carrito/cantidad', async (req, res) => {
    const id_usuario = req.session.idUsuario; // Obtener el usuario desde la sesión

    if (!id_usuario) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    try {
        const query = `
            SELECT SUM(cantidad) AS cantidad
            FROM carrito
            WHERE id_usuario = ?;
        `;
        const [result] = await conexion.execute(query, [id_usuario]);
        res.status(200).json({ cantidad: result[0].cantidad || 0 }); // Enviar la cantidad al cliente
    } catch (error) {
        console.error('Error al obtener cantidad de elementos del carrito:', error);
        res.status(500).json({ message: 'Error al obtener cantidad de elementos del carrito' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
