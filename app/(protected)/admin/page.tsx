"use client"


import { admin } from "@/actions/admin"
import { RoleGate } from "@/components/auth/role-gate"
import { FormSucces } from "@/components/form-succes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { UserRole } from "@prisma/client"
import { toast } from "sonner"
// import { useCurrentRole } from "@/hooks/use-current-role" for clinet component to get userRole
// import { currentRole } from "@/lib/auth" for server coomponent

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
        const onServerActionClick=()=>{
            admin()
            .then ((data)=>{
                if (data.error){
                    toast.error(data?.error)
                }

                if(data.success){
                    toast.success(data?.success)
                }
            })
        }

    return(
        <Card>
            <CardHeader>
                <p className="text-2xl font-semibold text-center">🔑Admin</p>
            </CardHeader>
            <CardContent className="space-y-4">
                <RoleGate allowedRole={UserRole.ADMIN}>
                    <FormSucces message='You are allowed to see this content'/>
                </RoleGate>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">
                        Admin-only API route
                    </p>
                    <Button onClick={onApiRouteRouteClick}>
                        GET
                    </Button>

                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">
                        Admin-only server action
                    </p>
                    <Button onClick={onServerActionClick}>
                        GET
                    </Button>

                </div>
            </CardContent>
            
            
        </Card>
        
    )
}

export default AdminPage