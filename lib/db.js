import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "127.0.0.1",       // XAMPP MySQL server
  user: "Adi",             // MySQL username
  password: "Adi#123",     // MySQL password
  database: "telephone"    // Database name
});