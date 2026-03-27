"use client";

import { useEffect, useState } from "react";

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function Greeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    setGreeting(getGreeting(new Date().getHours()));
  }, []);

  return (
    <div>
      {greeting && (
        <p className="text-sm text-white/80">{greeting}</p>
      )}
      <h1 className="text-2xl font-bold text-white mt-0.5">
        {name}
      </h1>
    </div>
  );
}
