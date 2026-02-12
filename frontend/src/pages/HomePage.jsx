import React from 'react'
import DrawingCanvas from '../components/DrawingCanvas'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black flex flex-col items-center justify-center px-4 py-10">
      <div className="max-w-lg w-full space-y-2 text-center mb-8">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Digit Recognition
        </h1>
        <p className="text-slate-400 text-lg">
          Reconnaissance de chiffres manuscrits par réseau de neurones
        </p>
      </div>
      <DrawingCanvas />
    </div>
  )
}

export default HomePage
