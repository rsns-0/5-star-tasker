

export class Logger{

    public log(message:string){
        console.log(message);
    }

    public logError(e:unknown){
        console.error(e);
    }
}