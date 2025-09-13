document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("loginSection");
  const dashboardSection = document.getElementById("dashboardSection");
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const loginError = document.getElementById("loginError");

  const ADMIN_USER = "admin";
  const ADMIN_PASS = "admin123";

  // Check if user is already logged in
  function checkAuth() {
    if (sessionStorage.getItem("isAdmin") === "true") {
      loginSection.classList.add("is-hidden");
      dashboardSection.classList.remove("is-hidden");
      loadLogs();
    } else {
      loginSection.classList.remove("is-hidden");
      dashboardSection.classList.add("is-hidden");
    }
  }

  // Handle login
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      sessionStorage.setItem("isAdmin", "true");
      checkAuth();
    } else {
      loginError.textContent = "Invalid username or password.";
    }
  });

  // Handle logout
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("isAdmin");
    checkAuth();
  });

  function loadLogs() {
    const logs = JSON.parse(localStorage.getItem("chatAdminLog")) || [];
    const tbody = document.getElementById("historyBody");
    tbody.innerHTML = "";

    let total = logs.length;
    let userCount = logs.filter(l => l.sender === "user").length;
    let aiCount = logs.filter(l => l.sender === "ai").length;
    let imgCount = logs.filter(l => l.img).length;

    document.getElementById("totalMessages").textContent = total;
    document.getElementById("userMessages").textContent = userCount;
    document.getElementById("aiMessages").textContent = aiCount;
    document.getElementById("imagesSent").textContent = imgCount;

    if (!logs.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px;">No messages yet.</td></tr>`;
      return;
    }

    logs.reverse().forEach(log => { // Show newest first
      const row = document.createElement("tr");
      const time = log.time; // Directly use the stored time string
      row.innerHTML = `
        <td>${time}</td>
        <td>${log.sender}</td>
        <td>
          ${log.message}
          ${log.img ? `<br><img src="${log.img}" width="100" style="cursor:pointer;" onclick="window.open('${log.img}', '_blank')">` : ""}
        </td>
        <td>${log.voice ? "ON" : "OFF"}</td>
        <td>${log.lang || "-"}</td>
      `;
      tbody.appendChild(row);
    });
  }

  // Search filter
  document.getElementById("searchInput").addEventListener("input", e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll("#historyBody tr").forEach(row => {
      row.style.display = row.innerText.toLowerCase().includes(q) ? "" : "none";
    });
  });

  // Export CSV
  document.getElementById("exportCSV").addEventListener("click", () => {
    const logs = JSON.parse(localStorage.getItem("chatAdminLog")) || [];
    if(logs.length === 0) return;
    let csv = "Time,Sender,Message,Image URL,Voice,Language\n";
    logs.forEach(l => {
        const message = `"${l.message.replace(/"/g, '""')}"`; // Escape double quotes
        csv += `"${new Date(l.time).toISOString()}","${l.sender}",${message},"${l.img || ''}","${l.voice}","${l.lang || ''}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "chat_history.csv";
    a.click();
  });

  // Clear Log
  document.getElementById("clearLogBtn").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all logs? This cannot be undone.")) {
      localStorage.removeItem("chatAdminLog");
      loadLogs();
    }
  });

  // Initial Check
  checkAuth();
  
  // Listen for storage changes from other tabs/windows
  window.addEventListener('storage', (event) => {
    if (event.key === 'chatAdminLog') {
      if (sessionStorage.getItem("isAdmin") === "true") {
        loadLogs();
      }
    }
  });
});
