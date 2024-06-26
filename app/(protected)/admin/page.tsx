"use client"

import * as z from "zod"
import { admin } from "@/actions/admin"
import { settings } from "@/actions/settings"
import { RoleGate } from "@/components/auth/role-gate"
import { FormSucces } from "@/components/form-succes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { SettingsSchema } from "@/schemas"
import { User, UserRole } from "@prisma/client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCurrentRole } from "@/hooks/use-current-role"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useCurrentRole } from "@/hooks/use-current-role" for clinet component to get userRole
// import { currentRole } from "@/lib/auth" for server coomponent
import { DataTable  } from "../../../components/userTable/data-table"
import {columns } from '../../../components/userTable/columns'

 const AdminPage= ()=>{
     const onApiRouteRouteClick = ()=> {
         fetch("/api/admin")
             .then((response)=>{
                 if(response.ok){
                     toast.success("Allowed API route!")
                 }else{
                     toast.error("You do not have access to this function!")
                 }
             })
     }
     const [data, setData] = useState<User[]>([])
     const onServerActionClick=()=>{
        admin()
        .then((data) => {
            // Check if data is an array (indicating success)
            if (Array.isArray(data)) {
                // Handle the array of user data
                // For example, updating state with the data
                setData(data);
                toast.success("Data loaded successfully");
            } else if ('error' in data) {
                // Handle the error case
                toast.error(data.error);
            } else {
                // Handle unexpected data structure
                toast.error("Unexpected data structure received");
            }
        })
        .catch((error) => {
            // Handle any errors that occur during the fetch
            console.error("Error fetching data:", error);
            toast.error("An error occurred while fetching data");
        });
};

  
     
        
        const [isPending, startTransition] = useTransition();
        const {update} = useSession();
        const [error,setError] =useState<string| undefined>();
        const [success, setSuccess] = useState<string|undefined>();
        const role = useCurrentRole();

        const onSubmit = (values: z.infer<typeof SettingsSchema>)=>{
            startTransition(()=>{
            settings(values)
            .then((data)=>{
                if(data.error){
                    setError(data.error);
                    toast.error(data.error)
                }
    
                if(data.success){
                    update()
                    setSuccess(data.success);
                    toast.success(data.success)
                }
            })
            .catch (()=>setError('Something went wrong!'))
        })
        return 
        };


        const form = useForm<z.infer<typeof SettingsSchema>>({
            resolver: zodResolver(SettingsSchema),
            defaultValues:{
                role: role || undefined,
            }
        });
    return(
        <>
            <>
                <Card className="w-full">
                <CardHeader>
                    <p className="text-2xl font-semibold text-center">🔑Admin</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <RoleGate allowedRole={UserRole.ADMIN}>
                        <FormSucces message='You are allowed to see this content'/>
                    </RoleGate>

                    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                        <p className="text-sm font-medium">
                            Admin-only server action
                        </p>
                        <Button onClick={onServerActionClick}>
                            GET
                        </Button>

                    </div>
                    <>

                    </>
                
                <div className="container mx-auto py-10 ">
                     <DataTable columns={columns} data={data} />
                 </div>
                </CardContent>
                
                
                </Card>
            </>
            <>
            

            </>
        </>
    )
}

export default AdminPage