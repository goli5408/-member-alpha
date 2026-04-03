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
        <p className="text-sm mt-0.5" style={{ color: "rgba(65,70,81,0.62)" }}>{greeting}</p>
      )}
      <h1 className="font-display text-2xl font-bold mt-0.5" style={{ color: "#2d1f70" }}>
        {name}
      </h1>
    </div>
  );
}
