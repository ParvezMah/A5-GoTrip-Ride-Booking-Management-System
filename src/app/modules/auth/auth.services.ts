/* eslint-disable @typescript-eslint/no-unused-vars */
import bcryptjs from 'bcryptjs';
import httpStatus from "http-status";
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';
import AppError from "../../errorHelper.ts/ApiError";
import { generateToken } from '../../utils/jwt';
import { createNewAccessTokenWithRefreshToken } from '../../utils/userTokens';
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";


const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email Does Not Exist");
    }

    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string);

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
    }

    // Creating AccessToken during login is optional
    const jwtPawload = {
        email: isUserExist.email,
        userId: isUserExist._id,
        role: isUserExist.role
    }

    // create AccessToken
    const accessToken = generateToken(jwtPawload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
    const refreshToken = generateToken(jwtPawload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

    // Hide password before sending the user object
    const { password: pass, ...rest } = isUserExist

    return {
        accessToken,
        refreshToken,
        user: rest
    }
}

const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

    return {
        accessToken: newAccessToken
    }

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
    credentialsLogin,
    getNewAccessToken,
    resetPassword
}