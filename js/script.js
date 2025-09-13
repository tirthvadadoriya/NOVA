// ====================== script.js (final with Function Calling) ======================

// ---------------------- safety-fallbacks ----------------------
// The sentiment library is now loaded locally and provides a global analyzeSentiment function.
// No fallback needed here as the function is expected to be available.

// Note: logger.js should define AdminLog. If not loaded for some reason,
// we will fail early in console — preferred fix is to load logger.js BEFORE this file.

// ---------------------- VARIABLES ----------------------
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const messagesContainer = document.getElementById("messages");
const imgBtn = document.getElementById("imgBtn");
const imgUpload = document.getElementById("imageUpload");
const langSelect = document.getElementById("langSelect");
const voiceToggle = document.getElementById("voiceToggle");
const micBtn = document.getElementById("micBtn");
const micWave = document.getElementById("micWave");
const liveTranscript = document.getElementById("liveTranscript");
const splash = document.getElementById("splash");
const chatApp = document.getElementById("chatApp");

let uploadedImage = null;
let isVoiceOn = true;
let USER_LOGO = "images/user.png"; // Default user avatar

// ---------------------- NOTIFICATION ----------------------
function showNotification(text) {
  const bar = document.getElementById("notificationBar");
  if (!bar) return;
  bar.innerText = text;
  bar.classList.remove("is-hidden");
  setTimeout(() => { bar.classList.add("is-hidden"); }, 5000);
}

// ---------------------- SENTIMENT ----------------------
// The analyzeSentiment function is now provided by js/sentiment.min.js
// function analyzeSentiment(message) { ... } is now external

// ---------------------- UTIL ----------------------
function scrollToBottom() {
  if (!messagesContainer) return;
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ---------------------- MESSAGES ----------------------
function addMessage(content, sender, img = null) {
  if (!messagesContainer) return;
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender + "-message");

  const avatar = document.createElement("img");
  avatar.className = "avatar";
  avatar.src = sender === "ai" ? "images/NOVA AI.png" : USER_LOGO;
  if (sender === "ai") msgDiv.appendChild(avatar);

  const bubble = document.createElement("div");
  bubble.classList.add("message-bubble", sender + "-bubble");
  
  if (content) {
      bubble.innerHTML = content;
  }

  if (img && sender === "user") {
    const image = document.createElement("img");
    image.src = img;
    image.style.maxWidth = "120px";
    image.style.display = "block";
    image.style.marginTop = "8px";
    bubble.appendChild(image);
  }

  msgDiv.appendChild(bubble);
  if (sender === "user") msgDiv.appendChild(avatar);

  messagesContainer.appendChild(msgDiv);
  scrollToBottom();
}

// ---------------------- TYPING INDICATOR ----------------------
function showTypingIndicator() {
  if (!messagesContainer) return;
  const typingDiv = document.createElement("div");
  typingDiv.classList.add("message", "ai-message");
  typingDiv.id = "typingIndicator";
  typingDiv.innerHTML = `
    <img class="avatar" src="images/NOVA AI.png" alt="AI">
    <div class="message-bubble ai-bubble typing">
      <span>AI is typing</span>
      <div class="dots"><span></span><span></span><span></span></div>
    </div>`;
  messagesContainer.appendChild(typingDiv);
  scrollToBottom();
}
function removeTypingIndicator() {
  const t = document.getElementById("typingIndicator");
  if (t) t.remove();
}

// ---------------------- VOICE (TTS) ----------------------
function speakText(text) {
  if (!isVoiceOn || !("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  const langMap = { "en-US":"en-US", "hi-IN":"hi-IN", "gu-IN":"gu-IN" };
  utter.lang = langMap[langSelect.value] || "en-US";
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

// ---------------------- TYPEWRITER EFFECT ----------------------
async function typeWriterEffect(text) {
  return new Promise((resolve) => {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", "ai-message");
    const avatar = document.createElement("img");
    avatar.className = "avatar";
    avatar.src = "images/NOVA AI.png";
    msgDiv.appendChild(avatar);
    const bubble = document.createElement("div");
    bubble.classList.add("message-bubble", "ai-bubble");
    msgDiv.appendChild(bubble);
    messagesContainer.appendChild(msgDiv);
    let i = 0;
    (function typing() {
      if (i < (text || "").length) {
        bubble.innerText += text.charAt(i++);
        scrollToBottom();
        setTimeout(typing, 5);
      } else {
        speakText(text);
        resolve();
      }
    })();
  });
}

// ---------------------- TRANSLATION ----------------------
async function translateText(text, targetLang, sourceLang = "auto") {
  if (!text) return "";
  try {
    const resp = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang.split("-")[0],
        format: "text"
      })
    });
    const data = await resp.json();
    return data?.translatedText || text;
  } catch (e) {
    console.warn("Translation error:", e);
    showNotification("⚠️ Translation service failed.");
    return text;
  }
}

// ---------------------- WEATHER FUNCTION ----------------------
async function getWeather(city) {
  try {
    const response = await fetch('/api/weather', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city })
    });
    if (!response.ok) {
      throw new Error('City not found.');
    }
    const data = await response.json();
    displayWeatherCard(data);
  } catch (error) {
    addMessage(`😥 Sorry, I couldn't get the weather for ${city}. Please check the city name.`, "ai");
    console.error("Weather API error:", error);
  }
}

function displayWeatherCard(data) {
    const { name, main, weather, wind } = data;
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    const cardHTML = `
        <div class="weather-card">
            <div class="header">
                <h3>${name}</h3>
                <img src="${iconUrl}" alt="${weather[0].description}">
            </div>
            <div class="temp">${Math.round(main.temp)}°C</div>
            <div class="details">
                <strong>${weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1)}</strong><br>
                Feels like: ${Math.round(main.feels_like)}°C<br>
                Humidity: ${main.humidity}%<br>
                Wind: ${wind.speed} m/s
            </div>
        </div>
    `;
    addMessage(cardHTML, "ai");
    speakText(`The current weather in ${name} is ${Math.round(main.temp)} degrees Celsius with ${weather[0].description}.`);
}

// ---------------------- GEMINI API CALL ----------------------
async function sendMessageToGemini(text, img) {
  try {
    const parts = [{ text }];
    if (img) {
      parts.push({ inline_data: { mime_type: "image/png", data: img.split(",")[1] } });
    }
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts }] })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error && errorData.error.includes('API key not configured')) {
        return "⚠️ Chat functionality is not available. Please configure the Gemini API key in your environment variables.";
      }
      return `⚠️ API Error: ${errorData.error || 'Unknown error'}`;
    }
    
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No reply from model.";
  } catch (err) {
    return "⚠️ Network Error: " + err.message;
  }
}

// ---------------------- MAIN SEND LOGIC ----------------------
async function handleSend() {
  const text = (userInput?.value || "").trim();
  const selectedLang = langSelect.value || "en-US";
  if (!text && !uploadedImage) return;

  addMessage(text || "📷 Image sent", "user", uploadedImage);

  if (text) {
    const mood = analyzeSentiment(text);
    if (mood.sentiment === "negative") {
      showNotification("😟 You seem upset. Do you want to connect with a human?");
    }
  }
  
  try {
    if (typeof AdminLog !== "undefined") {
      AdminLog.logToAdmin(text || "📷 Image sent", "user", { lang: selectedLang });
    }
  } catch (e) { console.warn("AdminLog failed:", e); }

  if (userInput) userInput.value = "";
  
  const lowerCaseText = text.toLowerCase();
  if ((lowerCaseText.includes("weather in") || lowerCaseText.startsWith("weather of") || lowerCaseText.includes("weather for"))) {
      const city = text.split(/in |of |for /i)[1]?.trim();
      if (city) {
          showTypingIndicator();
          await getWeather(city);
          removeTypingIndicator();
          uploadedImage = null;
          return;
      }
  }

  showTypingIndicator();

  let textForModel = text;
  if (text && selectedLang !== 'en-US') {
      textForModel = await translateText(text, 'en');
  }

  let reply = await sendMessageToGemini(textForModel, uploadedImage);

  if (reply && selectedLang !== 'en-US') {
      reply = await translateText(reply, selectedLang, 'en');
  }
  
  removeTypingIndicator();

  await typeWriterEffect(reply);

  try {
    if (typeof AdminLog !== "undefined") {
      AdminLog.logToAdmin(reply, "ai", { lang: selectedLang });
    }
  } catch (e) { console.warn("AdminLog save failed:", e); }

  uploadedImage = null;
}

// ---------------------- EVENT LISTENERS ----------------------
sendBtn?.addEventListener("click", handleSend);
userInput?.addEventListener("keypress", (e) => { if (e.key === "Enter") handleSend(); });
imgBtn?.addEventListener("click", () => imgUpload?.click());
imgUpload?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      uploadedImage = reader.result;
      addMessage("Image ready to send. Add a caption or press send.", "ai");
    };
    reader.readAsDataURL(file);
  }
});

voiceToggle?.addEventListener("click", () => {
  isVoiceOn = !isVoiceOn;
  voiceToggle.querySelector(".material-icons").innerText = isVoiceOn ? "volume_up" : "volume_off";
  voiceToggle.classList.toggle("off", !isVoiceOn);
});

// ---------------------- Speech to Text ----------------------
let recognition;
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    micBtn.classList.add("active");
    micWave.classList.add("active");
    liveTranscript.innerHTML = `🎙️ Listening...`;
  };

  recognition.onend = () => {
    micBtn.classList.remove("active");
    micWave.classList.remove("active");
    setTimeout(() => (liveTranscript.textContent = ""), 500);
  };

  recognition.onresult = (event) => {
    let interimTranscript = "";
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const t = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalTranscript += t + " ";
      else interimTranscript += t;
    }

    if (interimTranscript) {
      liveTranscript.textContent = "🎙️ " + interimTranscript;
    }

    if (finalTranscript.trim()) {
      userInput.value = finalTranscript.trim();
      handleSend();
      liveTranscript.textContent = "";
    }
  };
} else {
  console.warn("Speech Recognition not supported in this browser.");
}

micBtn?.addEventListener("click", () => {
    if (recognition) {
        recognition.lang = langSelect.value || 'en-US';
        recognition.start();
    }
    else alert("⚠️ Your browser does not support Speech Recognition");
});

// ---------------------- Theme toggle ----------------------
const themeToggle = document.getElementById("themeToggle");
themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  const isLight = document.body.classList.contains("light-theme");
  themeToggle.querySelector(".material-icons").innerText = isLight ? "dark_mode" : "brightness_4";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});
window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    if (themeToggle) themeToggle.querySelector(".material-icons").innerText = "dark_mode";
  }
});

// ---------------------- Google login helpers ----------------------
function decodeJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
  return JSON.parse(
    decodeURIComponent(
      atob(padded)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
  );
}
async function initGoogle() {
  if (!window.google?.accounts?.id) {
    console.warn('Google Identity Services not loaded. Showing fallback login button.');
    showFallbackLoginButton();
    return;
  }
  
  try {
    // Fetch configuration from server
    const response = await fetch('/api/config');
    const config = await response.json();
    
    // Check if we have a valid client ID
    if (config.isGoogleAuthEnabled) {
      google.accounts.id.initialize({
        client_id: config.googleClientId,
        callback: handleCredentialResponse,
        auto_select: false
      });
      google.accounts.id.renderButton(
        document.getElementById("googleSignIn"),
        { theme: "outline", size: "medium", shape: "pill", width: "200" }
      );
    } else {
      showFallbackLoginButton();
    }
    
    // Show warning if API keys are not configured
    if (!config.hasGeminiKey) {
      showNotification("⚠️ Gemini API key not configured. Chat functionality will be limited.");
    }
    if (!config.hasWeatherKey) {
      showNotification("⚠️ Weather API key not configured. Weather queries will not work.");
    }
  } catch (error) {
    console.error('Failed to load configuration:', error);
    showFallbackLoginButton();
  }
}

function showFallbackLoginButton() {
  const googleSignInDiv = document.getElementById("googleSignIn");
  if (!googleSignInDiv) return;
  
  googleSignInDiv.innerHTML = `
    <button class="fallback-login-btn" onclick="handleFallbackLogin()">
      <i class="material-icons" style="font-size: 18px;">login</i>
      Sign In
    </button>
  `;
}

function handleFallbackLogin() {
  showNotification("🔧 Google OAuth is not configured. Please set up your Google OAuth Client ID in the .env file. See OAUTH_SETUP.md for instructions.");
  
  // For demo purposes, simulate a login
  const demoUser = {
    name: "Demo User",
    email: "demo@example.com",
    picture: "images/user.png"
  };
  
  document.getElementById("status").textContent = `Hi, ${demoUser.name}`;
  USER_LOGO = demoUser.picture;
  document.getElementById("googleSignIn").classList.add("is-hidden");
  document.getElementById("logoutBtn").classList.remove("is-hidden");
  localStorage.setItem("googleUser", JSON.stringify(demoUser));
  addMessage(`Welcome ${demoUser.name}! 👋 (Demo Mode)`, "ai");
}
function handleCredentialResponse(response) {
  const user = decodeJwt(response.credential);
  if (!user) return;
  document.getElementById("status").textContent = `Hi, ${user.name}`;
  USER_LOGO = user.picture || USER_LOGO;
  document.getElementById("googleSignIn").classList.add("is-hidden");
  document.getElementById("logoutBtn").classList.remove("is-hidden");
  localStorage.setItem("googleUser", JSON.stringify(user));
  addMessage(`Welcome ${user.name}! 👋`, "ai");
}
function restoreGoogleUser() {
  const raw = localStorage.getItem("googleUser");
  if (!raw) return;
  try {
    const user = JSON.parse(raw);
    document.getElementById("status").textContent = `Hi, ${user.name}`;
    USER_LOGO = user.picture || USER_LOGO;
    document.getElementById("googleSignIn").classList.add("is-hidden");
    document.getElementById("logoutBtn").classList.remove("is-hidden");
  } catch (e) { console.warn(e); }
}

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("googleUser");
  document.getElementById("status").textContent = "Online";
  USER_LOGO = "images/user.png";
  document.getElementById("logoutBtn").classList.add("is-hidden");
  document.getElementById("googleSignIn").classList.remove("is-hidden");
  try { google.accounts.id.disableAutoSelect(); } catch(e){}
});

// ---------------------- Splash behaviour ----------------------
window.addEventListener("load", () => {
  setTimeout(() => {
    if (splash) {
      splash.classList.add("is-hidden");
      if (chatApp) chatApp.classList.remove("is-hidden");
      restoreGoogleUser();
      initGoogle();
    } else {
      if (chatApp) chatApp.classList.remove("is-hidden");
      restoreGoogleUser();
      initGoogle();
    }
  }, 1200);
});

// ---------------------- UI Effects ----------------------
function createRipple(event) {
  const button = event.currentTarget;

  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
  circle.classList.add("ripple");

  const ripple = button.getElementsByClassName("ripple")[0];

  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);
}

const buttons = document.getElementsByTagName("button");
for (const button of buttons) {
  button.addEventListener("click", createRipple);
}