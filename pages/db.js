import mysql from "mysql2/promise"
// Datos para conectarnos a la base de datos
export const conexion = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "12345",
    database: "Boneless",
    port: 3306
})