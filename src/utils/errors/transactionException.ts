export class TransactionException<const TData> extends Error {
	constructor(public data: TData, error?:Error) {
		super(error?.message,{cause:error})
		if((data as any).message){
			this.message = (data as any).message
		}
		if(typeof data === "string"){
			this.message = data
		}
	}

	
}