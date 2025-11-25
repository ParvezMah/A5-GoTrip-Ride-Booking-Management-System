/* eslint-disable @typescript-eslint/no-unused-vars */
import bcryptjs from 'bcryptjs';
import httpStatus from "http-status";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';
import AppError from "../../errorHelper/ApiError";
import { sendEmail } from '../../utils/sendEmail';
import { createNewAccessTokenWithRefreshToken } from '../../utils/userTokens';
import { User } from "../user/user.model";
import { IAuthProvider, UserStatus } from '../user/user.interface';


// const credentialsLogin = async (payload: Partial<IUser>) => {
//     const { email, password } = payload;

//     const isUserExist = await User.findOne({ email });

//     if (!isUserExist) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Email Does Not Exist");
//     }

//     const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string);

//     if (!isPasswordMatched) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
//     }

//     // Creating AccessToken during login is optional
//     const jwtPawload = {
//         email: isUserExist.email,
//         userId: isUserExist._id,
//         role: isUserExist.role
//     }

//     // create AccessToken
//     const accessToken = generateToken(jwtPawload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
//     const refreshToken = generateToken(jwtPawload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

//     // Hide password before sending the user object
//     const { password: pass, ...rest } = isUserExist

//     return {
//         accessToken,
//         refreshToken,
//         user: rest
//     }
// }

const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

    return {
        accessToken: newAccessToken
    }

}

// const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

//     const user = await User.findById(decodedToken.userId)

//     const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)
//     if (!isOldPasswordMatch) {
//         throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
//     }

//     user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

//    user!.save();

// }

const setPassword = async (userId: string, plainPassword: string) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(404, "User Not Found")
    }

    if (user.password && user.auths?.some(providerObject => providerObject.provider === "google")) {
        throw new AppError(httpStatus.BAD_REQUEST, "You have already set you password. Now you can change the password from your profile password update")
    }

    const hashedPassword = await bcryptjs.hash(
        plainPassword,
        Number(envVars.BCRYPT_SALT_ROUND)
    )

    const credentialProvider: IAuthProvider = {
        provider: "credentials",
        providerId: user.email
    }

    const auths: IAuthProvider[] = [...user.auths!, credentialProvider]

    user.password = hashedPassword

    user.auths = auths

    await user.save()

}

const forgotPassword = async (email: string) => {
    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
    }
    if (!isUserExist.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
    }
    if (isUserExist.status === UserStatus.BLOCKED ) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.status}`)
    }
    if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
        expiresIn: "10m"
    })

    const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`

    await sendEmail({
        to: isUserExist.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: isUserExist.name,
            resetUILink
        }
    })
}

const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

    const user = await User.findById(decodedToken.userId)

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)
    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
    }

    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

    user!.save();
}


export const AuthServices = {
    // credentialsLogin,
    getNewAccessToken,
    // changePassword,
    setPassword,
    forgotPassword,
    resetPassword
}