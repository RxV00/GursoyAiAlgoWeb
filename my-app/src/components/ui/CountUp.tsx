/*
	Installed from https://reactbits.dev/ts/tailwind/
*/

import { useEffect, useRef, useMemo } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  onStart,
  onEnd,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? to : from);

  // Memoize spring configuration for better performance
  const springConfig = useMemo(() => {
    const damping = 20 + 40 * (1 / duration);
    const stiffness = 100 * (1 / duration);
    return { damping, stiffness };
  }, [duration]);

  const springValue = useSpring(motionValue, springConfig);

  const isInView = useInView(ref, { 
    once: true, 
    margin: "0px"
  });

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = String(direction === "down" ? to : from);
    }
  }, [from, to, direction]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let durationTimeoutId: NodeJS.Timeout;
    
    if (isInView && startWhen) {
      if (typeof onStart === "function") {
        onStart();
      }

      timeoutId = setTimeout(() => {
        motionValue.set(direction === "down" ? from : to);
      }, delay * 1000);

      durationTimeoutId = setTimeout(
        () => {
          if (typeof onEnd === "function") {
            onEnd();
          }
        },
        delay * 1000 + duration * 1000
      );
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (durationTimeoutId) clearTimeout(durationTimeoutId);
    };
  }, [
    isInView,
    startWhen,
    motionValue,
    direction,
    from,
    to,
    delay,
    onStart,
    onEnd,
    duration,
  ]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        try {
          const options = {
            useGrouping: !!separator,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          };

          const formattedNumber = Intl.NumberFormat("en-US", options).format(
            Number(latest.toFixed(0))
          );

          ref.current.textContent = separator
            ? formattedNumber.replace(/,/g, separator)
            : formattedNumber;
        } catch {
          // Fallback for formatting errors
          ref.current.textContent = Math.round(latest).toString();
        }
      }
    });

    return () => unsubscribe();
  }, [springValue, separator]);

  return (
    <span 
      className={`${className} gpu-accelerated`} 
      ref={ref}
      style={{ willChange: 'contents' }}
    />
  );
}
