 
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express({});
app.use(cors({     //malwaire
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded 
app.use(express.static("public")) // if i wanna store any file like image or pdf
app.use(cookieParser()) // for parsing cookies from request headers

// middlewires are used to handle queries and req like if u hit any ones post of insta then it will check for the token in the cookies and then it will allow u to see that post
export default app;