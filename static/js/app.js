document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  const video = document.getElementById("webcam");
  const canvas = document.getElementById("canvas");
  const context = canvas?.getContext("2d");
  const generateBtn = document.getElementById("generateBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const saveBtn = document.getElementById("saveBtn");

  if (!video || !canvas || !context || !generateBtn || !downloadBtn || !saveBtn) {
    console.error("Missing elements:", {
      video: !!video,
      canvas: !!canvas,
      context: !!context,
      generateBtn: !!generateBtn,
      downloadBtn: !!downloadBtn,
      saveBtn: !!saveBtn
    });
    return;
  }

  console.log("All elements found:", { generateBtn, downloadBtn, saveBtn });

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
      console.log("Camera stream started");
    })
    .catch(err => console.error("Camera error:", err));

  document.getElementById("capture").addEventListener("click", () => {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.classList.remove("d-none");
    console.log("Capture button clicked");
  });

  generateBtn.addEventListener("click", async () => {
    console.log("Generate button clicked");
    const imageData = canvas.toDataURL("image/png");
    const mood = ["happy", "sad", "angry", "surprised", "neutral"][Math.floor(Math.random() * 5)];

    try {
      const res = await fetch("/generate_meme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Fetch result:", data);

      if (data.status === "success") {
        document.getElementById("memeArea").innerHTML = `
          <div class="card bg-light text-dark p-3">
            <img src="${imageData}" class="img-fluid rounded mb-3"/>
            <h4 class="fw-bold">${data.meme_text}</h4>
          </div>
        `;
        downloadBtn.classList.remove("hidden");
        saveBtn.classList.remove("hidden");
        window.lastMeme = imageData;
      } else {
        console.error("Backend error:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  });

  downloadBtn.addEventListener("click", () => {
    console.log("Download button clicked");
    const a = document.createElement("a");
    a.href = window.lastMeme;
    a.download = "meme.png";
    a.click();
  });

  saveBtn.addEventListener("click", async () => {
    console.log("Save button clicked");
    const res = await fetch("/save_meme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: window.lastMeme })
    });
    const data = await res.json();
    if (data.status === "success") {
      alert("Meme saved at: " + data.file);
    } else {
      alert("Error: " + data.message);
    }
  });
});