"use server"
import * as z from 'zod'
import { db } from "@/lib/db"
import { SettingsSchema } from '@/schemas'
import {  currentRole } from '@/lib/auth'



export const  userControl = async ({email, role}: z.infer<typeof SettingsSchema>
    )=>{
        const currentSessionRole =  await currentRole()
       
       
       

    if(currentSessionRole ==="ADMIN"){
            console.log("Edited by:",currentSessionRole)
            const selectedUser = await db.user.update({
                where:{
                    email: email,
                },
                data:{
                    role:role,
                }
               
            })
        return {success:"User role has been change",selectedUser} 
     }else{
            return {error:'You don`t have permission for this operations'}
        }
       return 
    }

    export const deleteUser = async ({email} : z.infer<typeof SettingsSchema>)=>{
    const currentSessionRole = await currentRole()
        if(currentSessionRole ==="ADMIN"){

            const selectedUser = await db.user.delete({
                where:{
                    email:email
                }
            })
            return {success: `${selectedUser} User has been deleted`}

    }
    return {error:'You don`t have permission for this operations'}
}
