import pg from "pg";
const {Pool} = pg;
import dotenv from "dotenv";
dotenv.config();

if (!process.env.DATABASE_URL){
    console.error("not found")
    process.exit(1);
}else{
    console.log("found")
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized: false
    }
});
