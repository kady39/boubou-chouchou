/*
  IMPORTANT:
  Change TALKING_START to the exact date/time when you started talking.
  Example: new Date("2026-04-20T21:30:00")
*/
const TALKING_START = new Date("2026-07-29T00:00:00"); // <-- EDIT ME

function updateCounter(){
  const diff=Math.max(0,Date.now()-TALKING_START.getTime());
  const total=Math.floor(diff/1000);
  const days=Math.floor(total/86400);
  const hours=Math.floor(total%86400/3600);
  const minutes=Math.floor(total%3600/60);
  const seconds=total%60;
  const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=String(val).padStart(2,"0")};
  const d=document.getElementById("days"); if(d)d.textContent=days.toLocaleString();
  set("hours",hours);set("minutes",minutes);set("seconds",seconds);
}
updateCounter();setInterval(updateCounter,1000);