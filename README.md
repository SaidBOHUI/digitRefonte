# Digit Recognition

Application web de reconnaissance de chiffres manuscrits utilisant un réseau de neurones Keras.

## Architecture

```
frontend/   → React + Vite + Material UI (servi par nginx)
backend/    → FastAPI + TensorFlow + SQLAlchemy (async)
database    → PostgreSQL (déployé séparément sur Coolify)
```

## Développement local

### Prérequis

- Docker & Docker Compose
- Ton modèle `model.h5` placé dans `backend/model/`

### Lancer le projet

```bash
docker compose up --build
```

- Frontend : http://localhost
- Backend (API docs) : http://localhost:8000/docs
- PostgreSQL : localhost:5432

### Sans Docker

**Backend :**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend :**
```bash
cd frontend
npm install
npm run dev
```

## Déploiement sur Coolify

1. **PostgreSQL** : Créer un service PostgreSQL dans Coolify. Noter l'URL de connexion.

2. **Backend** : Déployer depuis GitHub.
   - Docker Build Pack
   - Dockerfile path : `backend/Dockerfile`
   - Variables d'environnement :
     - `DATABASE_URL` = l'URL PostgreSQL de Coolify
     - `MODEL_PATH` = `model/model.h5`
     - `CORS_ORIGINS` = `["https://ton-domaine.com"]`

3. **Frontend** : Déployer depuis GitHub.
   - Docker Build Pack
   - Dockerfile path : `frontend/Dockerfile`
   - Build arg : `VITE_API_URL` = `https://api.ton-domaine.com/api`

## API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/predict` | Prédire un chiffre (envoyer 784 pixels) |
| GET | `/api/drawings` | Lister tous les dessins |
| GET | `/api/drawings/:id` | Récupérer un dessin |
| DELETE | `/api/drawings/:id` | Supprimer un dessin |
| GET | `/health` | Health check |
| GET | `/docs` | Documentation Swagger |
