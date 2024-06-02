import { db } from "@/lib/db";
///db User Function
export const getUserByEmail = async (email: string)=>{
    try{
    const user = await db.user.findUnique({where:{email}});
    return user;
    }catch{
        return null
    }
    };

    export const getUserById = async (id: string)=>{
        try{
        const user = await db.user.findUnique({where:{id}});
        return user;
        }catch(err){
            return err
        }
        };
