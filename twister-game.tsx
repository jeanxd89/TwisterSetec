"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, MicOff, RotateCw, Volume2 } from "lucide-react"
import TwisterWheel from "./twister-wheel"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"

type BodyPart = "MÃO ESQUERDA" | "MÃO DIREITA" | "PÉ ESQUERDO" | "PÉ DIREITO"
type Color = "Vermelho" | "Azul" | "Amarelo" | "Verde" | "Ar" | "Escolhe"

interface Move {
  bodyPart: BodyPart
  color: Color
}

export default function TwisterGame() {
  const [currentMove, setCurrentMove] = useState<Move | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [moveHistory, setMoveHistory] = useState<Move[]>([])
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition()

  const spinWheel = () => {
    if (isSpinning) return
    setIsSpinning(true)
  }

  const handleSpinComplete = (move: Move) => {
    setCurrentMove(move)
    setMoveHistory((prev) => [move, ...prev.slice(0, 9)])
    setIsSpinning(false)
    announceMove(move)
  }

  const announceMove = (move: Move) => {
    if ("speechSynthesis" in window) {
      let announcement = ""

      if (move.color === "Ar") {
        announcement = `${move.bodyPart} no ar!`
      } else if (move.color === "Escolhe") {
        announcement = `Quem gira escolhe! ${move.bodyPart}`
      } else {
        announcement = `${move.bodyPart}, ${move.color}`
      }

      const utterance = new SpeechSynthesisUtterance(announcement)
      utterance.lang = "pt-BR"
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  const toggleVoice = () => {
    if (voiceEnabled) {
      stopListening()
      setVoiceEnabled(false)
    } else {
      startListening()
      setVoiceEnabled(true)
    }
  }

  useEffect(() => {
    if (
      transcript.toLowerCase().includes("girar") ||
      transcript.toLowerCase().includes("rodar") ||
      transcript.toLowerCase().includes("spin")
    ) {
      spinWheel()
    }
  }, [transcript])

  const getColorDisplay = (color: Color) => {
    if (color === "Ar") {
      return { class: "bg-purple-600", text: "Ar ☁️" }
    } else if (color === "Escolhe") {
      return { class: "bg-purple-600", text: "Quem Gira Escolhe" }
    }

    switch (color) {
      case "Vermelho":
        return { class: "bg-[#D84B6B]", text: "Vermelho" }
      case "Azul":
        return { class: "bg-[#3498DB]", text: "Azul" }
      case "Amarelo":
        return { class: "bg-[#F4D03F]", text: "Amarelo" }
      case "Verde":
        return { class: "bg-[#A8C956]", text: "Verde" }
      default:
        return { class: "bg-gray-500", text: color }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-6xl font-black mb-4 text-balance">
          <span className="text-[#D84B6B]">T</span>
          <span className="text-[#3498DB]">W</span>
          <span className="text-[#F4D03F]">I</span>
          <span className="text-[#A8C956]">S</span>
          <span className="text-[#D84B6B]">T</span>
          <span className="text-[#3498DB]">E</span>
          <span className="text-[#F4D03F]">R</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Gire a roleta e siga os comandos! Use comandos de voz dizendo "girar" ou "rodar"
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Wheel Section */}
        <div className="space-y-6">
          <Card className="p-8 bg-card">
            <TwisterWheel isSpinning={isSpinning} currentMove={currentMove} onSpinComplete={handleSpinComplete} />
          </Card>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={spinWheel}
              disabled={isSpinning}
              className="flex-1 max-w-xs h-14 text-lg font-bold"
            >
              <RotateCw className={`mr-2 h-5 w-5 ${isSpinning ? "animate-spin" : ""}`} />
              {isSpinning ? "Girando..." : "Girar Roleta"}
            </Button>

            <Button
              size="lg"
              variant={voiceEnabled ? "destructive" : "secondary"}
              onClick={toggleVoice}
              className="h-14 px-6"
            >
              {voiceEnabled ? (
                <>
                  <Mic className="h-5 w-5 animate-pulse" />
                </>
              ) : (
                <>
                  <MicOff className="h-5 w-5" />
                </>
              )}
            </Button>
          </div>

          {voiceEnabled && (
            <Card className="p-4 bg-accent/50 border-accent">
              <div className="flex items-center gap-2 text-sm">
                <Volume2 className="h-4 w-4 text-accent-foreground" />
                <p className="text-accent-foreground font-medium">
                  {isListening ? '🎤 Ouvindo... Diga "girar" ou "rodar"' : "Ativando microfone..."}
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Current Move & History */}
        <div className="space-y-6">
          {/* Current Move Display */}
          {currentMove && (
            <Card className="p-8 bg-card">
              <h2 className="text-2xl font-bold mb-4 text-center">Movimento Atual</h2>
              <div className="flex flex-col items-center gap-4">
                <div
                  className={`w-32 h-32 rounded-full ${getColorDisplay(currentMove.color).class} shadow-lg flex items-center justify-center text-white font-bold text-lg`}
                >
                  {currentMove.color === "Ar" && "☁️"}
                  {currentMove.color === "Escolhe" && "T"}
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black mb-2">{currentMove.bodyPart}</p>
                  <p className="text-2xl font-bold text-muted-foreground">{getColorDisplay(currentMove.color).text}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Move History */}
          <Card className="p-6 bg-card">
            <h3 className="text-xl font-bold mb-4">Histórico de Movimentos</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {moveHistory.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum movimento ainda. Gire a roleta para começar!
                </p>
              ) : (
                moveHistory.map((move, index) => {
                  const colorDisplay = getColorDisplay(move.color)
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div
                        className={`w-8 h-8 rounded-full ${colorDisplay.class} flex-shrink-0 flex items-center justify-center text-white text-xs font-bold`}
                      >
                        {move.color === "Ar" && "☁️"}
                        {move.color === "Escolhe" && "T"}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{move.bodyPart}</p>
                        <p className="text-sm text-muted-foreground">{colorDisplay.text}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">#{moveHistory.length - index}</span>
                    </div>
                  )
                })
              )}
            </div>
          </Card>

          {/* Game Rules */}
          <Card className="p-6 bg-muted/30">
            <h3 className="text-lg font-bold mb-3">📋 Regras Rápidas</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Sempre use as mãos!</li>
              <li>• Apenas uma mão ou pé por círculo</li>
              <li>• O primeiro jogador a tocar tem direito ao espaço</li>
              <li>
                • <strong>Ar:</strong> Coloque a parte do corpo no ar
              </li>
              <li>
                • <strong>Quem gira escolhe:</strong> O girador escolhe o movimento
              </li>
              <li>• O último jogador que ficar é o vencedor!</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

