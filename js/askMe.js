// ........ LLM ChatGpt functionality...........
const questionInput = document.getElementById("question");
const askButton = document.getElementById("ask");
const responseDiv = document.getElementById("response");
let forVoice = " ";

// Initialize Speech Recognition
const mic = document.getElementById("mic");
const muteMic = document.getElementById("muteMic");

let isMuted = true;  // Start with microphone muted

// Check if browser supports SpeechRecognition
let recognition;
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition(); // For Chrome/Edge/Safari
} else if ('SpeechRecognition' in window) {
  recognition = new SpeechRecognition(); // For Firefox
} else {
  alert("Your browser does not support voice recognition.");
}

// Configure the recognition object
recognition.continuous = false;  // Stop recognition after a single input
recognition.lang = 'en-US';  // Set the language
recognition.interimResults = false;  // Show final results only

// Function to start microphone
function startMicrophone() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        console.log("Microphone access granted");
        isMuted = false; // Mic is active
        mic.style.display = "none";
        muteMic.style.display = "inline";
        recognition.start(); // Start SpeechRecognition
      })
      .catch((error) => {
        console.error("Error accessing microphone: ", error);
        alert("Something went wrong with the microphone. Please check permissions.");
        isMuted = true; // Mic remains muted due to error
        mic.style.display = "inline";
        muteMic.style.display = "none";
      });
  } else {
    alert("Your browser does not support microphone access.");
  }
}

// Function to stop microphone
function stopMicrophone() {
  if (!isMuted) {
    recognition.stop(); // Stop SpeechRecognition
    console.log("Microphone is muted");
    isMuted = true; // Update the state
    mic.style.display = "inline"; // Show mic button
    muteMic.style.display = "none"; // Hide mute button
  }
}

// Event listener for microphone activation
mic.addEventListener("click", () => {
  if (isMuted) {
    startMicrophone(); // Start microphone if muted
  }
});

// Event listener for muting microphone
muteMic.addEventListener("click", () => {
  stopMicrophone(); // Stop microphone when mute button is clicked
});

// SpeechRecognition result handling
recognition.onresult = function (event) {
  const speechResult = event.results[0][0].transcript;
  questionInput.value = speechResult; // Display the recognized speech in the input field
  console.log("Recognized Speech: " + speechResult);
  handleAsk(); // Trigger question submission
};

// Handle SpeechRecognition errors
recognition.onerror = function (event) {
  console.error("Speech Recognition Error: ", event.error);
  alert("Something went wrong with speech recognition. Please try again.");
};

// ...........LLM ChatGPT functionality (unchanged)...........
document.addEventListener("DOMContentLoaded", () => {
  let access_token = null;
  let refresh_token = null;
  responseDiv.style.display = "none";
  
  // Function to handle the asking of questions
  const handleAsk = () => {
    const question = questionInput.value;
    if (question) {
      askButton.innerHTML = '<img id="loading-img" src="assets/images/loading2.svg" width="110" height="20" alt="Loading" />';
      setResponse('Please wait! Response is coming....');
      setIsLoading(true);

      const headers = {
        'Content-Type': 'application/json',
      };
      const api_url = "https://awesome-terra-400014.lm.r.appspot.com/chat/";  // API endpoint
      const data = { "user_input": question };

      fetch(api_url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((result) => {
          forVoice = result.chatbot_response;
          setResponse(result.chatbot_response);
          setIsLoading(false);
        })
        .catch((error) => {
          responseDiv.textContent = "Request failed with an error.";
          setIsLoading(false);
          setResponse('Something went wrong. Please try again');
        });
    }
  };

  const setResponse = (text) => {
    responseDiv.style.display = "block";
    responseDiv.innerHTML = text;
    showClearButton();  // Ensure the button is displayed after the response
  };

  const setIsLoading = (isLoading) => {
    askButton.disabled = isLoading;
    askButton.innerHTML = isLoading ? 'Loading...' : 'Ask';
  };

  askButton.onclick = handleAsk;
  
  // Function to show the Clear Response button
  const showClearButton = () => {
    const clearResponseButton = document.getElementById('clearResponse');
    clearResponseButton.style.display = 'block';  // Always show the button
  };

  /* Clear Response function */
  document.getElementById('clearResponse').addEventListener('click', function() {
    document.getElementById('response').innerHTML = ''; // Clears the content of the response div
    // Clear Response button stays visible
    // No need to hide it after clearing
  });
});

