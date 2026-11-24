const PASSWORD="NAVIDAD23";
const canvas=document.getElementById("game"),ctx=canvas.getContext("2d");
const $=id=>document.getElementById(id);
const avatar=new Image();avatar.src="mini_yo.png";
let scene="start",world=0,coins=0,lives=3,paused=false,raf=0,last=0,camera=0,keys={},touch={left:false,right:false};
const TILE=48,GRAVITY=1900;
const worlds=[
 {name:"El pueblo nevado",sky:"#9bd7f2",ground:"#eaf7ff",top:"#83b7a5",platform:"#8b6c58",length:3000,stars:[420,1050,1790],hazards:[850,1450,2240],question:"¿Dónde nos vimos por primera vez?",answer:"Cádiz, en la puerta del hotel",morse:false},
 {name:"El bosque encantado",sky:"#91c7d7",ground:"#e5f2e7",top:"#578b70",platform:"#6e594a",length:3300,stars:[600,1320,2400],hazards:[980,1870,2700],question:"¿De qué color son los ojos de Carlos?",answer:"Verdes",morse:false},
 {name:"El reino de los dulces",sky:"#f5c5d5",ground:"#fff0e8",top:"#c77c91",platform:"#98715f",length:3400,stars:[700,1600,2650],hazards:[1100,2100,2900],question:"¿Qué dulces caseros pensé en preparar para Carlos?",answer:"Brownies y galletas",morse:false},
 {name:"La montaña de los secretos",sky:"#879fcb",ground:"#e7edff",top:"#8798b8",platform:"#6b6686",length:3600,stars:[520,1450,2850],hazards:[900,1900,3100],question:"Descifra la palabra secreta",answer:"AMORSIIIN",morse:true},
 {name:"El castillo helado",sky:"#9eb8e6",ground:"#f8f6ff",top:"#a5a0c9",platform:"#77718f",length:3900,stars:[850,1900,3100],hazards:[1250,2400,3300],question:"¿Qué frase quería que dijera el osito de voz?",answer:"Te quiero mucho Carlos",morse:false}
];
let player, platforms, starItems, hazards, exit, worldDone, checkpoint=0;
function buildWorld(){
 const w=worlds[world];camera=0;worldDone=false;
 player={x:70,y:300,w:34,h:48,vx:0,vy:0,onGround:false,face:1,inv:0};
 platforms=[{x:0,y:460,w:w.length,h:100},{x:240,y:365,w:150,h:22},{x:520,y:310,w:160,h:22},{x:780,y:390,w:170,h:22},{x:1110,y:330,w:180,h:22},{x:1430,y:270,w:160,h:22},{x:1740,y:385,w:180,h:22},{x:2050,y:320,w:180,h:22},{x:2390,y:260,w:190,h:22},{x:2730,y:370,w:180,h:22},{x:3050,y:310,w:180,h:22}];
 starItems=w.stars.map(x=>({x,y:platforms.find(p=>x>=p.x&&x<=p.x+p.w)?.y-35||405,taken:false}));
 hazards=w.hazards.map(x=>({x,y:412,w:38,h:48,phase:Math.random()*6}));
 exit={x:w.length-130,y:365,w:54,h:95};
 $("worldLabel").textContent=`MUNDO ${world+1} · ${w.name.toUpperCase()}`;
 $("stageName").textContent=`MUNDO ${world+1} / 5`; $("stageTitle").textContent=w.name;
 $("starCount").textContent=`⭐ 0/3`; $("lifeCount").textContent="♥ ".repeat(lives);
 $("hint").textContent="Recoge las 3 estrellas y llega a la puerta. ¡Cuidado con los obstáculos!";
 $("message").classList.add("hidden");
}
function showScreen(id){["startScreen","gameScreen","overlayScreen","endScreen"].forEach(s=>$(s).classList.toggle("hidden",s!==id))}
$("enter").onclick=()=>{if($("pass").value.trim().toUpperCase()!==PASSWORD){$("passError").textContent="Esa contraseña no abre la aventura…";return}world=0;coins=0;lives=3;buildWorld();showScreen("gameScreen");scene="game";last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)};
$("pass").addEventListener("keydown",e=>{if(e.key==="Enter")$("enter").click()});
$("again").onclick=()=>{scene="start";$("pass").value="";showScreen("startScreen")};
function bindHold(id,key){const el=$(id);const down=e=>{e.preventDefault();touch[key]=true};const up=e=>{e.preventDefault();touch[key]=false};el.addEventListener("pointerdown",down);["pointerup","pointerleave","pointercancel"].forEach(ev=>el.addEventListener(ev,up))}
bindHold("left","left");bindHold("right","right");
$("jump").addEventListener("pointerdown",e=>{e.preventDefault();jump()});
window.addEventListener("keydown",e=>{if(["ArrowLeft","ArrowRight","ArrowUp"," ","a","d","w"].includes(e.key))e.preventDefault();keys[e.key.toLowerCase()]=true;if(e.key===" "||e.key==="ArrowUp"||e.key.toLowerCase()==="w")jump();if(e.key==="Escape")togglePause()});
window.addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);
function jump(){if(scene==="game"&&!paused&&player?.onGround){player.vy=-690;player.onGround=false}}
$("pause").onclick=togglePause;
function togglePause(){if(scene!=="game")return;paused=!paused;$("message").textContent=paused?"PAUSA · Pulsa Ⅱ PAUSA para continuar":"";
 $("message").classList.toggle("hidden",!paused)}
function loop(t){if(scene!=="game")return;const dt=Math.min((t-last)/1000,.033);last=t;if(!paused)update(dt);draw();raf=requestAnimationFrame(loop)}
function update(dt){
 const w=worlds[world],left=keys.arrowleft||keys.a||touch.left,right=keys.arrowright||keys.d||touch.right;
 player.vx=(right?300:0)-(left?300:0);if(player.vx)player.face=Math.sign(player.vx);
 player.x+=player.vx*dt;player.x=Math.max(0,Math.min(w.length-player.w,player.x));
 player.vy+=GRAVITY*dt;let oldY=player.y;player.y+=player.vy*dt;player.onGround=false;
 for(const p of platforms){if(player.x+player.w>p.x&&player.x<p.x+p.w&&oldY+player.h<=p.y+8&&player.y+player.h>=p.y&&player.vy>=0){player.y=p.y-player.h;player.vy=0;player.onGround=true}}
 if(player.y>650)hurt();
 if(player.inv>0)player.inv-=dt;
 for(const s of starItems){if(!s.taken&&Math.abs((player.x+player.w/2)-s.x)<34&&Math.abs((player.y+player.h/2)-s.y)<44){s.taken=true;coins++;$("starCount").textContent=`⭐ ${starItems.filter(x=>x.taken).length}/3`}}
 for(const h of hazards){h.phase+=dt;if(Math.abs(player.x+player.w/2-(h.x+18))<30&&player.y+player.h>h.y+5&&player.y<h.y+h.h&&player.inv<=0)hurt()}
 camera=Math.max(0,Math.min(w.length-canvas.width,player.x-canvas.width*.36));
 if(player.x+player.w>exit.x&&starItems.every(s=>s.taken)){worldDone=true;showQuestion()}
}
function hurt(){lives--; $("lifeCount").textContent="♥ ".repeat(Math.max(0,lives));if(lives<=0){lives=3;player.x=70;player.y=300;player.vy=0; $("hint").textContent="¡No pasa nada! Has recuperado tus tres vidas. Inténtalo otra vez."}else{player.x=Math.max(70,player.x-180);player.y=280;player.vy=0;player.inv=1.5}}
function showQuestion(){
 scene="question";cancelAnimationFrame(raf);const w=worlds[world];
 $("overlayEyebrow").textContent=`MUNDO ${world+1} COMPLETADO`; $("overlayTitle").textContent=w.morse?"TRANSMISIÓN SECRETA":"¡Has encontrado una pista!";
 $("overlayText").textContent=w.question;
 const extra=$("overlayExtra");extra.innerHTML="";
 if(w.morse){extra.innerHTML='<div class="morse">.- / -- / --- / .-. / ... / .. / .. / .. / -.</div><div class="morse-input"><input id="answer" placeholder="Descifra la palabra"><button id="checkAnswer">COMPROBAR</button></div><p id="answerFeedback"></p>'; $("checkAnswer").onclick=()=>checkAnswer(w.answer)}
 else{extra.innerHTML=`<p class="answer-hint">Escribe tu respuesta para desbloquear el siguiente mundo.</p><div class="morse-input"><input id="answer" placeholder="Tu respuesta"><button id="checkAnswer">DESBLOQUEAR</button></div><p id="answerFeedback"></p>`;$("checkAnswer").onclick=()=>checkAnswer(w.answer)}
 $("overlayButton").classList.add("hidden");showScreen("overlayScreen");
}
function checkAnswer(expected){const val=$("answer").value.trim().toLocaleUpperCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g,"");const exp=expected.toLocaleUpperCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g,"");if(val===exp){$("answerFeedback").textContent="¡Correcto! La aventura continúa ✦";$("overlayButton").classList.remove("hidden");$("overlayButton").textContent=world===4?"DESCUBRIR EL SECRETO":"SIGUIENTE MUNDO ▶";$("overlayButton").onclick=nextWorld}else{$("answerFeedback").textContent="No es esa todavía. ¡Piensa en la pista y vuelve a intentarlo!"}}
function nextWorld(){if(world===4){scene="end";showScreen("endScreen");return}world++;scene="game";buildWorld();showScreen("gameScreen");last=performance.now();raf=requestAnimationFrame(loop)}
function draw(){
 const w=worlds[world];ctx.clearRect(0,0,canvas.width,canvas.height);const grad=ctx.createLinearGradient(0,0,0,540);grad.addColorStop(0,w.sky);grad.addColorStop(1,"#e8f3ff");ctx.fillStyle=grad;ctx.fillRect(0,0,960,540);
 // distant snowy hills
 ctx.fillStyle="#ffffff70";for(let i=0;i<9;i++){let x=((i*260-camera*.18)%1100+1100)%1100-60;ctx.beginPath();ctx.arc(x,390,110+(i%3)*20,Math.PI,0);ctx.fill()}
 // stars/snow
 for(let i=0;i<70;i++){let x=(i*137-camera*.35)%960,y=(i*71)%360;ctx.fillStyle="#fff9";ctx.fillRect((x+960)%960,y,3,3)}
 // platforms and floor
 for(const p of platforms){let x=p.x-camera;if(x+p.w<0||x>960)continue;ctx.fillStyle=w.ground;ctx.fillRect(x,p.y,p.w,p.h);ctx.fillStyle=w.top;ctx.fillRect(x,p.y,p.w,10);ctx.fillStyle="#ffffff88";for(let k=8;k<p.w;k+=28)ctx.fillRect(x+k,p.y+13,12,3)}
 // decorations
 for(let x=120;x<w.length;x+=360){let sx=x-camera;if(sx>-40&&sx<1000){ctx.fillStyle="#285c54";ctx.beginPath();ctx.moveTo(sx,330);ctx.lineTo(sx-42,430);ctx.lineTo(sx+42,430);ctx.fill();ctx.fillStyle="#8a684e";ctx.fillRect(sx-7,430,14,30)}}
 // hazards
 for(const h of hazards){let x=h.x-camera;if(x>-50&&x<1000){ctx.fillStyle="#7b3e4e";ctx.beginPath();ctx.moveTo(x,h.y+45);ctx.lineTo(x+18,h.y+4+Math.sin(h.phase*5)*3);ctx.lineTo(x+38,h.y+45);ctx.fill();ctx.fillStyle="#f4b5c3";ctx.fillRect(x+9,h.y+32,20,6)}}
 // stars
 for(const s of starItems){if(s.taken)continue;let x=s.x-camera;ctx.save();ctx.translate(x,s.y+Math.sin(tick()/220+s.x)*5);ctx.fillStyle="#ffcf45";ctx.strokeStyle="#fff5bb";ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<10;i++){let r=i%2?9:20,a=-Math.PI/2+i*Math.PI/5;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}
 // exit door
 let ex=exit.x-camera;ctx.fillStyle="#603d65";ctx.fillRect(ex,exit.y,exit.w,95);ctx.fillStyle="#f8d98a";ctx.fillRect(ex+9,exit.y+10,exit.w-18,85);ctx.fillStyle="#714a69";ctx.fillRect(ex+17,exit.y+20,exit.w-34,75);ctx.fillStyle="#ffd66e";ctx.beginPath();ctx.arc(ex+exit.w-15,exit.y+54,4,0,Math.PI*2);ctx.fill();
 // player
 let px=player.x-camera;if(player.inv<=0||Math.floor(performance.now()/90)%2===0){if(avatar.complete&&avatar.naturalWidth){ctx.save();if(player.face<0){ctx.translate(px+player.w,0);ctx.scale(-1,1);ctx.drawImage(avatar,0,player.y,player.w,player.h)}else ctx.drawImage(avatar,px,player.y,player.w,player.h);ctx.restore()}else{ctx.fillStyle="#b94368";ctx.fillRect(px,player.y,player.w,player.h)}}
}
function tick(){return performance.now()}
