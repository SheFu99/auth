import { db } from "@/lib/db";

export const getTwoFactorConformationByUserId = async (
    userId:string
)=>{
    try {
        const twoFactorConfirmation = await db.twoFactorConformation.findUnique({
            where:{userId}
        })

        return twoFactorConfirmation
    }catch{
        return null;
    }
}