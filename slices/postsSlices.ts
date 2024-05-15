

import { createSlice, PayloadAction } from '@reduxjs/toolkit';



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

export const postsSlice = createSlice({
  name: 'posts',
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

export const {  setLoading, setError, setUpload } = postsSlice.actions;

export default postsSlice.reducer;
