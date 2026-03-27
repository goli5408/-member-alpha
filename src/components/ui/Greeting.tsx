"use client";

import { useEffect, useState } from "react";

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function Greeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState("");
  const [displayName, setDisplayName] = useState(name);

  useEffect(() => {
    setGreeting(getGreeting(new Date().getHours()));
    const saved = localStorage.getItem("ss_displayName");
    if (saved) setDisplayName(saved);
  }, []);

  return (
    <div>
      {greeting && (
        <p className="text-sm mt-0.5" style={{ color: "rgba(65,70,81,0.62)" }}>{greeting}</p>
      )}
      <h1 className="font-display text-2xl font-bold mt-0.5" style={{ color: "#2d1f70" }}>
        {displayName}
      </h1>
    </div>
  );
}
