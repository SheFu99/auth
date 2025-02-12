"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star } from "lucide-react"

interface ProfileProps {
  posts?: number
  likes?: number
  rating?: number
}

export function ProfileTabs({ profile }: { profile: ProfileProps }) {
  return (
    <Tabs defaultId="stats" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger id="stats">Stats</TabsTrigger>
        <TabsTrigger id="rating">Rating</TabsTrigger>
      </TabsList>
      <TabsContent type='stats' id="stats" className="mt-4">
        <div className="p-4 rounded-lg bg-muted/50 shadow-md">
          <div className="space-y-2">
            {/* <h3 className="text-sm font-medium text-center mb-5">Stats:</h3> */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-muted-foreground text-center">Comments</p>
                <p className="font-medium text-center">{profile?.posts || 0}</p>
              </div>
              <div className="w-px bg-muted/50 self-stretch mx-auto"></div>
              <div>
                <p className="text-muted-foreground text-center">Likes</p>
                <p className="font-medium text-center">{profile?.likes || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent id="rating" type='stats' className="mt-4">
        <div className="p-4 rounded-lg bg-muted/50 shadow-md">
          <div className="space-y-2">
            {/* <h3 className="text-sm font-medium text-center mb-5">Rating:</h3> */}
            <div className="flex justify-center items-center space-x-2">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold">{profile?.rating?.toFixed(1) || "N/A"}</span>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}


