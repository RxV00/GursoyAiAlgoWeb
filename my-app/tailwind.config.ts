import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Prevent automatic dark mode activation
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors from design system
        brand: "#1A1A1A",
        accent: "#D4AF37",
        surface: "#FFFFFF",
        
        // Neutral colors
        neutral: {
          text: {
            primary: "#1A1A1A",
            secondary: "#666666",
            tertiary: "#999999",
            inverse: "#FFFFFF"
          },
          background: {
            primary: "#FFFFFF",
            secondary: "#F8F8F8",
            tertiary: "#EEEEEE"
          },
          border: {
            light: "#E0E0E0",
            medium: "#CCCCCC",
            dark: "#999999"
          }
        },
        
        // Semantic colors
        whatsapp: "#25D366",
        interactive: "#007AFF"
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        display: ["system-ui", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"]
      },
      fontSize: {
        display: "48px",
        h1: "32px",
        h2: "24px",
        h3: "18px",
        body: "16px",
        small: "14px",
        caption: "12px"
      },
      fontWeight: {
        light: "300",
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700"
      },
      lineHeight: {
        tight: "1.2",
        normal: "1.5",
        relaxed: "1.8"
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
        "4xl": "80px"
      },
      borderRadius: {
        none: "0px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        full: "50px"
      },
      boxShadow: {
        sm: "0 2px 4px rgba(0,0,0,0.1)",
        md: "0 4px 12px rgba(0,0,0,0.1)",
        lg: "0 8px 24px rgba(0,0,0,0.15)",
        xl: "0 12px 32px rgba(0,0,0,0.2)",
        elegant: "0 20px 25px -5px rgba(198, 211, 225, 0.1), 0 10px 10px -5px rgba(198, 211, 225, 0.04)",
        whatsapp: "0 4px 12px rgba(37,211,102,0.3)",
        "whatsapp-hover": "0 6px 16px rgba(37,211,102,0.4)",
        button: "0 2px 8px rgba(212,175,55,0.3)",
        "button-hover": "0 4px 12px rgba(212,175,55,0.4)",
        "button-active": "0 2px 4px rgba(212,175,55,0.3)"
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #87CEEB 0%, #4A90E2 100%)",
        "card-overlay": "linear-gradient(180deg, rgba(26,26,26,0.8) 0%, rgba(26,26,26,0.6) 100%)",
        "glass-effect": "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
        "hero-overlay": "linear-gradient(180deg, rgba(26,26,26,0.4) 0%, rgba(26,26,26,0.2) 100%)"
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out",
        "float": "float 3s ease-in-out infinite"
      },
      keyframes: {
        "fade-up": {
          from: {
            opacity: "0",
            transform: "translateY(20px)"
          },
          to: {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0)"
          },
          "50%": {
            transform: "translateY(-10px)"
          }
        }
      }
    }
  },
  plugins: [],
};

export default config; 