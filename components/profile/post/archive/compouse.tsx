// 'use client'

// import PublicProfile from "@/components/profile/PublicProfile";
// import TabSwitch from "@/components/profile/Tabs";
// import PublicProfileFriends from "@/components/profile/friends/publicProfileFriends";
// import InfinitePostList from "@/components/profile/post/public/InfinitePostList";
// import { ExtendedUser } from "@/next-auth";


// interface CompousePAgeProps {
//     profile:any,
//     sessionUser:ExtendedUser,
//     userPostList:any,
//     userfriendsList:any,
// }

// const CompousePage: React.FC<CompousePAgeProps> = ({profile,sessionUser,userPostList,userfriendsList}) => {
//     return (
//         <>
//         <PublicProfile profile={profile} sessionUser={sessionUser}/> 

//               {userPostList&&userfriendsList&&(
//                   <TabSwitch
//                   chilldrenFriends={<PublicProfileFriends friendsList={userfriendsList.profileFirendsList} /> }
//                   chilldrenPosts={<InfinitePostList  userId={sessionUser.id}  sessionUser={sessionUser}/>}
//                   postTotal={userPostList.totalPostCount}
//                   />
//               )}

//          </>
//       );
// }
 
// export default CompousePage;