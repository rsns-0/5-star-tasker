

export class CooldownEvent{
    constructor(public readonly expireTime:number){}

    public isExpired(){
        return this.expireTime <= Date.now()
    }

    
}


export class UserCommandCooldownEvent extends CooldownEvent{
    constructor(public readonly userId:string, public readonly commandName:string, expireTime:number){
        super(expireTime)
    }
}