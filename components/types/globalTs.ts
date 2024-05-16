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