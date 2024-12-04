import mysql from "mysql2/promise"
// Datos para conectarnos a la base de datos
export const conexion = mysql.createPool({
    host: "junction.proxy.rlwy.net",
    user: "root",
    password: "nszffScELAWUqgiAxuibrSZhjxHaMGZr",
    database: "railway",
    port: 12004
})