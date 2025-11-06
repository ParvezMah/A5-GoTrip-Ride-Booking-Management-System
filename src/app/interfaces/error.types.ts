// Structure of error object in error responses
export interface TErrorSources {
    path: string;
    message: string
}

// General shape of an API error response
export interface TGenericErrorResponse {
    statusCode: number,
    message: string,
    errorSources?: TErrorSources[]

}