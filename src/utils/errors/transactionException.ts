export class TransactionException<const TData> extends Error {
	constructor(public data: TData, error?:Error) {
		if(error) {
			super(error.message,{cause:error})
		}
		super()
		
		if((data as any).message){
			this.message = (data as any).message
		}
		if(typeof data === "string"){
			this.message = data
		}
	}

	
}