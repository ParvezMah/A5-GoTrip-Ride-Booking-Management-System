/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";

import { userServices } from "./user.services";

import { catchAsync } from "../../utils/catchAsync";
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


export const userControllers = {
    createUser,
}