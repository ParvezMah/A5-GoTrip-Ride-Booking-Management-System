/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";

import { userServices } from "./user.services";

import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { catchAsync } from "../../utils/catchAsync";
import { verifyToken } from "../../utils/jwt";
import { sendResponse } from "../../utils/sendResponse";



const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userServices.createUser(req.body)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: user
    })
})

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
     console.log("Query received:", query);
    const result = await userServices.getAllUsers(query as Record<string, string>);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "All Users Retrieved Successfully",
        data: result
    })
})


const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const UserId = req.params.id;
    const payload = req.body;

    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET)
    
    const verifiedToken = req.user;


    /* To solve this error from const verifiedToken
        Argument of type 'string | JwtPayload' is not assignable to parameter of type 'JwtPayload'.
        Type 'string' is not assignable to type 'JwtPayload'.ts(2345)
        const verifiedToken: string | JwtPayload
    */
    const user = await userServices.updateUser(UserId, payload, verifiedToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Updated Successfully",
        data: user
    })
})



export const userControllers = {
    createUser,
    getAllUsers,
    updateUser
}