document.addEventListener("DOMContentLoaded",()=>{
  const toggle=document.querySelector(".nav-toggle"), nav=document.querySelector(".nav nav");
  if(toggle) toggle.addEventListener("click",()=>nav.classList.toggle("open"));
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});
  document.querySelectorAll(".reveal").forEach(el=>obs.observe(el));
  const bubbles=document.getElementById("bubbles");
  if(bubbles){for(let i=0;i<18;i++){const b=document.createElement("span");b.textContent="";b.className="ambient-bubble";b.style.left=Math.random()*100+"%";b.style.animationDelay=(-Math.random()*8)+"s";bubbles.appendChild(b)}}
});