"use client";

import { api } from "@/trpc/react";
import { useState } from "react";

export function SearchWindow() {
  const [searchString, setSearchString] = useState("");
  const searchResult = api.cover.getTextEmbedding.useQuery(searchString);
  console.log(searchResult);

  return (
    <>
      <input
        className="text-black"
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
      />
      {searchResult.data && (
        <>
          <span>Input: {searchResult.data.input}</span>
          <span>Length: {searchResult.data.embedding.length}</span>
        </>
      )}
    </>
  );
}
