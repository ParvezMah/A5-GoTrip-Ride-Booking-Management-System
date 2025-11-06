import express, { Request, Response } from "express";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

const app = express()



app.use(express.json()) // for parsing application/json 






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