"use client"

import React, { useRef, useState, useMemo, useCallback, type ReactNode } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Plane, Environment } from "@react-three/drei"
import * as THREE from "three"
import { cn } from "@/lib/utils"

// Optimized easing function
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)

// Memoized window panel component for performance
const WindowPanel = React.memo(({ side }: { side: "left" | "right" }) => {
  // Optimized materials with proper disposal
  const materials = useMemo(() => {
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: "#f1f5f9",
      metalness: 0.8,
      roughness: 0.15,
      envMapIntensity: 1.2,
    })

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      roughness: 0.02,
      transmission: 0.95,
      thickness: 0.3,
      envMapIntensity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      ior: 1.52,
      reflectivity: 0.1,
      transparent: true,
      opacity: 0.95,
    })

    return { frameMaterial, glassMaterial }
  }, [])

  // Cleanup materials on unmount
  React.useEffect(() => {
    return () => {
      materials.frameMaterial.dispose()
      materials.glassMaterial.dispose()
    }
  }, [materials])

  const frameOffset = side === "left" ? 6.1 : -6.1

  return (
    <group>
      {/* Main glass panel */}
      <Plane args={[12, 16]} material={materials.glassMaterial} />

      {/* Optimized frame structure */}
      <Plane args={[0.3, 16.3]} position={[frameOffset, 0, 0.02]} material={materials.frameMaterial} />
      <Plane args={[12.3, 0.3]} position={[0, 8.15, 0.02]} material={materials.frameMaterial} />
      <Plane args={[12.3, 0.3]} position={[0, -8.15, 0.02]} material={materials.frameMaterial} />

      {/* Elegant mullions */}
      <Plane args={[0.08, 16]} position={[0, 0, 0.03]} material={materials.frameMaterial} />
      <Plane args={[12, 0.08]} position={[0, 0, 0.03]} material={materials.frameMaterial} />
      <Plane args={[12, 0.08]} position={[0, 5.3, 0.03]} material={materials.frameMaterial} />
      <Plane args={[12, 0.08]} position={[0, -5.3, 0.03]} material={materials.frameMaterial} />
    </group>
  )
})

WindowPanel.displayName = "WindowPanel"

// Optimized scene component
function Scene({ heroRef, onAnimationEnd }: { heroRef: React.RefObject<HTMLDivElement | null>; onAnimationEnd: () => void }) {
  const { camera } = useThree()
  const leftWindow = useRef<THREE.Group>(null!)
  const rightWindow = useRef<THREE.Group>(null!)
  const animationState = useRef({ progress: 0, hasEnded: false })

  // Memoized callback to prevent re-renders
  const handleAnimationEnd = useCallback(() => {
    onAnimationEnd()
  }, [onAnimationEnd])

  // Set initial camera position once
  React.useEffect(() => {
    camera.position.set(0, 0, 15)
    camera.lookAt(0, 0, 0)
  }, [camera])

  useFrame((state, delta) => {
    if (animationState.current.hasEnded) return

    // Smooth animation progression - reduced speed for slower animation
    animationState.current.progress = Math.min(animationState.current.progress + delta * 0.3, 1)
    const easedProgress = easeOutQuart(animationState.current.progress)

    // Optimized transformations
    if (leftWindow.current && rightWindow.current) {
      leftWindow.current.position.x = -easedProgress * 16
      rightWindow.current.position.x = easedProgress * 16
    }

    // Smooth camera zoom
    camera.position.z = 15 - easedProgress * 11

    // Hero section animation with better scaling
    if (heroRef.current) {
      const scale = 0.85 + easedProgress * 0.15
      const opacity = Math.pow(easedProgress, 0.6)
      heroRef.current.style.transform = `scale(${scale})`
      heroRef.current.style.opacity = `${opacity}`
    }

    // Complete animation
    if (animationState.current.progress >= 1) {
      animationState.current.hasEnded = true
      state.frameloop = "never"
      handleAnimationEnd()
    }
  })

  return (
    <>
      {/* Optimized lighting setup */}
      <ambientLight intensity={0.8} color="#ffffff" />
      <directionalLight position={[10, 10, 8]} intensity={1.5} color="#ffffff" castShadow />
      <directionalLight position={[-8, 8, 6]} intensity={1.2} color="#f8fafc" />
      <pointLight position={[0, 0, 12]} intensity={0.8} color="#ffffff" />

      <group ref={leftWindow}>
        <WindowPanel side="left" />
      </group>
      <group ref={rightWindow}>
        <WindowPanel side="right" />
      </group>
    </>
  )
}

export function WindowAnimation({ children }: { children: ReactNode }) {
  const heroWrapperRef = useRef<HTMLDivElement>(null)
  const [isAnimationComplete, setAnimationComplete] = useState(false)

  const handleAnimationComplete = useCallback(() => {
    setAnimationComplete(true)
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 3D Canvas with optimized settings */}
      <div
        className={cn(
          "absolute inset-0 z-30 transition-opacity duration-1000 ease-out",
          isAnimationComplete ? "opacity-0 pointer-events-none" : "opacity-100",
        )}
      >
        <Canvas
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
          dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)]}
          camera={{
            position: [0, 0, 15],
            fov: 50,
            near: 0.1,
            far: 100,
          }}
          performance={{ min: 0.8 }}
        >
          <Environment preset="dawn" />
          <Scene heroRef={heroWrapperRef} onAnimationEnd={handleAnimationComplete} />
        </Canvas>
      </div>

      {/* Hero section */}
      <div ref={heroWrapperRef} className="absolute inset-0 z-20 opacity-0">
        {children}
      </div>
    </div>
  )
} 