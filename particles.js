const canvas=document.getElementById("particleCanvas");
const ctx=canvas.getContext("2d");
canvas.width=window.innerWidth; canvas.height=window.innerHeight;
const particles=[]; const particleCount=80;
function random(min,max){return Math.random()*(max-min)+min;}
class Particle{
  constructor(){ this.x=random(0,canvas.width); this.y=random(0,canvas.height); this.radius=random(2,5); this.speedX=random(-0.5,0.5); this.speedY=random(-0.5,0.5); this.color=`rgba(255,255,255,${random(0.3,0.8)})`; }
  update(){ this.x+=this.speedX; this.y+=this.speedY; if(this.x<0||this.x>canvas.width)this.speedX*=-1; if(this.y<0||this.y>canvas.height)this.speedY*=-1; }
  draw(){ ctx.beginPath(); ctx.arc(this.x,this.y,this.radius,0,Math.PI*2); ctx.fillStyle=this.color; ctx.fill(); }
}
for(let i=0;i<particleCount;i++){particles.push(new Particle());}
function animateParticles(){ ctx.clearRect(0,0,canvas.width,canvas.height); particles.forEach(p=>{p.update();p.draw();}); requestAnimationFrame(animateParticles);}
animateParticles();
window.addEventListener("resize",()=>{ canvas.width=window.innerWidth; canvas.height=window.innerHeight; });
