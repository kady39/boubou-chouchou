const creatures=document.querySelectorAll(".sea-fish,.shark,.orca");
creatures.forEach(c=>c.addEventListener("click",()=>{
  const box=document.getElementById("secretBubble");
  box.textContent=c.dataset.secret;
  box.animate([{opacity:0,transform:"translateY(8px)"},{opacity:1,transform:"none"}],{duration:400});
}));

document.querySelectorAll(".bottle").forEach(b=>b.addEventListener("click",()=>{
  const out=document.getElementById("bottleMessage");
  out.textContent="“"+b.dataset.message+"”";
}));

function setupAnswer(textId,countId,buttonId,statusId,key){
  const text=document.getElementById(textId), count=document.getElementById(countId);
  const button=document.getElementById(buttonId), status=document.getElementById(statusId);
  if(!text)return;
  const old=localStorage.getItem(key);
  if(old) text.value=old;
  const update=()=>count.textContent=`${text.value.length} / 500`;
  text.addEventListener("input",update); update();
  button.addEventListener("click",()=>{
    localStorage.setItem(key,text.value);
    status.textContent=text.value.trim() ? "Saved quietly in this browser ♡" : "Nothing to save yet — take your time.";
  });
}
setupAnswer("oceanAnswer","charCount","saveAnswer","answerSaved","chouchou-ocean-answer-1");
setupAnswer("oceanAnswer2","charCount2","saveAnswer2","answerSaved2","chouchou-ocean-answer-2");