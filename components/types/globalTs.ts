export interface ProfileData {
    firstName?: string | null;
    lastName?: string | null;
    coverImage?: string | null;
    image?:string | null;
    gender?: gender;
    age?: string | null;
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
    authorAvatar?:string,
    authorName:string,
    image?: image[],
    superText?:string,
    text: string,
    timestamp: Date,
    userId: string,
    likes?:any[]
    likedByUser?:boolean,
    _count:_count,
    comments:any[],
    repostCount?:number,
    originPostId?:string,
    originPost?:originPost,
};

type originPost ={
  authorAvatar?:string,
  authorName:string,
  userId:string,
  timestamp:Date
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

export type profileOfferDetail = {
  userId?: string;
  firstName: string;
  image?: string;
};