import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {pool} from "./config.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.json({message: "Server is running"});
});

app.get("/curriculum", async (req,res) => {
    try{
        const result = await pool.query("SELECT * FROM cs_courses ORDER BY id DESC");
        res.json(result.rows);
    }catch (err){
        console.error(err.message);
        res.status(500).send("SERVOR ERROR, I AM SORRRY");
    }
});

app.post("/curriculum", async (req, res) => {
    try {
        const { 
            course_code, 
            title, 
            description, 
            instructor, 
            difficulty_rating, 
            credits 
        } = req.body;

        const newCourse = await pool.query(
            "INSERT INTO cs_courses (course_code, title, description, instructor, difficulty_rating, credits) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [course_code, title, description, instructor, difficulty_rating, credits]
        );

        res.status(201).json(newCourse.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.delete("/curriculum/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        const deleteCourse = await pool.query(
            "DELETE FROM cs_courses WHERE id = $1 RETURNING *", 
            [id]
        );

        if (deleteCourse.rows.length === 0) {
            return res.status(404).json("Course not found");
        }

        res.json({ message: "Course deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

const PORT = process.env.PORT || 3008
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
})