"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface WordRotateProps {
  words: string[]
  interval?: number
  className?: string
}

export function WordRotate({ words, interval = 1500, className }: WordRotateProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!words?.length) return
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, interval)
    return () => clearInterval(id)
  }, [words, interval])

  return (
    <span className={cn("inline align-baseline", className)}>{words[index]}</span>
  )
}