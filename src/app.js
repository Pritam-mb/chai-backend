 
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express({});
app.use(cors({     
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
}))


// To read JSON data sent in requests (like from Postman or frontend), limit size to 16kb
app.use(express.json({ limit: "16kb" }));

// To read data sent from HTML forms (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// To serve files like images, PDFs, CSS, JS from the "public" folder
app.use(express.static("public"));

// To read cookies sent by the browser
app.use(cookieParser()); // for parsing cookies from request headers

// middlewires are used to handle queries and req like if u hit any ones post of insta then it will check for the token in the cookies and then it will allow u to see that post
import userouter from "./routes/user.route.js"

//routes
app.use("/users",userouter)
// http://localhost:4000/users/register

export default app;