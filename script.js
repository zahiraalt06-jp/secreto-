const PASSWORD = "NAVIDAD23"; // Cambia esta clave si quieres.
const puzzles = [
 {title:"La primera estrella",text:"Una nota aparece junto a la ventana: «Para seguir el camino, retrocede tres letras en el abecedario». Descifra el mensaje.",extra:"PLQ",answer:"MIN",hint:"Cada letra vuelve tres posiciones: P→M, L→I, Q→N."},
 {title:"El ritmo de la nieve",text:"La siguiente puerta solo se abre con el número que continúa la secuencia.",extra:"2 · 6 · 12 · 20 · 30 · ?",answer:"42",hint:"Las diferencias son 4, 6, 8 y 10. La siguiente es 12."},
 {title:"Un mensaje en la noche",text:"Alguien dejó un mensaje en código Morse. Cada grupo representa una letra.",extra:".-.  /  .  /  ...",answer:"RES",hint:" .-. = R, . = E y ... = S. Escribe RES."},
 {title:"El último candado",text:"Ya casi está. Une los resultados de los tres niveles anteriores en el orden en que los conseguiste y añade un corazón al final. ¿Qué palabra te recuerda lo importante?",extra:"MIN · 42 · RES",answer:"MIN42RES",hint:"Junta exactamente las respuestas de los tres retos: MIN42RES."}
];
let current=0;
const $=id=>document.getElementById(id);
$("enter").addEventListener("click",()=>{
 if($("password").value.trim().toUpperCase()===PASSWORD){$("login").classList.add("hidden");$("game").classList.remove("hidden");render();}
 else $("login-error").textContent="Esa no es la contraseña… ¡prueba otra vez!";
});
$("password").addEventListener("keydown",e=>{if(e.key==="Enter")$("enter").click()});
function render(){const p=puzzles[current];$("level-label").textContent=`NIVEL ${current+1} DE 4`;$("progress").textContent="✦ ".repeat(current+1)+"✧ ".repeat(3-current);$("puzzle-title").textContent=p.title;$("puzzle-text").textContent=p.text;$("puzzle-extra").textContent=p.extra;$("answer").value="";$("feedback").textContent="";$("hint").textContent="Necesito una pista";$("hint").onclick=()=>{$("feedback").textContent="Pista: "+p.hint};}
$("check").addEventListener("click",()=>{const value=$("answer").value.trim().toUpperCase().replace(/\s/g,"");if(value===puzzles[current].answer){current++;if(current===puzzles.length){$("game").classList.add("hidden");$("ending").classList.remove("hidden");}else{render();$("feedback").textContent="¡Correcto! La siguiente puerta se ha abierto ✦";}}else $("feedback").textContent="Casi… vuelve a intentarlo. Tú puedes."});
$("answer").addEventListener("keydown",e=>{if(e.key==="Enter")$("check").click()});
$("restart").addEventListener("click",()=>{current=0;$("ending").classList.add("hidden");$("login").classList.remove("hidden");$("password").value="";$("login-error").textContent=""});
