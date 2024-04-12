"use server"
import type { NextApiRequest,NextApiResponse } from "next";
import { db } from "@/lib/db";

 const getUserPosts = async(
    req:NextApiRequest,
    res:NextApiResponse
    )=>{
        console.log("API Route is hit. Query Parameters:", req.query); 
    const {userId} = req.query;
        console.log(userId);
    if(!userId) {
        res.status(400).json({message:"userId is required"})
        return
    }

    try {

        const userPosts = await db.post.findMany({
            where:{
                userId:userId as string
            }
        });
        if(!userPosts){
            res.status(400).json({message:"user not found"})
            return 
         }
         res.json(userPosts);
         res.status(200).end();
    }catch(err){
        res.status(500).json({message:"internal server error"})
        return 
    }

    }
   
    export default getUserPosts;