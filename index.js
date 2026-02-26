import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import {pool} from "./database.js"

await pool.query(`CREATE TABLE IF NOT EXIST Movies(
    id INT auto_increment PRIMARY key,
    title VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    genre VARCHAR(50) NOT NULL)
`)
const PORT = process.env.PORT || 3000
const app = express()
app.use(express.json())
app.use(cors())

app.get("/Movies", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM Movies")
        res.json(rows);
    } catch (error) {
        res.status(500).json({msg: "Error DB",
            error: error
        })
    }
})

app.post("/Movies", async (req, res) => {
    const { title, year } = req.body;
    try {
        const [result] = await pool.query("INSERT INTO movies (title, year) VALUES (?, ?)", [title, year])
        res.status(201).json({id: result.insertId})
    } catch {
        res.status(500).json({msg: "Falló"})
    }
})

app.delete("/Movies/:id", async (req, res) => {
    const id = req.params.id
    try {
        const [result] = await pool.query("DELETE FROM Movies WHERE id =?", [id])
        if(result.affectedRows == 0){
            return res.status(404).json({message: "Película no encontrada"})
        }
        res.status(200).json({message: "Película deleteada"})
    } catch (error) {
        res.status(500).json({message: "Error al eliminar", error})
    }
})

app.listen(PORT, ()=>{
    console.log("Everything's fine")
})