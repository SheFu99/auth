"use client"

import { Card , CardContent,CardFooter, CardHeader } from "@/components/ui/card";
import { Header } from "./header";
import { Social } from "./social";
import { BackButton } from "./back-button";
interface CardWrapperProps {
    children: React.ReactNode;
    headerLable:string;
    backButtonLabel:string;
    backButtonHref:string;
    showSocial?:boolean;
};

export const CardWrapper = ({children,headerLable,backButtonLabel,backButtonHref,showSocial}: CardWrapperProps)=>{
    return(
        <Card className="w-50 shadow-md">
            <CardHeader>
                <Header label={headerLable}></Header>
            </CardHeader>
                    <CardContent>
                        {children}
                    </CardContent>
                            {showSocial&& (
                                <CardFooter>
                                    <Social/>
                                </CardFooter>
                            )}
                            <CardFooter>
                                <BackButton
                                label={backButtonLabel}
                                href={backButtonHref}/>
                            </CardFooter>
        </Card>
    )
}
