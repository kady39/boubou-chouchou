(() => {
  const cfg = window.CHOUCHOU_CONFIG || {};
  const status = document.getElementById("status");
  const loginStatus = document.getElementById("login-status");
  const loginPanel = document.getElementById("login-panel");
  const dashboard = document.getElementById("dashboard");
  const answersEl = document.getElementById("answers");

  if (!window.supabase || !cfg.supabaseUrl || !cfg.supabasePublishableKey ||
      cfg.supabaseUrl.includes("YOUR-PROJECT-REF")) {
    loginStatus.textContent = "Configure js/config.js first.";
    return;
  }

  const client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabasePublishableKey);

  async function loadAnswers() {
    status.textContent = "Reading the bottles…";
    const { data, error } = await client
      .from("answers")
      .select("id, question_id, question_text, answer, page, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      status.textContent = "Could not load answers: " + error.message;
      return;
    }

    status.textContent = `${data.length} answer${data.length === 1 ? "" : "s"} saved.`;
    answersEl.innerHTML = data.length ? data.map(a => `
      <article class="answer">
        <div class="meta">${new Date(a.created_at).toLocaleString()} · ${escapeHtml(a.question_id)}</div>
        <strong>${escapeHtml(a.question_text)}</strong>
        <div class="answer-text">${escapeHtml(a.answer)}</div>
      </article>
    `).join("") : "<p>No bottles yet. The ocean is still waiting… 🌊</p>";
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
    }[c]));
  }

  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    loginStatus.textContent = "Opening the private log…";
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      loginStatus.textContent = error.message;
      return;
    }
    loginPanel.classList.add("hidden");
    dashboard.classList.remove("hidden");
    await loadAnswers();
  });

  document.getElementById("logout").addEventListener("click", async () => {
    await client.auth.signOut();
    dashboard.classList.add("hidden");
    loginPanel.classList.remove("hidden");
    loginStatus.textContent = "Logged out.";
  });

  client.auth.getSession().then(async ({ data }) => {
    if (data.session) {
      loginPanel.classList.add("hidden");
      dashboard.classList.remove("hidden");
      await loadAnswers();
    }
  });
})();
