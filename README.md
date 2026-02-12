# Digit Recognition

Application web de reconnaissance de chiffres manuscrits utilisant un réseau de neurones Keras.

## Architecture

```
frontend/   → React + Vite + Tailwind CSS (servi par nginx)
backend/    → FastAPI + TensorFlow + SQLAlchemy (async)
database    → PostgreSQL (déployé séparément sur Coolify)
```

## Développement local

### Prérequis

- Docker & Docker Compose (ou Python 3.11+ et Node.js 20+)
- Ton modèle `model.h5` placé dans `backend/model/`

### Sans Docker

**Backend :**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Lance PostgreSQL localement
docker run -d --name digit-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=digit_recognition \
  -p 5432:5432 \
  postgres:16-alpine

# Crée un .env
cp .env.example .env

uvicorn app.main:app --reload --port 8000
```

**Frontend :**
```bash
cd frontend
npm install
npm run dev
```

- Frontend : http://localhost:5173
- Backend (API docs) : http://localhost:8000/docs

## Déploiement sur Coolify

### 1. PostgreSQL
Créer un service PostgreSQL dans Coolify (menu Databases).

### 2. Service Docker Compose
Déployer depuis GitHub avec Build Pack **Docker Compose**.

**Domaines :**
- backend → `https://api.sbohui.fr`
- frontend → `https://digiteye.sbohui.fr`

**Variables d'environnement :**
```
DATABASE_URL=postgresql+asyncpg://postgres:PASSWORD@HOSTNAME:5432/postgres
```

### 3. Modèle
Le fichier `model.h5` doit être dans `backend/model/`.

## API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/predict` | Prédire un chiffre (envoyer 784 pixels) |
| GET | `/api/drawings` | Lister tous les dessins |
| GET | `/api/drawings/:id` | Récupérer un dessin |
| DELETE | `/api/drawings/:id` | Supprimer un dessin |
| GET | `/health` | Health check |
| GET | `/docs` | Documentation Swagger |
