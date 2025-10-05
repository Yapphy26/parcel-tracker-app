import React from "react";
import { LoaderFour } from "@/components/ui/loader";

export default function Loader() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-white/80 dark:bg-black/80 backdrop-blur-xs z-9999">
      <LoaderFour />
    </div>
  );
}