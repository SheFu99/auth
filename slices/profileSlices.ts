// slices/profileSlice.ts
import { UserProfile } from '@/schemas';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { z } from 'zod';


// TypeScript interface for compile-time type checking, inferred from Zod schema


interface ProfileState {
  loading: boolean;
  error: string | null;
  upload:boolean;
}

const initialState: ProfileState = {
  loading: false,
  error: null,
  upload:false,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // setProfile: (state, action: PayloadAction<Profile | null>) => {
    //   state.profile = action.payload;
    // },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setUpload:(state, action: PayloadAction<boolean>)=>{
      state.upload = action.payload;
    }
  },
});

export const {  setLoading, setError, setUpload } = profileSlice.actions;

export default profileSlice.reducer;
