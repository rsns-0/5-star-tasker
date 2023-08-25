import { AxiosError } from "axios"
import { ZodError } from "zod"
import { fromZodError } from "zod-validation-error"

export class TranslationServiceErrorFactory{
    
    static fromError(error:unknown){
        if(error instanceof TranslationServiceError){
            return error
        }
        if(error instanceof ZodError){
            return new TranslationValidationError(error)
        }
        if(error instanceof AxiosError){
            return new TranslationNetworkError(error)
        }
        return new TranslationServiceError(error as Error)
    }
}

class TranslationServiceError<TError extends Error=Error> extends Error {
    protected e: TError

    constructor(error:TError){
        super(error.message)
        this.message = error.message
        this.name = error.name
        this.e=error
    }
    
    isNetworkError(): this is TranslationNetworkError {
      return (this.e as unknown as AxiosError).isAxiosError
    }
  
    isValidationError(): this is TranslationValidationError {
        return this.e instanceof ZodError
    }
}

export class TranslationNetworkError extends TranslationServiceError<AxiosError> {
    get statusCode(){
        return this.e.code
    }

    
}

export class TranslationValidationError extends TranslationServiceError<ZodError> {
    
    get friendlyErrorMessage(){
        
        return fromZodError(this.e)
        
        
    }
    
}
