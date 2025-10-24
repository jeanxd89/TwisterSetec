"use client"

import { useEffect, useState } from "react"

type BodyPart = "MÃO ESQUERDA" | "MÃO DIREITA" | "PÉ ESQUERDO" | "PÉ DIREITO"
type Color = "Vermelho" | "Azul" | "Amarelo" | "Verde" | "Ar" | "Escolhe"

interface Move {
  bodyPart: BodyPart
  color: Color
}

interface TwisterWheelProps {
  isSpinning: boolean
  currentMove: Move | null
  onSpinComplete?: (move: Move) => void
}

const colorCircles = [
  { color: "Vermelho", bgColor: "#D84B6B", icon: null },
  { color: "Verde", bgColor: "#A8C956", icon: null },
  { color: "Escolhe", bgColor: "#7B5BA1", icon: "T" },
  { color: "Amarelo", bgColor: "#F4D03F", icon: null },
  { color: "Azul", bgColor: "#3498DB", icon: null },
  { color: "Ar", bgColor: "#7B5BA1", icon: "☁" },
  { color: "Vermelho", bgColor: "#D84B6B", icon: null },
  { color: "Verde", bgColor: "#A8C956", icon: null },
  { color: "Escolhe", bgColor: "#7B5BA1", icon: "T" },
  { color: "Amarelo", bgColor: "#F4D03F", icon: null },
  { color: "Azul", bgColor: "#3498DB", icon: null },
  { color: "Ar", bgColor: "#7B5BA1", icon: "☁" },
  { color: "Vermelho", bgColor: "#D84B6B", icon: null },
  { color: "Verde", bgColor: "#A8C956", icon: null },
  { color: "Escolhe", bgColor: "#7B5BA1", icon: "T" },
  { color: "Amarelo", bgColor: "#F4D03F", icon: null },
  { color: "Azul", bgColor: "#3498DB", icon: null },
  { color: "Ar", bgColor: "#7B5BA1", icon: "☁" },
  { color: "Vermelho", bgColor: "#D84B6B", icon: null },
  { color: "Verde", bgColor: "#A8C956", icon: null },
  { color: "Escolhe", bgColor: "#7B5BA1", icon: "T" },
  { color: "Amarelo", bgColor: "#F4D03F", icon: null },
  { color: "Azul", bgColor: "#3498DB", icon: null },
  { color: "Ar", bgColor: "#7B5BA1", icon: "☁" },
]

const bodyParts: BodyPart[] = ["MÃO DIREITA", "PÉ DIREITO", "MÃO ESQUERDA", "PÉ ESQUERDO"]

export default function TwisterWheel({ isSpinning, currentMove, onSpinComplete }: TwisterWheelProps) {
  const [rotation, setRotation] = useState(0)
  const [targetIndex, setTargetIndex] = useState(0)

  useEffect(() => {
    if (isSpinning) {
      const randomIndex = Math.floor(Math.random() * colorCircles.length)
      setTargetIndex(randomIndex)

      const segmentAngle = 360 / colorCircles.length
      const targetAngle = randomIndex * segmentAngle
      const spinAmount = 360 * 5 + targetAngle

      setRotation((prev) => prev + spinAmount)

      setTimeout(() => {
        const selectedColor = colorCircles[randomIndex]
        const randomBodyPart = bodyParts[Math.floor(Math.random() * bodyParts.length)]

        if (onSpinComplete) {
          onSpinComplete({
            bodyPart: randomBodyPart,
            color: selectedColor.color as Color,
          })
        }
      }, 2000)
    }
  }, [isSpinning, onSpinComplete])

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 z-20">
        <div className="relative">
          <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[30px] border-t-gray-800 drop-shadow-xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-gray-900" />
        </div>
      </div>

      <div className="relative w-full h-full">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-2xl"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? "transform 2s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
          }}
        >
          <defs>
            <radialGradient id="wheelGradient">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f5f5f5" />
            </radialGradient>
            <filter id="paperTexture">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
              <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="1">
                <feDistantLight azimuth="45" elevation="60" />
              </feDiffuseLighting>
            </filter>
            <radialGradient id="metalGradient">
              <stop offset="0%" stopColor="#555" />
              <stop offset="50%" stopColor="#333" />
              <stop offset="100%" stopColor="#222" />
            </radialGradient>
          </defs>

          <circle cx="200" cy="200" r="198" fill="url(#wheelGradient)" stroke="#ccc" strokeWidth="3" />
          <circle cx="200" cy="200" r="198" fill="white" opacity="0.05" filter="url(#paperTexture)" />

          {/* Body part labels */}
          {bodyParts.map((part, index) => {
            const angle = (360 / 4) * index
            const startAngle = (angle - 90 - 45) * (Math.PI / 180)
            const endAngle = (angle - 90 + 45) * (Math.PI / 180)
            const radius = 140

            const x1 = 200 + radius * Math.cos(startAngle)
            const y1 = 200 + radius * Math.sin(startAngle)
            const x2 = 200 + radius * Math.cos(endAngle)
            const y2 = 200 + radius * Math.sin(endAngle)

            const pathData = `M 200 200 L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`

            const textAngle = angle
            const textRadius = 80
            const textX = 200 + textRadius * Math.cos((textAngle - 90) * (Math.PI / 180))
            const textY = 200 + textRadius * Math.sin((textAngle - 90) * (Math.PI / 180))

            return (
              <g key={index}>
                <path d={pathData} fill="#fafafa" stroke="#d0d0d0" strokeWidth="1.5" />

                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#D84B6B"
                  fontSize="18"
                  fontWeight="700"
                  transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                  className="pointer-events-none select-none uppercase"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
                >
                  {part.split(" ")[0]}
                  <tspan x={textX} dy="20">
                    {part.split(" ")[1]}
                  </tspan>
                </text>
              </g>
            )
          })}

          {/* Color circles */}
          {colorCircles.map((circle, index) => {
            const angle = (360 / colorCircles.length) * index
            const radius = 175
            const circleX = 200 + radius * Math.cos((angle - 90) * (Math.PI / 180))
            const circleY = 200 + radius * Math.sin((angle - 90) * (Math.PI / 180))

            return (
              <g key={index}>
                <circle cx={circleX + 1} cy={circleY + 1} r="18" fill="rgba(0,0,0,0.15)" />
                <circle cx={circleX} cy={circleY} r="18" fill={circle.bgColor} stroke="white" strokeWidth="3" />
                <circle cx={circleX - 3} cy={circleY - 3} r="5" fill="rgba(255,255,255,0.3)" />

                {circle.icon && (
                  <text
                    x={circleX}
                    y={circleY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={circle.icon === "T" ? "20" : "18"}
                    fontWeight="bold"
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
                  >
                    {circle.icon}
                  </text>
                )}
              </g>
            )
          })}

          <circle cx="200" cy="200" r="28" fill="url(#metalGradient)" stroke="#111" strokeWidth="2" />
          <circle cx="200" cy="200" r="10" fill="#444" stroke="#666" strokeWidth="1" />
          <circle cx="197" cy="197" r="3" fill="#888" />
        </svg>
      </div>
    </div>
  )
}

