/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

import httpStatus from 'http-status';
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.services";
import AppError from "../../errorHelper.ts/ApiError";


// const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

//     passport.authenticate("local", async (err: any, user: any, info: any) => {
//         if (err) {


//             return next(new AppError(401, err))
//         }
//         if (!user) {
//             // console.log("from !user");
//             // return new AppError(401, info.message)
//             return next(new AppError(401, info.message))
//         }
//   // ✅ Check if user is blocked or suspended
//     //   if (user.status === "BLOCKED" || user.status === "Suspended") {
//     //     const { password, ...rest } = user.toObject();
//     //     return sendResponse(res, {
//     //       success: true,
//     //       statusCode: httpStatus.OK,
//     //       message: `User is ${user.status}`,
//     //       data: rest, // return user info without password
//     //     });
//     //   }



//         const userTokens = await createUserToken(user)

//         // delete user.toObject().password

//         const { password: pass, ...rest } = user.toObject()


//         setAuthCookie(res, userTokens)

//         sendResponse(res, {
//             success: true,
//             statusCode: httpStatus.OK,
//             message: "User Logged In Successfully",
//             data: {
//                 accessToken: userTokens.accessToken,
//                 refreshToken: userTokens.refreshToken,
//                 user: rest
//             }
//         })
//     })(req, res, next) 
// })

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const loginInfo = await AuthServices.credentialsLogin(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: loginInfo
    })
});

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.headers.authorization;
    console.log("refreshToken : ", refreshToken)
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token recieved from cookies")
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Retrived Successfully",
        data: tokenInfo,
    })
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken
}
