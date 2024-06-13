
// import { getCurrentProfile } from "@/actions/UserProfile";
// import { useQuery } from "@tanstack/react-query";

// export const fetchProfile = async (userId:string)=>{
//     console.log(userId)
//     const {profile,error}= await getCurrentProfile(userId)
//     if(error) {
//         throw new Error(error)
//     }

//     return profile
// };

// export const useProfile = (userId:string)=>{
//     return useQuery({
//         queryKey:['PROFILEINFO' ,userId],
//         queryFn:()=>fetchProfile(userId)
//     })

// };