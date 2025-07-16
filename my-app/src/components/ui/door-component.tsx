"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface DoorComponentProps {
  isOpen: boolean
  doorColor?: string
  contentBehind: ReactNode
  doorHeight?: string
}

export function DoorComponent({
  isOpen,
  doorColor = "from-slate-700 to-slate-800",
  contentBehind,
  doorHeight = "h-64",
}: DoorComponentProps) {
  return (
    <div className={`relative ${doorHeight} w-full overflow-hidden rounded-3xl shadow-2xl border border-slate-200/20`}>
      {/* Content behind the doors */}
      <div className="absolute inset-0 flex items-center justify-center">{contentBehind}</div>

      {/* Left Door */}
      <motion.div
        className={`absolute top-0 left-0 bg-gradient-to-br ${doorColor} ${doorHeight} shadow-2xl`}
        style={{ width: "50%" }}
        initial={{ x: 0 }}
        animate={{ x: isOpen ? "-100%" : 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
          duration: 0.8,
        }}
      >
        {/* Elegant door handle */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="w-3 h-8 bg-gradient-to-b from-amber-300 to-amber-500 rounded-full shadow-lg">
            <div className="w-full h-2 bg-amber-200 rounded-full mt-1"></div>
          </div>
        </div>

        {/* Sophisticated door panels */}
        <div className="absolute inset-4">
          <div className="h-full border-2 border-white/10 rounded-2xl">
            <div className="absolute inset-4 border border-white/5 rounded-xl">
              <div className="absolute inset-4 border border-white/5 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-l-3xl"></div>

        {/* Edge highlight */}
        <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-white/20 via-white/10 to-white/5"></div>
      </motion.div>

      {/* Right Door */}
      <motion.div
        className={`absolute top-0 right-0 bg-gradient-to-bl ${doorColor} ${doorHeight} shadow-2xl`}
        style={{ width: "50%" }}
        initial={{ x: 0 }}
        animate={{ x: isOpen ? "100%" : 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
          duration: 0.8,
        }}
      >
        {/* Elegant door handle */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <div className="w-3 h-8 bg-gradient-to-b from-amber-300 to-amber-500 rounded-full shadow-lg">
            <div className="w-full h-2 bg-amber-200 rounded-full mt-1"></div>
          </div>
        </div>

        {/* Sophisticated door panels */}
        <div className="absolute inset-4">
          <div className="h-full border-2 border-white/10 rounded-2xl">
            <div className="absolute inset-4 border border-white/5 rounded-xl">
              <div className="absolute inset-4 border border-white/5 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-bl from-white/5 to-transparent rounded-r-3xl"></div>

        {/* Edge highlight */}
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-white/20 via-white/10 to-white/5"></div>
      </motion.div>

      {/* Center seam with elegant styling */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-slate-400/30 via-slate-500/40 to-slate-400/30 transform -translate-x-1/2"></div>

        {/* Door frame shadow */}
        <div
          className="absolute inset-0 rounded-3xl shadow-inner pointer-events-none"
          style={{ boxShadow: "inset 0 0 20px rgba(0,0,0,0.1)" }}
        ></div>
      </div>

      {/* Ambient lighting effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/5 rounded-3xl pointer-events-none"></div>
    </div>
  )
}
