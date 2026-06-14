import { useState, useRef, useEffect, useCallback } from "react";

// ─── System prompts ────────────────────────────────────────────────────────
const PROMPTS = {
  en: {
    formal: `You are Profess — a communication coach for high-stakes formal situations.

SESSION MODE: FORMAL | LANGUAGE: ENGLISH
Respond entirely in English.

Your approach: rigorous, precise, demanding. You embody the audience and respond exactly as they would. You step out as coach after each exchange — but only after the exchange is complete.

IDENTITY TAGS — append to EVERY message (no exceptions):
[ROLE:role_name][MOOD:mood_name][MODE:mode_name][INNER:inner_thought]

ROLE: interviewer | examiner | journalist | judge | client | opponent | negotiator | default
MOOD: neutral | surprised | amused | thinking | warm | skeptical | serious | uncomfortable
MODE: dialog (fully in-role, zero coaching) | coaching (everything else)
INNER: 3-8 word private thought. No asterisks. No italic markers. Plain text only.
Example: [INNER:They are avoiding the real question.] or [INNER:Stronger than I expected.]

## STAGE DIRECTIONS — EXACT FORMAT REQUIRED
In dialog mode, physical actions go on their OWN SEPARATE LINE using double parentheses:
((action here))

Correct example:
((leans back, arms crossed))
I have heard that argument before. What else do you have?

Wrong — never do this:
*leans back* I have heard that argument before.
*leans back, arms crossed* — never mix action and dialog on one line.

NEVER use asterisks. NEVER use em-dashes for actions. The (( )) format is mandatory.

## SESSION FLOW — CRITICAL FOR DEBATE AND ROLEPLAY
Do NOT break character to coach after every single user message.
The correct flow is:
1. User speaks (argument, question, pitch, answer)
2. You respond IN-ROLE as the character — push back, ask follow-up, react
3. Only step out to coach after a meaningful in-role exchange (2-4 turns minimum)
4. Exception: if the user explicitly asks for feedback, coach immediately

For debate practice specifically:
- After user gives an argument, respond as the OPPONENT — challenge it, POI, rebut
- Do not coach after every speech turn — let the debate breathe
- Coach only after a full exchange, or when the user signals they want feedback

## COACHING QUALITY — READ CAREFULLY
Before giving feedback, ask yourself these questions silently:
1. Did the user's argument ALREADY address this potential weakness? If yes, do not criticize it.
2. What is the MOST DANGEROUS weakness — the one that causes the most damage if exploited? Lead with that, not the easiest one to spot.
3. Is there a logical inconsistency, or did I just fail to understand the user's framing?

Feedback that criticizes a point the user already covered is worse than no feedback. It undermines trust and wastes the user's time.

## COACHING BREVITY — NON-NEGOTIABLE
Coaching feedback is EXACTLY 3 sentences. Not 4. Not 5. Three.
Sentence 1: The single most dangerous weakness — the one that will hurt most if exploited.
Sentence 2: Why specifically this audience will exploit it, and how.
Sentence 3: One concrete alternative — write it out as the user should say it.
Zero preamble. Zero headers. Zero bullet points. Cut everything else.

When in doubt about MODE: use coaching.
Start by asking: who they are, what situation, how hard to push. One question max.

Core rules:
- Never criticize what the user already addressed — read the full argument before responding
- Identify the most dangerous weakness, not the most obvious one
- Show the audience unspoken reaction
- You cannot move people you do not understand.`,

    social: `You are Profess — a communication coach for social and interpersonal situations.

SESSION MODE: SOCIAL | LANGUAGE: ENGLISH
Respond entirely in English.

Your approach: warm but honest. You embody the social character the user describes and respond as that person would. You step out as coach after a natural exchange — not after every single message.

IDENTITY TAGS — append to EVERY message (no exceptions):
[ROLE:role_name][MOOD:mood_name][MODE:mode_name][INNER:inner_thought]

ROLE: friend_female | friend_male | colleague | stranger | default
MOOD: neutral | surprised | amused | thinking | warm | skeptical | serious | uncomfortable
MODE: dialog | coaching
INNER: 3-8 word private thought. No asterisks. Plain text only.
Example: [INNER:This is actually going well.]

## STAGE DIRECTIONS — EXACT FORMAT REQUIRED
Physical actions on their OWN LINE:
((action here))

Correct:
((smiles, glances away))
Oh wow — I had no idea you were at UI too.

Wrong:
*smiles and glances away* Oh wow, I had no idea.

NEVER use asterisks.

## SESSION FLOW
Respond in-role for 2-3 turns before stepping out to coach.
Let the conversation breathe. Real social practice requires sustained exchange, not constant interruption.

## COACHING BREVITY — NON-NEGOTIABLE
Exactly 3 sentences:
Sentence 1: The most important thing that landed well or did not (be specific about what and why).
Sentence 2: What the other person was actually feeling — their internal reaction, not just their surface response.
Sentence 3: One concrete thing to try — write it out as the user should say it.
No headers. No bullets. Three sentences only.

Core rules:
- Social skill is real skill — same rigor as formal communication
- Show the other person inner reaction, not just their words
- You cannot move people you do not understand.`,
  },
    id: {
    formal: `Kamu adalah Profess — pelatih komunikasi untuk situasi formal bertaruhan tinggi.

MODE SESI: FORMAL | BAHASA: INDONESIA
Balas seluruhnya dalam Bahasa Indonesia.

Pendekatanmu: ketat, presisi, menuntut. Kamu menjelma sebagai audiens dan merespons persis seperti yang mereka lakukan. Kamu keluar sebagai coach setelah pertukaran selesai — bukan setelah setiap pesan.

IDENTITY TAGS — tambahkan di SETIAP pesan:
[ROLE:role_name][MOOD:mood_name][MODE:mode_name][INNER:inner_thought]

ROLE: interviewer | examiner | journalist | judge | client | opponent | negotiator | default
MOOD: neutral | surprised | amused | thinking | warm | skeptical | serious | uncomfortable
MODE: dialog | coaching
INNER: Pikiran privat 3-8 kata. Tanpa asterisk. Teks biasa saja.
Contoh: [INNER:Mereka menghindari pertanyaan utamanya.]

## FORMAT STAGE DIRECTION — WAJIB MUTLAK
Aksi fisik HARUS di BARIS SENDIRI:
((aksi di sini))

Benar:
((bersandar, tangan bersilang))
Saya sudah dengar argumen itu sebelumnya.

Salah:
*bersandar* Saya sudah dengar argumen itu.

JANGAN gunakan asterisk.

## KONTEKS BUDAYA INDONESIA — PENTING
Dalam simulasi formal berbahasa Indonesia, karakter harus mencerminkan norma budaya Indonesia:
- Panggilan kehormatan digunakan sesuai konteks: Pak, Bu, Mas, Mbak — bahkan dalam setting formal
- Hierarki sangat dihormati — atasan, penguji, hakim, pewawancara diperlakukan dengan hormat tinggi
- Komunikasi formal Indonesia cenderung lebih sopan dan tidak langsung dibanding barat
- Kritik disampaikan dengan lebih halus — namun tetap tegas dalam substansi

## ALUR SESI — PENTING
Jangan keluar dari karakter untuk coaching setelah setiap pesan.
Alur yang benar:
1. User berbicara
2. Kamu merespons IN-ROLE — tantang, tanya balik, reaksi
3. Baru coaching setelah 2-4 pertukaran bermakna
Untuk latihan debat: respons sebagai LAWAN DEBAT dulu sebelum coaching.

## KUALITAS COACHING — BACA DENGAN TELITI
Sebelum memberi feedback:
1. Apakah user SUDAH mengantisipasi kelemahan ini? Jika ya, jangan kritik.
2. Apa kelemahan PALING BERBAHAYA? Mulai dari sana, bukan yang paling mudah.
3. Apakah ini benar-benar inkonsistensi, atau saya gagal memahami framing user?

## SINGKATNYA COACHING — WAJIB MUTLAK
Tepat 3 kalimat. Tidak lebih.
Kalimat 1: Kelemahan paling berbahaya — yang paling merusak jika dieksploitasi.
Kalimat 2: Mengapa audiens ini spesifiknya akan mengeksploitasi kelemahan itu.
Kalimat 3: Satu alternatif konkret — tulis persis seperti yang seharusnya user katakan.
Tanpa pembuka. Tanpa header. Tanpa poin-poin.

Aturan inti:
- Jangan kritik apa yang sudah di-address user
- Identifikasi kelemahan paling berbahaya, bukan yang paling mudah
- Kamu tidak bisa menggerakkan orang yang tidak kamu pahami.`,

    social: `Kamu adalah Profess — pelatih komunikasi untuk situasi sosial dan interpersonal.

MODE SESI: SOSIAL | BAHASA: INDONESIA
Balas seluruhnya dalam Bahasa Indonesia.

IDENTITY TAGS — tambahkan di SETIAP pesan:
[ROLE:role_name][MOOD:mood_name][MODE:mode_name][INNER:inner_thought]

ROLE: friend_female | friend_male | colleague | stranger | default
MOOD: neutral | surprised | amused | thinking | warm | skeptical | serious | uncomfortable
MODE: dialog | coaching
INNER: Pikiran privat 3-8 kata. Tanpa asterisk. Teks biasa.
Contoh: [INNER:Ini sebenarnya berjalan baik.]

## FORMAT STAGE DIRECTION — WAJIB
((aksi di sini)) — di baris sendiri. JANGAN gunakan asterisk.

## KONTEKS BUDAYA INDONESIA — PENTING
Dalam simulasi sosial berbahasa Indonesia, karakter harus mencerminkan norma budaya Indonesia, bukan barat:
- Panggilan kehormatan sangat penting: Om, Tante, Pak, Bu, Mas, Mbak, Kak — gunakan sesuai konteks usia dan status
- Orang yang lebih tua jarang meminta dipanggil nama saja tanpa gelar — lebih umum "Om Budi", "Mas Andi", "Kak Sari"
- Hierarki sosial dan penghormatan kepada yang lebih tua atau lebih senior adalah norma, bukan pilihan
- Komunikasi tidak langsung dan menjaga muka (face-saving) adalah hal yang umum
- Keakraban dibangun perlahan — tidak seperti budaya barat yang lebih cepat informal

## ALUR SESI
Respons in-role selama 2-3 ronde sebelum coaching. Biarkan percakapan mengalir.

## SINGKATNYA COACHING — WAJIB MUTLAK
Tepat 3 kalimat:
Kalimat 1: Hal terpenting yang berhasil atau tidak — spesifik.
Kalimat 2: Apa yang sebenarnya dirasakan orang lain saat itu.
Kalimat 3: Satu hal konkret — tulis persis seperti yang seharusnya user katakan.

Aturan inti:
- Keterampilan sosial adalah keterampilan nyata
- Tunjukkan reaksi batin orang lain
- Kamu tidak bisa menggerakkan orang yang tidak kamu pahami.`,
  }
};

// ─── Character definitions ─────────────────────────────────────────────────
const CHARS = {
  default:       { name: "Profess",         title: "Your Coach",            accent: "#C8B89A", bg: "#16130F", skin: "#C8A882", hair: "#2A1F14", hairLong: false, glasses: false, beard: false, bodyColor: "#2A2520", tie: null },
  interviewer:   { name: "Ms. Chen",        title: "HR Interviewer",        accent: "#7BA7BC", bg: "#111620", skin: "#D4987A", hair: "#1A0A08", hairLong: true,  glasses: false, beard: false, bodyColor: "#1E2A3A", tie: null },
  examiner:      { name: "Prof. Wijaya",    title: "Thesis Examiner",       accent: "#B09050", bg: "#171410", skin: "#C89060", hair: "#D0CDC6", hairLong: false, glasses: false, beard: true,  bodyColor: "#1A1A2A", tie: null },
  journalist:    { name: "Ms. Rahmawati",  title: "Senior Correspondent",  accent: "#BC7A7A", bg: "#181010", skin: "#C8A070", hair: "#180E06", hairLong: true,  glasses: false, beard: false, bodyColor: "#2A1A1A", tie: null },
  judge:         { name: "The Judge",       title: "Debate Adjudicator",    accent: "#8AAA7A", bg: "#111812", skin: "#B89070", hair: "#2A2018", hairLong: false, glasses: false, beard: false, bodyColor: "#1A2A1A", tie: null },
  client:        { name: "The Client",      title: "Decision Maker",        accent: "#A07AB8", bg: "#151218", skin: "#D4A870", hair: "#3A2A18", hairLong: false, glasses: false, beard: false, bodyColor: "#22182A", tie: null },
  opponent:      { name: "The Opponent",    title: "Opposition Speaker",    accent: "#BC8A5A", bg: "#171310", skin: "#C89A60", hair: "#1A1008", hairLong: false, glasses: false, beard: false, bodyColor: "#2A1E12", tie: null },
  negotiator:    { name: "The Counterpart", title: "Negotiation Partner",   accent: "#8AB87A", bg: "#111812", skin: "#B8906A", hair: "#2A1A10", hairLong: false, glasses: false, beard: false, bodyColor: "#1A2818", tie: "#8AB87A" },
  lawyer:        { name: "Mr. Reeves",      title: "Defense Lawyer",        accent: "#B0A890", bg: "#141414", skin: "#D4A87A", hair: "#1A1008", hairLong: false, glasses: true,  beard: false, bodyColor: "#1A1A1A", tie: "#8A7A6A" },
  friend_female: { name: "Her",             title: "Old Friend",            accent: "#D490B8", bg: "#181220", skin: "#E8B898", hair: "#1A0808", hairLong: true,  glasses: false, beard: false, bodyColor: "#2A1E28", tie: null },
  friend_male:   { name: "Him",             title: "Old Friend",            accent: "#7A9AB8", bg: "#111620", skin: "#C49060", hair: "#1A1008", hairLong: false, glasses: false, beard: false, bodyColor: "#1E2228", tie: null },
  colleague:     { name: "Colleague",       title: "Coworker",              accent: "#B8A87A", bg: "#161610", skin: "#C8A070", hair: "#2A1A10", hairLong: false, glasses: false, beard: false, bodyColor: "#22201A", tie: null },
  stranger:      { name: "Stranger",        title: "Someone New",           accent: "#909090", bg: "#131313", skin: "#B89878", hair: "#3A3020", hairLong: false, glasses: false, beard: false, bodyColor: "#1E1E1E", tie: null },
  parent:        { name: "Parent",          title: "Your Parent",           accent: "#9AB88A", bg: "#121814", skin: "#C89060", hair: "#6A5040", hairLong: false, glasses: true,  beard: false, bodyColor: "#1E2418", tie: null },
};

const MOOD_DATA = {
  neutral:       { browL:"M54 88 Q62 84 70 87", browR:"M90 87 Q98 84 106 88", eyeRy:5.5, eyeLy:5.5, mouth:"neutral",  blush:0,   think:false, sweat:false },
  surprised:     { browL:"M53 83 Q62 77 71 82", browR:"M90 82 Q98 77 107 83", eyeRy:8.5, eyeLy:8.5, mouth:"surprised",blush:.28, think:false, sweat:false },
  amused:        { browL:"M54 89 Q62 85 70 88", browR:"M90 88 Q98 85 106 89", eyeRy:3.5, eyeLy:3.5, mouth:"amused",   blush:.42, think:false, sweat:false },
  thinking:      { browL:"M54 87 Q62 82 70 86", browR:"M90 85 Q98 82 106 87", eyeRy:4.5, eyeLy:4.5, mouth:"thinking", blush:0,   think:true,  sweat:false },
  warm:          { browL:"M54 90 Q62 86 70 89", browR:"M90 89 Q98 86 106 90", eyeRy:4,   eyeLy:4,   mouth:"warm",     blush:.5,  think:false, sweat:false },
  skeptical:     { browL:"M53 86 Q62 81 71 85", browR:"M90 88 Q98 85 106 89", eyeRy:4,   eyeLy:5.5, mouth:"skeptical",blush:0,   think:false, sweat:false },
  serious:       { browL:"M53 87 L71 89",        browR:"M90 89 L108 87",       eyeRy:5.5, eyeLy:5.5, mouth:"serious",  blush:0,   think:false, sweat:false },
  uncomfortable: { browL:"M54 89 Q62 93 70 89", browR:"M90 89 Q98 93 106 89", eyeRy:5.5, eyeLy:5.5, mouth:"uncomf",   blush:.35, think:false, sweat:true  },
};

function darken(hex, amt) {
  try { let r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16); return `#${Math.max(0,r-amt).toString(16).padStart(2,"0")}${Math.max(0,g-amt).toString(16).padStart(2,"0")}${Math.max(0,b-amt).toString(16).padStart(2,"0")}`; } catch { return hex; }
}
function lighten(hex, amt) {
  try { let r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16); return `#${Math.min(255,r+amt).toString(16).padStart(2,"0")}${Math.min(255,g+amt).toString(16).padStart(2,"0")}${Math.min(255,b+amt).toString(16).padStart(2,"0")}`; } catch { return hex; }
}

function buildSVG(roleKey, mood, isTalking) {
  const c = CHARS[roleKey] || CHARS.default;
  const s = c.skin, h = c.hair, b = c.bodyColor;
  const md = MOOD_DATA[mood] || MOOD_DATA.neutral;
  const hairDark = darken(h, 25);

  const hairSVG = c.hairLong
    ? `<ellipse cx="80" cy="46" rx="34" ry="20" fill="${h}"/>
       <rect x="46" y="46" width="68" height="22" fill="${h}"/>
       <ellipse cx="47" cy="88" rx="11" ry="34" fill="${h}"/>
       <ellipse cx="113" cy="88" rx="11" ry="34" fill="${h}"/>
       <ellipse cx="80" cy="130" rx="34" ry="14" fill="${h}" opacity=".7"/>`
    : `<ellipse cx="80" cy="47" rx="33" ry="18" fill="${h}"/>
       <rect x="47" y="47" width="66" height="22" fill="${h}"/>`;

  const glassesSVG = c.glasses
    ? `<rect x="54" y="79" rx="4" width="22" height="14" fill="none" stroke="#4A3828" stroke-width="2.5"/>
       <rect x="84" y="79" rx="4" width="22" height="14" fill="none" stroke="#4A3828" stroke-width="2.5"/>
       <line x1="76" y1="86" x2="84" y2="86" stroke="#4A3828" stroke-width="2"/>
       <line x1="54" y1="85" x2="46" y2="83" stroke="#4A3828" stroke-width="2"/>
       <line x1="106" y1="85" x2="114" y2="83" stroke="#4A3828" stroke-width="2"/>` : "";

  const beardSVG = c.beard
    ? `<ellipse cx="80" cy="116" rx="22" ry="10" fill="#D0CCC5"/>
       <path d="M58 110 Q80 124 102 110" fill="#D0CCC5"/>` : "";

  const browsSVG = `<path d="${md.browL}" stroke="${hairDark}" stroke-width="2.8" fill="none" stroke-linecap="round"/>
                    <path d="${md.browR}" stroke="${hairDark}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;

  const eyeSquint = mood === "amused" || mood === "warm";
  const [ex, ely, ery] = [6, md.eyeLy, md.eyeRy];
  const eyeL = eyeSquint
    ? `<path d="M${62-ex} 86 Q62 ${86-ely} ${62+ex} 86 Q62 ${86+ely*.55} ${62-ex} 86Z" fill="#1A1209"/>`
    : `<ellipse cx="62" cy="86" rx="${ex}" ry="${ely}" fill="#1A1209"/>`;
  const eyeR = eyeSquint
    ? `<path d="M${98-ex} 86 Q98 ${86-ery} ${98+ex} 86 Q98 ${86+ery*.55} ${98-ex} 86Z" fill="#1A1209"/>`
    : `<ellipse cx="98" cy="86" rx="${ex}" ry="${ery}" fill="#1A1209"/>`;

  const noseSVG = `<path d="M77 97 Q80 102 83 97" stroke="#9A7860" stroke-width="1.5" fill="none" stroke-linecap="round"/>
                   <circle cx="76" cy="100" r="1.5" fill="${darken(s,8)}" opacity=".45"/>
                   <circle cx="84" cy="100" r="1.5" fill="${darken(s,8)}" opacity=".45"/>`;

  let mouthSVG;
  const my = 110;
  if (isTalking) {
    mouthSVG = `<ellipse cx="80" cy="${my+3}" rx="11" ry="9" fill="#3A1A0A"/>
                <ellipse cx="80" cy="${my+3}" rx="8.5" ry="5.5" fill="#5A2A1A"/>
                <path d="M69 ${my+3} Q80 ${my-1} 91 ${my+3}" stroke="#7A4030" stroke-width="1" fill="none"/>`;
  } else {
    mouthSVG = {
      neutral:   `<path d="M68 ${my} Q80 ${my+5} 92 ${my}" stroke="#8A6050" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
      surprised: `<ellipse cx="80" cy="${my+4}" rx="9" ry="8.5" fill="#3A1A0A"/>`,
      amused:    `<path d="M66 ${my-2} Q80 ${my+13} 94 ${my-2}" stroke="#C87A60" stroke-width="3" fill="none" stroke-linecap="round"/>
                  <path d="M66 ${my-2} Q80 ${my+13} 94 ${my-2}" fill="#E89070" opacity=".28"/>`,
      thinking:  `<path d="M70 ${my+2} Q82 ${my} 92 ${my+4}" stroke="#8A6050" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
      warm:      `<path d="M66 ${my-1} Q80 ${my+11} 94 ${my-1}" stroke="#C87A60" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
      skeptical: `<path d="M68 ${my+2} Q79 ${my} 92 ${my+5}" stroke="#8A6050" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
      serious:   `<line x1="68" y1="${my+1}" x2="92" y2="${my+1}" stroke="#6A4030" stroke-width="3" stroke-linecap="round"/>`,
      uncomf:    `<path d="M68 ${my+4} Q80 ${my-2} 92 ${my+4}" stroke="#8A6050" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                  <path d="M92 ${my+4} Q95 ${my+7} 98 ${my+4}" stroke="#8A6050" stroke-width="2" fill="none"/>`,
    }[md.mouth] || "";
  }

  const blushSVG = md.blush > 0
    ? `<ellipse cx="52" cy="97" rx="11" ry="6.5" fill="#E87060" opacity="${md.blush}"/>
       <ellipse cx="108" cy="97" rx="11" ry="6.5" fill="#E87060" opacity="${md.blush}"/>` : "";

  const thinkSVG = md.think
    ? `<circle cx="108" cy="68" r="4" fill="${s}" stroke="#C0A890" stroke-width="1.5"/>
       <circle cx="115" cy="59" r="3.5" fill="${s}" stroke="#C0A890" stroke-width="1.5"/>
       <circle cx="121" cy="51" r="6.5" fill="${s}" stroke="#C0A890" stroke-width="1.5"/>
       <text x="121" y="54.5" font-size="9" fill="#6A5040" text-anchor="middle" font-weight="bold">?</text>` : "";

  const sweatSVG = md.sweat
    ? `<path d="M108 62 Q111 69 107.5 71 Q103.5 69 108 62Z" fill="#A8C8E8" opacity=".88"/>` : "";

  let bodySVG = "";
  const armL = `<rect x="20" y="132" rx="10" width="22" height="54" fill="${b}"/>`;
  const armR = `<rect x="118" y="132" rx="10" width="22" height="54" fill="${b}"/>`;

  switch(roleKey) {
    case "interviewer":
      bodySVG = `<rect x="40" y="128" rx="8" width="80" height="92" fill="${b}"/>
        <path d="M58 128 L80 150 L102 128 L94 128 L80 144 L66 128Z" fill="#243A52"/>
        <rect x="68" y="128" width="24" height="26" fill="#EAE7E0"/>
        ${armL}<rect x="14" y="166" rx="3" width="30" height="40" fill="#EAE0D0"/>
        <rect x="22" y="160" rx="2" width="12" height="10" fill="#9A8A7A"/>
        <line x1="18" y1="178" x2="40" y2="178" stroke="#ADA090" stroke-width="1.5"/>
        <line x1="18" y1="185" x2="40" y2="185" stroke="#ADA090" stroke-width="1.5"/>
        ${armR}`; break;
    case "lawyer":
      bodySVG = `<rect x="40" y="128" rx="8" width="80" height="92" fill="${b}"/>
        <path d="M58 128 L80 150 L102 128 L94 128 L80 144 L66 128Z" fill="#111"/>
        <rect x="68" y="128" width="24" height="26" fill="#EAE7E0"/>
        <path d="M74 128 L80 141 L86 128" fill="${c.tie||"#8A7A6A"}"/>
        ${armL}${armR}
        <rect x="116" y="152" rx="3" width="28" height="38" fill="#EAE0D0"/>
        <line x1="120" y1="160" x2="140" y2="160" stroke="#9A9080" stroke-width="1.5"/>
        <line x1="120" y1="167" x2="140" y2="167" stroke="#9A9080" stroke-width="1.5"/>`; break;
    case "examiner":
      bodySVG = `<rect x="36" y="128" rx="8" width="88" height="92" fill="${b}"/>
        <path d="M54 128 L80 150 L106 128" fill="#7A5A20" opacity=".9"/>
        ${armL}<rect x="118" y="116" rx="10" width="20" height="54" fill="${b}" style="transform:rotate(-20deg);transform-origin:128px 143px"/>
        <rect x="121" y="93" rx="2" width="5" height="30" fill="#C8A840" style="transform:rotate(20deg);transform-origin:123px 108px"/>
        <circle cx="124" cy="91" r="5" fill="#E8C850"/>`; break;
    case "journalist":
      bodySVG = `<rect x="40" y="128" rx="8" width="80" height="92" fill="${b}"/>
        <rect x="88" y="138" rx="3" width="24" height="16" fill="#EAE0D0"/>
        <rect x="90" y="140" rx="2" width="20" height="6" fill="#BC7A7A"/>
        ${armL}${armR}
        <rect x="116" y="154" rx="6" width="14" height="22" fill="#3A3A3A"/>
        <circle cx="123" cy="156" r="8" fill="#4A4A4A"/>
        <circle cx="123" cy="156" r="5" fill="#2A2A2A"/>`; break;
    case "judge":
      bodySVG = `<rect x="40" y="128" rx="8" width="80" height="92" fill="${b}"/>
        <path d="M58 128 L80 150 L102 128 L94 128 L80 144 L66 128Z" fill="#243224"/>
        ${armL}${armR}
        <rect x="118" y="166" rx="3" width="28" height="36" fill="#EAE7DC"/>
        <line x1="122" y1="174" x2="142" y2="174" stroke="#9A9A8A" stroke-width="2"/>
        <line x1="122" y1="181" x2="142" y2="181" stroke="#9A9A8A" stroke-width="1.5"/>`; break;
    case "negotiator":
      bodySVG = `<rect x="40" y="128" rx="8" width="80" height="92" fill="${b}"/>
        <path d="M58 128 L80 148 L102 128 L94 128 L80 142 L66 128Z" fill="#243A22"/>
        <path d="M77 128 L80 138 L83 128" fill="${c.tie||"#8AB87A"}"/>
        <rect x="20" y="134" rx="10" width="22" height="48" fill="${b}" style="transform:rotate(14deg);transform-origin:31px 158px"/>
        <rect x="118" y="134" rx="10" width="22" height="48" fill="${b}" style="transform:rotate(-14deg);transform-origin:129px 158px"/>`; break;
    case "friend_female":
      bodySVG = `<rect x="42" y="130" rx="14" width="76" height="90" fill="${b}"/>
        <path d="M58 130 Q80 141 102 130" fill="none" stroke="#C890A0" stroke-width="2.5"/>
        <rect x="20" y="136" rx="10" width="22" height="50" fill="${b}"/>
        <rect x="118" y="136" rx="10" width="22" height="50" fill="${b}"/>`; break;
    case "parent":
      bodySVG = `<rect x="40" y="128" rx="10" width="80" height="92" fill="${b}"/>
        <path d="M58 128 Q80 137 102 128" fill="none" stroke="#5A7050" stroke-width="2"/>
        ${armL}${armR}`; break;
    default:
      bodySVG = `<rect x="42" y="130" rx="12" width="76" height="90" fill="${b}"/>
        <path d="M60 130 Q80 142 100 130" fill="none" stroke="${darken(b,10)}" stroke-width="1.5"/>
        ${armL}${armR}`;
  }

  return `<svg viewBox="0 0 160 240" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;overflow:visible">
    ${bodySVG}
    <circle cx="80" cy="82" r="42" fill="${s}"/>
    ${hairSVG}
    <ellipse cx="38" cy="86" rx="7" ry="9" fill="${s}"/>
    <ellipse cx="122" cy="86" rx="7" ry="9" fill="${s}"/>
    ${beardSVG}${glassesSVG}
    ${browsSVG}
    ${eyeL}${eyeR}
    <circle cx="64" cy="83" r="2" fill="white" opacity=".9"/>
    <circle cx="100" cy="83" r="2" fill="white" opacity=".9"/>
    ${noseSVG}${mouthSVG}${blushSVG}
    ${thinkSVG}${sweatSVG}
  </svg>`;
}

// ─── Main component ────────────────────────────────────────────────────────
export default function Profess() {
  const [screen, setScreen] = useState("lang"); // lang | mode | disclaimer | session
  const [lang, setLang] = useState(null); // en | id
  const [sessionMode, setSessionMode] = useState(null);
  const [pendingMode, setPendingMode] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentRole, setCurrentRole] = useState("default");
  const [currentMood, setCurrentMood] = useState("neutral");
  const [isInRole, setIsInRole] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTalking, setIsTalking] = useState(false); // mouth animation
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState(null);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const speechRef = useRef(null);
  const recognitionRef = useRef(null);
  const talkTimerRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const extractRole = (t) => (t.match(/\[ROLE:(\w+)\]/) || [])[1] || null;
  const extractMood = (t) => (t.match(/\[MOOD:(\w+)\]/) || [])[1] || null;
  const extractMode = (t) => (t.match(/\[MODE:(\w+)\]/) || [])[1] || null;
  const extractInner = (t) => { const m = t.match(/\[INNER:(.*?)\]/); return m ? m[1].replace(/\*/g,"").trim() : null; };
  const cleanText = (t) => t
    .replace(/\[ROLE:\w+\]/g,"").replace(/\[MOOD:\w+\]/g,"")
    .replace(/\[MODE:\w+\]/g,"").replace(/\[INNER:.*?\]/g,"")
    .replace(/^---+$/gm, "").trim();

  // Segment types: 'stage' | 'dialog' | 'divider' | 'coaching'
  const parseSegments = (text) => {
    const segments = [];
    const lines = text.split('\n');
    let inCoaching = false;

    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (!trimmed) {
        // Empty line — if we have content, add spacing
        if (segments.length > 0 && segments[segments.length-1].type !== 'divider') {
          segments.push({ type: 'divider' });
        }
        continue;
      }

      // Strip --- dividers entirely (visual noise)
      if (/^---+$/.test(trimmed)) continue;

      // Detect coaching sections by common markers
      const coachingMarkers = [
        /^COACHING/i, /^COACH/i, /^FEEDBACK/i,
        /^CATATAN/i, /^KOREKSI/i, /^ANALISIS/i,
        /^\[Stepping out/i, /^\*\[Stepping out/i,
      ];
      if (coachingMarkers.some(r => r.test(trimmed))) {
        inCoaching = true;
        segments.push({ type: 'section_break' });
        // Strip the coaching header label itself — don't show it
        continue;
      }

      // Stage direction: (( ))
      const stageMatch = trimmed.match(/^\(\((.*?)\)\)$/);
      if (stageMatch) {
        inCoaching = false;
        segments.push({ type: 'stage', text: stageMatch[1].trim() });
        continue;
      }

      // Regular text
      const lastSeg = segments.length > 0 ? segments[segments.length-1] : null;
      const segType = inCoaching ? 'coaching' : 'dialog';

      if (lastSeg && lastSeg.type === segType) {
        lastSeg.text += ' ' + trimmed;
      } else {
        segments.push({ type: segType, text: trimmed });
      }
    }

    // Clean up trailing dividers
    while (segments.length > 0 && ['divider','section_break'].includes(segments[segments.length-1].type)) {
      segments.pop();
    }

    return segments;
  };

  const scrubForSpeech = (text) => text
    // Strip all bracket tags
    .replace(/\[.*?\]/g, '')
    .replace(/\(\(.*?\)\)/g, '')
    // Strip dividers
    .replace(/^---+$/gm, '')
    // Strip markdown
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_{1,2}(.*?)_{1,2}/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    // Strip punctuation that TTS reads literally
    .replace(/—/g, ', ')
    .replace(/–/g, ', ')
    .replace(/ - /g, ', ')
    .replace(/\.\.\./g, '. ')
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    // Strip remaining symbols
    .replace(/[*_~`#|>]/g, '')
    .replace(/\[|\]/g, '')
    .replace(/\(|\)/g, '')
    // Clean whitespace
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .substring(0, 700);

  const cleanForSpeech = scrubForSpeech;

  const getVoiceProfile = useCallback((role, mood, inRole, isInnerThought = false) => {
    const voices = window.speechSynthesis?.getVoices() || [];
    const byName = (name) => voices.find(v => v.name === name);
    const isID = lang === "id";

    // For Indonesian sessions: use Google Bahasa Indonesia for all roles
    // Rate tuned slower because Indonesian TTS needs more time to sound natural
    if (isID) {
      const idVoice = byName("Google Bahasa Indonesia") ||
        voices.find(v => v.lang === "id-ID") ||
        byName("Google UK English Male") || // last resort fallback
        voices.find(v => v.lang?.startsWith("en"));

      let rate = 1.05, pitch = 1.0, volume = 0.92;

      // Indonesian voice sounds clearer at slightly slower rate than English
      if (!inRole) { rate = 1.0; pitch = 1.0; }
      else {
        switch(role) {
          case "interviewer":   rate = 0.98; pitch = 1.02; break;
          case "journalist":    rate = 1.06; pitch = 1.04; break;
          case "judge":         rate = 0.92; pitch = 0.96; break;
          case "examiner":      rate = 0.94; pitch = 0.97; break;
          case "lawyer":        rate = 0.96; pitch = 0.98; break;
          case "opponent":      rate = 1.08; pitch = 1.0;  break;
          case "parent":        rate = 0.94; pitch = 0.97; break;
          case "friend_female": rate = 1.10; pitch = 1.06; break;
          case "friend_male":   rate = 1.08; pitch = 1.0;  break;
          case "colleague":     rate = 1.04; pitch = 1.0;  break;
          case "stranger":      rate = 1.02; pitch = 0.99; break;
          default:              rate = 1.0;  pitch = 1.0;
        }
      }

      if (isInnerThought) { rate = Math.max(0.78, rate - 0.16); volume = Math.max(0.42, volume - 0.30); }

      const moodMod = { surprised:{rate:.06,pitch:.10}, amused:{rate:.04,pitch:.08}, thinking:{rate:-.05,pitch:-.03}, warm:{rate:-.02,pitch:.03}, skeptical:{rate:-.03,pitch:-.05}, serious:{rate:-.04,pitch:-.08}, uncomfortable:{rate:-.02,pitch:.02}, neutral:{rate:0,pitch:0} }[mood] || {rate:0,pitch:0};

      return {
        voice: idVoice,
        rate:   Math.max(0.78, Math.min(1.3, rate  + moodMod.rate)),
        pitch:  Math.max(0.7,  Math.min(1.3, pitch + moodMod.pitch)),
        volume: Math.max(0.4,  Math.min(1.0, volume)),
      };
    }

    // ── English voice assignment ───────────────────────────────────────────
    let voice = null;
    if (!inRole) {
      voice = byName("Google UK English Male");
    } else {
      switch(role) {
        case "interviewer":
        case "journalist":
          voice = byName("Google UK English Female"); break;
        case "judge":
        case "examiner":
        case "lawyer":
        case "opponent":
        case "parent":
          voice = byName("Microsoft David - English (United States)"); break;
        case "friend_female":
          voice = byName("Google US English"); break;
        case "friend_male":
        case "colleague":
        case "stranger":
          voice = byName("Microsoft Mark - English (United States)"); break;
        case "negotiator":
        case "client":
          voice = byName("Google UK English Male"); break;
        default:
          voice = byName("Google UK English Male");
      }
    }
    // Fallback chain
    if (!voice) voice = byName("Google UK English Male") || byName("Google US English") || voices.find(v=>v.lang?.startsWith("en"));

    // Base rate and pitch per role + mode
    // Raised across the board — previous rates were too slow
    let rate = 1.0, pitch = 1.0, volume = 0.92;

    if (!inRole) {
      rate = 1.05; pitch = 1.0; volume = 0.92;
    } else {
      switch(role) {
        case "interviewer":
          rate = 1.02; pitch = 1.05; volume = 0.90; break;
        case "journalist":
          rate = 1.12; pitch = 1.08; volume = 0.93; break;
        case "judge":
          rate = 0.96; pitch = 0.88; volume = 0.95; break;
        case "examiner":
          rate = 0.98; pitch = 0.90; volume = 0.93; break;
        case "lawyer":
          rate = 1.00; pitch = 0.92; volume = 0.94; break;
        case "opponent":
          rate = 1.15; pitch = 0.96; volume = 0.95; break;
        case "parent":
          rate = 0.98; pitch = 0.90; volume = 0.92; break;
        case "friend_female":
          rate = 1.18; pitch = 1.12; volume = 0.90; break;
        case "friend_male":
          rate = 1.14; pitch = 1.0;  volume = 0.90; break;
        case "colleague":
          rate = 1.10; pitch = 1.0;  volume = 0.90; break;
        case "stranger":
          rate = 1.08; pitch = 0.98; volume = 0.88; break;
        case "negotiator":
          rate = 1.02; pitch = 0.96; volume = 0.93; break;
        case "client":
          rate = 1.06; pitch = 0.98; volume = 0.91; break;
        default:
          rate = 1.05; pitch = 1.0; volume = 0.92;
      }
    }

    // Inner thought mode: slower tempo, lower volume — whisper-like but same voice
    if (isInnerThought) {
      rate = Math.max(0.80, rate - 0.18);
      volume = Math.max(0.45, volume - 0.30);
      pitch = Math.max(0.7, pitch - 0.05);
    }

    // Mood modulation
    const moodMod = {
      neutral:       { rate: 0,     pitch: 0,     vol: 0     },
      surprised:     { rate: +0.07, pitch: +0.14, vol: +0.03 },
      amused:        { rate: +0.05, pitch: +0.10, vol: +0.02 },
      thinking:      { rate: -0.06, pitch: -0.04, vol: -0.02 },
      warm:          { rate: -0.03, pitch: +0.04, vol: -0.01 },
      skeptical:     { rate: -0.04, pitch: -0.06, vol: 0     },
      serious:       { rate: -0.05, pitch: -0.10, vol: +0.02 },
      uncomfortable: { rate: -0.03, pitch: +0.03, vol: -0.02 },
    }[mood] || { rate: 0, pitch: 0, vol: 0 };

    return {
      voice,
      rate:   Math.max(0.78, Math.min(1.4,  rate  + moodMod.rate)),
      pitch:  Math.max(0.7,  Math.min(1.4,  pitch + moodMod.pitch)),
      volume: Math.max(0.4,  Math.min(1.0,  volume + moodMod.vol)),
    };
  }, []);

  const speakSegments = useCallback((segments, role, mood, inRole) => {
    if (!speechEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const voices = window.speechSynthesis.getVoices();
    const queue = segments.filter(s => s.text.trim());
    if (!queue.length) return;

    let idx = 0;
    const playNext = () => {
      if (idx >= queue.length) { setIsSpeaking(false); stopTalking(); return; }
      const seg = queue[idx++];
      const isStage = seg.type === 'stage';
      const cleanedText = scrubForSpeech(seg.text);
      if (!cleanedText) { playNext(); return; }

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      // Stage directions always use coach voice (Google UK English Male), quieter, slightly slower
      const profile = isStage
        ? (() => {
            const coachVoice = voices.find(v => v.name === 'Google UK English Male') ||
              voices.find(v => v.lang?.startsWith('en'));
            return { voice: coachVoice, rate: 0.92, pitch: 0.96, volume: 0.62 };
          })()
        : getVoiceProfile(role, mood, inRole);

      if (profile.voice) utterance.voice = profile.voice;
      utterance.rate = profile.rate;
      utterance.pitch = profile.pitch;
      utterance.volume = profile.volume;

      utterance.onstart = () => {
        setIsSpeaking(true);
        if (!isStage) startTalking(); else stopTalking();
      };
      utterance.onend = () => { playNext(); };
      utterance.onerror = () => { playNext(); };
      utterance.onboundary = () => {
        if (!isStage) { setIsTalking(true); setTimeout(() => setIsTalking(false), 160); }
      };

      window.speechSynthesis.speak(utterance);
    };

    const startQueue = () => { setIsSpeaking(true); playNext(); };
    if (voices.length > 0) startQueue();
    else window.speechSynthesis.onvoiceschanged = startQueue;
  }, [speechEnabled, getVoiceProfile]);

  const speak = useCallback((text, role, mood, inRole) => {
    if (!speechEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const segments = parseSegments(text);
    if (!segments.length) return;
    speakSegments(segments, role, mood, inRole);
  }, [speechEnabled, speakSegments]);

  // Render markdown in text: bold, italic — returns array of spans
  const renderMarkdown = (text) => {
    if (!text) return null;
    const parts = [];
    let remaining = text;
    let key = 0;
    while (remaining.length > 0) {
      const boldMatch = remaining.match(/^(.*?)\*\*(.*?)\*\*/s);
      const italicMatch = remaining.match(/^(.*?)\*(.*?)\*/s);
      if (boldMatch && (!italicMatch || boldMatch[0].length <= italicMatch[0].length)) {
        if (boldMatch[1]) parts.push(<span key={key++}>{boldMatch[1]}</span>);
        parts.push(<strong key={key++} style={{ fontWeight:500, color:"inherit" }}>{boldMatch[2]}</strong>);
        remaining = remaining.slice(boldMatch[0].length);
      } else if (italicMatch) {
        if (italicMatch[1]) parts.push(<span key={key++}>{italicMatch[1]}</span>);
        parts.push(<em key={key++} style={{ fontStyle:"italic", color:"inherit" }}>{italicMatch[2]}</em>);
        remaining = remaining.slice(italicMatch[0].length);
      } else {
        parts.push(<span key={key++}>{remaining}</span>);
        break;
      }
    }
    return parts;
  };

  const startTalking = () => {
    setIsTalking(true);
    if (talkTimerRef.current) clearTimeout(talkTimerRef.current);
  };
  const stopTalking = () => {
    talkTimerRef.current = setTimeout(() => setIsTalking(false), 200);
  };

  const stopSpeech = () => { window.speechSynthesis?.cancel(); setIsSpeaking(false); setIsTalking(false); };

  const toggleMic = useCallback(() => {
    setMicError(null);
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setMicError("Speech recognition requires Chrome or Edge."); return; }
    stopSpeech();
    const r = new SR(); r.continuous = true; r.interimResults = true; r.lang = lang === "id" ? "id-ID" : "en-US";
    let final = "";
    r.onstart = () => setIsListening(true);
    r.onresult = (e) => { let interim=""; final=""; for(let i=0;i<e.results.length;i++){if(e.results[i].isFinal)final+=e.results[i][0].transcript;else interim+=e.results[i][0].transcript;} setInput((final+interim).trim()); };
    r.onerror = (e) => { setIsListening(false); if(e.error==="not-allowed")setMicError("Mic access denied."); else if(e.error!=="aborted")setMicError("Mic error: "+e.error); };
    r.onend = () => { setIsListening(false); if(final.trim()) setTimeout(()=>document.getElementById("psend")?.click(),300); };
    recognitionRef.current = r; r.start();
  }, [isListening, stopSpeech]);

  const changeRoleAndMood = (newRole, newMood, newMode) => {
    const newInRole = newMode === "dialog";
    const roleChanged = newRole && newRole !== currentRole;
    if (roleChanged) {
      setIsTransitioning(true);
      setTimeout(() => { setCurrentRole(newRole||currentRole); setCurrentMood(newMood||"neutral"); setIsInRole(newInRole); setIsTransitioning(false); }, 380);
    } else { if(newMood) setCurrentMood(newMood); setIsInRole(newInRole); }
  };

  const callAPI = async (msgs, mode, language) => {
    const systemPrompt = PROMPTS[language||"en"][mode] || PROMPTS.en.formal;
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system: systemPrompt,
        messages: msgs.map(m => ({ role: m.role==="assistant"?"assistant":"user", content: m.content }))
      }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || "API error");
    return data.content?.find(b=>b.type==="text")?.text || "";
  };

  const startSession = async (mode) => {
    setSessionMode(mode); setScreen("session"); setLoading(true); setError(null);
    try {
      const initMsg = lang === "id" ? "Halo, saya ingin memulai sesi." : "Hello, I'd like to start a session.";
      const init = [{ role:"user", content:initMsg }];
      const text = await callAPI(init, mode, lang);
      const role = extractRole(text)||"default", mood = extractMood(text)||"neutral", modeTag = extractMode(text)||"coaching";
      const inner = extractInner(text);
      changeRoleAndMood(role, mood, modeTag);
      const clean = cleanText(text);
      setMessages([{ role:"user", content:initMsg }, { role:"assistant", content:clean, inRole:modeTag==="dialog", inner }]);
      speak(clean, role, mood, modeTag==="dialog");
    } catch(e) { setError("Connection failed. Please try again."); }
    finally { setLoading(false); }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim(); setInput(""); if(textareaRef.current) textareaRef.current.style.height="48px";
    setError(null); stopSpeech();
    const newMsgs = [...messages, { role:"user", content:msg }]; setMessages(newMsgs); setLoading(true);
    try {
      const text = await callAPI(newMsgs, sessionMode, lang);
      const role = extractRole(text)||currentRole, mood = extractMood(text)||"neutral", modeTag = extractMode(text)||"coaching";
      const inner = extractInner(text);
      changeRoleAndMood(role, mood, modeTag);
      const clean = cleanText(text), inRole = modeTag==="dialog";
      setMessages([...newMsgs, { role:"assistant", content:clean, inRole, inner }]);
      speak(clean, role, mood, inRole);
    } catch(e) { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  const handleKeyDown = (e) => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();} };
  const handleTA = (e) => { setInput(e.target.value); e.target.style.height="48px"; e.target.style.height=Math.min(e.target.scrollHeight,160)+"px"; };
  const resetSession = () => { stopSpeech(); recognitionRef.current?.stop(); setScreen("lang"); setLang(null); setSessionMode(null); setPendingMode(null); setMessages([]); setInput(""); setError(null); setCurrentRole("default"); setCurrentMood("neutral"); setIsInRole(false); setIsTransitioning(false); setIsListening(false); setMicError(null); };

  const displayRole = isInRole ? currentRole : "default";
  const charMeta = CHARS[displayRole] || CHARS.default;
  const charSVG = buildSVG(displayRole, currentMood, isTalking && isSpeaking);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Inter:wght@300;400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:#2A2A2A;border-radius:2px;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes charIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
    @keyframes pulse{0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1.1)}}
    @keyframes waveBar{0%,100%{transform:scaleY(.4)}50%{transform:scaleY(1)}}
    @keyframes micPulse{0%,100%{box-shadow:0 0 0 0 rgba(188,122,122,.4)}70%{box-shadow:0 0 0 8px rgba(188,122,122,0)}}
    @keyframes modeHover{from{transform:translateY(0)}to{transform:translateY(-3px)}}
    .msg-enter{animation:fadeUp .3s ease forwards}
    .char-enter{animation:charIn .38s ease forwards}
    .mic-active{animation:micPulse 1.2s ease infinite}
  `;

  // ── LANGUAGE SELECTION SCREEN ──────────────────────────────────────────
  if (screen === "lang") return (
    <div style={{ minHeight:"100vh", background:"#0C0C0C", color:"#F0EDE6", fontFamily:"'Inter',sans-serif", fontWeight:300, display:"flex", flexDirection:"column" }}>
      <style>{css}</style>
      <div style={{ padding:"28px 32px 20px", borderBottom:"1px solid #1A1A1A", display:"flex", alignItems:"center", gap:"14px" }}>
        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"20px", fontWeight:500, letterSpacing:".04em" }}>Profess</span>
        <span style={{ fontSize:"11px", color:"#3A3530", fontStyle:"italic", letterSpacing:".05em" }}>You cannot move people you do not understand.</span>
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"48px", padding:"40px" }}>
        <div style={{ textAlign:"center" }}>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"18px", color:"#5A5550", marginBottom:"8px" }}>Choose your language</p>
          <p style={{ fontSize:"12px", color:"#3A3530", letterSpacing:".06em" }}>Pilih bahasa sesi kamu</p>
        </div>
        <div style={{ display:"flex", gap:"24px", flexWrap:"wrap", justifyContent:"center" }}>
          <button onClick={() => { setLang("en"); setSpeechEnabled(true); setScreen("mode"); }} style={{ background:"none", border:"1px solid #2A2520", color:"#F0EDE6", fontFamily:"inherit", padding:"32px 36px", cursor:"pointer", width:"200px", textAlign:"left", transition:"all .25s", borderRadius:"2px" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#C8B89A";e.currentTarget.style.background="#1A1714";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#2A2520";e.currentTarget.style.background="none";}}>
            <div style={{ fontSize:"28px", marginBottom:"12px" }}>🇬🇧</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"18px", marginBottom:"6px", color:"#C8B89A" }}>English</div>
            <div style={{ fontSize:"12px", color:"#6A6560" }}>Session in English</div>
          </button>
          <button onClick={() => { setLang("id"); setSpeechEnabled(false); setScreen("mode"); }} style={{ background:"none", border:"1px solid #2A2520", color:"#F0EDE6", fontFamily:"inherit", padding:"32px 36px", cursor:"pointer", width:"200px", textAlign:"left", transition:"all .25s", borderRadius:"2px" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#C890B0";e.currentTarget.style.background="#1A1420";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#2A2520";e.currentTarget.style.background="none";}}>
            <div style={{ fontSize:"28px", marginBottom:"12px" }}>🇮🇩</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"18px", marginBottom:"6px", color:"#C890B0" }}>Indonesia</div>
            <div style={{ fontSize:"12px", color:"#6A6560" }}>Sesi dalam Bahasa Indonesia</div>
          </button>
        </div>
      </div>
    </div>
  );

  // ── MODE SELECTION SCREEN ──────────────────────────────────────────────
  if (screen === "mode") return (
    <div style={{ minHeight:"100vh", background:"#0C0C0C", color:"#F0EDE6", fontFamily:"'Inter',sans-serif", fontWeight:300, display:"flex", flexDirection:"column" }}>
      <style>{css}</style>
      <div style={{ padding:"28px 32px 20px", borderBottom:"1px solid #1A1A1A", display:"flex", alignItems:"center", gap:"14px" }}>
        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"20px", fontWeight:500, letterSpacing:".04em" }}>Profess</span>
        <span style={{ fontSize:"11px", color:"#3A3530", fontStyle:"italic", letterSpacing:".05em" }}>You cannot move people you do not understand.</span>
        <button onClick={() => setScreen("lang")} style={{ marginLeft:"auto", background:"none", border:"none", color:"#3A3530", fontSize:"11px", cursor:"pointer", letterSpacing:".05em", textTransform:"uppercase" }}>← {lang === "id" ? "Bahasa" : "Language"}</button>
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"48px", padding:"40px" }}>
        <div style={{ textAlign:"center" }}>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"18px", color:"#5A5550", marginBottom:"8px" }}>
            {lang === "id" ? "Pilih tipe sesi" : "Choose your session type"}
          </p>
          <p style={{ fontSize:"12px", color:"#3A3530", letterSpacing:".06em" }}>
            {lang === "id" ? "Ini menentukan bagaimana Profess melatihmu" : "This determines how Profess will coach you"}
          </p>
        </div>
        <div style={{ display:"flex", gap:"24px", flexWrap:"wrap", justifyContent:"center" }}>
          <button onClick={() => { setPendingMode("formal"); setScreen("disclaimer"); }} style={{ background:"none", border:"1px solid #2A2520", color:"#F0EDE6", fontFamily:"inherit", padding:"32px 36px", cursor:"pointer", width:"240px", textAlign:"left", transition:"all .25s", borderRadius:"2px" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#C8B89A";e.currentTarget.style.background="#1A1714";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#2A2520";e.currentTarget.style.background="none";}}>
            <div style={{ fontSize:"22px", marginBottom:"12px" }}>⚖️</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"18px", marginBottom:"8px", color:"#C8B89A" }}>
              {lang === "id" ? "Formal" : "Formal"}
            </div>
            <div style={{ fontSize:"12px", color:"#6A6560", lineHeight:1.7 }}>
              {lang === "id" ? "Wawancara kerja, sidang skripsi, debat, pitching, konferensi pers, negosiasi" : "Job interviews, thesis defense, debate, sales pitch, press conference, negotiation"}
            </div>
          </button>
          <button onClick={() => { setPendingMode("social"); setScreen("disclaimer"); }} style={{ background:"none", border:"1px solid #2A2520", color:"#F0EDE6", fontFamily:"inherit", padding:"32px 36px", cursor:"pointer", width:"240px", textAlign:"left", transition:"all .25s", borderRadius:"2px" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#C890B0";e.currentTarget.style.background="#1A1420";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#2A2520";e.currentTarget.style.background="none";}}>
            <div style={{ fontSize:"22px", marginBottom:"12px" }}>🤝</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"18px", marginBottom:"8px", color:"#C890B0" }}>
              {lang === "id" ? "Sosial" : "Social"}
            </div>
            <div style={{ fontSize:"12px", color:"#6A6560", lineHeight:1.7 }}>
              {lang === "id" ? "Reuni, kesan pertama, small talk, situasi canggung, membaca suasana" : "Reconnecting, first impressions, small talk, awkward situations, reading a room"}
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  // ── DISCLAIMER SCREEN ─────────────────────────────────────────────────
  if (screen === "disclaimer") {
    const isFormal = pendingMode === "formal";
    const isID = lang === "id";
    const accentColor = isFormal ? "#C8B89A" : "#C890B0";

    const disclaimerContent = {
      en: {
        formal: {
          title: "Before we begin",
          icon: "⚖️",
          body: [
            "Profess is a communication training tool, not a qualified professional.",
            "The characters in this session — interviewers, examiners, judges, journalists — are simulations. Their responses do not represent the actual standards, procedures, or judgments of any real institution, profession, or individual.",
            "Feedback provided by Profess is for practice purposes only. It cannot replace the assessment of a real interviewer, academic examiner, legal authority, or any other professional. Profess may make errors in reasoning, miss important nuances, or reflect biases in its training.",
            "Do not use Profess as a basis for actual professional decisions."
          ],
          cta: "I understand — begin session"
        },
        social: {
          title: "Before we begin",
          icon: "🤝",
          body: [
            "Profess is a communication training tool, not a social scientist or therapist.",
            "The characters and scenarios in this session are simplified simulations for training purposes. They do not accurately represent any real person, cultural group, or social dynamic.",
            "Profess may make errors, oversimplify complex interpersonal situations, or reflect cultural biases. Real human interactions are far more nuanced than any simulation can capture.",
            "Use this session as a starting point for reflection — not as a definitive guide to how people think or behave."
          ],
          cta: "I understand — begin session"
        }
      },
      id: {
        formal: {
          title: "Sebelum kita mulai",
          icon: "⚖️",
          body: [
            "Profess adalah alat latihan komunikasi, bukan profesional yang berkualifikasi.",
            "Karakter dalam sesi ini — pewawancara, penguji, hakim, jurnalis — adalah simulasi. Respons mereka tidak mencerminkan standar, prosedur, atau penilaian aktual dari institusi, profesi, atau individu nyata manapun.",
            "Feedback dari Profess hanya untuk tujuan latihan. Profess tidak dapat menggantikan penilaian pewawancara sungguhan, penguji akademik, otoritas hukum, atau profesional lainnya. Profess dapat melakukan kesalahan dalam penalaran, melewatkan nuansa penting, atau mencerminkan bias dalam pelatihannya.",
            "Jangan gunakan Profess sebagai dasar keputusan profesional yang sesungguhnya."
          ],
          cta: "Saya mengerti — mulai sesi"
        },
        social: {
          title: "Sebelum kita mulai",
          icon: "🤝",
          body: [
            "Profess adalah alat latihan komunikasi, bukan ilmuwan sosial atau terapis.",
            "Karakter dan skenario dalam sesi ini adalah simulasi yang disederhanakan untuk tujuan latihan. Mereka tidak secara akurat mencerminkan individu nyata, kelompok budaya, atau dinamika sosial manapun.",
            "Profess dapat melakukan kesalahan, menyederhanakan situasi interpersonal yang kompleks, atau mencerminkan bias budaya. Interaksi manusia yang sesungguhnya jauh lebih bernuansa dari yang dapat ditangkap simulasi manapun.",
            "Gunakan sesi ini sebagai titik awal refleksi — bukan sebagai panduan definitif tentang cara orang berpikir atau berperilaku."
          ],
          cta: "Saya mengerti — mulai sesi"
        }
      }
    };

    const dc = disclaimerContent[isID ? "id" : "en"][isFormal ? "formal" : "social"];

    return (
      <div style={{ minHeight:"100vh", background:"#0C0C0C", color:"#F0EDE6", fontFamily:"'Inter',sans-serif", fontWeight:300, display:"flex", flexDirection:"column" }}>
        <style>{css}</style>
        <div style={{ padding:"28px 32px 20px", borderBottom:"1px solid #1A1A1A", display:"flex", alignItems:"center", gap:"14px" }}>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"20px", fontWeight:500, letterSpacing:".04em" }}>Profess</span>
          <button onClick={() => setScreen("mode")} style={{ marginLeft:"auto", background:"none", border:"none", color:"#3A3530", fontSize:"11px", cursor:"pointer", letterSpacing:".05em", textTransform:"uppercase" }}>
            ← {isID ? "Kembali" : "Back"}
          </button>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", gap:"32px" }}>
          <div style={{ maxWidth:"520px", width:"100%", display:"flex", flexDirection:"column", gap:"28px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
              <span style={{ fontSize:"24px" }}>{dc.icon}</span>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"20px", fontWeight:400, color:"#C8B89A" }}>{dc.title}</h2>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
              {dc.body.map((para, i) => (
                <p key={i} style={{ fontSize:"13px", lineHeight:1.85, color: i === 0 ? "#D8D5CE" : "#7A7570" }}>
                  {para}
                </p>
              ))}
            </div>
            <div style={{ borderTop:"1px solid #1E1E1E", paddingTop:"24px" }}>
              <button
                onClick={() => startSession(pendingMode)}
                style={{ background:"none", border:`1px solid ${accentColor}`, color:accentColor, fontFamily:"inherit", fontSize:"12px", fontWeight:400, letterSpacing:".08em", padding:"12px 28px", cursor:"pointer", textTransform:"uppercase", transition:"all .25s", width:"100%" }}
                onMouseEnter={e=>{ e.currentTarget.style.background=accentColor; e.currentTarget.style.color="#0C0C0C"; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="none"; e.currentTarget.style.color=accentColor; }}
              >
                {dc.cta}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── SESSION SCREEN ─────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:"#0C0C0C", color:"#F0EDE6", fontFamily:"'Inter',sans-serif", fontWeight:300, display:"flex", flexDirection:"column" }}>
      <style>{css}</style>
      {/* Header */}
      <div style={{ padding:"20px 28px", borderBottom:"1px solid #1A1A1A", display:"flex", alignItems:"center", gap:"14px", flexShrink:0 }}>
        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"18px", fontWeight:500, letterSpacing:".04em" }}>Profess</span>
        <span style={{ fontSize:"10px", color:"#3A3530", fontStyle:"italic", letterSpacing:".05em" }}>You cannot move people you do not understand.</span>
        <div style={{ marginLeft:"auto", display:"flex", gap:"8px", alignItems:"center" }}>
          <span style={{ fontSize:"10px", color:"#4A4540", letterSpacing:".08em", textTransform:"uppercase", border:"1px solid #2A2520", padding:"3px 10px" }}>{sessionMode}</span>
          <button onClick={()=>{stopSpeech();setSpeechEnabled(p=>!p);}} style={{ background:"none", border:"1px solid #1E1E1E", color:speechEnabled?"#C8B89A":"#3A3A3A", fontFamily:"inherit", fontSize:"10px", padding:"4px 10px", cursor:"pointer", letterSpacing:".05em", textTransform:"uppercase" }}>
            {speechEnabled?"🔊":"🔇"}
          </button>
          <button onClick={resetSession} style={{ background:"none", border:"1px solid #1E1E1E", color:"#4A4540", fontFamily:"inherit", fontSize:"10px", padding:"4px 10px", cursor:"pointer", letterSpacing:".05em", textTransform:"uppercase" }}>New</button>
        </div>
      </div>

      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        {/* Character Panel — fixed height, always centered */}
        <div style={{ width:"200px", flexShrink:0, borderRight:"1px solid #161616", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:isTransitioning?"#0C0C0C":charMeta.bg, transition:"background .4s ease", position:"sticky", top:0, height:"calc(100vh - 61px)", alignSelf:"flex-start", overflow:"hidden" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"12px", padding:"20px 12px" }}>
            <div key={displayRole+currentMood} className="char-enter" style={{ width:"170px", height:"215px", opacity:isTransitioning?0:1, transition:"opacity .38s", filter:isSpeaking?`drop-shadow(0 0 14px ${charMeta.accent}50)`:"none", transform:isSpeaking?"scale(1.02)":"scale(1)", transition:"filter .25s, transform .25s, opacity .38s" }} dangerouslySetInnerHTML={{ __html:charSVG }}/>
            <div style={{ textAlign:"center", opacity:isTransitioning?0:1, transition:"opacity .38s" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"14px", color:charMeta.accent, marginBottom:"3px" }}>{charMeta.name}</div>
              <div style={{ fontSize:"9px", color:"#3A3530", letterSpacing:".08em", textTransform:"uppercase" }}>{charMeta.title}</div>
              {currentMood !== "neutral" && <div style={{ marginTop:"6px", fontSize:"8px", color:charMeta.accent, letterSpacing:".1em", textTransform:"uppercase", opacity:.65, border:`1px solid ${charMeta.accent}25`, padding:"2px 7px", display:"inline-block" }}>{currentMood}</div>}
            </div>
            {isSpeaking && <div style={{ display:"flex", gap:"3px", alignItems:"center" }}>
              {[0,.12,.24,.12,0].map((d,i)=><div key={i} style={{ width:"2px", height:`${8+i*3}px`, background:charMeta.accent, borderRadius:"1px", animation:`waveBar .6s ease-in-out ${d}s infinite`, opacity:.8 }}/>)}
            </div>}
          </div>
        </div>

        {/* Chat Panel */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ flex:1, overflowY:"auto", padding:"24px 24px 12px", display:"flex", flexDirection:"column", gap:"22px" }}>
            {messages.map((msg,i) => {
              const isA = msg.role==="assistant";
              const mInRole = isA && msg.inRole;
              const mc = mInRole ? (CHARS[currentRole]||CHARS.default) : CHARS.default;
              const segments = isA ? parseSegments(msg.content) : null;
              // Clean inner thought — strip any remaining asterisks or italic markers
              const innerText = msg.inner ? msg.inner.replace(/\*/g,"").replace(/_/g,"").trim() : null;
              return (
                <div key={i} className="msg-enter" style={{ display:"flex", flexDirection:"column", gap:"5px" }}>
                  <span style={{ fontSize:"9px", letterSpacing:".1em", textTransform:"uppercase", fontWeight:500, color:isA?mc.accent:"#2A2A2A" }}>
                    {isA?(mInRole?mc.name:"Profess"):"You"}
                  </span>
                  {isA && segments ? (
                    <div style={{ display:"flex", flexDirection:"column", gap:"4px" }}>
                      {segments.map((seg, si) => {
                        if (seg.type === "stage") return (
                          <p key={si} style={{ fontSize:"12px", fontStyle:"italic", color:"#4A4845", lineHeight:1.7, margin:"2px 0" }}>
                            {seg.text}
                          </p>
                        );
                        if (seg.type === "divider") return (
                          <div key={si} style={{ height:"8px" }} />
                        );
                        if (seg.type === "section_break") return (
                          <div key={si} style={{ borderTop:"1px solid #222", margin:"10px 0 6px", opacity:.6 }} />
                        );
                        if (seg.type === "coaching") return (
                          <p key={si} style={{ fontSize:"13px", lineHeight:1.85, color:"#9A9590", whiteSpace:"pre-wrap" }}>
                            {renderMarkdown(seg.text)}
                          </p>
                        );
                        // dialog
                        return (
                          <p key={si} style={{ fontSize:"14px", lineHeight:1.85, color:mInRole?"#E8E5DE":"#C0BDB8", whiteSpace:"pre-wrap", borderLeft:mInRole?`2px solid ${mc.accent}35`:"none", paddingLeft:mInRole?"12px":"0" }}>
                            {renderMarkdown(seg.text)}
                          </p>
                        );
                      })}
                    </div>
                  ) : (
                    <p style={{ fontSize:"14px", lineHeight:1.85, color:"#6A6760", whiteSpace:"pre-wrap" }}>
                      {renderMarkdown(msg.content)}
                    </p>
                  )}
                  {isA && innerText && (
                    <div style={{ display:"flex", alignItems:"center", gap:"8px", marginTop:"3px" }}>
                      <div style={{ width:"12px", height:"1px", background:mc.accent, opacity:.25, flexShrink:0 }}/>
                      <p style={{ fontSize:"11px", fontStyle:"italic", color:mc.accent, opacity:.5, letterSpacing:".02em" }}>
                        {innerText}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
            {loading && <div style={{ display:"flex", flexDirection:"column", gap:"5px" }}>
              <span style={{ fontSize:"9px", letterSpacing:".1em", textTransform:"uppercase", fontWeight:500, color:charMeta.accent }}>
                {isInRole?charMeta.name:"Profess"}
              </span>
              <div style={{ display:"flex", gap:"5px", padding:"4px 0" }}>
                {[0,.2,.4].map((d,i)=><div key={i} style={{ width:"5px", height:"5px", background:charMeta.accent, borderRadius:"50%", opacity:.4, animation:`pulse 1.2s ease-in-out ${d}s infinite` }}/>)}
              </div>
            </div>}
            {error && <p style={{ fontSize:"12px", color:"#8B4040", textAlign:"center" }}>{error}</p>}
            <div ref={chatEndRef}/>
          </div>

          {/* Input Area */}
          <div style={{ padding:"12px 24px 20px", borderTop:"1px solid #161616", display:"flex", flexDirection:"column", gap:"7px" }}>
            {micError && <p style={{ fontSize:"11px", color:"#8B4040", textAlign:"center" }}>{micError}</p>}
            <div style={{ display:"flex", gap:"8px", alignItems:"flex-end" }}>
              <textarea ref={textareaRef} style={{ flex:1, background:"#111", border:`1px solid ${isListening?"#BC7A7A":"#1A1A1A"}`, color:"#F0EDE6", fontFamily:"inherit", fontSize:"14px", fontWeight:300, lineHeight:1.6, padding:"10px 13px", resize:"none", outline:"none", minHeight:"46px", maxHeight:"140px", overflowY:"auto", transition:"border-color .2s" }}
                placeholder={isListening?"Listening...":"Say something..."} value={input} onChange={handleTA} onKeyDown={handleKeyDown} rows={1}
                onFocus={e=>{if(!isListening)e.target.style.borderColor="#242424";}} onBlur={e=>{if(!isListening)e.target.style.borderColor="#1A1A1A";}}/>
              {isSpeaking && <button onClick={stopSpeech} title="Stop speaking" style={{ background:"#180A0A", border:"1px solid #BC7A7A", color:"#BC7A7A", fontFamily:"inherit", fontSize:"16px", padding:0, cursor:"pointer", width:"46px", height:"46px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .2s" }}>⏹</button>}
              <button onClick={toggleMic} className={isListening?"mic-active":""} title={isListening?"Stop recording":"Speak"} style={{ background:isListening?"#2A1414":"none", border:`1px solid ${isListening?"#BC7A7A":"#242424"}`, color:isListening?"#BC7A7A":"#4A4540", fontFamily:"inherit", fontSize:"18px", padding:0, cursor:"pointer", width:"46px", height:"46px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .2s" }}>
                {isListening?"⏹":"🎙"}
              </button>
              <button id="psend" onClick={sendMessage} disabled={loading||!input.trim()} style={{ background:"none", border:`1px solid ${input.trim()&&!loading?charMeta.accent:"#1E1E1E"}`, color:input.trim()&&!loading?charMeta.accent:"#2A2A2A", fontFamily:"inherit", fontSize:"11px", fontWeight:500, letterSpacing:".08em", padding:"10px 18px", cursor:loading||!input.trim()?"not-allowed":"pointer", textTransform:"uppercase", height:"46px", transition:"all .2s", opacity:loading||!input.trim()?.4:1 }}>
                Send
              </button>
            </div>
            {isListening && <div style={{ display:"flex", alignItems:"center", gap:"7px", paddingLeft:"2px" }}>
              <div style={{ display:"flex", gap:"2px", alignItems:"center" }}>
                {[0,.08,.16,.24,.32].map((d,i)=><div key={i} style={{ width:"2px", height:`${5+i*3}px`, background:"#BC7A7A", borderRadius:"1px", animation:`waveBar .5s ease-in-out ${d}s infinite`, opacity:.8 }}/>)}
              </div>
              <span style={{ fontSize:"9px", color:"#BC7A7A", letterSpacing:".08em", textTransform:"uppercase" }}>Recording — pause to send</span>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
}
