from flask import Flask, render_template, request, jsonify, send_from_directory
import os, base64
from datetime import datetime

app = Flask(__name__, static_folder="static", template_folder="templates")

# Ensure memes folder exists
os.makedirs("static/memes", exist_ok=True)

# Home route
@app.route("/")
def index():
    return render_template("index.html")

# Favicon route
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, 'static'),
        'favicon.ico',
        mimetype='image/vnd.microsoft.icon'
    )

# Save meme route
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
    print("🚀 Starting Flask on port 5001...")
    app.run(host="0.0.0.0", port=5001, debug=True, use_reloader=False)
