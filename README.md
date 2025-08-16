# AI Mood-to-Meme Generator 🎭

Detects your facial expression → Generates a mood-based meme instantly.

## Features
- Webcam face capture
- Hugging Face `vit-face-expression` model via Transformers.js (free, local, no API key)
- Randomized meme punchlines per mood
- Bootstrap + Animate.css UI
- Download or save memes (Flask backend saves under `static/memes/`)

## Setup

```bash
# 1. Clone / unzip
cd mood_to_meme_fullstack

# 2. Create venv
python -m venv .venv
.\.venv\Scripts\activate   # (Windows)
source .venv/bin/activate  # (Linux/Mac)

# 3. Install dependencies
pip install flask

# 4. Run backend
python app.py
