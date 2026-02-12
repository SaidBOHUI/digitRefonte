import DrawingCanvas from '../components/DrawingCanvas'
import { Eye } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Eye className="text-indigo-400" size={36} />
          <h1 className="text-4xl font-bold text-white">DigitEye</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Dessinez un chiffre et laissez l'IA le reconnaître
        </p>
      </div>

      {/* Canvas */}
      <DrawingCanvas />

      {/* Footer */}
      <footer className="mt-12 text-gray-500 text-sm">
        Réseau de neurones Keras (MLP 256→128→10) entraîné sur MNIST
      </footer>
    </div>
  )
}
