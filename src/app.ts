import express, { Request, Response } from "express";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import passport from "passport";
const app = express()


app.use(expressSession({ // Use express-session middleware before passport.session()
    secret: "Your secret",
    resave: false,
    saveUninitialized: false,
})); 
app.use(passport.initialize()); // Initialize Passport middleware
app.use(passport.session()); // If using sessions, initialize session support

app.use(cookieParser())
app.use(express.json()) // for parsing application/json 
app.use(express.urlencoded({ extended: true }))



app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Tour Management System Backend"
    })
})

// Application Routes
app.use("/api/v1", router)

// Global Error Handler
app.use(globalErrorHandler)
app.use(notFound)

export default app