document.getElementById("ask").addEventListener("click", () => {
  const question = document.getElementById("question").value.trim();
  const responseDiv = document.getElementById("response");
  const loadingImage = document.getElementById("loading-image");
  const askButton = document.getElementById("ask");

  if (question) {
    responseDiv.textContent = ""; 
    loadingImage.style.display = "block"; 
    askButton.disabled = true; // Disable button while processing

    setTimeout(() => {
      loadingImage.style.display = "none"; 
      responseDiv.innerHTML = `<div class="chatbot-response">Chatbot says: "${question}"</div>`;
      askButton.disabled = false; // Re-enable button
    }, 1500);
  } else {
    alert("Please enter a question!");
  }
});

// Microphone toggle
const mic = document.getElementById("mic");
const muteMic = document.getElementById("muteMic");

mic.addEventListener("click", () => {
  mic.style.display = "none";
  muteMic.style.display = "inline";
  console.log("Microphone activated");
});

muteMic.addEventListener("click", () => {
  muteMic.style.display = "none";
  mic.style.display = "inline";
  console.log("Microphone muted");
});

// Optional: Add SpeechRecognition logic here if needed
