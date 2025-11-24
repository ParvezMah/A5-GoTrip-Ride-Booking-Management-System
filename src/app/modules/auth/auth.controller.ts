/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

import httpStatus from 'http-status';
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.services";
import AppError from "../../errorHelper.ts/ApiError";
import { setTokensToCookie } from "../../utils/setTokensToCookie";


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
    
    // res.cookie("accessToken", loginInfo.accessToken, {
    //     httpOnly: true, // httpOnly: true This makes the cookie inaccessible to JavaScript running in the browser (it can't be read or modified by document.cookie). Purpose: Helps protect against XSS (Cross-Site Scripting) attacks.
    //     secure: false, // secure: false This means the cookie will be sent over both HTTP and HTTPS connections. Purpose: In development, you often use secure: false because you may not have HTTPS locally. In production, you should set secure: true so the cookie is only sent over HTTPS, making it more secure.
    // })
    
    // res.cookie("refreshToken", loginInfo.refreshToken, {
    //     httpOnly: true, // httpOnly: true This makes the cookie inaccessible to JavaScript running in the browser (it can't be read or modified by document.cookie). Purpose: Helps protect against XSS (Cross-Site Scripting) attacks.
    //     secure: false, // secure: false This means the cookie will be sent over both HTTP and HTTPS connections. Purpose: In development, you often use secure: false because you may not have HTTPS locally. In production, you should set secure: true so the cookie is only sent over HTTPS, making it more secure.
    // })

    setTokensToCookie(res, loginInfo)

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

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged Out Successfully",
        data: null,
    })
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout
}
