import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins({
subsets: ["latin"],
weight :["600"]
});

interface HeaderProps{
    label: string;
}

export const Header = ({label}:HeaderProps) =>{

    return(
        <div className=" w-full flex flex-col gap-y-4 items-center justify-center">
            <h1 className={cn("text-3xl font-semibold",font.className)}>
            <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">

  <rect width="100%" height="100%" fill="none"/>


  <g id="icon" transform="translate(40, 40)">

    <circle cx="0" cy="0" r="21" fill="rgba(0, 0, 0, 0.3)"/>

    <circle cx="0" cy="0" r="20" fill="none" stroke="white" stroke-width="4"/>


    <g id="figure1" transform="rotate(0)">
      <circle cx="-10" cy="-15" r="5" fill="white"/>
      <rect x="-11.5" y="-10" width="3" height="10" fill="white"/>
    </g>
    <g id="figure2" transform="rotate(120)">
      <circle cx="-10" cy="-15" r="5" fill="white"/>
      <rect x="-11.5" y="-10" width="3" height="10" fill="white"/>
    </g>
    <g id="figure3" transform="rotate(-120)">
      <circle cx="-10" cy="-15" r="5" fill="white"/>
      <rect x="-11.5" y="-10" width="3" height="10" fill="white"/>
    </g>
  </g>
</svg>



            </h1>
            <p> {label}</p>
        </div>
    )

}