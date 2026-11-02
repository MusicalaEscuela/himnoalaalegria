/* =========================================================
   Musicala Piano Lab · Himno a la alegría
   Datos de la canción, audio, piano, reto con verificación
   (clic, teclado o micrófono) y ruta guiada.
   ========================================================= */

/* ---------- Datos musicales ---------- */
const PC = { Do:0, Re:2, Mi:4, Fa:5, Sol:7, La:9, Si:11 };
const PC_NAMES = ['Do','Do♯','Re','Re♯','Mi','Fa','Fa♯','Sol','Sol♯','La','La♯','Si'];

// Acordes de mano izquierda (MIDI). Digitación 5-3-1 de abajo hacia arriba.
const CHORDS = {
  Do:  { type:'do',  notes:['Do','Mi','Sol'], midi:[48,52,55], fingers:['5','3','1'] },
  Sol: { type:'sol', notes:['Sol','Si','Re'], midi:[43,47,50], fingers:['5','3','1'] }
};

// Duraciones en tiempos (negra = 1). Ajustadas a pulsos enteros/medios
// para que el metrónomo coincida con la melodía.
const lines = [
  { section:'Bloque A', chord:'Do', notes:['Mi','Fa','Sol','Sol'], durations:[1,1,1,1], rightFingers:['3','4','5','5'], leftFingers:['3','2','1','1'], goal:'Entrada de la melodía' },
  { section:'Bloque A', chord:'Do', notes:['Fa','Mi','Re','Do','Do'], durations:[1,1,1,1,1], rightFingers:['4','3','2','1','1'], leftFingers:['2','3','4','5','5'], goal:'Bajada por grados' },
  { section:'Bloque A', chord:'Do', notes:['Re','Mi','Mi','Re'], durations:[1,1,1.5,1.5], rightFingers:['2','3','3','2'], leftFingers:['4','3','3','4'], goal:'Cierre suspendido' },

  { section:'Bloque A’', chord:'Sol', notes:['Mi','Fa','Sol','Sol'], durations:[1,1,1,1], rightFingers:['3','4','5','5'], leftFingers:['3','2','1','1'], goal:'Repetición con Sol' },
  { section:'Bloque A’', chord:'Sol', notes:['Fa','Mi','Re','Do','Do'], durations:[1,1,1,1,1], rightFingers:['4','3','2','1','1'], leftFingers:['2','3','4','5','5'], goal:'Mantener el pulso' },
  { section:'Bloque A’', chord:'Sol', notes:['Re','Mi','Re','Do'], durations:[1,1,1.5,1.5], rightFingers:['2','3','2','1'], leftFingers:['4','3','4','5'], goal:'Cierre en Do' },

  { section:'Bloque B', chord:'Sol', notes:['Re','Mi','Do','Re','Mi','Fa','Mi','Do'], durations:[1,1,1,1,.5,.5,1,1], rightFingers:['2','3','1','2','3','4','3','1'], leftFingers:['4','3','5','4','3','2','3','5'], goal:'Puente: más notas, mismo pulso' },
  { section:'Bloque B', chord:'Sol', notes:['Re','Mi','Fa','Mi','Re','Do','Re','Sol'], durations:[1,.5,.5,1,1,1,1,2], rightFingers:['2','3','4','3','2','1','2','5'], leftFingers:['4','3','2','3','4','5','4','1'], goal:'Preparar el regreso' },

  { section:'Bloque A final', chord:'Do', notes:['Mi','Fa','Sol','Sol'], durations:[1,1,1,1], rightFingers:['3','4','5','5'], leftFingers:['3','2','1','1'], goal:'Regreso del tema' },
  { section:'Bloque A final', chord:'Do', notes:['Fa','Mi','Re','Do','Do'], durations:[1,1,1,1,1], rightFingers:['4','3','2','1','1'], leftFingers:['2','3','4','5','5'], goal:'Bajar relajado' },
  { section:'Bloque A final', chord:'Do', notes:['Re','Mi','Mi','Re'], durations:[1,1,1.5,1.5], rightFingers:['2','3','3','2'], leftFingers:['4','3','3','4'], goal:'Cierre suspendido' },

  { section:'Cierre', chord:'Do', notes:['Mi','Fa','Sol','Sol'], durations:[1,1,1,1], rightFingers:['3','4','5','5'], leftFingers:['3','2','1','1'], goal:'Última repetición' },
  { section:'Cierre', chord:'Do', notes:['Fa','Mi','Re','Do','Do'], durations:[1,1,1,1,1], rightFingers:['4','3','2','1','1'], leftFingers:['2','3','4','5','5'], goal:'No correr al final' },
  { section:'Cierre', chord:'Do', notes:['Re','Mi','Re','Do'], durations:[1,1,1.5,2], rightFingers:['2','3','2','1'], leftFingers:['4','3','4','5'], goal:'Reposo final' }
];

// Paso 1: posición de cinco dedos (no es una línea de la canción).
const FIVE_FINGER = { section:'Posición', chord:'Do', notes:['Do','Re','Mi','Fa','Sol'], durations:[1,1,1,1,1], rightFingers:['1','2','3','4','5'], leftFingers:['5','4','3','2','1'], goal:'Pulgar en Do' };

/* ---------- Ruta guiada ----------
   hand   -> qué se practica (find | right | chord | both)
   scope  -> alcance por defecto; scopes -> alcances elegibles
   along  -> si se ofrece "Toca conmigo"
   zones  -> secciones extra visibles */
const guidedSteps = [
  {
    short:'1 · Posición', hand:'find', scope:'line', along:false, zones:[],
    title:'Pon la mano en posición y ubica las notas',
    text:'Toda la canción usa solo cinco notas: Do, Re, Mi, Fa y Sol. Pon el pulgar derecho en el Do del centro y deja un dedo sobre cada tecla: 1 = Do, 2 = Re, 3 = Mi, 4 = Fa, 5 = Sol. La mano ya no se mueve en toda la canción.',
    goal:'Reto: la app te pide 8 notas al azar. Supéralo sin errores.'
  },
  {
    short:'2 · Derecha', hand:'right', scope:'line', along:true, zones:['mapa'],
    title:'Mano derecha, una línea a la vez',
    text:'Escucha la línea, luego pulsa “Toca conmigo”: tras la cuenta 1-2-3-4 la app ilumina cada nota a tiempo y tú la tocas. Cuando te salga, haz el reto. Con 3 puntos pasa a la siguiente línea con ›.',
    goal:'Meta: 3 puntos en las líneas 1, 2 y 3 (Bloque A).'
  },
  {
    short:'3 · Izquierda', hand:'chord', scope:'line', along:true, zones:['mapa'],
    title:'Mano izquierda: solo dos acordes',
    text:'La izquierda no toca melodía: sostiene un acorde por línea. Do = Do·Mi·Sol y Sol = Sol·Si·Re, siempre con dedos 5-3-1. En “Toca conmigo” la app pone la melodía y tú el acorde al inicio de cada línea.',
    goal:'Meta: cambiar de Do a Sol sin mirar el teclado.'
  },
  {
    short:'4 · Juntas', hand:'both', scope:'line', along:true, zones:['mapa'],
    title:'Une las dos manos',
    text:'El acorde suena justo con la primera nota de la línea y se queda mientras la derecha canta. Usa “Toca conmigo” en tempo Lento: la app solo marca el pulso y te muestra las dos manos. El reto revisa la melodía.',
    goal:'Meta: una línea completa con las dos manos sin frenar.'
  },
  {
    short:'5 · Canción', hand:'both', scope:'block', scopes:['block','song'], along:true, zones:['mapa'],
    title:'Arma los bloques y la canción completa',
    text:'Practica bloque por bloque (usa el mapa para saltar) y, cuando todos tengan puntos, elige “Canción completa”. Sube el tempo de a poco: primero que suene claro, después rápido.',
    goal:'Meta: la canción completa en tempo Medio sin perderte.'
  }
];

const lessonPlan = [
  ['Posición de cinco dedos', 'Pulgar en Do, ubicar Do-Re-Mi-Fa-Sol con el reto de notas al azar.', '3 min', 0],
  ['Mano derecha por líneas', 'Escuchar, tocar con la app y hacer el reto de las líneas 1 a 3.', '6 min', 1],
  ['Acordes de mano izquierda', 'Do-Mi-Sol y Sol-Si-Re con 5-3-1. La app toca la melodía.', '4 min', 2],
  ['Unir manos', 'Una línea a tempo lento, acorde largo + melodía.', '5 min', 3],
  ['Bloque o canción', 'Tocar un bloque completo con metrónomo y cerrar con la canción.', '2 min', 4]
];

/* ---------- Estado ---------- */
const store = {
  get(key, fallback){ try{ const v = localStorage.getItem('himno-' + key); return v === null ? fallback : JSON.parse(v); }catch(e){ return fallback; } },
  set(key, value){ try{ localStorage.setItem('himno-' + key, JSON.stringify(value)); }catch(e){} }
};

const state = {
  mode: store.get('mode', 'guided'),
  step: store.get('step', 0),
  hand: 'right',
  scope: 'line',
  line: store.get('line', 0),
  tempo: store.get('tempo', 60),
  mastery: store.get('mastery', {}),   // { right:[0..3 por línea], chord:[...], both:[...], 'left-melody':[...] }
  playing: null,                        // 'listen' | 'along' | null
  challenge: null
};
if(!guidedSteps[state.step]) state.step = 0;
if(!lines[state.line]) state.line = 0;

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

function currentStep(){ return guidedSteps[state.step]; }
function hand(){ return state.mode === 'guided' ? currentStep().hand : state.hand; }
function scope(){
  if(state.mode !== 'guided') return state.scope;
  const step = currentStep();
  return step.scopes && step.scopes.includes(state.scope) ? state.scope : step.scope;
}
function masteryHand(){ return hand() === 'find' ? 'right' : hand(); }
function masteryOf(index){ return (state.mastery[masteryHand()] || [])[index] || 0; }

function scopeLines(){
  if(hand() === 'find') return [-1];
  if(scope() === 'song') return lines.map((_, i) => i);
  if(scope() === 'block'){
    const section = lines[state.line].section;
    return lines.map((l, i) => l.section === section ? i : -1).filter(i => i >= 0);
  }
  return [state.line];
}
function lineAt(index){ return index === -1 ? FIVE_FINGER : lines[index]; }
function lineBeats(line){ return line.durations.reduce((a, b) => a + b, 0); }
function melodyMidi(note, h){ return (h === 'left-melody' ? 48 : 60) + PC[note]; }

/* ---------- Audio ---------- */
let ctx = null;
let master = null;
let nodes = [];
let timers = [];

function audio(){
  if(!ctx){
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = .9;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp).connect(ctx.destination);
  }
  if(ctx.state === 'suspended') ctx.resume();
  return ctx;
}

const midiToFreq = m => 440 * Math.pow(2, (m - 69) / 12);

// Tono tipo piano: fundamental + armónicos con caída exponencial.
function tone(midi, when, dur, vol=.22){
  const c = audio();
  const out = c.createGain();
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 2600;
  out.gain.setValueAtTime(0.0001, when);
  out.gain.exponentialRampToValueAtTime(vol, when + .008);
  out.gain.exponentialRampToValueAtTime(vol * .35, when + Math.min(.35, dur));
  out.gain.setValueAtTime(vol * .35, when + Math.max(.01, dur - .05));
  out.gain.exponentialRampToValueAtTime(0.0001, when + dur + .25);
  out.connect(lp).connect(master);
  [[1,'triangle',1],[2,'sine',.35],[3,'sine',.12]].forEach(([mult, type, g]) => {
    const osc = c.createOscillator();
    const og = c.createGain();
    osc.type = type;
    osc.frequency.value = midiToFreq(midi) * mult;
    og.gain.value = g;
    osc.connect(og).connect(out);
    osc.start(when);
    osc.stop(when + dur + .3);
    nodes.push(osc);
  });
}

function click(when, strong){
  const c = audio();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = 'square';
  osc.frequency.value = strong ? 1800 : 1200;
  g.gain.setValueAtTime(strong ? .16 : .09, when);
  g.gain.exponentialRampToValueAtTime(0.0001, when + .04);
  osc.connect(g).connect(master);
  osc.start(when);
  osc.stop(when + .05);
  nodes.push(osc);
}

function at(ms, fn){ timers.push(setTimeout(fn, Math.max(0, ms))); }

function stopAll(silent){
  timers.forEach(clearTimeout);
  timers = [];
  nodes.forEach(n => { try{ n.stop(); }catch(e){} });
  nodes = [];
  state.playing = null;
  state.challenge = null;
  $$('.key').forEach(k => k.classList.remove('on-melody','on-do','on-sol','target','pressed'));
  $$('.btn.running').forEach(b => b.classList.remove('running'));
  renderNotes();
  if(!silent) say('Listo. Elige qué hacer.', '');
}

/* ---------- Reproducción: Escuchar / Toca conmigo ---------- */
function play(kind){
  stopAll(true);
  const c = audio();
  const h = hand();
  const spb = 60 / state.tempo;
  const countIn = kind === 'along';
  const metro = $('#optMetro').checked || (kind === 'along' && h === 'both');

  // Qué suena: al escuchar, lo que se practica; al tocar conmigo, la otra mano.
  const melodyHand = h === 'left-melody' ? 'left-melody' : 'right';
  const practicesMelody = h !== 'chord';
  const practicesChord = h === 'chord' || h === 'both';
  const soundMelody = kind === 'listen' ? practicesMelody : (h === 'chord');
  const soundChord = kind === 'listen' ? practicesChord : (h === 'right' || h === 'left-melody');
  const showChord = h !== 'find';

  const start = c.currentTime + .15;
  let beat = 0;

  if(countIn){
    for(let i = 0; i < 4; i++){
      click(start + i * spb, i === 0);
      at((i * spb + .15) * 1000, () => say(String(i + 1), 'count'));
    }
    beat = 4;
  }

  scopeLines().forEach(index => {
    const line = lineAt(index);
    const lineStart = beat;
    at((lineStart * spb + .1) * 1000, () => {
      if(index >= 0 && index !== state.line){ state.line = index; renderStudio(); renderMap(); }
      say(kind === 'along' ? 'Tu turno: sigue la nota iluminada.' : `Escuchando: ${line.notes.join(' · ')}`, '');
    });

    if(showChord){
      const chord = CHORDS[line.chord];
      const dur = lineBeats(line) * spb * .95;
      if(soundChord) chord.midi.forEach(m => tone(m, start + lineStart * spb, dur, .12));
      at(lineStart * spb * 1000 + 150, () => flashKeys(chord.midi, 'on-' + chord.type, dur * 1000));
      if(h === 'chord') at(lineStart * spb * 1000 + 150, () => flashTokens([0,1,2], dur * 1000));
    }

    line.durations.forEach((d, i) => {
      const midi = melodyMidi(line.notes[i], melodyHand);
      const when = beat * spb;
      const len = d * spb;
      if(soundMelody) tone(midi, start + when, len * .92);
      if(!soundMelody && kind === 'listen') return beat += d;
      at(when * 1000 + 150, () => {
        flashKeys([midi], 'on-melody', len * 900);
        if(h !== 'chord') flashTokens([i], len * 900);
      });
      beat += d;
    });
  });

  if(metro){
    for(let b = countIn ? 4 : 0; b < Math.ceil(beat); b++) click(start + b * spb, (b - (countIn ? 4 : 0)) % 4 === 0);
  }

  state.playing = kind;
  $(kind === 'listen' ? '#btnListen' : '#btnAlong').classList.add('running');
  at(beat * spb * 1000 + 450, () => {
    state.playing = null;
    $$('.btn.running').forEach(b => b.classList.remove('running'));
    if($('#optLoop').checked) return play(kind);
    say(kind === 'along'
      ? '¿Salió parejo? Repite o haz el <b>Reto</b> para sumar un punto.'
      : 'Ahora pulsa <b>Toca conmigo</b> o intenta el <b>Reto</b>.', '');
  });
}

function flashKeys(midis, cls, ms){
  midis.forEach(m => {
    const key = keyEl(m);
    if(!key) return;
    key.classList.add(cls);
    at(ms, () => key.classList.remove(cls));
  });
}

function flashTokens(indexes, ms){
  indexes.forEach(i => {
    const t = $(`#notesRow [data-i="${i}"]`);
    if(!t) return;
    t.classList.add('now');
    at(ms, () => t.classList.remove('now'));
  });
}

/* ---------- Reto: la app espera cada nota ---------- */
function startChallenge(){
  stopAll(true);
  audio();
  const h = hand();
  let seq = [];

  if(h === 'find'){
    const pool = FIVE_FINGER.notes;
    let prev = null;
    for(let i = 0; i < 8; i++){
      let n;
      do{ n = pool[Math.floor(Math.random() * pool.length)]; }while(n === prev);
      prev = n;
      seq.push({ line:-1, i, note:n, midi:60 + PC[n] });
    }
  } else {
    scopeLines().forEach(index => {
      const line = lines[index];
      if(h === 'chord'){
        const chord = CHORDS[line.chord];
        chord.notes.forEach((n, i) => seq.push({ line:index, i, note:n, midi:chord.midi[i] }));
      } else {
        line.notes.forEach((n, i) => seq.push({ line:index, i, note:n, midi:melodyMidi(n, h) }));
      }
    });
  }

  state.challenge = { seq, pos:0, errors:0, lines:scopeLines() };
  $('#btnChallenge').classList.add('running');
  if(seq[0].line >= 0 && seq[0].line !== state.line){ state.line = seq[0].line; renderStudio(); renderMap(); }
  else renderNotes();
  showTarget();
  say(h === 'chord'
    ? 'Toca las notas del acorde <b>una por una</b>, de abajo hacia arriba.'
    : `Toca la nota marcada. ${micOn ? 'Te estoy escuchando 🎤' : 'Usa el piano, el teclado o activa el micrófono.'}`, '');
}

function showTarget(){
  const ch = state.challenge;
  $$('.key.target').forEach(k => k.classList.remove('target'));
  if(!ch) return;
  const target = ch.seq[ch.pos];
  const key = keyEl(target.midi);
  if(key) key.classList.add('target');
  $$('#notesRow .note').forEach(t => t.classList.remove('now'));
  const token = $(`#notesRow [data-i="${target.i}"]`);
  if(token) token.classList.add('now');
}

function noteInput(midi){
  const ch = state.challenge;
  if(!ch) return;
  const target = ch.seq[ch.pos];
  const token = $(`#notesRow [data-i="${target.i}"]`);

  if(midi % 12 !== target.midi % 12){
    ch.errors++;
    if(token){ token.classList.remove('miss'); void token.offsetWidth; token.classList.add('miss'); }
    say(`Esa fue <b>${PC_NAMES[midi % 12]}</b>; buscamos <b>${target.note}</b>. Errores: ${ch.errors}`, 'bad');
    return;
  }

  if(token){ token.classList.remove('now','miss'); token.classList.add('hit'); }
  ch.pos++;

  if(ch.pos >= ch.seq.length) return finishChallenge();

  const next = ch.seq[ch.pos];
  if(next.line !== target.line && next.line >= 0){
    state.line = next.line;
    renderStudio();
    renderMap();
  }
  say(`¡Bien! ${ch.seq.length - ch.pos} nota${ch.seq.length - ch.pos === 1 ? '' : 's'} más.`, ch.errors ? '' : 'good');
  showTarget();
}

function finishChallenge(){
  const ch = state.challenge;
  state.challenge = null;
  $$('.key.target').forEach(k => k.classList.remove('target'));
  $('#btnChallenge').classList.remove('running');

  if(hand() === 'find'){
    say(ch.errors === 0
      ? '¡Perfecto! Ya conoces el terreno. Pulsa <b>Siguiente paso →</b>.'
      : `Terminaste con ${ch.errors} error${ch.errors > 1 ? 'es' : ''}. Otra ronda: la meta es cero.`, ch.errors ? 'bad' : 'good');
  } else if(ch.errors === 0){
    const key = masteryHand();
    const list = state.mastery[key] || (state.mastery[key] = lines.map(() => 0));
    ch.lines.forEach(i => { list[i] = Math.min(3, (list[i] || 0) + 1); });
    store.set('mastery', state.mastery);
    renderMap();
    const level = list[ch.lines[0]];
    say(level >= 3 && ch.lines.length === 1
      ? '¡Línea dominada! ★ Pasa a la siguiente con › o sube el tempo +5.'
      : `¡Sin errores! +1 punto (${level}/3). ${level < 3 ? 'Otra vez para afianzar.' : ''}`, 'good');
  } else {
    say(`Terminaste con ${ch.errors} error${ch.errors > 1 ? 'es' : ''}. Repite más lento: el punto se gana con cero errores.`, 'bad');
  }

  if($('#optLoop').checked) at(1600, startChallenge);
}

/* ---------- Entrada: piano en pantalla y teclado ---------- */
const KEYMAP = { a:60, s:62, d:64, f:65, g:67, h:69, j:71, k:72 };

function playedByUser(midi){
  if(!state.playing) tone(midi, audio().currentTime, .55, .2);
  const key = keyEl(midi);
  if(key){ key.classList.add('pressed'); setTimeout(() => key.classList.remove('pressed'), 140); }
  noteInput(midi);
}

/* ---------- Micrófono: detección de altura (NSDF) ---------- */
let micOn = false;
let micStream = null;
let analyser = null;
let micBuf = null;
let micRaf = 0;
const mic = { candidate:null, frames:0, last:null, lastRms:0, rearmed:true };

async function toggleMic(){
  if(micOn){ stopMic(); return; }
  try{
    audio();
    micStream = await navigator.mediaDevices.getUserMedia({ audio:{ echoCancellation:false, noiseSuppression:false, autoGainControl:false } });
    const src = ctx.createMediaStreamSource(micStream);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    micBuf = new Float32Array(analyser.fftSize);
    src.connect(analyser);
    micOn = true;
    $('#btnMic').setAttribute('aria-pressed', 'true');
    $('#micStatus').hidden = false;
    $('#micStatus').innerHTML = 'Micrófono activo. Toca una nota en tu piano…';
    micLoop();
  }catch(e){
    $('#micStatus').hidden = false;
    $('#micStatus').textContent = 'No se pudo usar el micrófono. Revisa el permiso del navegador (y abre la app desde https o localhost).';
  }
}

function stopMic(){
  micOn = false;
  cancelAnimationFrame(micRaf);
  if(micStream) micStream.getTracks().forEach(t => t.stop());
  micStream = null;
  $('#btnMic').setAttribute('aria-pressed', 'false');
  $('#micStatus').hidden = true;
}

function detectPitch(buf, sampleRate){
  const size = 1024;
  let rms = 0;
  for(let i = 0; i < size; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / size);
  if(rms < .012) return { rms, freq:null };

  const minLag = Math.floor(sampleRate / 1100);
  const maxLag = Math.min(size - 1, Math.floor(sampleRate / 75));
  const nsdf = new Float32Array(maxLag + 1);
  for(let lag = minLag; lag <= maxLag; lag++){
    let acf = 0, energy = 0;
    for(let i = 0; i < size - lag; i++){
      acf += buf[i] * buf[i + lag];
      energy += buf[i] * buf[i] + buf[i + lag] * buf[i + lag];
    }
    nsdf[lag] = energy ? 2 * acf / energy : 0;
  }
  let best = 0;
  for(let lag = minLag; lag <= maxLag; lag++) best = Math.max(best, nsdf[lag]);
  if(best < .6) return { rms, freq:null };

  // Primer pico que alcance el 88% del máximo: evita errores de octava.
  for(let lag = minLag + 1; lag < maxLag; lag++){
    if(nsdf[lag] >= best * .88 && nsdf[lag] >= nsdf[lag - 1] && nsdf[lag] >= nsdf[lag + 1]){
      const a = nsdf[lag - 1], b = nsdf[lag], c = nsdf[lag + 1];
      const shift = (a - c) / (2 * (a - 2 * b + c) || 1);
      return { rms, freq: sampleRate / (lag + shift) };
    }
  }
  return { rms, freq:null };
}

function micLoop(){
  if(!micOn) return;
  micRaf = requestAnimationFrame(micLoop);
  analyser.getFloatTimeDomainData(micBuf);
  const { rms, freq } = detectPitch(micBuf, ctx.sampleRate);

  // Si la app está sonando, no escuchar (evita que se oiga a sí misma).
  if(state.playing){ mic.candidate = null; return; }

  // Re-armado: la nota anterior se apagó o bajó mucho -> se acepta la misma nota otra vez.
  if(!freq || rms < mic.lastRms * .45) mic.rearmed = true;
  if(!freq){ mic.candidate = null; mic.frames = 0; return; }

  const midi = Math.round(69 + 12 * Math.log2(freq / 440));
  if(midi === mic.candidate) mic.frames++;
  else { mic.candidate = midi; mic.frames = 1; }

  if(mic.frames === 3 && (midi !== mic.last || mic.rearmed)){
    mic.last = midi;
    mic.lastRms = rms;
    mic.rearmed = false;
    $('#micStatus').innerHTML = `Escuché: <b>${PC_NAMES[midi % 12]}</b>`;
    const key = keyEl(midi);
    if(key){ key.classList.add('pressed'); setTimeout(() => key.classList.remove('pressed'), 160); }
    noteInput(midi);
  }
}

/* ---------- Piano en pantalla (Sol2 – Do5) ---------- */
const PIANO_FROM = 43, PIANO_TO = 72;
const isBlack = m => [1,3,6,8,10].includes(m % 12);
const keyEl = m => $(`.key[data-midi="${m}"]`);

function buildPiano(){
  const piano = $('#piano');
  const whites = [];
  for(let m = PIANO_FROM; m <= PIANO_TO; m++) if(!isBlack(m)) whites.push(m);
  const w = 100 / whites.length;
  let whiteIndex = 0;
  for(let m = PIANO_FROM; m <= PIANO_TO; m++){
    const key = document.createElement('button');
    key.type = 'button';
    key.dataset.midi = m;
    const name = PC_NAMES[m % 12];
    if(isBlack(m)){
      key.className = 'key black-key';
      key.style.left = `${(whiteIndex - .32) * w}%`;
      key.style.width = `${w * .64}%`;
      key.setAttribute('aria-label', name);
      key.innerHTML = '<span class="finger"></span>';
    } else {
      key.className = 'key white-key' + (m % 12 === 0 ? ' c-key' : '');
      key.setAttribute('aria-label', name + (Math.floor(m / 12) - 1));
      key.innerHTML = `<span class="finger"></span><span class="label">${m === 60 ? 'Do<br>central' : name}</span>`;
      whiteIndex++;
    }
    key.addEventListener('pointerdown', e => { e.preventDefault(); playedByUser(m); });
    piano.appendChild(key);
  }
}

// Marca las teclas de la línea activa con colores y número de dedo.
function markPiano(){
  $$('.key').forEach(k => {
    k.classList.remove('mark-melody','mark-do','mark-sol');
    k.querySelector('.finger').textContent = '';
  });
  const h = hand();
  const line = lineAt(hand() === 'find' ? -1 : state.line);

  if(h !== 'chord'){
    const fingers = h === 'left-melody' ? line.leftFingers : line.rightFingers;
    line.notes.forEach((n, i) => {
      const key = keyEl(melodyMidi(n, h));
      if(!key) return;
      key.classList.add('mark-melody');
      if(!key.querySelector('.finger').textContent) key.querySelector('.finger').textContent = fingers[i];
    });
  }
  if(h !== 'find'){
    const chord = CHORDS[line.chord];
    chord.midi.forEach((m, i) => {
      const key = keyEl(m);
      key.classList.add('mark-' + chord.type);
      if(h === 'chord') key.querySelector('.finger').textContent = chord.fingers[i];
    });
  }
}

/* ---------- Render ---------- */
function say(html, tone){
  const f = $('#feedback');
  f.className = 'feedback' + (tone ? ' ' + tone : '');
  f.innerHTML = html;
}

function renderNotes(){
  const h = hand();
  const line = lineAt(h === 'find' ? -1 : state.line);
  const ch = state.challenge;
  let html = '';

  if(h === 'find' && ch){
    html = ch.seq.map((t, i) => `<div class="note" data-i="${i}"><b>${t.note}</b><small>${FIVE_FINGER.rightFingers[FIVE_FINGER.notes.indexOf(t.note)]}</small></div>`).join('');
  } else if(h === 'chord'){
    const chord = CHORDS[line.chord];
    html = chord.notes.map((n, i) => `<div class="note chord-note ${chord.type}" data-i="${i}"><b>${n}</b><small>${chord.fingers[i]}</small></div>`).join('');
  } else {
    const fingers = h === 'left-melody' ? line.leftFingers : line.rightFingers;
    if(h === 'both'){
      const chord = CHORDS[line.chord];
      html += `<div class="note chord-note ${chord.type}" title="Acorde mano izquierda"><b>${line.chord}</b><small>IZ</small></div><div class="note sep">+</div>`;
    }
    html += line.notes.map((n, i) => `<div class="note" data-i="${i}"><b>${n}</b><small>${fingers[i]}</small></div>`).join('');
  }
  $('#notesRow').innerHTML = html;

  // Mantener marcas del reto en curso
  if(ch && h !== 'find'){
    ch.seq.slice(0, ch.pos).forEach(t => {
      if(t.line !== state.line) return;
      const token = $(`#notesRow [data-i="${t.i}"]`);
      if(token) token.classList.add('hit');
    });
  } else if(ch){
    for(let i = 0; i < ch.pos; i++) $(`#notesRow [data-i="${i}"]`).classList.add('hit');
  }
}

function renderStudio(){
  const h = hand();
  const guided = state.mode === 'guided';
  const step = currentStep();
  const find = h === 'find';
  const line = lineAt(find ? -1 : state.line);
  const chord = CHORDS[line.chord];

  $('#chordBadge').className = `chord-badge ${find ? 'melody' : chord.type}`;
  $('#chordBadge').textContent = find ? 'Mano derecha' : `Acorde ${line.chord}`;
  $('#chordBadge').hidden = false;
  $('#lineTitle').textContent = find ? 'Posición de cinco dedos' : `Línea ${state.line + 1} de ${lines.length}`;
  $('#lineMeta').textContent = find ? 'Pulgar (1) en el Do central' : `${line.section} · ${line.goal}`;
  $('#prevLine').style.visibility = find ? 'hidden' : '';
  $('#nextLine').style.visibility = find ? 'hidden' : '';

  $('#fingerHint').textContent = h === 'chord'
    ? 'Mano izquierda: el número es el dedo (5 = meñique, 1 = pulgar).'
    : 'El número debajo de cada nota es el dedo (1 = pulgar, 5 = meñique).';

  // Selectores: libres en práctica libre; en guiado solo el alcance si el paso lo ofrece.
  $('#handSeg').classList.toggle('step-off', guided);
  $('#scopeSeg').classList.toggle('step-off', guided && !step.scopes);
  $$('#scopeSeg button').forEach(b => {
    b.classList.toggle('step-off', guided && step.scopes && !step.scopes.includes(b.dataset.scope));
    b.classList.toggle('active', b.dataset.scope === scope());
  });
  $$('#handSeg button').forEach(b => b.classList.toggle('active', b.dataset.hand === state.hand));

  $('#btnAlong').classList.toggle('step-off', guided ? !step.along : false);
  $('#btnChallenge').innerHTML = find
    ? '<span aria-hidden="true">✓</span> Reto: encuentra la nota'
    : h === 'both'
      ? '<span aria-hidden="true">✓</span> Reto (melodía)'
      : '<span aria-hidden="true">✓</span> Reto: ¿te sale?';

  renderNotes();
  markPiano();
}

function renderTempo(){
  $('#tempoValue').textContent = state.tempo;
  $$('[data-tempo]').forEach(b => b.classList.toggle('active', Number(b.dataset.tempo) === state.tempo));
}

function renderMap(){
  const sections = [...new Set(lines.map(l => l.section))];
  $('#blocks').innerHTML = sections.map(section => {
    const items = lines.map((l, i) => ({ l, i })).filter(x => x.l.section === section);
    const chord = items[0].l.chord;
    return `<div class="block">
      <h3>${section} <span class="tag ${CHORDS[chord].type}">${chord}</span></h3>
      ${items.map(({ l, i }) => {
        const m = masteryOf(i);
        return `<button class="line-pill${i === state.line ? ' active' : ''}${m >= 3 ? ' mastered' : ''}" data-line="${i}">
          <span class="num">${i + 1}</span><span class="txt">${l.notes.join(' ')}</span>
          <span class="dots" aria-label="${m} de 3">${[0,1,2].map(d => `<i class="${d < m ? 'on' : ''}"></i>`).join('')}</span>
        </button>`;
      }).join('')}
    </div>`;
  }).join('');
}

function renderGuided(){
  const step = currentStep();
  $('#guidedStepLabel').textContent = `Paso ${state.step + 1} de ${guidedSteps.length}`;
  $('#guidedTitle').textContent = step.title;
  $('#guidedText').textContent = step.text;
  $('#guidedGoal').textContent = step.goal;
  $('#guidedPrev').disabled = state.step === 0;
  $('#guidedNext').disabled = state.step === guidedSteps.length - 1;
  $('#guidedProgress').innerHTML = guidedSteps.map((s, i) =>
    `<button type="button" data-step="${i}" class="${i === state.step ? 'current' : i < state.step ? 'done' : ''}">${s.short}</button>`
  ).join('');
  $$('.zone').forEach(z => z.classList.toggle('step-on', step.zones.includes(z.dataset.zone)));
}

function renderGuide(){
  const heads = ['Línea','Acorde','Mano derecha','Dedos der.','Dedos izq.'];
  $('#guideTable').innerHTML =
    heads.map((h, i) => `<div class="guide-head${i > 2 ? ' hide-sm' : ''}">${h}</div>`).join('') +
    lines.map((l, i) => `
      <div><b>${i + 1}</b>&nbsp;<small>${l.section}</small></div>
      <div><span class="tag ${CHORDS[l.chord].type}">${l.chord}</span></div>
      <div class="notes">${l.notes.join(' · ')}</div>
      <div class="hide-sm">${l.rightFingers.join(' ')}</div>
      <div class="hide-sm">${l.leftFingers.join(' ')}</div>`).join('');
}

function renderLesson(){
  $('#lesson').innerHTML = lessonPlan.map(([title, text, time, step]) =>
    `<li><div><b>${title}</b><p>${text}</p></div><button class="time" data-goto="${step}">${time} · ir →</button></li>`
  ).join('');
}

function renderAll(){
  document.body.classList.toggle('mode-guided', state.mode === 'guided');
  document.body.classList.toggle('mode-explore', state.mode === 'explore');
  $$('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === state.mode));
  renderGuided();
  renderStudio();
  renderMap();
  renderTempo();
}

/* ---------- Acciones ---------- */
function setMode(mode){
  stopAll();
  state.mode = mode;
  store.set('mode', mode);
  renderAll();
}

function setStep(index){
  stopAll();
  state.step = Math.max(0, Math.min(guidedSteps.length - 1, index));
  state.scope = currentStep().scope;
  store.set('step', state.step);
  renderAll();
  say(state.step === 0 ? 'Pulsa <b>Escuchar</b> para oír las cinco notas.' : 'Pulsa <b>Escuchar</b> para empezar.', '');
  $('#guiado').scrollIntoView({ behavior:'smooth', block:'start' });
}

function setLine(index){
  if(hand() === 'find') return;
  stopAll(true);
  state.line = (index + lines.length) % lines.length;
  store.set('line', state.line);
  renderStudio();
  renderMap();
  say('Pulsa <b>Escuchar</b> para oír esta línea.', '');
}

function setTempo(value){
  state.tempo = Math.max(40, Math.min(132, value));
  store.set('tempo', state.tempo);
  renderTempo();
}

function bind(){
  $$('.mode-btn').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  $('#guidedPrev').addEventListener('click', () => setStep(state.step - 1));
  $('#guidedNext').addEventListener('click', () => setStep(state.step + 1));
  $('#guidedProgress').addEventListener('click', e => { const b = e.target.closest('[data-step]'); if(b) setStep(Number(b.dataset.step)); });

  $$('#handSeg button').forEach(b => b.addEventListener('click', () => { stopAll(true); state.hand = b.dataset.hand; renderStudio(); renderMap(); }));
  $$('#scopeSeg button').forEach(b => b.addEventListener('click', () => { stopAll(true); state.scope = b.dataset.scope; renderStudio(); }));

  $('#prevLine').addEventListener('click', () => setLine(state.line - 1));
  $('#nextLine').addEventListener('click', () => setLine(state.line + 1));
  $('#btnListen').addEventListener('click', () => play('listen'));
  $('#btnAlong').addEventListener('click', () => play('along'));
  $('#btnChallenge').addEventListener('click', startChallenge);
  $('#btnStop').addEventListener('click', () => stopAll());
  $('#btnMic').addEventListener('click', toggleMic);

  $('#tempoDown').addEventListener('click', () => setTempo(state.tempo - 5));
  $('#tempoUp').addEventListener('click', () => setTempo(state.tempo + 5));
  $$('[data-tempo]').forEach(b => b.addEventListener('click', () => setTempo(Number(b.dataset.tempo))));

  $('#blocks').addEventListener('click', e => {
    const b = e.target.closest('[data-line]');
    if(!b) return;
    setLine(Number(b.dataset.line));
    $('#estudio').scrollIntoView({ behavior:'smooth', block:'start' });
  });
  $('#resetProgress').addEventListener('click', () => {
    if(!confirm('¿Borrar los puntos de todas las líneas?')) return;
    state.mastery = {};
    store.set('mastery', {});
    renderMap();
  });
  $('#lesson').addEventListener('click', e => {
    const b = e.target.closest('[data-goto]');
    if(!b) return;
    state.mode = 'guided';
    store.set('mode', 'guided');
    setStep(Number(b.dataset.goto));
  });

  window.addEventListener('keydown', e => {
    if(e.target.matches('input,textarea') || e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
    const k = e.key.toLowerCase();
    if(KEYMAP[k] !== undefined){ playedByUser(KEYMAP[k]); return; }
    if(e.key === 'ArrowLeft') setLine(state.line - 1);
    if(e.key === 'ArrowRight') setLine(state.line + 1);
    if(e.key === ' ' && !e.target.matches('button')){ e.preventDefault(); play('listen'); }
    if(e.key === 'Escape') stopAll();
  });
}

function init(){
  buildPiano();
  renderGuide();
  renderLesson();
  bind();
  renderAll();
  say(state.mode === 'guided' && state.step === 0
    ? 'Pulsa <b>Escuchar</b> para oír las cinco notas.'
    : 'Pulsa <b>Escuchar</b> para empezar.', '');
}

init();
