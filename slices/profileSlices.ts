// slices/profileSlice.ts
import { UserProfile } from '@/schemas';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { z } from 'zod';


// TypeScript interface for compile-time type checking, inferred from Zod schema
type Profile = z.infer<typeof UserProfile>;

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile | null>) => {
      state.profile = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setProfile, setLoading, setError } = profileSlice.actions;

export default profileSlice.reducer;
