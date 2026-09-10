(() => {
  const cfg = window.CHOUCHOU_CONFIG || {};
  const questions = window.CHOUCHOU_QUESTIONS || [];

  async function submitAnswer(questionId, answer, card) {
    const status = card.querySelector(".answer-status");
    const button = card.querySelector(".save-answer");

    if (!cfg.supabaseUrl || cfg.supabaseUrl.includes("YOUR-PROJECT-REF") ||
        !cfg.supabasePublishableKey || cfg.supabasePublishableKey.includes("YOUR_SUPABASE")) {
      status.textContent = "The little time capsule isn't connected yet. (Admin setup needed.)";
      return;
    }

    if (!answer.trim()) {
      status.textContent = "Write something first, little diver 🌊";
      return;
    }

    button.disabled = true;
    status.textContent = "Sending your answer into the bottle…";

    const q = questions.find(x => x.id === questionId);
    try {
      const res = await fetch(`${cfg.supabaseUrl}/functions/v1/${cfg.submitFunctionName || "submit-answer"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": cfg.supabasePublishableKey,
          "Authorization": `Bearer ${cfg.supabasePublishableKey}`
        },
        body: JSON.stringify({
          question_id: questionId,
          question_text: q?.prompt || questionId,
          answer: answer.trim(),
          page: location.pathname
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Unable to save answer.");

      status.textContent = "Saved in our little time capsule ♡";
      button.textContent = "Saved ✓";
      const textarea = card.querySelector("textarea");
      textarea.value = "";
      textarea.disabled = true;
    } catch (err) {
      console.error(err);
      status.textContent = "It didn't reach the ocean yet. Please try again.";
      button.disabled = false;
    }
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".save-answer");
    if (!button) return;
    const card = button.closest(".question-card");
    const textarea = card.querySelector("textarea");
    submitAnswer(card.dataset.questionId, textarea.value, card);
  });
})();
