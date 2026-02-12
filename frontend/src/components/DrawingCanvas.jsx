import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Brush, Trash2, Send, Loader2 } from 'lucide-react'
import { predictDigit } from '../api'

const CANVAS_SIZE = 280
const BRUSH_RADIUS = 12

const DrawingCanvas = () => {
	const canvasRef = useRef(null)
	const [isDrawing, setIsDrawing] = useState(false)
	const [hasDrawn, setHasDrawn] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [result, setResult] = useState(null)
	const [error, setError] = useState(null)

	useEffect(() => {
		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')
		ctx.fillStyle = '#000000'
		ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
		ctx.lineCap = 'round'
		ctx.lineJoin = 'round'
		ctx.strokeStyle = '#ffffff'
		ctx.lineWidth = BRUSH_RADIUS * 2
	}, [])

	const getPosition = (e) => {
		const canvas = canvasRef.current
		const rect = canvas.getBoundingClientRect()
		const scaleX = canvas.width / rect.width
		const scaleY = canvas.height / rect.height

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
		const ctx = canvasRef.current.getContext('2d')
		const pos = getPosition(e)
		ctx.beginPath()
		ctx.moveTo(pos.x, pos.y)
		setIsDrawing(true)
		setHasDrawn(true)
		setResult(null)
		setError(null)
	}

	const draw = (e) => {
		e.preventDefault()
		if (!isDrawing) return
		const ctx = canvasRef.current.getContext('2d')
		const pos = getPosition(e)
		ctx.lineTo(pos.x, pos.y)
		ctx.stroke()
	}

	const stopDrawing = (e) => {
		e?.preventDefault()
		setIsDrawing(false)
	}

	const clearCanvas = () => {
		const ctx = canvasRef.current.getContext('2d')
		ctx.fillStyle = '#000000'
		ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
		setHasDrawn(false)
		setResult(null)
		setError(null)
	}

	const getPixels = useCallback(() => {
		const canvas = canvasRef.current
		const tempCanvas = document.createElement('canvas')
		tempCanvas.width = 28
		tempCanvas.height = 28
		const tempCtx = tempCanvas.getContext('2d')
		tempCtx.imageSmoothingEnabled = true
		tempCtx.imageSmoothingQuality = 'high'
		tempCtx.drawImage(canvas, 0, 0, 28, 28)

		const imageData = tempCtx.getImageData(0, 0, 28, 28)
		const pixels = []
		for (let i = 0; i < imageData.data.length; i += 4) {
			pixels.push(imageData.data[i] / 255.0)
		}
		return pixels
	}, [])

	  const handlePredict = async () => {
	    setIsLoading(true)
	    setError(null)
	    try {
	      const pixels = getPixels()
	      const data = await predictDigit(pixels)
	      setResult(data)
	    } catch (err) {
	      console.error('Prediction error:', err)
	      setError('Erreur lors de la prédiction. Vérifiez que le serveur est lancé.')
	    } finally {
	      setIsLoading(false)
	    }
	  }





	return (
		<div className="flex flex-col items-center gap-6">
			{/* Canvas */}
			<div className="rounded-xl overflow-hidden border-2 border-slate-700 shadow-lg shadow-blue-500/10">
				<canvas
					ref={canvasRef}
					width={CANVAS_SIZE}
					height={CANVAS_SIZE}
					className="cursor-crosshair touch-none block"
					style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
					onMouseDown={startDrawing}
					onMouseMove={draw}
					onMouseUp={stopDrawing}
					onMouseLeave={stopDrawing}
					onTouchStart={startDrawing}
					onTouchMove={draw}
					onTouchEnd={stopDrawing}
				/>
			</div>

			{/* Helper */}
			<p className="text-slate-500 text-sm flex items-center gap-2">
				<Brush size={16} />
				Dessinez un chiffre (0-9) dans le cadre
			</p>

			{/* Buttons */}
			<div className="flex gap-3">
				<button
					onClick={handlePredict}
					disabled={!hasDrawn || isLoading}
					className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
				>
					{isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
					{isLoading ? 'Analyse...' : 'Classifier'}
				</button>
				<button
					onClick={clearCanvas}
					className="flex items-center gap-2 px-6 py-2.5 border border-slate-600 hover:border-slate-500 hover:bg-slate-800 text-slate-300 font-medium rounded-lg transition-colors duration-200 cursor-pointer"
				>
					<Trash2 size={18} />
					Effacer
				</button>
			</div>

			{/* Result */}
			{result && (
				<div className="w-full max-w-sm bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl p-6 text-center space-y-3">
					<p className="text-6xl font-bold text-blue-400">
						{result.predicted_digit}
					</p>
					<p className="text-slate-400 text-sm">
						Confiance : {(result.confidence * 100).toFixed(1)}%
					</p>
					<div className="flex flex-wrap gap-1.5 justify-center pt-2">
						{result.probabilities.map((prob, idx) => (
							<span
								key={idx}
								className={`text-xs px-2.5 py-1 rounded-full font-medium ${idx === result.predicted_digit
										? 'bg-blue-600 text-white'
										: 'bg-slate-700 text-slate-400'
									}`}
							>
								{idx}: {(prob * 100).toFixed(0)}%
							</span>
						))}
					</div>
				</div>
			)}

			{/* Error */}
			{error && (
				<p className="text-red-400 text-sm text-center max-w-sm">
					{error}
				</p>
			)}
		</div>
	)
}

export default DrawingCanvas
