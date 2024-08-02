"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { api } from "@/trpc/react";
import { Separator } from "@/components/ui/separator";
import { ImageCard } from "@/components/ImageCard";

const formSchema = z.object({
  q: z.string().trim().min(1),
});

const maxSimilarityLevel = 5;

export default function Page() {
  const [query, setQuery] = useState("");
  const [similarity, setSimilarity] = useState(1);
  const images = api.cover.searchByString.useQuery(
    { search: query, similarityThreshold: similarity },
    {
      enabled: () => query !== "",
    },
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      q: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSimilarity(1);
    setQuery(values.q);
  }

  function increaseSimilarity() {
    setSimilarity((s) => {
      if (s + 1 >= maxSimilarityLevel) {
        return s;
      }
      return s + 1;
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="q"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Search</FormLabel>
                <FormControl>
                  <Input
                    className="text-black"
                    placeholder="shadcn"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter a search term</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <Separator className="my-2" />
      {images.isLoading && (
        <div className="flex justify-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          />
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-6 p-12">
        {images.isSuccess && images.data.length === 0 && (
          <p>Could not find any results</p>
        )}
        {images.isSuccess &&
          images.data.map((image) => (
            <>
              <ImageCard key={image.id} imageData={image} className="w-56" />
              <span>{image.similarity * 100}</span>
            </>
          ))}
      </div>
      {images.isSuccess && similarity < maxSimilarityLevel && (
        <div className="flex flex-row justify-center">
          <Button onClick={increaseSimilarity}>Show more</Button>
        </div>
      )}
    </>
  );
}
