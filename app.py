from flask import Flask, render_template, request, jsonify
import os, base64
from datetime import datetime
import logging

app = Flask(__name__, static_folder="static", template_folder="templates")
logging.basicConfig(level=logging.DEBUG)

os.makedirs("static/memes", exist_ok=True)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/generate_meme", methods=["POST"])
def generate_meme():
    logging.debug("Received /generate_meme request: %s", request.get_json())
    try:
        data = request.get_json()
        mood = data.get("mood", "neutral")

        meme_dict = {
            "happy": "When life gives you smiles, make memes 😂",
            "sad": "Crying inside but still coding 😭",
            "angry": "This bug is personal now 😡",
            "surprised": "Wait… did that just work? 😲",
            "neutral": "Just another day in the matrix 😐"
        }

        meme_text = meme_dict.get(mood, "Default meme line 😎")
        return jsonify({"status": "success", "meme_text": meme_text})
    except Exception as e:
        logging.error("Error in /generate_meme: %s", str(e))
        return jsonify({"status": "error", "message": str(e)})

@app.route("/save_meme", methods=["POST"])
def save_meme():
    try:
        data = request.get_json()
        img_data = base64.b64decode(data["image"].split(",")[1])
        filename = datetime.now().strftime("%Y%m%d_%H%M%S") + ".png"
        filepath = os.path.join("static/memes", filename)

        with open(filepath, "wb") as f:
            f.write(img_data)

        return jsonify({"status": "success", "file": f"/static/memes/{filename}"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

if __name__ == "__main__":
    app.run(debug=True, port=5000)