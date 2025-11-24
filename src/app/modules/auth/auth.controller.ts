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
import { envVars } from "../../config/env";
import { createUserTokens } from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate("local", async (err: any, user: any, info: any) => {
        if (err) {
            return next(new AppError(401, err))
        }
        if (!user) {
            return next(new AppError(401, info.message))
        }
        const userTokens = await createUserTokens(user)

        const { password: pass, ...rest } = user.toObject()

        setTokensToCookie(res, userTokens)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Logged In Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest
            }
        })
    })(req, res, next)
})

// Login With Email & Password -> Postman
// const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

//     const loginInfo = await AuthServices.credentialsLogin(req.body);

//     // res.cookie("accessToken", loginInfo.accessToken, {
//     //     httpOnly: true, // httpOnly: true This makes the cookie inaccessible to JavaScript running in the browser (it can't be read or modified by document.cookie). Purpose: Helps protect against XSS (Cross-Site Scripting) attacks.
//     //     secure: false, // secure: false This means the cookie will be sent over both HTTP and HTTPS connections. Purpose: In development, you often use secure: false because you may not have HTTPS locally. In production, you should set secure: true so the cookie is only sent over HTTPS, making it more secure.
//     // })

//     // res.cookie("refreshToken", loginInfo.refreshToken, {
//     //     httpOnly: true, // httpOnly: true This makes the cookie inaccessible to JavaScript running in the browser (it can't be read or modified by document.cookie). Purpose: Helps protect against XSS (Cross-Site Scripting) attacks.
//     //     secure: false, // secure: false This means the cookie will be sent over both HTTP and HTTPS connections. Purpose: In development, you often use secure: false because you may not have HTTPS locally. In production, you should set secure: true so the cookie is only sent over HTTPS, making it more secure.
//     // })

//     setTokensToCookie(res, loginInfo)

//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "User Logged In Successfully",
//         data: loginInfo
//     })
// });

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
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

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user

    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Changed Successfully",
        data: null,
    })
})

const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? req.query.state as string : ""

    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }

    // /booking => booking , => "/" => ""
    const user = req.user;
    console.log("googleCallbackController : ", user);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    const tokenInfo = createUserTokens(user)

    setTokensToCookie(res, tokenInfo)

    // res.redirect(`${envVars.FRONTEND_URL}/booking`)
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})


export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallbackController
}
