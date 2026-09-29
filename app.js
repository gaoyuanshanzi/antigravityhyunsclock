/* ============================================================
   app.js – Clock, Calendar, Post-it Notes
   ============================================================ */

/* ── Utility ── */
function pad(n) { return String(n).padStart(2, '0'); }

function koreanNow() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
}

/* ============================================================
   1. ANALOG CLOCK (Canvas)
   ============================================================ */
const canvas  = document.getElementById('clockCanvas');
const ctx     = canvas.getContext('2d');
const CX      = canvas.width  / 2;   // 170
const CY      = canvas.height / 2;   // 170
const R       = CX - 10;             // 160 – outer edge

const GREEN       = '#39ff14';
const GREEN_GLOW  = '#39ff14';
const GREEN_DIM   = '#156b00';

function drawClock() {
  const now  = koreanNow();
  const hrs  = now.getHours();
  const min  = now.getMinutes();
  const sec  = now.getSeconds();
  const ms   = now.getMilliseconds();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* ── Face ── */
  ctx.beginPath();
  ctx.arc(CX, CY, R, 0, Math.PI * 2);
  ctx.fillStyle = '#000';
  ctx.fill();

  /* outer glow ring */
  ctx.beginPath();
  ctx.arc(CX, CY, R, 0, Math.PI * 2);
  ctx.strokeStyle = GREEN;
  ctx.lineWidth   = 3;
  ctx.shadowColor = GREEN_GLOW;
  ctx.shadowBlur  = 14;
  ctx.stroke();
  ctx.shadowBlur  = 0;

  /* ── Minute / Second tick marks ── */
  for (let i = 0; i < 60; i++) {
    const angle    = (i / 60) * Math.PI * 2 - Math.PI / 2;
    const isDot    = i % 5 !== 0;       // dot ticks (non-5 min)
    const isMajor  = i % 5 === 0;       // major (hour) ticks

    if (isDot) {
      /* small neon dots on the outer ring */
      const dr = R - 10;
      const dx = CX + Math.cos(angle) * dr;
      const dy = CY + Math.sin(angle) * dr;
      ctx.beginPath();
      ctx.arc(dx, dy, 2.2, 0, Math.PI * 2);
      ctx.fillStyle  = GREEN;
      ctx.shadowColor = GREEN_GLOW;
      ctx.shadowBlur  = 6;
      ctx.fill();
      ctx.shadowBlur  = 0;
    } else {
      /* major tick lines */
      const inner = R - 22;
      const outer = R - 6;
      const x1 = CX + Math.cos(angle) * outer;
      const y1 = CY + Math.sin(angle) * outer;
      const x2 = CX + Math.cos(angle) * inner;
      const y2 = CY + Math.sin(angle) * inner;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = GREEN;
      ctx.lineWidth   = 2.5;
      ctx.shadowColor = GREEN_GLOW;
      ctx.shadowBlur  = 8;
      ctx.stroke();
      ctx.shadowBlur  = 0;
    }
  }

  /* ── 12-hour numerals (outer ring, large) ── */
  ctx.font         = 'bold 26px sans-serif';
  ctx.fillStyle    = GREEN;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor  = GREEN_GLOW;
  ctx.shadowBlur   = 10;
  const numR12     = R - 38;
  for (let h = 1; h <= 12; h++) {
    const angle = (h / 12) * Math.PI * 2 - Math.PI / 2;
    const nx = CX + Math.cos(angle) * numR12;
    const ny = CY + Math.sin(angle) * numR12;
    ctx.fillText(String(h), nx, ny);
  }
  ctx.shadowBlur = 0;

  /* ── 24-hour numerals (inner ring, small) ── */
  ctx.font      = '11px sans-serif';
  ctx.fillStyle = GREEN_DIM;
  const numR24  = R - 68;
  for (let h = 1; h <= 24; h++) {
    const angle = (h / 24) * Math.PI * 2 - Math.PI / 2;
    const nx = CX + Math.cos(angle) * numR24;
    const ny = CY + Math.sin(angle) * numR24;
    ctx.fillText(String(h), nx, ny);
  }

  /* ── Hands ── */
  const secFrac   = sec + ms / 1000;
  const minFrac   = min + secFrac / 60;
  const hrsFrac   = (hrs % 12) + minFrac / 60;

  function drawHand(fraction, total, length, width, glow) {
    const angle = (fraction / total) * Math.PI * 2 - Math.PI / 2;
    const tx    = CX + Math.cos(angle) * length;
    const ty    = CY + Math.sin(angle) * length;
    /* tail */
    const bx    = CX - Math.cos(angle) * (length * 0.18);
    const by    = CY - Math.sin(angle) * (length * 0.18);

    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(tx, ty);
    ctx.strokeStyle = GREEN;
    ctx.lineWidth   = width;
    ctx.lineCap     = 'round';
    if (glow) {
      ctx.shadowColor = GREEN_GLOW;
      ctx.shadowBlur  = 16;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  drawHand(hrsFrac,  12, R * 0.52, 7,  true);   // hour
  drawHand(minFrac,  60, R * 0.75, 5,  true);   // minute
  drawHand(secFrac,  60, R * 0.84, 2,  false);  // second (thin, no glow)

  /* second hand – red contrasting tip */
  const secAngle = (secFrac / 60) * Math.PI * 2 - Math.PI / 2;
  const sx = CX + Math.cos(secAngle) * R * 0.84;
  const sy = CY + Math.sin(secAngle) * R * 0.84;
  const sx2 = CX + Math.cos(secAngle) * R * 0.68;
  const sy2 = CY + Math.sin(secAngle) * R * 0.68;
  ctx.beginPath();
  ctx.moveTo(sx2, sy2);
  ctx.lineTo(sx, sy);
  ctx.strokeStyle = '#ff3b30';
  ctx.lineWidth = 2;
  ctx.stroke();

  /* ── Centre dot ── */
  ctx.beginPath();
  ctx.arc(CX, CY, 7, 0, Math.PI * 2);
  ctx.fillStyle  = '#fff';
  ctx.shadowColor = '#fff';
  ctx.shadowBlur  = 8;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.beginPath();
  ctx.arc(CX, CY, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#ff3b30';
  ctx.fill();
}

/* ── Digital time display ── */
function updateDigital() {
  const now = koreanNow();
  const h   = pad(now.getHours());
  const m   = pad(now.getMinutes());
  const s   = pad(now.getSeconds());
  document.getElementById('digitalTime').textContent = `${h}:${m}:${s}`;
}

function clockTick() {
  drawClock();
  updateDigital();
}
clockTick();
setInterval(clockTick, 50);   // smooth sweep


/* ============================================================
   2. CALENDAR
   ============================================================ */
const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];
const MONTHS_EN = [
  'JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE',
  'JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'
];

let calYear, calMonth;

function initCalendar() {
  const t = koreanNow();
  calYear  = t.getFullYear();
  calMonth = t.getMonth();
  renderCalendar();
}

function renderCalendar() {
  const today     = koreanNow();
  const todayY    = today.getFullYear();
  const todayM    = today.getMonth();
  const todayD    = today.getDate();

  document.getElementById('calMonthLabel').textContent = MONTHS_EN[calMonth];
  document.getElementById('calYearLabel').textContent  = calYear;

  /* build head */
  const head = document.getElementById('calDaysHead');
  head.innerHTML = '';
  DAYS_KO.forEach(d => {
    const th = document.createElement('th');
    th.textContent = d;
    head.appendChild(th);
  });

  /* first weekday of month */
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const body = document.getElementById('calBody');
  body.innerHTML = '';

  let d = 1;
  for (let row = 0; row < 6; row++) {
    if (d > daysInMonth) break;
    const tr = document.createElement('tr');
    for (let col = 0; col < 7; col++) {
      const td = document.createElement('td');
      const cellIdx = row * 7 + col;
      if (cellIdx < firstDay || d > daysInMonth) {
        td.className = 'empty';
        td.textContent = '';
      } else {
        td.innerHTML = `<div class="date-num">${d}</div>`;
        if (col === 0) td.classList.add('sunday');
        if (col === 6) td.classList.add('saturday');
        if (d === todayD && calMonth === todayM && calYear === todayY)
          td.classList.add('today');
        d++;
      }
      tr.appendChild(td);
    }
    body.appendChild(tr);
  }
}

document.getElementById('prevMonth').addEventListener('click', () => {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
});
document.getElementById('nextMonth').addEventListener('click', () => {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
});

initCalendar();


/* ============================================================
   3. POST-IT NOTES
   ============================================================ */
const STORAGE_KEY = 'hyuns-notes-v1';
let notes = [];
let editingId = null;

function loadNotes() {
  try { notes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { notes = []; }
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function plainText(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return (div.textContent || div.innerText || '').trim();
}

function renderNotes() {
  const list = document.getElementById('noteList');
  list.innerHTML = '';
  if (notes.length === 0) {
    list.innerHTML = '<p style="color:#aaa;font-size:.85rem;text-align:center;padding:20px;">메모가 없습니다. + 새 메모를 클릭하세요.</p>';
    return;
  }
  [...notes].reverse().forEach(note => {
    const item = document.createElement('div');
    item.className = 'note-item';
    item.dataset.id = note.id;

    const preview = document.createElement('div');
    preview.className = 'note-preview';
    preview.innerHTML = note.html.slice(0, 300);

    const dateEl = document.createElement('div');
    dateEl.className = 'note-date';
    dateEl.textContent = note.updatedAt;

    const actions = document.createElement('div');
    actions.className = 'note-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'note-btn edit';
    editBtn.textContent = '✏️ 편집';
    editBtn.addEventListener('click', e => { e.stopPropagation(); openModal(note.id); });

    const delBtn = document.createElement('button');
    delBtn.className = 'note-btn del';
    delBtn.textContent = '🗑 삭제';
    delBtn.addEventListener('click', e => { e.stopPropagation(); deleteNote(note.id); });

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    item.appendChild(preview);
    item.appendChild(dateEl);
    item.appendChild(actions);

    item.addEventListener('click', () => openModal(note.id));
    list.appendChild(item);
  });
}

function deleteNote(id) {
  if (!confirm('이 메모를 삭제하시겠습니까?')) return;
  notes = notes.filter(n => n.id !== id);
  saveNotes();
  renderNotes();
}

/* ── Modal open/close ── */
const modal    = document.getElementById('noteModal');
const editor   = document.getElementById('rteEditor');

function openModal(id) {
  editingId = id || null;
  if (id) {
    const note = notes.find(n => n.id === id);
    editor.innerHTML = note ? note.html : '';
  } else {
    editor.innerHTML = '';
  }
  modal.classList.remove('hidden');
  editor.focus();
}

function closeModal() {
  modal.classList.add('hidden');
  editingId = null;
}

document.getElementById('addNoteBtn').addEventListener('click', () => openModal(null));
document.getElementById('closeModal').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

/* ── Save ── */
document.getElementById('saveNote').addEventListener('click', () => {
  const html    = editor.innerHTML.trim();
  const nowStr  = koreanNow().toLocaleString('ko-KR');
  if (!html || html === '<br>') { alert('내용을 입력해주세요.'); return; }

  if (editingId) {
    const idx = notes.findIndex(n => n.id === editingId);
    if (idx !== -1) { notes[idx].html = html; notes[idx].updatedAt = nowStr; }
  } else {
    notes.push({ id: genId(), html, updatedAt: nowStr });
  }
  saveNotes();
  renderNotes();
  closeModal();
});

/* ── RTE helpers ── */
window.execCmd = function(cmd) {
  document.execCommand(cmd, false, null);
  editor.focus();
};

document.getElementById('fontSizeSelect').addEventListener('change', function() {
  document.execCommand('fontSize', false, this.value);
  editor.focus();
});

document.getElementById('colorPicker').addEventListener('input', function() {
  document.execCommand('foreColor', false, this.value);
  editor.focus();
});

/* ── Export ── */
document.getElementById('exportHTML').addEventListener('click', () => {
  const note = editingId ? notes.find(n => n.id === editingId) : null;
  const html = note
    ? `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>메모</title></head><body style="font-family:sans-serif;padding:20px">${note.html}</body></html>`
    : `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>메모</title></head><body style="font-family:sans-serif;padding:20px">${editor.innerHTML}</body></html>`;
  download('memo.html', html, 'text/html');
});

document.getElementById('exportTXT').addEventListener('click', () => {
  const note = editingId ? notes.find(n => n.id === editingId) : null;
  const txt  = plainText(note ? note.html : editor.innerHTML);
  download('memo.txt', txt, 'text/plain');
});

function download(filename, content, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type: `${type};charset=utf-8` }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ── Init ── */
loadNotes();
renderNotes();
