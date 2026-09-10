// V3 interactive question bank.
// Answers are submitted to the Supabase Edge Function and stored in the private database.
window.CHOUCHOU_QUESTIONS = [
  {
    id: "underwater-beauty",
    creature: "🐢",
    title: "Something beautiful",
    prompt: "What's the most beautiful thing you've ever seen underwater?",
    placeholder: "I want to know what stayed in your memory…"
  },
  {
    id: "shark-question",
    creature: "🦈",
    title: "Okay… be honest 😭",
    prompt: "If we went diving together and a shark appeared, would you protect me or swim away first?",
    placeholder: "No pressure. I definitely won't judge you. 😂"
  },
  {
    id: "orca-moment",
    creature: "🐋",
    title: "A quiet moment",
    prompt: "We're underwater, everything is silent, and suddenly an orca swims past us. What would you want to do?",
    placeholder: "Describe the moment…"
  },
  {
    id: "understood",
    creature: "🌊",
    title: "The deep question",
    prompt: "What's something you wish people understood about you without you having to explain it?",
    placeholder: "You can be completely honest here."
  },
  {
    id: "dream-dive",
    creature: "🤿",
    title: "Your dream dive",
    prompt: "If money, distance and time didn't matter, where would your dream dive be?",
    placeholder: "A real place or a place from your imagination."
  },
  {
    id: "little-happiness",
    creature: "🐡",
    title: "A tiny happiness",
    prompt: "What's one small thing that can instantly make your day better?",
    placeholder: "A song, a person, food, the sea… anything."
  }
];

window.renderQuestionCards = function(container) {
  if (!container) return;
  container.innerHTML = window.CHOUCHOU_QUESTIONS.map(q => `
    <article class="question-card" data-question-id="${q.id}">
      <div class="question-creature">${q.creature}</div>
      <p class="eyebrow">${q.title}</p>
      <h3>${q.prompt}</h3>
      <textarea maxlength="2000" placeholder="${q.placeholder}" aria-label="${q.prompt}"></textarea>
      <button class="save-answer" type="button">Drop this answer in the bottle ♡</button>
      <div class="answer-status" aria-live="polite"></div>
    </article>
  `).join("");
};
