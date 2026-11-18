const $=s=>document.querySelector(s);
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PAGE=document.body.dataset.page;
const QID=+new URLSearchParams(location.search).get('id');
const accts=()=>{try{return JSON.parse(localStorage.getItem('hl_accts'))||{}}catch(e){return {}}};
async function hash(p,m){const d=new TextEncoder().encode('unab:'+m+':'+p);if(typeof crypto!=='undefined'&&crypto.subtle){const b=await crypto.subtle.digest('SHA-256',d);return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}let h=0;for(const c of m+p)h=(h*31+c.charCodeAt(0))|0;return 'x'+h}
let mode='in';
let id=null;try{id=localStorage.getItem('hl_session')}catch(e){}
const load=()=>{try{return JSON.parse(localStorage.getItem('hl:'+id))||{}}catch(e){return {}}};
const save=()=>{try{localStorage.setItem('hl:'+id,JSON.stringify(S))}catch(e){}};
function seed(){S.hist=S.hist||[{a:'Torneo de Fútbol 5',f:'15 oct 2026',h:4,e:'Aprobado'},{a:'Taller de pintura',f:'18 oct 2026',h:3,e:'Aprobado'},{a:'Yoga y bienestar',f:'20 oct 2026',h:2,e:'En revisión'},{a:'Voluntariado',f:'22 oct 2026',h:4,e:'Aprobado'}];
S.not=S.not||[['Inscripción confirmada','Tu cupo para el Torneo de Fútbol 5 está confirmado.'],['Recordatorio de actividad','Mañana tienes el Taller de Pintura.'],['Horas acreditadas','Se aprobaron 4 horas de voluntariado.']];
S.en=S.en||[];S.user=S.user||{nom:(accts()[id]||{}).nom||id.split('@')[0],mail:id}}
let S=id?load():{};if(id)seed();
const EV=[
{id:1,n:'Torneo de Fútbol 5',c:'Deporte',d:'15 oct 2026',t:'2:00 p. m.',l:'Canchas UNAB',h:4,cu:20,rq:'Cuenta UNAB vigente y carné.',ds:'Torneo relámpago de fútbol 5 entre estudiantes de todos los programas.'},
{id:2,n:'Taller de pintura',c:'Cultura',d:'18 oct 2026',t:'4:00 p. m.',l:'Edificio K',h:3,cu:15,rq:'Traer delantal y ganas de crear.',ds:'Taller práctico de pintura con materiales incluidos.'},
{id:3,n:'Yoga y bienestar',c:'Bienestar',d:'20 oct 2026',t:'4:00 p. m.',l:'Zona deportiva',h:2,cu:30,rq:'Ropa cómoda y tapete propio.',ds:'Sesión guiada de yoga y respiración para reducir el estrés.'},
{id:4,n:'Charla tecnológica',c:'Académico',d:'22 oct 2026',t:'12:00 m.',l:'Auditorio',h:2,cu:100,rq:'Inscripción previa con correo institucional.',ds:'Charla sobre tendencias tecnológicas con invitados de la industria.'}];
const TOP=[['Fútbol',4,'⚽'],['Lectura',3,'📖'],['Cine',2,'🎬'],['Música',4,'🎵'],['Arte',3,'🎨'],['Deporte',2,'🏃'],['Ciencia',4,'🔬'],['Debate',3,'⚖️'],['Voluntariado',2,'🎒']];
const PG=[['inicio','Inicio'],['top9','Top 9 Horas Libres'],['eventos','Tabla de Eventos'],['buscador','Buscador'],['cuenta','Mi Cuenta'],['historial','Historial'],['evidencia','Subir Evidencia'],['notificaciones','Notificaciones']];
const TOTAL=50;
const done=()=>S.hist.filter(x=>x.e==='Aprobado').reduce((a,x)=>a+x.h,23);
const go=(p,i)=>{location.href=p+'.html'+(i?'?id='+i:'')};
const evRows=l=>l.map(e=>`<div class="row"><div><b>${e.n}</b><br><small>${e.c} · ${e.h} horas · ${e.d}</small></div><button class="btn red" onclick="go('detalle',${e.id})">Ver detalles</button></div>`).join('')||'<p class="sub">No se encontraron actividades.</p>';
const isMail=m=>/^[a-z0-9._-]+@unab\.edu\.co$/i.test(m);
const V={
inicio:()=>`<div class="banner"><h2>Acredita tus Horas Libres de Forma Fácil</h2><p>Consulta eventos culturales, deportivos y académicos de la UNAB.</p></div>
<div class="card"><h3>Te damos la bienvenida, ${esc(S.user.nom)}</h3><p class="sub">${esc(id)} · Tu progreso: ${done()} de ${TOTAL} horas.</p><div class="bar"><i style="width:${done()/TOTAL*100}%"></i></div><br><button class="btn" onclick="go('eventos')">Hacia Eventos →</button></div>
<div class="card"><h3>Próximos eventos</h3>${evRows(EV.slice(0,3))}</div>`,
top9:()=>`<h2>Top 9 Horas Libres</h2><p class="sub">Las 9 actividades que más horas asignan en el semestre.</p><div class="grid">${TOP.map((t,i)=>`<div class="tc"><div class="n">${i+1}</div><div class="e">${t[2]}</div><b>${t[0]}</b><span>+${t[1]}h</span></div>`).join('')}</div>`,
eventos:()=>`<h2>Tabla de Eventos y Recompensas</h2><p class="sub">Consulta fechas, lugares y horas de cada evento.</p><div class="card scroll"><table><tr><th>Evento</th><th>Fecha</th><th>Lugar</th><th>Horas</th><th></th></tr>${EV.map(e=>`<tr><td>${e.n}</td><td>${e.d}</td><td>${e.l}</td><td>${e.h} h</td><td><button class="btn red" onclick="go('detalle',${e.id})">Ver</button></td></tr>`).join('')}</table></div>`,
buscador:()=>`<h2>Buscador de Actividades</h2><p class="sub">Encuentra actividades por nombre o categoría.</p><div class="card"><input class="f" id="q" placeholder="Buscar actividad…" value="${esc(S.q||'')}" oninput="S.q=this.value;list()"><div class="chips">${['Todos','Deporte','Cultura','Bienestar','Académico'].map(c=>`<button class="chip ${(S.cat||'Todos')===c?'on':''}" onclick="S.cat='${c}';save();document.querySelectorAll('.chip').forEach(b=>b.classList.toggle('on',b.textContent==='${c}'));list()">${c}</button>`).join('')}</div><div id="res"></div></div>`,
detalle:()=>{const e=EV.find(x=>x.id===QID)||EV[0];const lib=e.cu-S.en.filter(x=>x===e.id).length;return `<h2>Detalle del Evento</h2><div class="card"><h3>${e.n}</h3><p>${e.ds}</p><br><div class="scroll"><table><tr><th>Fecha y hora</th><th>Lugar</th><th>Recompensa</th><th>Cupos</th></tr><tr><td>${e.d}, ${e.t}</td><td>${e.l}</td><td><b>${e.h} h</b></td><td>${lib}</td></tr></table></div><p style="margin:12px 0"><b>Requisitos:</b> ${e.rq}</p>
<svg viewBox="0 0 320 120" width="100%" style="max-width:420px;border:1px solid var(--ln);border-radius:8px;background:var(--tint)"><rect x="20" y="20" width="90" height="40" fill="#D32F2F" opacity=".25"/><rect x="130" y="20" width="80" height="40" fill="#FF6F00" opacity=".3"/><rect x="230" y="20" width="70" height="40" fill="#D32F2F" opacity=".25"/><rect x="20" y="80" width="280" height="22" fill="#FF6F00" opacity=".2"/><circle cx="${[65,170,265,170][e.id-1]}" cy="40" r="9" fill="#D32F2F"/><text x="160" y="116" font-size="10" text-anchor="middle" fill="currentColor">Mapa del campus UNAB: ${e.l}</text></svg><br><br><button class="btn" onclick="go('inscripcion',${e.id})">Inscribirse</button> <button class="btn red" onclick="go('eventos')">Volver</button></div>`},
inscripcion:()=>`<h2>Formulario de Inscripción</h2><p class="sub">Registra tus datos para participar en una actividad.</p><div class="card" style="max-width:520px"><label>Nombre completo</label><input class="f" id="nom" value="${esc(S.user.nom)}"><label>Correo institucional</label><input class="f" id="mail" value="${esc(S.user.mail)}" readonly><label>Actividad seleccionada</label><select class="f" id="act">${EV.map(e=>`<option value="${e.id}" ${e.id===QID?'selected':''}>${e.n}</option>`).join('')}</select><div class="err" id="er"></div><button class="btn red" onclick="enroll()">Confirmar inscripción</button></div>`,
cuenta:()=>{const p=Math.round(done()/TOTAL*100);return `<h2>Mi Cuenta / Mi Progreso</h2><p class="sub">${esc(id)}</p><div class="card flex"><div class="donut" style="background:conic-gradient(var(--red) ${p*3.6}deg,#fde0b8 0)"><b>${p}%</b></div><div style="flex:1;min-width:220px"><p>Horas completadas: <b>${done()} / ${TOTAL}</b></p><div class="bar" style="margin:10px 0"><i style="width:${p}%"></i></div><h3>${p>=100?'¡Meta cumplida!':'¡Vas por buen camino!'}</h3><p class="sub">Te faltan ${Math.max(TOTAL-done(),0)} horas.</p></div></div>
<div class="card" style="max-width:520px"><h3>Mis datos</h3><label>Nombre completo</label><input class="f" id="nom" value="${esc(S.user.nom)}"><label>Correo institucional</label><input class="f" value="${esc(S.user.mail)}" readonly><div class="err" id="er"></div><button class="btn red" onclick="saveProfile()">Guardar datos</button></div>`},
historial:()=>`<h2>Historial de Horas Acreditadas</h2><p class="sub">Actividades realizadas y su estado.</p><div class="card scroll"><table><tr><th>Actividad</th><th>Fecha</th><th>Horas</th><th>Estado</th></tr>${S.hist.map(x=>`<tr><td>${esc(x.a)}</td><td>${x.f}</td><td>${x.h}${x.h==='—'?'':' h'}</td><td><span class="badge ${x.e==='Aprobado'?'ok':'rev'}">${x.e}</span></td></tr>`).join('')}</table></div>`,
evidencia:()=>`<h2>Subir Evidencia Externa</h2><p class="sub">Carga certificados de actividades externas.</p><div class="card"><div class="drop"><p>↑ Selecciona tu archivo</p><small>Formatos permitidos: PDF, JPG o PNG</small><br><br><input type="file" id="fl" accept=".pdf,.jpg,.jpeg,.png"></div><div class="err" id="er"></div><button class="btn red" onclick="sendEv()">Enviar evidencia</button></div>`,
notificaciones:()=>`<h2>Centro de Notificaciones</h2><p class="sub">Confirmaciones y recordatorios importantes.</p><div class="card">${S.not.map(n=>`<div class="no"><i></i><div><b>${esc(n[0])}</b><br><small>${esc(n[1])}</small></div></div>`).join('')}</div>`};
function list(){const q=(S.q||'').toLowerCase(),c=S.cat||'Todos';$('#res').innerHTML=evRows(EV.filter(e=>(c==='Todos'||e.c===c)&&(e.n.toLowerCase().includes(q)||e.c.toLowerCase().includes(q))))}
function saveProfile(){const nom=$('#nom').value.trim();
if(nom.length<3){$('#er').textContent='Escribe tu nombre completo.';return}
S.user.nom=nom;save();$('#er').className='okm';$('#er').textContent='Datos guardados.'}
function enroll(){const i=+$('#act').value,nom=$('#nom').value.trim(),e=EV.find(x=>x.id===i);
if(nom.length<3){$('#er').textContent='Escribe tu nombre completo.';return}
if(S.en.includes(i)){$('#er').textContent='Ya estás inscrito en esta actividad.';return}
S.user.nom=nom;S.en.push(i);S.not.unshift(['Inscripción confirmada','Tu cupo para '+e.n+' está confirmado.']);save();go('notificaciones')}
function sendEv(){const f=$('#fl').files[0];if(!f){$('#er').textContent='Selecciona un archivo PDF, JPG o PNG.';return}
S.hist.unshift({a:'Evidencia: '+f.name,f:new Date().toLocaleDateString('es-CO',{day:'numeric',month:'short',year:'numeric'}),h:'—',e:'En revisión'});
S.not.unshift(['Evidencia recibida','Tu archivo '+f.name+' está en revisión.']);save();go('historial')}
const setMode=m=>{mode=m;render()};
const startSession=c=>{try{localStorage.setItem('hl_session',c)}catch(e){$('#er').textContent='Tu navegador no permite guardar la sesión.';return}location.href='inicio.html'};
async function login(){const c=$('#code').value.trim().toLowerCase(),p=$('#pass').value;
if(!isMail(c)){$('#er').textContent='Usa tu correo institucional que termina en @unab.edu.co.';return}
const a=accts()[c];
if(!a){$('#er').textContent='Esta cuenta no está registrada.';$('#alt').innerHTML='<button class="btn" onclick="setMode(\'up\')">Crear cuenta</button>';return}
if(a.h!==await hash(p,c)){$('#er').textContent='Clave incorrecta.';return}
startSession(c)}
async function register(){const n=$('#nom').value.trim(),c=$('#code').value.trim().toLowerCase(),p=$('#pass').value,p2=$('#pass2').value;
if(n.length<3){$('#er').textContent='Escribe tu nombre completo.';return}
if(!isMail(c)){$('#er').textContent='Usa tu correo institucional que termina en @unab.edu.co.';return}
const all=accts();
if(all[c]){$('#er').textContent='Esta cuenta ya está registrada, inicia sesión.';$('#alt').innerHTML='<button class="btn" onclick="setMode(\'in\')">Iniciar sesión</button>';return}
if(p.length<6){$('#er').textContent='La clave debe tener al menos 6 caracteres.';return}
if(p!==p2){$('#er').textContent='Las claves no coinciden.';return}
all[c]={nom:n,h:await hash(p,c)};
try{localStorage.setItem('hl_accts',JSON.stringify(all))}catch(e){$('#er').textContent='Tu navegador no permite guardar la cuenta.';return}
startSession(c)}
function logout(){try{localStorage.removeItem('hl_session')}catch(e){}location.href='login.html'}
function render(){const app=$('#app');
if(PAGE==='login'){if(id){location.replace('inicio.html');return}
const up=mode==='up';
app.innerHTML=`<div class="login"><div class="card"><h1>UNAB | HORAS LIBRES</h1><p class="sub">${up?'Crea tu cuenta con tu correo institucional.':'Inicia sesión con tu cuenta del portal.'}</p>${up?'<label>Nombre completo</label><input class="f" id="nom" autocomplete="name">':''}<label>Correo institucional</label><input class="f" id="code" type="email" placeholder="nombre.apellido@unab.edu.co" autocomplete="username"><label>Clave</label><input class="f" id="pass" type="password" autocomplete="${up?'new-password':'current-password'}" ${up?'':'onkeydown="if(event.key===\'Enter\')login()"'}>${up?'<label>Confirmar clave</label><input class="f" id="pass2" type="password" autocomplete="new-password" onkeydown="if(event.key===\'Enter\')register()">':''}<div class="err" id="er"></div><div id="alt" style="margin-bottom:10px"></div><button class="btn red" style="width:100%" onclick="${up?'register()':'login()'}">${up?'Crear cuenta':'Iniciar sesión'}</button><div style="text-align:center"><button class="lnk" onclick="setMode('${up?'in':'up'}')">${up?'¿Ya tienes cuenta? Inicia sesión':'¿No tienes cuenta? Crear cuenta'}</button></div></div></div>`;return}
if(!id){location.replace('login.html');return}
app.innerHTML=`<header><h1>UNAB | HORAS LIBRES</h1><div class="hr"><input placeholder="Buscar actividades…" onkeydown="if(event.key==='Enter'){S.q=this.value;S.cat='Todos';save();go('buscador')}"><span>👤 ${esc(S.user.nom)}</span><button onclick="logout()">Salir</button></div></header><div class="lay"><nav>${PG.map(p=>`<a href="${p[0]}.html" class="${p[0]===PAGE?'on':''}">${p[1]}</a>`).join('')}</nav><main>${V[PAGE]()}</main></div>`;
if(PAGE==='buscador')list()}
render();
