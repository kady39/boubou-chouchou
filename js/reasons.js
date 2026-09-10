/*
  Replace these with your real reasons.
  Keep them specific to HIM. That's what will make this page special.
*/
const reasons=[
"Because you make ordinary conversations feel special.",
"Because I love the way you talk about the things you care about.",
"Because your little reactions make me smile.",
"Because you have a softness you don't always notice.",
"Because you make me curious about your world.",
"Because I remember the little things you tell me.",
"Because you are unapologetically you.",
"Because talking to you can change the mood of my whole day.",
"Because I like hearing your voice.",
"Because your sense of humor gets me.",
"Because you make me want to know you more deeply.",
"Because I love your random little messages.",
"Because the sea makes me think of you.",
"Because I want to hear all your diving stories.",
"Because I like discovering your favorite things.",
"Because you somehow became part of my routine.",
"Because you make distance feel a little smaller.",
"Because you give me reasons to look forward to tomorrow.",
"Because I notice when you are happy.",
"Because I notice when something is bothering you.",
"Because your dreams matter to me.",
"Because I like imagining future adventures with you.",
"Because you can make me laugh without trying.",
"Because you are one of the people I genuinely want to keep.",
"Because you make me appreciate small moments.",
"Because I feel lucky that our paths crossed.",
"Because there are still so many things I want to discover about you.",
"Because you make me excited about memories we haven't made yet.",
"Because 'Chouchou' somehow became your name in my heart.",
"Because you are you — and that's enough.",
];

const grid=document.getElementById("reasonsGrid");
if(grid){
 reasons.forEach((reason,i)=>{
  const card=document.createElement("article");card.className="reason-card locked";
  card.innerHTML=`<span class="num">REASON ${String(i+1).padStart(2,"0")}</span><p>${reason}</p><span class="fish-icon">${["🐟","🐠","🐡"][i%3]}</span>`;
  card.addEventListener("click",()=>card.classList.toggle("unlocked"));
  grid.appendChild(card);
 });
}
const unlock=document.getElementById("reveal30"), final=document.getElementById("finalReason"), chest=document.getElementById("chest");
if(unlock)unlock.addEventListener("click",()=>{final.classList.remove("hidden");unlock.textContent="Unlocked ♡";chest.textContent="💖";unlock.disabled=true});