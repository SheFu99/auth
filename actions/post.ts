"use server"
import { Comment, post } from "@/components/types/globalTs"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { comment } from "postcss"

///Need to cache this functions

type getComentParams = {
    PostId:string,
    page:number
}
type GetPostPromise ={
    post?:post,
    success?:boolean,
    error?:string
}
export const getPostById = async (PostId:string):Promise<GetPostPromise> => {

    if(!PostId){
        return {error:"PostId is required!"}
    };
    const user = await currentUser()
    let post 
if(user){
    post = await db.post.findFirst({
        where:{PostId:PostId},
        select:{
            PostId:true,
            user:{
                select:{
                    name:true,
                    image:true,
                    id:true,
                }
            },
            userId:true,
            timestamp:true,
            superText:true,
            text:true,
            repostCount:true,
            _count:{
                select:{
                    likes:true,
                    comments:true
                }
            },
            image:{
                select:{url:true},
                take:5,
            },
            originPost:{
                select:{
                    user:{
                        select:{
                            name:true,
                            image:true,
                            id:true
                        }
                    },
                    userId:true,
                    timestamp:true,
                }
            },
            likes:{
                where:{
                    userId:user?.id
                },
                select:{userId:true}
            }
        }
      
    })
}else{
    post = await db.post.findFirst({
        where:{PostId:PostId},
        include:{
            user:{
                select:{
                    name:true,
                    image:true,
                    id:true,
                }
            },
            _count:{
                    select:{
                     likes:true,
                     comments:true
                    }
                    },
                    image:{
                        select:{url:true},
                        take:5,
                    },
                    originPost:{
                                select:{
                                    user:{
                                        select:{
                                            name:true,
                                            image:true,
                                            id:true,
                                        }
                                    },
                                    userId:true,
                                    timestamp:true,
                                }
                            },

        }
})
}
    

    const hasLike = post?.likes?.length>0

    const postWithLike  = {
        ...post,
        likedByUser:hasLike
    }
    return {post:postWithLike,success:true}
}
type CommentByPost = {
    comments?:Comment[],
    success?:boolean,
    error?:string,
    totalCommentsCount?:number
}
export const getCommentByPost = async ({PostId, page}:getComentParams):Promise<CommentByPost>=>{

    if(!PostId||!page){
        return {error:'Unexpected behavior'}
    }
    const user = await currentUser()
    const pageSize = 5
    const skip = (page-1)*pageSize
   
    const comments = await db.comment.findMany( 
        {where:{postId:PostId},

    ///orederBy _count.likes

    orderBy:[
        {timestamp:'asc'}
    ],
    skip:skip,
    take:pageSize,
    include:{
        _count:{
            select:{
                likes:true,

            }
        } ,
        image:{
            select:{url:true}
        },
        user:{
            select:{
                name:true,
                image:true,
                id:true,
            }
        },
        likes:{
            where:{
                userId:user?.id
            },
            select:{userId:true}
        }
       
    }
}) 

    const commentsWithLikes = comments.map(com=>{
        const commentLikedByUser = user && com?.likes && com.likes.some(like=>like.userId === user.id)
        return{
            ...com,
            likedByUser:commentLikedByUser ?? false
        }
    })
  

    if(!comments){
        return {success:true}
    }

    let totalCommentsCount:number
    if(page===1){
        totalCommentsCount = await db.comment.count({
            where:{
                postId:PostId
            }
        })
    }
    
    return {success:true , comments:commentsWithLikes , totalCommentsCount}
}