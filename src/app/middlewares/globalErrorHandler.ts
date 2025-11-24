/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelper.ts/ApiError";
import { TErrorSources } from "../interfaces/error.types";

export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {

    const errorSource: any = [
    ]

    // Development logging
    if (envVars.NODE_ENV === "development") {
        console.log(err);
    }


    // Initialize default error response values
    const errorSources: TErrorSources[] = []
    let statusCode = 500
    let message = "Something Went Wrong!!"

    //Duplicate error
    if (err.code === 11000) {
        const matchedArray = err.message.match(/"([^"]*)"/)
        statusCode = 400;
        message = `${matchedArray[1]} Already Exist`
    }
    // Cast Error - ObjectId error
    else if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid MongoDB ObjectId. Please provide a valid Id"
    }
    // Validation error
    else if (err.name === "ValidationError") {
        statusCode = 400;
        const errors = Object.values(err.errors);

        errors.forEach((errorObject: any) => errorSource.push({
            path: errorObject.path,
            message: errorObject.message
        }))
        message = "Validation Error Occurred"
    }
    else if (err instanceof AppError) {
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