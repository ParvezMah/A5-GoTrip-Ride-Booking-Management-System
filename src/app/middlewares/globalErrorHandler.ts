/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelper.ts/ApiError";
import { TErrorSources } from "../interfaces/error.types";

export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {

    // Development logging
    if (envVars.NODE_ENV === "development") {
        console.log(err);
    }


    // Initialize default error response values
    const errorSources: TErrorSources[] = []
    let statusCode = 500
    let message = "Something Went Wrong!!"

    //Checking error type
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message
    } else if (err instanceof Error) {
        statusCode = 500;
        message = err?.message
    }

    // Sending the error response
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: envVars.NODE_ENV === "development" ? err : null,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })

}