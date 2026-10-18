// Anjani Spring Co. — lightweight interaction layer. The hero uses the supplied spring photo, not a procedural CGI spring.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const stage = document.querySelector('#springStage');
const springPhoto = document.querySelector('#realSpringPhoto');
let scrollTarget = 0, scrollCurrent = 0, raf = 0;
function updateSpringTarget(){
  if(!stage || !springPhoto) return;
  const rect = stage.getBoundingClientRect();
  const range = Math.max(window.innerHeight + rect.height, 1);
  scrollTarget = Math.max(0, Math.min(1, (window.innerHeight * .78 - rect.top) / range));
}
function animateSpring(){
  if(!stage || !springPhoto || reduced) return;
  scrollCurrent += (scrollTarget - scrollCurrent) * .08;
  springPhoto.style.setProperty('--spring-rotate', `${(scrollCurrent - .5) * 3}deg`);
  springPhoto.style.setProperty('--spring-y', `${Math.sin(scrollCurrent * Math.PI) * -10}px`);
  springPhoto.style.setProperty('--spring-scale', `${1 + Math.sin(scrollCurrent * Math.PI) * .025}`);
  raf = requestAnimationFrame(animateSpring);
}
window.addEventListener('scroll', updateSpringTarget, {passive:true});
window.addEventListener('resize', updateSpringTarget);
updateSpringTarget();
if(!reduced) animateSpring();
const progress=document.querySelector('#progress');
function updateProgress(){const max=document.documentElement.scrollHeight-window.innerHeight; if(progress) progress.style.width=(max>0?window.scrollY/max*100:0)+'%';}
window.addEventListener('scroll',updateProgress,{passive:true});updateProgress();
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));}
const menuToggle=document.querySelector('#menuToggle'),nav=document.querySelector('#nav');
menuToggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuToggle?.setAttribute('aria-expanded','false');menuToggle?.setAttribute('aria-label','Open navigation');}));
const year=document.querySelector('#year'); if(year) year.textContent=new Date().getFullYear();
const form=document.querySelector('#quoteForm');
form?.addEventListener('submit',e=>{
  e.preventDefault();const d=new FormData(form);
  const subject=encodeURIComponent('Spring enquiry — '+d.get('spring'));
  const body=encodeURIComponent(`Hello Anjani Spring Co.,\n\nI would like to enquire about a spring requirement.\n\nName: ${d.get('name')}\nCompany: ${d.get('company')}\nEmail: ${d.get('email')}\nPhone: ${d.get('phone')||'Not provided'}\nSpring type: ${d.get('spring')}\nEstimated quantity: ${d.get('quantity')||'Not provided'}\nApplication / specifications: ${d.get('details')||'Not provided'}\n\nPlease contact me to discuss feasibility and a quotation.\n`);
  const note=document.querySelector('#formNote');if(note) note.textContent='Your email app should open with the enquiry pre-filled. This demo does not transmit or store form data. Confirm the preferred enquiry email before launch.';
  window.location.href=`mailto:anjanispring2012@gmail.com?subject=${subject}&body=${body}`;
});
