"use client"

import { useState, useEffect } from "react"

export default function WindowAnimation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Trigger animation after a short delay
    const openTimer = setTimeout(() => {
      setIsOpen(true)
    }, 500)
    
    // Hide the entire component after animation completes
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
    }, 2500)
    
    return () => {
      clearTimeout(openTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div 
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none transition-opacity duration-1000"
      style={{ 
        zIndex: 20,
        opacity: isVisible ? 1 : 0
      }}
    >
      {/* Sliding Window Panels */}
      <div className="absolute inset-0 flex">
        {/* Left Panel */}
        <div
          className={`relative w-1/2 h-full transition-all duration-2000 ease-in-out ${
            isOpen ? "-translate-x-[110%] opacity-0" : "translate-x-0 opacity-100"
          }`}
        >
          {/* Outer Frame Shadow */}
          <div className="absolute -inset-2 bg-black/20 blur-xl"></div>

          {/* Main Frame Structure */}
          <div className="absolute inset-0 bg-transparent shadow-2xl border border-gray-700/50">
            {/* Frame Bevels */}
            <div className="absolute inset-1 border border-gray-600/30 bg-gradient-to-br from-gray-800/20 to-transparent"></div>
            <div className="absolute inset-2 border border-gray-500/20"></div>

            {/* Glass Panel - Completely Transparent */}
            <div className="absolute inset-4">{/* No background, no blur, no effects - completely transparent */}</div>

            {/* Professional Hardware */}
            {/* Top Rail */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-700 via-black to-gray-900 border-b border-gray-600/30">
              <div className="absolute inset-x-2 top-1 h-1 bg-gradient-to-r from-gray-600 via-gray-400 to-gray-600 rounded-full shadow-inner"></div>
            </div>

            {/* Bottom Rail */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black via-gray-900 to-gray-800 border-t border-gray-600/30">
              <div className="absolute inset-x-2 bottom-1 h-1 bg-gradient-to-r from-gray-600 via-gray-400 to-gray-600 rounded-full shadow-inner"></div>
            </div>

            {/* Left Stile */}
            <div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-gray-700 via-black to-gray-900 border-r border-gray-600/30">
              <div className="absolute inset-y-2 left-1 w-1 bg-gradient-to-b from-gray-600 via-gray-400 to-gray-600 rounded-full shadow-inner"></div>
            </div>

            {/* Right Stile (Center Mullion) */}
            <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-black via-gray-900 to-gray-800 border-l border-gray-600/30">
              <div className="absolute inset-y-2 right-1 w-1 bg-gradient-to-b from-gray-600 via-gray-400 to-gray-600 rounded-full shadow-inner"></div>
              {/* Weather Stripping */}
              <div className="absolute inset-y-4 right-0 w-1 bg-black rounded-l-full"></div>
            </div>

            {/* Professional Handle */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              <div className="w-3 h-20 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full shadow-lg border border-gray-400/30">
                <div className="absolute inset-1 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 rounded-full"></div>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-gray-700 via-gray-600 to-gray-700 rounded-full shadow-inner"></div>
              </div>
            </div>

            {/* Lock Mechanism */}
            <div className="absolute right-8 top-1/2 translate-y-8">
              <div className="w-2 h-4 bg-gradient-to-b from-gray-500 to-gray-700 rounded border border-gray-400/30 shadow-inner"></div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div
          className={`relative w-1/2 h-full transition-all duration-2000 ease-in-out ${
            isOpen ? "translate-x-[110%] opacity-0" : "translate-x-0 opacity-100"
          }`}
        >
          {/* Outer Frame Shadow */}
          <div className="absolute -inset-2 bg-black/20 blur-xl"></div>

          {/* Main Frame Structure */}
          <div className="absolute inset-0 bg-transparent shadow-2xl border border-gray-700/50">
            {/* Frame Bevels */}
            <div className="absolute inset-1 border border-gray-600/30 bg-gradient-to-br from-gray-800/20 to-transparent"></div>
            <div className="absolute inset-2 border border-gray-500/20"></div>

            {/* Glass Panel - Completely Transparent */}
            <div className="absolute inset-4">{/* No background, no blur, no effects - completely transparent */}</div>

            {/* Professional Hardware */}
            {/* Top Rail */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-700 via-black to-gray-900 border-b border-gray-600/30">
              <div className="absolute inset-x-2 top-1 h-1 bg-gradient-to-r from-gray-600 via-gray-400 to-gray-600 rounded-full shadow-inner"></div>
            </div>

            {/* Bottom Rail */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black via-gray-900 to-gray-800 border-t border-gray-600/30">
              <div className="absolute inset-x-2 bottom-1 h-1 bg-gradient-to-r from-gray-600 via-gray-400 to-gray-600 rounded-full shadow-inner"></div>
            </div>

            {/* Left Stile (Center Mullion) */}
            <div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-gray-700 via-black to-gray-900 border-r border-gray-600/30">
              <div className="absolute inset-y-2 left-1 w-1 bg-gradient-to-b from-gray-600 via-gray-400 to-gray-600 rounded-full shadow-inner"></div>
              {/* Weather Stripping */}
              <div className="absolute inset-y-4 left-0 w-1 bg-black rounded-r-full"></div>
            </div>

            {/* Right Stile */}
            <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-gray-600 via-gray-500 to-gray-600 border-l border-gray-600/30">
              <div className="absolute inset-y-2 right-1 w-1 bg-gradient-to-b from-gray-600 via-gray-400 to-gray-600 rounded-full shadow-inner"></div>
            </div>

            {/* Professional Handle */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2">
              <div className="w-3 h-20 bg-gradient-to-l from-gray-600 via-gray-500 to-gray-600 rounded-full shadow-lg border border-gray-400/30">
                <div className="absolute inset-1 bg-gradient-to-l from-gray-500 via-gray-400 to-gray-500 rounded-full"></div>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-gray-700 via-gray-600 to-gray-700 rounded-full shadow-inner"></div>
              </div>
      </div>

            {/* Lock Mechanism */}
            <div className="absolute left-8 top-1/2 translate-y-8">
              <div className="w-2 h-4 bg-gradient-to-b from-gray-500 to-gray-700 rounded border border-gray-400/30 shadow-inner"></div>
            </div>
          </div>
      </div>
      </div>


    </div>
  )
} 
