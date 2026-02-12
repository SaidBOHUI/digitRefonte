import numpy as np
import os

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

from tensorflow import keras

_model = None


def load_model(model_path: str):
    global _model
    _model = keras.models.load_model(model_path)
    print(f"Model loaded from {model_path}")
    print(f"Model input shape: {_model.input_shape}")
    print(f"Model output shape: {_model.output_shape}")


def predict_digit(pixels: list[float]) -> dict:
    if _model is None:
        raise RuntimeError("Model not loaded")

    # Reshape to (1, 784) for MLP and normalize to [0, 1]
    input_data = np.array(pixels, dtype=np.float32).reshape(1, 784)
    input_data = input_data / 255.0 if input_data.max() > 1.0 else input_data

    predictions = _model.predict(input_data, verbose=0)
    probabilities = predictions[0].tolist()
    predicted_digit = int(np.argmax(probabilities))
    confidence = float(probabilities[predicted_digit])

    return {
        "predicted_digit": predicted_digit,
        "confidence": confidence,
        "probabilities": probabilities,
    }
