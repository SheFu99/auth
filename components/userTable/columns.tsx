/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import * as z from 'zod'

 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
import { SettingsSchema, UserInfoSchema } from "@/schemas"
import { startTransition, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { Form, FormControl, FormField, FormItem,  FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserRole } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { deleteUser, userControl } from '@/actions/userControl'
import { AiFillDelete } from "react-icons/ai";
// export type UserInfo = z.infer<typeof UserInfoSchema>
interface User {
  name: string;
  isTwoFactorEnabled: boolean;
  role: string;
  email: string;
  image: string;
  id?: any;
  password?: any;
}
export const columns: ColumnDef<User,unknown>[] = [

    
  {
    accessorKey: "name",
    header: "Name",
    
  },
  {
    accessorKey: "email",
    header:  ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell:({row})=>{
      
        const [isPending, startTransition]= useTransition()
        const {update} = useSession();
        const form = useForm<z.infer<typeof SettingsSchema>>({
          resolver: zodResolver(SettingsSchema),
          defaultValues:{
            role: row.original.role as UserRole,
          }
        });
       

        const onSubmit = (values: z.infer<typeof SettingsSchema>)=>{
            const email = row.original.email
            const role=  form.watch("role")
            const arg = {
                email:email,
                role:role,
            }
            
            startTransition(()=>{
            userControl(arg)
            .then((data)=>{
                if(data?.error){
                 
                    toast.error(data?.error)
                }
    
                if(data?.success){
                    update()
                   
                    toast.success(data?.success)
                }
            })
            
        })
      
        return 
        };
      

        return(
            <Form {...form} >
                        <form className='space-y-6 w-full' onChange={form.handleSubmit(onSubmit)} >
                            
                                <FormField
                                    control={form.control}
                                    name='role'
                                    render ={({field})=>(
                                    <FormItem className="w-full ">
                                        <FormControl >
                                        <Select
                                            disabled={isPending}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger >
                                                        <SelectValue
                                                            placeholder="seleact a role"
                                                            />

                                                            <SelectContent >

                                                                <SelectItem value={UserRole.ADMIN} >
                                                                    Admin
                                                                </SelectItem>
                                                                <SelectItem value={UserRole.USER} >
                                                                    User
                                                                </SelectItem>
                                                                
                                                            </SelectContent>

                                                    </SelectTrigger>
                                                </FormControl>
                                            
                                                <FormMessage/>
                                            </Select>
                                        </FormControl>

                                    </FormItem>

                                    )}
                                /> 

                            {/* <Button type='submit'> save</Button> */}
                            </form>
                    </Form>
        )
    }
  },
  {
    accessorKey: "isTwoFactorEnabled",
    header: "2FA",
  },
 
  {
    header: 'Action',
    cell: ({ row }) => {
        const data = row.original
        const {update} = useSession()
        const email = row.original.email
        const onClick = (email: string)=>{
          
          
          startTransition(()=>{
          deleteUser(email)
          .then((data)=>{
              if(data?.error){
               
                  toast.error(data?.error)
              }
  
              if(data?.success){
                  update()
                 
                  toast.success(data?.success)
              }
          })
          
      })
    
      return 
      };
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(data.id)}
              >
                Copy user ID
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={()=> navigator.clipboard.writeText(data.email)}>Copy user Email</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={()=>onClick(row.original.email)}>  Delete User <div className='flex justify-center align-middle items-start ml-2'><AiFillDelete className='w-5 h-5' style={{color: "#b44646"}}/></div></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
  }
 

]
