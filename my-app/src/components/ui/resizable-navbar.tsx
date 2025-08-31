"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";

import React, { useRef, useState, useEffect } from "react";


interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
  }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState<boolean>(false);

  // Use throttled scroll handling to reduce reflow
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Clear existing timeout for debouncing
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the visibility check to prevent excessive updates
    timeoutRef.current = setTimeout(() => {
      // Check visibility with hysteresis to prevent flickering
      const shouldBeVisible = latest > 120;
      if (visible !== shouldBeVisible) {
        setVisible(shouldBeVisible);
      }
    }, 16); // ~60fps debouncing
  });

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn("fixed inset-x-0 top-0 z-40 w-full", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible },
            )
          : child,
      )}
    </div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      initial={{
        y: 0,
        scale: 1,
      }}
      animate={{
        y: visible ? 16 : 0,
        scale: visible ? 0.95 : 1,
      }}
      transition={{
        type: "tween",
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      style={{
        willChange: "transform",
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-5xl flex-row items-center justify-between self-start rounded-full px-6 py-3 lg:flex gap-6 transition-all duration-300 ease-out",
        visible 
          ? "bg-white/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20" 
          : "bg-transparent",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        // Desktop: absolute positioned for navbar, Mobile: flex column for mobile menu
        "flex flex-col space-y-2 lg:absolute lg:inset-0 lg:flex lg:flex-1 lg:flex-row lg:items-center lg:justify-center lg:space-y-0 lg:space-x-4 text-sm font-medium text-zinc-600 transition duration-200 hover:text-zinc-800",
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-2 sm:px-3 py-2 text-neutral-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap text-sm"
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-lg bg-gray-100"
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      initial={{
        y: 0,
        scale: 1,
      }}
      animate={{
        y: visible ? 12 : 0,
        scale: visible ? 0.96 : 1,
      }}
      transition={{
        type: "tween",
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      style={{
        willChange: "transform",
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-full flex-col items-center justify-between rounded-full px-4 py-3 lg:hidden transition-all duration-300 ease-out",
        visible 
          ? "bg-white/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20" 
          : "bg-transparent",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between min-w-0 gap-1 md:gap-2 lg:gap-1",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-x-0 top-12 z-50 flex w-full max-w-full flex-col items-start justify-start gap-2 rounded-lg bg-white px-2 sm:px-3 py-4 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <button 
      onClick={onClick}
      className="relative z-20 flex h-9 w-9 md:h-10 md:w-10 lg:h-8 lg:w-8 items-center justify-center rounded-lg text-black hover:bg-gray-100 transition-colors duration-200 flex-shrink-0"
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      {isOpen ? (
        <IconX className="h-5 w-5 md:h-6 md:w-6 lg:h-5 lg:w-5" />
      ) : (
        <IconMenu2 className="h-5 w-5 md:h-6 md:w-6 lg:h-5 lg:w-5" />
      )}
    </button>
  );
};

export const NavbarLogo = () => {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center space-x-2 md:space-x-3 lg:space-x-2 text-sm font-normal text-black hover:opacity-90 transition-opacity duration-200 flex-shrink-0 min-w-0"
    >
      <div className="relative w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-[#c6d3e1] to-[#7a8fa5] rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group flex-shrink-0 self-center">
        <span className="text-white font-bold text-sm md:text-lg lg:text-xl tracking-tight">G</span>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg lg:rounded-xl"></div>
        <div className="absolute inset-0 border border-white/30 rounded-lg lg:rounded-xl"></div>
      </div>
      <div className="flex flex-col justify-center min-w-0 flex-1 h-full">
        <span className="font-bold text-sm md:text-lg lg:text-xl text-slate-900 leading-tight tracking-tight truncate">
          <span className="hidden sm:inline">Gursoy</span><span className="sm:hidden">Gursoylar</span><span className="text-[#7a8fa5] hidden sm:inline">lar</span>
        </span>
        <span className="text-xs text-slate-500 font-medium uppercase tracking-widest hidden lg:block leading-none">
          Architecture
        </span>
      </div>
    </Link>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
} & Omit<React.ComponentProps<'a'>, 'href' | 'children' | 'className'>) => {
  const baseStyles =
    "px-3 sm:px-4 py-2 rounded-md bg-white button bg-white text-black text-xs sm:text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-flex items-center justify-center text-center min-h-[36px] sm:min-h-[40px] min-w-[60px] sm:min-w-[80px] whitespace-nowrap flex-shrink-0";

  const variantStyles = {
    primary:
      "shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
    secondary: "bg-transparent shadow-none text-slate-600",
    dark: "bg-black text-white shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
    gradient:
      "bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]",
  };

  // Use React.createElement to avoid TypeScript issues with generic components
  return React.createElement(
    Tag,
    {
      href,
      className: cn(baseStyles, variantStyles[variant], className),
      ...props,
    },
    children
  );
};
