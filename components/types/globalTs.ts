import { ExtendedUser } from "@/next-auth";
import { UserRole } from "@prisma/client";

export interface ProfileData {
    firstName?: string | null;
    lastName?: string | null;
    coverImage?: string | null;
    image?:string | null;
    gender?: gender;
    age?: number | null;
    phoneNumber?: string | null;
    regionCode?: string | null;
    adres?: string | null;
    userId: string;
    error?:string;
    success?:string;
  };
  
export type friendRelation = {
  transactionId:string,
  requesterId:String,
  adresseedId:String,
  status:friendshipStatus,
  createdAt:Date,
  updatedAt:Date
};

export type FriendsOffer ={
  addressee?:profileOfferDetail;
  requester?: profileOfferDetail;
  transactionId: string;
  requesterId: string;
  adresseedId: string;
  status: friendshipStatus;
  createdAt: Date;
  updatedAt?: Date;
};

export type friendshipStatus = "PENDING"|"ACCEPTED"|"DECLINED"|"BLOCKED" | undefined
export type gender = "Male" | "Female" | "Undefined"|null;



export type post ={
    PostId: string,
    user:{
      name:string,
      image?:string,
      id:string,
    },
    image?: image[],
    superText?:string,
    text: string,
    timestamp: Date,
    userId: string,
    likes?:any[],
    likedByUser?:boolean,
    _count:_count,
    comments?:Comment[],
    repostCount?:number,
    originPostId?:string,
    originPost?:originPost,
};

type originPost ={
 user:{
  name:string,
  image?:string,
  id:string,
 },
  timestamp:Date,
}
export type deletePostParams ={
  postId:string,
  keys:string[],
}
type author = {
  Name:string,
  Image:string
}
type _count = {
  comments?:number,
  likes:number,
};
type image ={
    url:string
    inedx?:number
};
export type Comment = {
  likedByUser?: boolean;
  user: ExtendedUser;
  image: { url?: string }[];
  likes?: { userId?: string }[];
  _count: _count;
  CommentId: string;
  text: string;
  timestamp: Date;
  postId: string;
  userId: string;
  galleryId: string;
};


export type profileOfferDetail = {
  userId?: string;
  firstName: string;
  image?: string;
};
///EXTENDED_USER
// export type sessionUser = {
//   id:string,
//   name:string,
//   email?:string,
//   image?:string,
//   role:UserRole,
// }

export type CommentPrev = {
  text:string,
  image?:{ url?: string }[];
  userId?:string,
};