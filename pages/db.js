import mysql from "mysql2/promise"
// Datos para conectarnos a la base de datos
export const conexion = mysql.createPool({
    host: "autorack.proxy.rlwy.net",
    user: "root",
    password: "rpDvkoPXVmmfJPCHgprcXudaEVtblhlp",
    database: "railway",
    port: 40007

})