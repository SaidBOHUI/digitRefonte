import numpy as np
import tensorflow as tf
from app.config import get_settings

settings = get_settings()

model = None


def load_model():
    global model
    try:
        model = tf.keras.models.load_model(settings.model_path)
        print(f"✅ Model loaded from {settings.model_path}")
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
        raise e


def predict_digit(pixels: list[float]) -> dict:
    if model is None:
        raise RuntimeError("Model not loaded")

    # 1. Préparation des données (Vecteur plat 784)
    input_data = np.array(pixels, dtype=np.float32).reshape(1, 784)

    # 2. Normalisation à [0, 1] si nécessaire
    if input_data.max() > 1.0:
        input_data = input_data / 255.0

    # 3. CORRECTION : Inversion automatique
    # Si la moyenne est > 0.5, c'est probablement du noir sur blanc (à inverser pour MNIST)
    if input_data.mean() > 0.5:
        input_data = 1.0 - input_data

    # 4. Prédiction
    prediction = model.predict(input_data, verbose=0)
    
    # 5. Extraction des résultats
    predicted_digit = int(np.argmax(prediction[0]))
    confidence = float(np.max(prediction[0]))
    probabilities = prediction[0].tolist()
    
    # 6. Debugging (Pour voir ce qui se passe dans ton terminal)
    print(f"--- Debug Prédiction ---")
    print(f"Moyenne pixels (post-inversion): {input_data.mean():.4f}")
    print(f"Digit prédit: {predicted_digit} ({confidence*100:.2f}%)")
    print(f"Probabilités brutes : {[round(p, 2) for p in probabilities[:10]]}")

    return {
        "predicted_digit": predicted_digit,
        "confidence": confidence,
        "probabilities": probabilities,
    }
