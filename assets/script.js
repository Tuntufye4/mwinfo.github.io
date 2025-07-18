window.addEventListener("DOMContentLoaded", () => {
  // Show welcome section on load
  showSection('welcome');

  // Splash screen fades out after 3 seconds total
  setTimeout(() => {
    const splash = document.getElementById("splashScreen");
    if (splash) splash.style.display = "none";
  }, 3000);

  // Event delegation for API test buttons
  document.addEventListener("click", async (e) => {
    if (e.target.id === "runBtn") {
      const url = document.getElementById("endpoint").value;
      const resBox = document.getElementById("response");
      if (!resBox) return;
      try {
        resBox.textContent = "Loading...";
        const res = await fetch(url, { mode: 'cors' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const contentType = res.headers.get("content-type") || "";
        const result = contentType.includes("json")
          ? await res.json()
          : await res.text();
        resBox.textContent = typeof result === "object"
          ? JSON.stringify(result, null, 2)
          : result;
      } catch (err) {
        resBox.textContent = "Fetch Error: " + err.message;
      }
    }

    if (e.target.id === "copyBtn") {
      const endpoint = document.getElementById("endpoint");
      if (!endpoint) return;
      try {
        await navigator.clipboard.writeText(endpoint.value);
        alert("Copied!");
      } catch {
        alert("Failed to copy.");
      }
    }
  });

  // Dark mode toggle
  const themeToggle = document.getElementById("themeToggle");
  themeToggle.addEventListener("click", () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      html.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      html.classList.remove("light");
      localStorage.setItem("theme", "dark");
    }
  });

  // Persist theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  } else {
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
  }
});

// Function to load sections dynamically
function showSection(name) {
  const container = document.getElementById("mainContent");
  fetch(`sections/${name}.html`)
    .then((res) => {
      if (!res.ok) throw new Error("Section not found");
      return res.text();
    })
    .then((html) => {
      container.innerHTML = html;
    })
    .catch(() => {
      container.innerHTML = `<p class="text-red-500">Failed to load the section.</p>`;
    });
}
              