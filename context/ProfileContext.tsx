// // context/ProfileContext.tsx
// import { getCurrentProfile } from '@/actions/UserProfile';
// import { useCurrentUser } from '@/hooks/use-current-user';
// import { useSession } from 'next-auth/react';
// import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// interface Profile {
//   firstName: string;
//   lastName: string;
//   // Define the rest of your profile structure here
// }

// interface ProfileContextType {
//   profile: Profile | null;
//   triggerRefetch: () => void;
// }

// const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// export const ProfileProvider = ({ children }: { children: ReactNode }) => {
//   const [profile, setProfile] = useState<Profile | null>(null);
//   const [update, setUpdate] = useState(false);
//   useEffect(()=>{
//     console.log(profile)
//   },[profile])
// const user = useCurrentUser()
//   useEffect(()=>{
//     const fetchProfile = async () => {
//       if (user?.id) {
//         try {
//           const profileData = await getCurrentProfile(user?.id);
//           setProfile(profileData);
//           console.log(profileData); // Now logging the fetched profile data
//         } catch (error) {
//           console.error('Failed to fetch profile:', error);
//         }
//       }
//     };

//     if (profile === null || update) {
//         fetchProfile();
//       }

//   },[update])
//   const triggerRefetch = () => setUpdate(!update);
//   return (
//     <ProfileContext.Provider value={{ profile,triggerRefetch }}>
//       {children}
//     </ProfileContext.Provider>
//   );
// };

// export const useProfile = (): ProfileContextType => {
//   const context = useContext(ProfileContext);
//   if (context === undefined) {
//     throw new Error('useProfile must be used within a ProfileProvider');
//   }
//   return context;
// };
