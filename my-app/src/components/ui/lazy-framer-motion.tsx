"use client";
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

// Import framer-motion directly for simpler type handling
import { LazyMotion, domMax, m, MotionProps } from 'framer-motion';

// Lightweight fallback with CSS animations
function MotionFallback({ 
  children, 
  className,
  style,
  initial,
  animate
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const elementRef = React.useRef<HTMLDivElement>(null);

  // Client-side hydration detection
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !elementRef.current) return;

    // Simple intersection observer for CSS animations
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [isClient]);

  // Convert framer-motion props to CSS classes
  const getCSSAnimationClass = () => {
    if (!isClient) return 'opacity-0'; // SSR-safe default
    
    if (initial?.opacity === 0 && animate?.opacity === 1) {
      return isVisible ? 'animate-fade-up' : 'opacity-0';
    }
    if (initial?.y && animate?.y === 0) {
      return isVisible ? 'animate-fade-up' : 'opacity-0 translate-y-5';
    }
    return isVisible ? 'animate-fade-up' : 'opacity-0';
  };

  return (
    <div 
      ref={elementRef}
      className={cn(
        className,
        getCSSAnimationClass(),
        'gpu-accelerated transition-all duration-500'
      )}
      style={style}
    >
      {children}
    </div>
  );
}

interface LazyMotionWrapperProps {
  children: React.ReactNode;
  enableLazyLoading?: boolean;
  fallbackProps?: {
    className?: string;
    style?: React.CSSProperties;
    initial?: Record<string, unknown>;
    animate?: Record<string, unknown>;
  };
}

export function LazyMotionWrapper({ 
  children, 
  enableLazyLoading = true,
  fallbackProps = {}
}: LazyMotionWrapperProps) {
  // SSR-safe initial states
  const [shouldLoadMotion, setShouldLoadMotion] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Client-side hydration detection
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !enableLazyLoading) {
      if (!enableLazyLoading) setShouldLoadMotion(true);
      return;
    }

    const checkPerformance = () => {
      const isLowEnd = 
        /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ||
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4);
      
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      setIsLowPerformance(isLowEnd || prefersReducedMotion);
      
      if (!isLowEnd && !prefersReducedMotion) {
        setShouldLoadMotion(true);
      }
    };

    checkPerformance();
  }, [isClient, enableLazyLoading]);

  if (isLowPerformance || !shouldLoadMotion) {
    return <MotionFallback {...fallbackProps}>{children}</MotionFallback>;
  }

  return (
    <LazyMotion features={domMax} strict>
      {children}
    </LazyMotion>
  );
}

// Enhanced motion div with lazy loading
interface LazyMotionDivProps extends Omit<MotionProps, 'children'> {
  children: React.ReactNode;
  className?: string;
  enableLazyLoading?: boolean;
}

export function LazyMotionDiv({
  children,
  className,
  enableLazyLoading = true,
  ...props
}: LazyMotionDivProps) {
  // SSR-safe initial state
  const [shouldLoadMotion, setShouldLoadMotion] = useState(true); // Default to loading motion for better UX
  const [isClient, setIsClient] = useState(false);

  // Client-side hydration detection
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !enableLazyLoading) {
      if (!enableLazyLoading) setShouldLoadMotion(true);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      setShouldLoadMotion(true);
    }
  }, [isClient, enableLazyLoading]);

  if (!shouldLoadMotion) {
    return (
      <MotionFallback 
        className={className}
        style={undefined}
        initial={undefined}
        animate={undefined}
      >
        {children}
      </MotionFallback>
    );
  }

  return (
    <LazyMotion features={domMax} strict>
      <m.div
        className={cn(className, 'gpu-accelerated')}
        {...props}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}