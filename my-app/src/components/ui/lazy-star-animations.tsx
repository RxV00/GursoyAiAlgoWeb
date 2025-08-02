"use client";
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

// Lazy load star animation components
const ShootingStars = lazy(() => 
  import('./shooting-stars').then(module => ({ 
    default: module.ShootingStars 
  }))
);

const StaticStars = lazy(() => 
  import('./static-stars').then(module => ({ 
    default: module.StaticStars 
  }))
);

// Lightweight CSS-only star background as fallback
function StarsFallback({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* CSS-only twinkling stars */}
      <div className="stars-layer-1"></div>
      <div className="stars-layer-2"></div>
      <div className="stars-layer-3"></div>
      
      <style jsx>{`
        .stars-layer-1, .stars-layer-2, .stars-layer-3 {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, #c6d3e1, transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(198, 211, 225, 0.8), transparent),
            radial-gradient(1px 1px at 90px 40px, #c6d3e1, transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(198, 211, 225, 0.6), transparent),
            radial-gradient(2px 2px at 160px 30px, #c6d3e1, transparent);
          background-repeat: repeat;
          background-size: 200px 100px;
        }
        
        .stars-layer-1 {
          animation: twinkle 4s infinite;
        }
        
        .stars-layer-2 {
          animation: twinkle 6s infinite reverse;
          background-size: 300px 150px;
          opacity: 0.8;
        }
        
        .stars-layer-3 {
          animation: twinkle 8s infinite;
          background-size: 400px 200px;
          opacity: 0.6;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .stars-layer-1, .stars-layer-2, .stars-layer-3 {
            animation: none;
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}

interface LazyStarAnimationsProps {
  starCount?: number;
  starColor?: string;
  shootingStarProps?: {
    minSpeed?: number;
    maxSpeed?: number;
    minDelay?: number;
    maxDelay?: number;
    starColor?: string;
    trailColor?: string;
    starWidth?: number;
    starHeight?: number;
  };
  className?: string;
  enableLazyLoading?: boolean;
}

export function LazyStarAnimations({ 
  starCount = 100,
  starColor = "#c6d3e1",
  shootingStarProps = {
    minSpeed: 15,
    maxSpeed: 25,
    minDelay: 1500,
    maxDelay: 3000,
    starColor: "#7a8fa5",
    trailColor: "#c6d3e1",
    starWidth: 15,
    starHeight: 2,
  },
  className,
  enableLazyLoading = true
}: LazyStarAnimationsProps) {
  // SSR-safe initial states
  const [shouldLoadAnimations, setShouldLoadAnimations] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false); // Changed: Default to high performance
  const [isClient, setIsClient] = useState(false);

  // Client-side hydration detection
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !enableLazyLoading) {
      if (!enableLazyLoading) setShouldLoadAnimations(true);
      return;
    }

    const checkPerformance = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const connection = (navigator as { connection?: { effectiveType?: string } }).connection;
      const isSlowConnection = connection?.effectiveType === 'slow-2g';
      
      // Only disable for very specific cases
      setIsLowPerformance(prefersReducedMotion || isSlowConnection);
      
      if (!prefersReducedMotion && !isSlowConnection) {
        // Load animations quickly
        setShouldLoadAnimations(true);
      }
    };

    checkPerformance();
  }, [isClient, enableLazyLoading]);

  // Use CSS fallback for low-performance devices
  if (isLowPerformance || !shouldLoadAnimations) {
    return <StarsFallback className={className} />;
  }

  return (
    <>
      {/* Static Stars */}
      <Suspense fallback={<StarsFallback className={cn(className, "z-0")} />}>
        <StaticStars
          starCount={starCount}
          starColor={starColor}
          className={cn(className, "z-0")}
        />
      </Suspense>
      
      {/* Shooting Stars */}
      <Suspense fallback={null}>
        <ShootingStars
          {...shootingStarProps}
          className={cn(className, "z-[1]")}
        />
      </Suspense>
    </>
  );
}