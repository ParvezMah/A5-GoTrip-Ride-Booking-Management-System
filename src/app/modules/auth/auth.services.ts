import bcryptjs from 'bcryptjs';
import AppError from "../../errorHelper.ts/ApiError";
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import httpStatus from "http-status";
import { envVars } from '../../config/env';
import { generateToken } from '../../utils/jwt';


const credentialsLogin = async(payload: Partial<IUser>) => {
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

    return {
        accessToken
    }
}

export const authServices = {
    credentialsLogin
}