<<<<<<< HEAD
// ====================== LOGGER ======================
const AdminLog = {
  STORAGE_KEY: "chatAdminLog",

  // Message ko save karo
  logToAdmin: function (message, sender, options = {}) {
    const logs = this.getLogs();

    logs.push({
      id: Date.now(),
      sender: sender,                       // "user" or "ai"
      message: message || "",               // text message
      img: options.img || null,             // if image uploaded
      voice: options.voice || false,        // voice on/off
      lang: options.lang || "en",           // language code
      time: new Date().toLocaleString()     // save current timestamp
    });

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
  },

  // Sabhi logs laao
  getLogs: function () {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  },

  // History clear karo
  clearLogs: function () {
    localStorage.removeItem(this.STORAGE_KEY);
  }
};
=======
// ====================== LOGGER ======================
const AdminLog = {
  STORAGE_KEY: "chatAdminLog",

  // Message ko save karo
  logToAdmin: function (message, sender, options = {}) {
    const logs = this.getLogs();

    logs.push({
      id: Date.now(),
      sender: sender,                       // "user" or "ai"
      message: message || "",               // text message
      img: options.img || null,             // if image uploaded
      voice: options.voice || false,        // voice on/off
      lang: options.lang || "en",           // language code
      time: new Date().toLocaleString()     // save current timestamp
    });

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
  },

  // Sabhi logs laao
  getLogs: function () {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  },

  // History clear karo
  clearLogs: function () {
    localStorage.removeItem(this.STORAGE_KEY);
  }
};
>>>>>>> bddf2dc (Initial commit: chatbot project)
