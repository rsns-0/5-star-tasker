import prisma from "@/backend/db/prismaInstance"

class ReminderRepository{
    private client = prisma
    
    public async getRemindersOfUser(userId:number){
        const res = await this.client.reminders.findMany({
            where: {
                user_id: userId,
            }
        })
        return res
    }

    public async deleteReminder(reminderId:number){
        const res = await this.client.reminders.delete({
            where: {
                id: reminderId
            }
        })
        return res
    }
    
}