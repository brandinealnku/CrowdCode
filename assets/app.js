import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import {
  getDatabase, ref, set, update, get, onValue, onDisconnect, remove, push
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js';

export const firebaseConfig = {
  apiKey: 'AIzaSyDG34fpXimkHbqiLD0YFbM1FuSUlLW7FSo',
  authDomain: 'crowdcode-713e4.firebaseapp.com',
  databaseURL: 'https://crowdcode-713e4-default-rtdb.firebaseio.com',
  projectId: 'crowdcode-713e4',
  storageBucket: 'crowdcode-713e4.firebasestorage.app',
  messagingSenderId: '415062434213',
  appId: '1:415062434213:web:0ac4da57c4ffe6a5e7884c',
  measurementId: 'G-E1CNDCQWC0'
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export function escapeHtml(str=''){
  return String(str).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

export function getSessionId(){
  const url = new URL(window.location.href);
  let session = url.searchParams.get('session');
  if(!session){
    session = crypto.randomUUID().slice(0,8).toUpperCase();
    url.searchParams.set('session', session);
    window.history.replaceState({}, '', url);
  }
  return session;
}

export function buildAudienceUrl(sessionId){
  const u = new URL('./audience.html', window.location.href);
  u.searchParams.set('session', sessionId);
  return u.toString();
}

export function buildGalleryUrl(sessionId){
  const u = new URL('./gallery.html', window.location.href);
  u.searchParams.set('session', sessionId);
  return u.toString();
}

export function sessionRef(sessionId){ return ref(db, `demoDay/sessions/${sessionId}`); }
export function participantsRef(sessionId){ return ref(db, `demoDay/sessions/${sessionId}/participants`); }
export function projectsRef(sessionId){ return ref(db, `demoDay/sessions/${sessionId}/projects`); }
export function votesRef(sessionId){ return ref(db, `demoDay/sessions/${sessionId}/votes`); }
export function hostPresenceRef(sessionId){ return ref(db, `demoDay/sessions/${sessionId}/hostPresence`); }

export const starterProjects = [
  { id:'team-alpha', title:'GlowUp Coffee', team:'Team Alpha', category:'Website Redesign', pitch:'A full redesign focused on clearer navigation, stronger branding, and mobile-first UX.', demoUrl:'https://example.com', repoUrl:'https://github.com/', members:'Ava, Noah, Eli', tech:'HTML, CSS, JavaScript' },
  { id:'team-beta', title:'TrailMix Outdoors', team:'Team Beta', category:'Interactive Experience', pitch:'A more modern and engaging experience with stronger calls to action and cleaner layout.', demoUrl:'https://example.com', repoUrl:'https://github.com/', members:'Mia, Jay, Zoe', tech:'Bootstrap, JS, Forms' },
  { id:'team-gamma', title:'Fresh Frame Studio', team:'Team Gamma', category:'Portfolio / Brand Site', pitch:'A polished redesign that improves readability, flow, and visual storytelling.', demoUrl:'https://example.com', repoUrl:'https://github.com/', members:'Leo, Emma, Kai', tech:'Responsive Design, UI Patterns' }
];

export function defaultSession(){
  return {
    title:'INF 286 Demo Day 🚀',
    subtitle:'You are not just turning in projects. You are launching them.',
    instructor:'Brandi Neal',
    course:'INF 286: Intro to Web Development',
    phase:'lobby',
    countdownSeconds:8,
    allowVoting:false,
    featuredProjectId:'',
    finalHeadline:'YOU BUILT THIS',
    finalSubhead:'INF 286 Final Projects • Ready to Launch 🚀',
    hypeTiles:['BUILD','DESIGN','CODE','SHIP'],
    updatedAt:Date.now()
  };
}

export async function ensureSession(sessionId){
  const sRef = sessionRef(sessionId);
  const snap = await get(sRef);
  if(!snap.exists()){
    await set(sRef, defaultSession());
    const projectPayload = {};
    starterProjects.forEach(p => projectPayload[p.id] = { ...p, votes:0, createdAt:Date.now() });
    await update(projectsRef(sessionId), projectPayload);
  }
  await set(hostPresenceRef(sessionId), { online:true, updatedAt:Date.now() });
  onDisconnect(hostPresenceRef(sessionId)).remove();
}

export async function saveProjects(sessionId, rawText){
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const payload = {};
  lines.forEach((line, idx) => {
    const [team,title,category,pitch,demoUrl,repoUrl,members,tech] = line.split('|').map(s => (s || '').trim());
    const id = (team || `team-${idx+1}`).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') || `team-${idx+1}`;
    payload[id] = {
      id,
      team: team || `Team ${idx+1}`,
      title: title || `Project ${idx+1}`,
      category: category || 'Final Project',
      pitch: pitch || 'A polished final project built in INF 286.',
      demoUrl: demoUrl || 'https://example.com',
      repoUrl: repoUrl || 'https://github.com/',
      members: members || 'Add team members',
      tech: tech || 'HTML, CSS, JavaScript',
      votes: 0,
      createdAt: Date.now() + idx
    };
  });
  await set(projectsRef(sessionId), payload);
  return payload;
}

export function projectsToText(projects){
  return Object.values(projects || {}).sort((a,b) => (a.createdAt||0) - (b.createdAt||0)).map(p => [p.team,p.title,p.category,p.pitch,p.demoUrl,p.repoUrl,p.members,p.tech].join('|')).join('\n');
}

export async function castVote(sessionId, participantId, projectId){
  const votePath = ref(db, `demoDay/sessions/${sessionId}/votes/${participantId}`);
  const current = await get(votePath);
  if(current.exists()) throw new Error('You already voted in this session.');
  await set(votePath, { participantId, projectId, votedAt:Date.now() });
  const projectPath = ref(db, `demoDay/sessions/${sessionId}/projects/${projectId}`);
  const projectSnap = await get(projectPath);
  const currentVotes = projectSnap.val()?.votes || 0;
  await update(projectPath, { votes: currentVotes + 1 });
}

export async function addReaction(sessionId, emoji, nickname=''){
  const r = push(ref(db, `demoDay/sessions/${sessionId}/reactions`));
  await set(r, { emoji, nickname, createdAt:Date.now() });
}

export { ref, set, update, get, onValue, remove };
