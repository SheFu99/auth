import { Gender, UserRole } from "@prisma/client";
import * as z from "zod";


export const SettingsSchema = z.object({
  name: z.optional(z.string().min(5)) , ///that schema is for our update clinet-info logic
  isTwoFactorEnabled: z.optional(z.boolean()),
  role :z.enum([UserRole.ADMIN ,UserRole.EDITOR, UserRole.USER,UserRole.GUEST]).optional(),
  email: z.optional(z.string().email()) ,
  password: z.optional(z.string().min(6)),
  newPassword : z.optional(z.string().min(6)),
  image: z.optional(z.string().min(12))
})
.refine((data)=>{
  if (data.password && !data.newPassword){
    return false
  }


  return true
}, {
    message: 'New password is required!',
    path:['newPassword']
  })
  .refine((data)=>{
    if (data.newPassword && !data.password){
      return false
    }
  
    return true
  }, {
      message: 'Password is required!',
      path:['Password']
    })



export const LoginSchema = z.object({
    email: z.string().email({
        message: 'Email is required'
    }),
    password: z.string().min(6, {
        message: 'Password is required'
    }),
    code: z.optional(z.string())
});

export const ResetSchema = z.object({
  email: z.string().email({
      message: 'Email is required'
  }),
 
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6,{
      message: 'Minimum of 6 charecters required'
  }),
 
});

export const RegisterSchema = z.object({
    email: z.string().email("Email is required"), // Simplified
    profile: z.any(),
    password: z.string().min(6, "Password is required and must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
    name: z.string().min(3, "Name is required and must be at least 3 characters"),
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // This attaches the error message to confirmPassword
  });

 export const UserInfoSchema = z.object({
      id:z.any(),
      email: z.string().email("Email is required"),
      name: z.string().min(3, "Name is required and must be at least 3 characters"),
      role: z.string().min(4, "User role is undefined"),
      image: z.string().min(11,"Image is undefined"),
      isTwoFactorEnabled: z.boolean(),
      password: z.any()
  })
  const phoneNumberRegex = /^\+?\d{10,15}$/;
  const RegionCode = /^[a-zA-Z0-9]{2,5}$/
  const Address = /^[a-zA-Z0-9 ,.-]+$/
  
  
export const UserProfile = z.object({
  // userId: z.string().min(6,'User id is required!').nullable().optional(),
  firstName: z.string().min(3,"Name is required and must be at least 3 characters").optional(),
  lastName: z.string().min(2,"Last Name is required and must be at least 3 characters").optional(),
  coverImage: z.string().min(10, 'Image is undefined').nullable().optional(),
  gender: z.enum([Gender.Male, Gender.Female, Gender.Undefined]).optional(),
  age: z.number().min(16).max(120).optional(),

  
  phoneNumber: z.string().regex(phoneNumberRegex, {
    message: "Invalid phone number format.",
  }).nullable().optional(),
  regionCode: z.string().regex(RegionCode).nullable().optional(),
  adres: z.string().regex(Address).nullable().optional(),
});

  
export type LoginFormDataType = z.infer<typeof LoginSchema>;
