import { db } from "@/lib/db";
import { ExtendedUser } from "@/next-auth";
///db User Function
export const getUserByEmail = async (email: string)=>{
    try{
    const user = await db.user.findUnique({where:{email}});
    return user;
    }catch{
        return null
    }
    };

    export const getUserById = async (id:string):Promise<ExtendedUser> => {
        console.log('session',id)

       
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL|| "http://localhost:3000"}/api/session?id=${id}`);
      // console.log(res)

        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      };
      
