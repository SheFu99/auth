import { db } from "@/lib/db"

type checkTGuserParams = {
    tgId:   number
}
type RetrutnPromise = {
    userId?: string;
    creationDate?: Date;
    updateTime?: Date;
    error?:string
}

export const checkWorker= async ({tgId}:checkTGuserParams):Promise<RetrutnPromise> =>{
    console.log('CheckParams',tgId)
     try {
        const worker = await db.worker.findUnique({
            where:{
                telegramId: tgId
            },
                select:{
                    userId:true,
                    updateTime:true,
                    creationDate:true
                }})
                console.log(worker,"WORKER")
        return worker
     } catch (error) {
        return {error:error}
     }

}