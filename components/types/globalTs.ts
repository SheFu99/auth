export interface ProfileData {
    firstName: string | null;
    lastName: string | null;
    coverImage: string | null;
    gender: string | null;
    age: string | null;
    phoneNumber: string | null;
    regionCode: string | null;
    adres: string | null;
    userId: string;
    error?:string;
    success?:string;
  }



export type post ={
    PostId: string,
    image?: image[],
    text: string,
    timestamp: Date,
    userId: string,
    likes?:any[]
    likedByUser?:boolean,
    _count:_count,
    author:{
        Name:string,
        Image:string,
    },
    comments:any[]
    
};
type _count = {
  comments:number,
  likes:number,
};
type image ={
    url:string
    inedx:number
};
export type comments={
  CommentId:string;
  text:string;
  timestamp:Date;
  postId:string;
  userId:string;
  image?:image[];
  likes?:any[]
  _count?:_count,
  likedByUser:boolean;
}