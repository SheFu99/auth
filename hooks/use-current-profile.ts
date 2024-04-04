import { RootState } from '@/lib/store';
import { setProfile, setUpload } from '@/slices/profileSlices';
import { useDispatch, useSelector } from 'react-redux';

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

export function useCurrentProfile() {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile.profile);
  const upload = useSelector((state:RootState)=> state.profile.upload)
  // Define a function for updating the profile
  const updateProfile = (profileData: ProfileData) => {
    dispatch(setProfile(profileData));
  };

  const switchUpload = (upload : boolean) =>{
    dispatch(setUpload(upload))
  }
  // Return both the profile state and the update function
  return { profile, updateProfile ,upload, switchUpload};
}

