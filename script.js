document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(e=>io.observe(e));
const b=document.querySelector('.menu-button'),n=document.querySelector('.nav-links');
if(b&&n)b.addEventListener('click',()=>n.classList.toggle('open'));