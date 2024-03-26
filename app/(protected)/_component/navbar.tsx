"use client"
import { usePathname } from 'next/navigation'
import { UserButton } from '@/components/auth/user-button'

export const Navbar = ()=>{
    const pathname = usePathname();
    return(
        <nav className="bg-secondary col-start-1 col-span-12 row-span-1 p-4 rounded-xs md:w-full h-auto">
        <div className="flex justify-end">
        <UserButton />
        </div>
    </nav>
    
    )
}