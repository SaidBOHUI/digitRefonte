import { useRef, useState, useEffect, useCallback } from 'react'
import { Eraser, Send, Loader2 } from 'lucide-react'
import { predictDigit } from '../api'

const CANVAS_SIZE = 280
const GRID_SIZE = 28
const LINE_WIDTH = 16

export default function DrawingCanvas() {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Initialize canvas with black background
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
    setPrediction(null)
    setError(null)
  }, [])

  useEffect(() => {
    clearCanvas()
  }, [clearCanvas])

  const getPosition = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = CANVAS_SIZE / rect.width
    const scaleY = CANVAS_SIZE / rect.height

    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const startDrawing = (e) => {
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPosition(e)

    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = LINE_WIDTH
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    setIsDrawing(true)
  }

  const draw = (e) => {
    if (!isDrawing) return
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPosition(e)

    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
  }

  const stopDrawing = (e) => {
    if (e) e.preventDefault()
    setIsDrawing(false)
  }

  const getPixels = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Create a temporary small canvas (28x28)
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = GRID_SIZE
    tempCanvas.height = GRID_SIZE
    const tempCtx = tempCanvas.getContext('2d')

    // Disable image smoothing for sharper downscale
    tempCtx.imageSmoothingEnabled = true
    tempCtx.imageSmoothingQuality = 'medium'
    tempCtx.drawImage(canvas, 0, 0, GRID_SIZE, GRID_SIZE)

    const imageData = tempCtx.getImageData(0, 0, GRID_SIZE, GRID_SIZE)
    const pixels = []

    // Extract grayscale values (use red channel since it's white on black)
    for (let i = 0; i < imageData.data.length; i += 4) {
      pixels.push(imageData.data[i]) // 0-255
    }

    return pixels
  }

  const handlePredict = async () => {
    setLoading(true)
    setError(null)
    try {
      const pixels = getPixels()
      const result = await predictDigit(pixels)
      setPrediction(result)
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur de prédiction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="border-2 border-gray-600 rounded-xl cursor-crosshair touch-none"
          style={{ width: '280px', height: '280px' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={clearCanvas}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <Eraser size={18} />
          Effacer
        </button>
        <button
          onClick={handlePredict}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          Prédire
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Result */}
      {prediction && (
        <div className="bg-gray-800/80 backdrop-blur border border-gray-700 rounded-xl p-6 w-full max-w-sm text-center">
          <div className="text-6xl font-bold text-white mb-2">
            {prediction.predicted_digit}
          </div>
          <div className="text-indigo-400 text-lg mb-4">
            Confiance : {(prediction.confidence * 100).toFixed(1)}%
          </div>

          {/* Probability bars */}
          <div className="space-y-1.5">
            {prediction.probabilities.map((prob, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 w-4 text-right">{idx}</span>
                <div className="flex-1 bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === prediction.predicted_digit
                        ? 'bg-indigo-500'
                        : 'bg-gray-500'
                    }`}
                    style={{ width: `${(prob * 100).toFixed(1)}%` }}
                  />
                </div>
                <span className="text-gray-400 w-12 text-right">
                  {(prob * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
