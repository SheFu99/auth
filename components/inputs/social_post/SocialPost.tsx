"use client";

import { useState } from "react";
import { MentionsInput, Mention } from "react-mentions";
import { getUserListByShortName } from "@/actions/search/users";

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
    onChange={(e) => setText(e.target.value)}
    style={{
      control: {
        // The textarea container styling
        fontSize: "14px",
        backgroundColor: "#fdfdfd",
        border: "1px solid #ccc",
        padding: "0.5rem",
      },
      highlighter: {
        // The hidden highlighter layer
        padding: "0.5rem",
        overflow: "hidden",
      },
      input: {
        // The actual text area
        margin: 0,
        fontSize: "14px",
        fontFamily: "inherit",
        color: "#333",
      },
      suggestions: {
        // The suggestions dropdown
        list: {
          backgroundColor: "white",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "14px",
          // you can add shadows, maxHeight, etc.
          boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
          maxHeight: "200px",
          overflowY: "auto",
        },
        item: {
          padding: "8px 12px",
          borderBottom: "1px solid #eee",
          cursor: "pointer",
          // style when hovered or focused
          "&focused": {
            backgroundColor: "#e6f7ff",
          },
        },
      },
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
