export interface ProfileData {
    firstName: string | null;
    lastName: string | null;
    coverImage: string | null;
    gender: string|null;
    age: string | null;
    phoneNumber: string | null;
    regionCode: string | null;
    adres: string | null;
    userId: string;
    error?:string;
    success?:string;
  };
  export type gender = {
    gender:"Male" | "Female" | "Undefined"|null;
  };
export type friendRelation = {
  transactionId:string,
  requesterId:String,
  adresseedId:String,
  status:friendshipStatus,
  createdAt:Date,
  updatedAt:Date
};
export type friendshipStatus = "PENDING"|"ACCEPTED"|"DECLINED"|"BLOCKED" | undefined

export type post ={
    PostId: string,

    originPostId?:string,

    image?: image[],

    superText?:string,
    
    text: string,
    timestamp: Date,
    originTimeStamp?: Date,
    userId: string,
    originUserId?:string,
    likes?:any[]
    likedByUser?:boolean,
    _count:_count,
    author:author,

    originUserName?:string,
    originAvatar?:string,

    comments:any[],
    repostCount?:number,
   
};
export type deletePostParams ={
  postId:string,
  keys:string[],
  originPostId?:string
}
type author = {
  Name:string,
  Image:string
}
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
};

export type requester= {
  id: string;
  name: string;
  image: string;
};