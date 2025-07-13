"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
}

interface StaticStarsProps {
  starCount?: number;
  starColor?: string;
  className?: string;
}

export const StaticStars: React.FC<StaticStarsProps> = ({
  starCount = 100,
  starColor = "#c6d3e1",
  className,
}) => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100, // Use percentage for responsive design
          y: Math.random() * 100,
          size: Math.random() * 2 + 1, // Random size between 1-3px
          opacity: Math.random() * 0.8 + 0.2, // Random opacity between 0.2-1
          twinkleSpeed: Math.random() * 3 + 2, // Random speed between 2-5s
        });
      }
      
      setStars(newStars);
    };

    generateStars();
  }, [starCount]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: starColor,
            opacity: star.opacity,
            animationDuration: `${star.twinkleSpeed}s`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}; 