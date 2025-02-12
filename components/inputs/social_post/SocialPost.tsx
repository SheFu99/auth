"use client";

import { useState } from "react";
import { MentionsInput, Mention } from "react-mentions";
import { getUserListByShortName } from "@/actions/search/users";
import './socialPostInput.css'
export default function CustomTextareaWithMentions() {
  const [text, setText] = useState("");

  // React Mentions calls this function with (query, callback)
  // whenever the user types after '@'
 


  const getUserSuggestionList = async (query: string, callback: any) => {
    if (!query) {
      // If there's no search term, return an empty array
      callback([]);
      return;
    }


    try {
      // Suppose getUserListByShortName returns:
      // { searchResult: [...], error: ... }
      const { searchResult, error } = await getUserListByShortName({
        shortName: query,
        pageParams: 1,


      });
      console.log("searchResult", searchResult);

      if (error || !Array.isArray(searchResult)) {
        // In case of error or no valid array, pass empty array
        console.error("Error in user list:", error);
        callback([]);
        return;
      }

      // Map each user to { id, display } shape
      const suggestions = searchResult.map((user: any) => ({
        id: user.id ?? "",
        display: user.name ?? "Unknown",
      }));

      // Now call callback with an array of objects
      callback(suggestions);
    } catch (err) {
      console.error("Error in API call:", err);
      callback([]); // Pass empty array on error
    }
  };

  return (
    <MentionsInput
    value={text}
    placeholder="Type something here..."
    onChange={(e) => setText(e.target.value)}
    classNames={{
      control: "relative w-full",
      input: `
      flex min-h-[30px] w-full
      rounded-md bg-background px-3 py-2 text-xl ring-offset-background
      placeholder:text-xl placeholder:text-white  
      focus:placeholder:text-neutral-600          
      focus:border-none focus:outline-none focus-visible:outline-none
      disabled:cursor-not-allowed disabled:opacity-50
      resize-none
    `,
    }}
  >
    <Mention
      trigger="@"
      data={getUserSuggestionList}
      markup="@[__id__]"
      displayTransform={(id) => `@${id}`}
    />

  </MentionsInput>
  
  );
}
