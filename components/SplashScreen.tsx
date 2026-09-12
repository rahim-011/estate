"use client"

import { useEffect, useState } from "react"

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("estatea_visited")
    if (hasVisited) {
      setShowSplash(false)
      return
    }
    sessionStorage.setItem("estatea_visited", "true")
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 1800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {showSplash && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-500">
          <h1 className="text-5xl font-bold text-white animate-logo-in">
            ESTATEA
          </h1>
        </div>
      )}
      <div className={showSplash ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>
        {children}
      </div>
    </>
  )
}