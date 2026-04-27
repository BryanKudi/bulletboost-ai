# BulletBoost AI

BulletBoost AI is a full-stack web application that helps users turn rough experience descriptions into polished resume bullet points.

## Features
- Paste raw experience descriptions
- Select a target role category
- Generate polished, resume-ready bullet points
- Copy generated bullets easily

## Tech Stack
- React + Vite
- Tailwind CSS
- Python / Flask
- Anthropic Claude API

## Running locally

### Backend
```bash
cd backend
pip install -r requirements.txt
export ANTHROPIC_API_KEY=your_key_here
python app.py
```
### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173, backend on http://localhost:5000.