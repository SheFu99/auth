import { ExtendedUser } from "@/next-auth";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";

interface UserInfoProps {
    user?:ExtendedUser;
    label:string;
}

export const UserInfo = ({
    user, label
}:UserInfoProps) =>{
    return(

        <Card className="shadow-md">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    {label}
                </p>
            </CardHeader>

            <CardContent>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md ">
                    <p className="text-sm font-medium">ID</p>
                    <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-gray-500 rounded-md text-white">{user?.id}</p>
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md ">
                    <p className="text-sm font-medium">Name</p>
                    <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-gray-500 rounded-md text-white">{user?.name}</p>
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md ">
                    <p className="text-sm font-medium">Email</p>
                    <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-gray-500 rounded-md text-white">{user?.email}</p>
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md ">
                    <p className="text-sm font-medium">Role</p>
                    <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-gray-500 rounded-md text-white">{user?.role}</p>
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md ">
                    <p className="text-sm font-medium">Two factor authentication</p>
                    <Badge variant={user?.isTwoFactorEnabled ? "success":"destructive"}>{user?.isTwoFactorEnabled? "ON":"OFF"}</Badge>
                </div>
            </CardContent>
        </Card>
    )
}