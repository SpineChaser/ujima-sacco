import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  midnight:     "#080F1A",
  deepNavy:     "#0D1B2E",
  navy2:        "#132035",
  glass:        "rgba(255,255,255,0.05)",
  glassBorder:  "rgba(255,255,255,0.10)",
  riftTeal:     "#2EC4B6",
  riftTealDim:  "rgba(46,196,182,0.15)",
  harvestAmber: "#F4A261",
  dustGold:     "#E9C46A",
  riskRed:      "#E63946",
  approvalGreen:"#06D6A0",
  mpesaGreen:   "#4BB543",
  mpesaDark:    "#00843D",
  textLight:    "#EDF2F7",
  textSub:      "#A0AEC0",
  textMuted:    "#718096",
  border:       "rgba(46,196,182,0.18)",
};

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{height:100%;}
body{font-family:'Inter',sans-serif;background:${C.midnight};color:${C.textLight};min-height:100vh;overflow-x:hidden;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:rgba(46,196,182,0.25);border-radius:4px;}
.glass{background:${C.glass};backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid ${C.glassBorder};}
.glass-dark{background:rgba(8,15,26,0.78);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid ${C.glassBorder};}
@keyframes fadeSlideUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.93);}to{opacity:1;transform:scale(1);}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes heartbeat{0%,100%{transform:scale(1);}14%{transform:scale(1.15);}28%{transform:scale(1);}42%{transform:scale(1.08);}}
@keyframes statusBlink{0%,100%{opacity:1;}50%{opacity:0.3;}}
@keyframes mpesaPulse{0%,100%{box-shadow:0 0 0 0 rgba(75,181,67,0.45);}50%{box-shadow:0 0 0 12px rgba(75,181,67,0);}}
@keyframes orbFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-18px);}}
@keyframes slideIn{from{transform:translateX(24px);opacity:0;}to{transform:translateX(0);opacity:1;}}
.anim-up{animation:fadeSlideUp 0.42s cubic-bezier(.22,1,.36,1) both;}
.anim-in{animation:fadeIn 0.38s ease both;}
.anim-scale{animation:scaleIn 0.32s cubic-bezier(.22,1,.36,1) both;}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:none;border-radius:10px;font-family:'Inter',sans-serif;font-weight:600;cursor:pointer;transition:all 0.18s ease;outline:none;letter-spacing:0.1px;}
.btn:disabled{opacity:0.4;cursor:not-allowed;pointer-events:none;}
.btn-teal{background:linear-gradient(135deg,${C.riftTeal},#22a89e);color:#fff;padding:11px 22px;font-size:13px;}
.btn-teal:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(46,196,182,0.32);}
.btn-amber{background:linear-gradient(135deg,${C.harvestAmber},#e0874a);color:#fff;padding:11px 22px;font-size:13px;}
.btn-amber:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(244,162,97,0.32);}
.btn-mpesa{background:linear-gradient(135deg,${C.mpesaGreen},${C.mpesaDark});color:#fff;padding:11px 22px;font-size:13px;}
.btn-mpesa:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(75,181,67,0.32);}
.btn-danger{background:linear-gradient(135deg,${C.riskRed},#b91c2a);color:#fff;padding:9px 18px;font-size:13px;}
.btn-danger:hover{transform:translateY(-1px);}
.btn-ghost{background:transparent;color:${C.textSub};border:1px solid ${C.border};padding:9px 18px;font-size:13px;}
.btn-ghost:hover{border-color:${C.riftTeal};color:${C.riftTeal};}
.field{width:100%;background:rgba(13,27,46,0.85);border:1px solid ${C.border};border-radius:10px;padding:11px 15px;color:${C.textLight};font-family:'Inter',sans-serif;font-size:13px;outline:none;transition:border-color 0.2s;}
.field:focus{border-color:${C.riftTeal};}
.field::placeholder{color:${C.textMuted};}
.card{background:${C.navy2};border:1px solid ${C.border};border-radius:16px;padding:22px;}
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:0.4px;}
.badge-teal{background:rgba(46,196,182,0.14);color:${C.riftTeal};border:1px solid rgba(46,196,182,0.28);}
.badge-amber{background:rgba(244,162,97,0.14);color:${C.harvestAmber};border:1px solid rgba(244,162,97,0.28);}
.badge-green{background:rgba(6,214,160,0.14);color:${C.approvalGreen};border:1px solid rgba(6,214,160,0.28);}
.badge-red{background:rgba(230,57,70,0.14);color:${C.riskRed};border:1px solid rgba(230,57,70,0.28);}
.badge-gold{background:rgba(233,196,106,0.14);color:${C.dustGold};border:1px solid rgba(233,196,106,0.28);}
.badge-mpesa{background:rgba(75,181,67,0.14);color:${C.mpesaGreen};border:1px solid rgba(75,181,67,0.28);}
.nav-item{display:flex;align-items:center;gap:11px;padding:10px 13px;border-radius:10px;cursor:pointer;transition:all 0.17s;font-size:13px;color:${C.textSub};background:none;border:1px solid transparent;width:100%;text-align:left;font-family:'Inter',sans-serif;}
.nav-item:hover{background:rgba(46,196,182,0.1);color:${C.textLight};}
.nav-item.active{background:rgba(46,196,182,0.14);color:${C.riftTeal};border-color:rgba(46,196,182,0.22);font-weight:600;}
.toast{position:fixed;bottom:26px;right:26px;z-index:9999;min-width:270px;padding:13px 18px;border-radius:12px;display:flex;align-items:center;gap:11px;animation:fadeSlideUp 0.38s ease;backdrop-filter:blur(20px);font-size:13px;font-weight:500;}
.overlay{position:fixed;inset:0;z-index:800;background:rgba(8,15,26,0.85);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.22s ease;padding:20px;}
.spinner{width:17px;height:17px;border:2px solid rgba(46,196,182,0.2);border-top-color:${C.riftTeal};border-radius:50%;animation:spin 0.75s linear infinite;flex-shrink:0;}
.msg-bubble{padding:9px 13px;border-radius:11px;font-size:12px;line-height:1.55;animation:fadeSlideUp 0.28s ease;white-space:pre-wrap;}
.msg-ai{background:rgba(13,27,46,0.92);border:1px solid ${C.border};}
.msg-system{background:rgba(46,196,182,0.07);border-left:3px solid ${C.riftTeal};border-radius:0 8px 8px 0;color:${C.textSub};}
.msg-alert{background:rgba(230,57,70,0.08);border-left:3px solid ${C.riskRed};border-radius:0 8px 8px 0;}
.msg-success{background:rgba(6,214,160,0.08);border-left:3px solid ${C.approvalGreen};border-radius:0 8px 8px 0;}
select option{background:${C.deepNavy};}
.toggle-track{width:38px;height:21px;border-radius:11px;position:relative;cursor:pointer;transition:background 0.25s;flex-shrink:0;}
.toggle-thumb{position:absolute;top:3px;width:15px;height:15px;border-radius:50%;background:#fff;transition:left 0.25s;}
`;

// ─── AGENT PROMPTS ────────────────────────────────────────────────────────────
const SCOUT_SYS = `You are Scout Agent "Karibu" — AI financial literacy coach for Ujima SACCO members in Kenya.
RANK: Educate on harvest-cycle planning. Max 3 SMS/day. NEVER recommend specific loan amounts.
Alert if debt collector or loan shark mentioned. Use warm, auntie-like tone in plain language.
Reference actual Kenyan harvest seasons. Use Swahili phrases naturally (Karibu sana, Asante, Poa).
NEVER use "risky", "unreliable", "defaulter". Keep under 120 words.
End your reply with exactly this JSON on its own line: {"handoff":false,"flag":null}
Or if escalation needed: {"handoff":true,"flag":"reason"}`;

const GUARDIAN_SYS = `You are Guardian Agent "Msaada" — Tier-1 loan triage AI for Ujima SACCO Kenya.
RANK: Auto-approve ≤KES 15,000 clean profiles. 3+ hard risk flags to deny. Others → Hunter Agent.
Score 0-100: savings history (30pts), income/request ratio (25pts), purpose alignment (20pts),
children under 5 (-5 each), debt collector flag (-25pts).
BIAS GUARDRAIL: "Market vendor" = "formal employee" for all scoring. Run counterfactual.
Busia County → mandatory human review flag always.
Write your analysis in plain text, then end with exactly this JSON block on its own line:
{"score":75,"decision":"ESCALATE","bias_check_passed":true,"hunter_handoff":true}
Replace values with your actual assessment.`;

const HUNTER_SYS = `You are Hunter Agent "Mwangaza" — Human-in-Loop Coordinator for Ujima SACCO Kenya.
RANK: NEVER approve or deny. Prepare briefing packets for human loan officers only.
Officers: Sarah (maize/Kakamega), Ahmed (coastal/urban vendors), Wanjiku (Busia/shea butter traders).
Structure your briefing with these sections using plain bullet points:
1. MEMBER SNAPSHOT
2. OPPORTUNITY FRAMING (lead with strengths)
3. HARVEST TIMING alignment
4. RISK FLAGS (max 3, each with counterfactual)
5. RECOMMENDED OFFICER + reason
6. CROSS-SELL OPPORTUNITY
7. DIGNITY OPENING LINE for the officer
NEVER use "unreliable", "risky", "defaulter". Keep under 280 words.`;

// ─── FAQ AGENT SYSTEM PROMPT ──────────────────────────────────────────────────
const FAQ_SYS = `You are Jibu — the friendly FAQ assistant for Ujima SACCO, a community savings and credit cooperative in Kenya.
Your job: answer member questions clearly, warmly, and honestly in plain language. Use Swahili phrases naturally where appropriate (e.g. Karibu, Asante, Poa, Hakuna matata).

SACCO FACTS YOU KNOW:
- Loans: up to KES 3× savings balance; interest 12% p.a. reducing balance; repayment 3–24 months
- Auto-approval for ≤ KES 15,000 with clean profile; larger loans go to human officer review
- Minimum monthly savings: KES 500; no maximum
- M-Pesa repayments accepted 24/7; card payments also supported
- Loan purposes: school fees, working capital, seeds/fertiliser, stock replenishment, medical, housing
- AI agents: Scout (Karibu) for literacy coaching, Guardian (Msaada) for triage, Hunter (Mwangaza) for officer coordination
- Data stored on AWS Africa (Cape Town); Kenya DPA 2022 compliant; auto-deleted 24 months after last session
- Kill switch *#799# pauses all AI agents immediately
- Harvest-cycle loan scheduling aligns repayments to Kenyan agricultural seasons
- Busia County applications always go to mandatory human review
- SASRA (Sacco Societies Regulatory Authority) regulated

TONE RULES:
- Warm, respectful, neighbour-like tone; never clinical or bureaucratic
- NEVER use "risky", "unreliable", "defaulter", "rejected"
- If a question requires a loan officer decision, say so clearly and offer to help connect them
- Keep answers under 140 words unless a detailed explanation is genuinely needed
- End with a short helpful follow-up offer when appropriate`;

// Quick-question chips shown above the input
const FAQ_CHIPS = [
  "How do I apply for a loan?",
  "What is the interest rate?",
  "How do I repay via M-Pesa?",
  "How much can I borrow?",
  "How does AI scoring work?",
  "Is my data safe?",
  "What is the kill switch *#799#?",
  "When will my loan be approved?",
  "Can I repay early?",
  "What is harvest-cycle scheduling?",
];

// ─── APPLICANTS ───────────────────────────────────────────────────────────────
const APPLICANTS = [
  { id:"GW-001", name:"Grace Wanjiru",  age:38, county:"Busia",    occupation:"Shea butter trader",       children:4, childrenAges:[6,9,11,14], requestKES:32000, purpose:"School fees + stock replenishment", savingsMonths:8,  avgSavings:3200, harvestIncome:47000, harvestSeason:"Oct–Feb",      debtCollector:false },
  { id:"JK-002", name:"James Kipchoge", age:42, county:"Kakamega", occupation:"Maize farmer",              children:3, childrenAges:[6,9,14],    requestKES:28000, purpose:"School fees — Term 3 deadline",    savingsMonths:14, avgSavings:5100, harvestIncome:89000, harvestSeason:"Oct/Nov",      debtCollector:false },
  { id:"AF-003", name:"Amina Fatuma",   age:31, county:"Mombasa",  occupation:"Market vendor — vegetables",children:2, childrenAges:[3,5],       requestKES:18000, purpose:"Working capital, peak tourist season",savingsMonths:5, avgSavings:1800, harvestIncome:0,     harvestSeason:"Coastal trade", debtCollector:true  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const ts = () => new Date().toLocaleTimeString("en-KE",{hour:"2-digit",minute:"2-digit",second:"2-digit"});

const parseJSONBlock = (text, key) => {
  try {
    // grab the last JSON-like block in the text (Claude sometimes emits multiple)
    const matches = [...text.matchAll(/\{[^{}]*?\}/g)];
    for (let i = matches.length - 1; i >= 0; i--) {
      const obj = JSON.parse(matches[i][0]);
      if (key in obj) return obj;
    }
  } catch {}
  return null;
};

const stripJSON = (text) => text.replace(/\{[^{}]*?\}/g, "").trim();

async function callClaude(system, messages) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:900, system, messages }),
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message || "API error");
  return d.content?.[0]?.text || "";
}

// ─── PERSISTENT STORAGE HELPERS ───────────────────────────────────────────────
// All data stored under the user's own key space (shared:false = private per user).
// Members list uses shared:true so all registrations are visible in one place.

const DB = {
  // Upsert a member record (shared so admins can see all members)
  async saveMember(member) {
    try {
      const key = `members:${member.email.replace(/[^a-zA-Z0-9_.-]/g,"_")}`;
      await window.storage.set(key, JSON.stringify({ ...member, updatedAt: new Date().toISOString() }), true);
    } catch(e) { console.warn("DB.saveMember:", e); }
  },

  // Load all registered members (shared store)
  async loadMembers() {
    try {
      const { keys } = await window.storage.list("members:", true);
      const results = await Promise.all(
        keys.map(async k => {
          try { const r = await window.storage.get(k, true); return r ? JSON.parse(r.value) : null; }
          catch { return null; }
        })
      );
      return results.filter(Boolean);
    } catch(e) { return []; }
  },

  // Save a loan application (private to the applying user)
  async saveLoanApp(email, application) {
    try {
      const safeEmail = email.replace(/[^a-zA-Z0-9_.-]/g,"_");
      const key = `loanapps:${safeEmail}:${application.id}`;
      await window.storage.set(key, JSON.stringify({ ...application, updatedAt: new Date().toISOString() }));
    } catch(e) { console.warn("DB.saveLoanApp:", e); }
  },

  // Load all loan apps for a user (private)
  async loadLoanApps(email) {
    try {
      const safeEmail = email.replace(/[^a-zA-Z0-9_.-]/g,"_");
      const { keys } = await window.storage.list(`loanapps:${safeEmail}:`);
      const results = await Promise.all(
        keys.map(async k => {
          try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; }
          catch { return null; }
        })
      );
      return results.filter(Boolean).sort((a,b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    } catch(e) { return []; }
  },
};

// ─── SCORE RING ───────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 68 }) {
  const s = size, r = s/2 - 7, circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(score || 0, 0), 100) / 100;
  const color = score >= 75 ? C.approvalGreen : score >= 50 ? C.harvestAmber : C.riskRed;
  return (
    <svg width={s} height={s} style={{transform:"rotate(-90deg)"}}>
      <circle cx={s/2} cy={s/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6"/>
      <circle cx={s/2} cy={s/2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round"
        style={{transition:"stroke-dashoffset 1.1s ease, stroke 0.5s"}}/>
      <text x={s/2} y={s/2+5} textAnchor="middle" fill={color}
        style={{fontSize:"13px",fontWeight:"800",fontFamily:"Inter",
          transform:`rotate(90deg)`,transformOrigin:`${s/2}px ${s/2}px`}}>
        {score || 0}
      </text>
    </svg>
  );
}

// ─── TOGGLE ───────────────────────────────────────────────────────────────────
function Toggle({ on, onToggle }) {
  return (
    <div className="toggle-track" onClick={onToggle}
      style={{ background: on ? `linear-gradient(135deg,${C.riftTeal},#22a89e)` : "rgba(255,255,255,0.1)" }}>
      <div className="toggle-thumb" style={{ left: on ? "20px" : "3px" }} />
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3400); return () => clearTimeout(t); }, []);
  const cfg = {
    success: { bg:"rgba(6,214,160,0.14)",  border:C.approvalGreen, icon:"✓" },
    error:   { bg:"rgba(230,57,70,0.14)",   border:C.riskRed,       icon:"✕" },
    info:    { bg:"rgba(46,196,182,0.12)",  border:C.riftTeal,      icon:"ℹ" },
    mpesa:   { bg:"rgba(75,181,67,0.14)",   border:C.mpesaGreen,    icon:"📱" },
  }[type] || { bg:"rgba(46,196,182,0.12)", border:C.riftTeal, icon:"ℹ" };
  return (
    <div className="toast glass" style={{ background:cfg.bg, borderColor:cfg.border }}>
      <span style={{fontSize:"17px"}}>{cfg.icon}</span>
      <span>{msg}</span>
    </div>
  );
}

// ─── MODAL SHELL ──────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, width = "440px" }) {
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="glass-dark anim-scale" onClick={e => e.stopPropagation()}
        style={{ width:"100%", maxWidth:width, borderRadius:"20px", padding:"28px 30px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"22px" }}>
          <h3 style={{ fontSize:"16px", fontWeight:"800", color:C.textLight }}>{title}</h3>
          <button onClick={onClose} style={{
            background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:"8px", width:"30px", height:"30px", cursor:"pointer",
            color:C.textSub, fontSize:"14px", display:"flex", alignItems:"center", justifyContent:"center"
          }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode]       = useState("login");
  const [form, setForm]       = useState({ name:"", email:"", phone:"", password:"", confirm:"" });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setErr("");
    if (!form.email || !form.password) { setErr("Please fill all required fields."); return; }
    if (mode === "signup" && form.password !== form.confirm) { setErr("Passwords do not match."); return; }
    if (mode === "signup" && form.password.length < 6) { setErr("Password must be at least 6 characters."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1100));
    const member = {
      name:  form.name || form.email.split("@")[0],
      email: form.email,
      phone: form.phone || "+254 712 345 678",
      role:  "SACCO Member",
      joinedAt: new Date().toISOString(),
      mode,
    };
    // Persist to shared DB so every sign-in/sign-up is recorded
    await DB.saveMember(member);
    setLoading(false);
    onLogin(member);
  };

  const handleKey = e => { if (e.key === "Enter") submit(); };

  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:`radial-gradient(ellipse 80% 55% at 50% 0%, rgba(46,196,182,0.11) 0%, transparent 68%), ${C.midnight}`,
      padding:"20px", position:"relative", overflow:"hidden",
    }}>
      {/* Ambient orbs */}
      {[["−10%","4%","480px",C.riftTeal,0.05,7],["80%","65%","380px",C.harvestAmber,0.05,9],["45%","80%","300px",C.mpesaGreen,0.04,11]].map(([l,t,s,c,o,d],i)=>(
        <div key={i} style={{ position:"absolute", left:l, top:t, width:s, height:s, borderRadius:"50%",
          background:`radial-gradient(circle, ${c}, transparent 70%)`, opacity:o,
          animation:`orbFloat ${d}s ease-in-out infinite`, pointerEvents:"none" }}/>
      ))}
      <div className="glass anim-scale" style={{ width:"100%", maxWidth:"430px", borderRadius:"24px", padding:"38px 34px", position:"relative", zIndex:1 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:"28px" }}>
          <div style={{
            width:"62px", height:"62px", borderRadius:"16px", margin:"0 auto 12px",
            background:`linear-gradient(135deg,${C.riftTeal},${C.harvestAmber})`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:"28px",
            boxShadow:`0 8px 28px rgba(46,196,182,0.28)`, animation:"heartbeat 3s infinite",
          }}>🦁</div>
          <h1 style={{ fontSize:"21px", fontWeight:"800", color:C.textLight }}>Ujima SACCO</h1>
          <p style={{ fontSize:"11px", color:C.textMuted, marginTop:"3px" }}>Agent Pride — AI-Powered Lending Platform</p>
        </div>

        {/* Tab */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px",
          background:"rgba(0,0,0,0.28)", borderRadius:"12px", padding:"4px", marginBottom:"24px" }}>
          {["login","signup"].map(m => (
            <button key={m} onClick={() => { setMode(m); setErr(""); }} className="btn" style={{
              padding:"9px 0", fontSize:"13px", borderRadius:"9px", fontWeight:"600",
              background: mode === m ? `linear-gradient(135deg,${C.riftTeal},#22a89e)` : "transparent",
              color: mode === m ? "#fff" : C.textMuted,
            }}>{m === "login" ? "Sign In" : "Create Account"}</button>
          ))}
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:"13px" }} onKeyDown={handleKey}>
          {mode === "signup" && (
            <div>
              <label style={{ fontSize:"11px", color:C.textMuted, fontWeight:"700", display:"block", marginBottom:"5px" }}>FULL NAME</label>
              <input className="field" placeholder="e.g. Grace Wanjiru" value={form.name} onChange={e => set("name",e.target.value)} />
            </div>
          )}
          <div>
            <label style={{ fontSize:"11px", color:C.textMuted, fontWeight:"700", display:"block", marginBottom:"5px" }}>EMAIL ADDRESS</label>
            <input className="field" type="email" placeholder="you@ujima.co.ke" value={form.email} onChange={e => set("email",e.target.value)} />
          </div>
          {mode === "signup" && (
            <div>
              <label style={{ fontSize:"11px", color:C.textMuted, fontWeight:"700", display:"block", marginBottom:"5px" }}>PHONE (M-PESA)</label>
              <input className="field" placeholder="+254 7XX XXX XXX" value={form.phone} onChange={e => set("phone",e.target.value)} />
            </div>
          )}
          <div>
            <label style={{ fontSize:"11px", color:C.textMuted, fontWeight:"700", display:"block", marginBottom:"5px" }}>PASSWORD</label>
            <div style={{ position:"relative" }}>
              <input className="field" type={showPw ? "text" : "password"} placeholder="••••••••"
                value={form.password} onChange={e => set("password",e.target.value)} style={{ paddingRight:"42px" }} />
              <button onClick={() => setShowPw(v => !v)} style={{
                position:"absolute", right:"11px", top:"50%", transform:"translateY(-50%)",
                background:"none", border:"none", cursor:"pointer", fontSize:"15px", opacity:0.55,
              }}>{showPw ? "🙈" : "👁"}</button>
            </div>
          </div>
          {mode === "signup" && (
            <div>
              <label style={{ fontSize:"11px", color:C.textMuted, fontWeight:"700", display:"block", marginBottom:"5px" }}>CONFIRM PASSWORD</label>
              <input className="field" type="password" placeholder="••••••••" value={form.confirm} onChange={e => set("confirm",e.target.value)} />
            </div>
          )}

          {err && (
            <div style={{ background:"rgba(230,57,70,0.1)", border:"1px solid rgba(230,57,70,0.28)",
              borderRadius:"8px", padding:"9px 12px", fontSize:"12px", color:C.riskRed,
              display:"flex", alignItems:"center", gap:"7px" }}>⚠ {err}</div>
          )}

          <button className="btn btn-teal" onClick={submit} disabled={loading} style={{ marginTop:"4px", padding:"13px", width:"100%" }}>
            {loading ? <><span className="spinner"/>{mode==="login"?"Signing in…":"Creating account…"}</> : mode==="login" ? "Sign In →" : "Create Account →"}
          </button>
        </div>

        <p style={{ textAlign:"center", fontSize:"11px", color:C.textMuted, marginTop:"16px" }}>
          {mode==="login" ? "Demo: any email + password ·" : ""} 🔒 Kenya DPA 2022
        </p>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, user, onLogout, collapsed }) {
  const items = [
    { id:"dashboard", icon:"⊞",  label:"Dashboard"        },
    { id:"agents",    icon:"🦁", label:"Agent Simulation" },
    { id:"apply",     icon:"📝", label:"Apply for Loan"   },
    { id:"payments",  icon:"💳", label:"Loan Payments"    },
    { id:"loans",     icon:"📋", label:"My Loans"         },
    { id:"faq",       icon:"💬", label:"FAQ — Jibu"       },
    { id:"profile",   icon:"👤", label:"My Profile"       },
  ];
  return (
    <div className="glass-dark" style={{
      width: collapsed ? "62px" : "216px", minHeight:"100vh",
      display:"flex", flexDirection:"column", padding:"18px 9px",
      transition:"width 0.28s ease", borderRight:`1px solid ${C.glassBorder}`,
      flexShrink:0, position:"relative", zIndex:10,
    }}>
      {/* Brand */}
      <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"4px 6px 22px", overflow:"hidden" }}>
        <div style={{
          width:"36px", height:"36px", flexShrink:0, borderRadius:"10px",
          background:`linear-gradient(135deg,${C.riftTeal},${C.harvestAmber})`,
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:"17px",
          animation:"heartbeat 4s infinite",
        }}>🦁</div>
        {!collapsed && (
          <div style={{ overflow:"hidden" }}>
            <div style={{ fontSize:"14px", fontWeight:"800", color:C.textLight, whiteSpace:"nowrap" }}>Ujima</div>
            <div style={{ fontSize:"10px", color:C.riftTeal, fontWeight:"600" }}>SACCO PRIDE</div>
          </div>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div style={{
          display:"flex", alignItems:"center", gap:"8px", background:"rgba(0,0,0,0.24)",
          borderRadius:"9px", padding:"8px 11px", marginBottom:"14px", border:`1px solid ${C.border}`,
        }}>
          <span style={{ fontSize:"12px", opacity:0.55 }}>🔍</span>
          <span style={{ fontSize:"11px", color:C.textMuted }}>Search…</span>
        </div>
      )}

      {/* Nav items */}
      <nav style={{ display:"flex", flexDirection:"column", gap:"2px", flex:1 }}>
        {items.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)}
            className={`nav-item ${page===item.id ? "active" : ""}`}
            style={{ justifyContent: collapsed ? "center" : "flex-start", padding: collapsed ? "10px 0" : "10px 12px" }}>
            <span style={{ fontSize:"16px", flexShrink:0 }}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
            {!collapsed && page===item.id && <span style={{ marginLeft:"auto", fontSize:"8px", color:C.riftTeal }}>●</span>}
          </button>
        ))}
      </nav>

      {/* User + logout */}
      <div style={{ borderTop:`1px solid rgba(255,255,255,0.06)`, paddingTop:"12px", marginTop:"8px" }}>
        {!collapsed && (
          <div style={{ padding:"6px 10px 10px" }}>
            <div style={{ fontSize:"12px", fontWeight:"600", color:C.textLight, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name}</div>
            <div style={{ fontSize:"10px", color:C.textMuted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.email}</div>
          </div>
        )}
        <button onClick={onLogout} className="nav-item" style={{
          color:C.riskRed, justifyContent: collapsed ? "center" : "flex-start",
          padding: collapsed ? "10px 0" : "10px 12px",
        }}>
          <span style={{ fontSize:"16px" }}>⎋</span>
          {!collapsed && <span style={{ color:C.riskRed }}>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
function Topbar({ page, user, onToggle }) {
  const titles = { dashboard:"Dashboard", agents:"Agent Simulation", apply:"Apply for a Loan", payments:"Loan Payments", loans:"My Loans", faq:"FAQ — Jibu Assistant", profile:"My Profile" };
  return (
    <div className="glass-dark" style={{
      height:"58px", display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 20px", borderBottom:`1px solid ${C.glassBorder}`, flexShrink:0,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:"13px" }}>
        <button onClick={onToggle} style={{
          background:"none", border:"none", cursor:"pointer", color:C.textSub,
          fontSize:"17px", padding:"4px 6px", borderRadius:"7px",
        }}>☰</button>
        <h2 style={{ fontSize:"15px", fontWeight:"700" }}>{titles[page] || page}</h2>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
        <div style={{ fontSize:"10px", color:C.textMuted, display:"flex", alignItems:"center", gap:"5px" }}>
          <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:C.approvalGreen, animation:"statusBlink 2.5s infinite" }}/>
          Live · DPA 2022
        </div>
        <div className="glass" style={{ display:"flex", alignItems:"center", gap:"9px", padding:"6px 11px", borderRadius:"10px" }}>
          <div style={{
            width:"27px", height:"27px", borderRadius:"8px",
            background:`linear-gradient(135deg,${C.riftTeal},${C.harvestAmber})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"12px", fontWeight:"700", color:"#fff",
          }}>{(user.name?.[0] || "U").toUpperCase()}</div>
          <div>
            <div style={{ fontSize:"12px", fontWeight:"600" }}>{user.name}</div>
            <div style={{ fontSize:"10px", color:C.textMuted }}>{user.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage({ user, setPage }) {
  const stats = [
    { label:"Active Loan",    value:"KES 28,000", sub:"Due Jan 2026",           color:C.harvestAmber, icon:"📋" },
    { label:"Savings Balance",value:"KES 47,200", sub:"+KES 3,200 this month",  color:C.approvalGreen,icon:"💰" },
    { label:"Loan Score",     value:"82/100",     sub:"Eligible for KES 50K",   color:C.riftTeal,     icon:"⭐" },
    { label:"Next Harvest",   value:"Oct / Nov",  sub:"Maize season",           color:C.dustGold,     icon:"🌾" },
  ];
  const agentStatus = [
    { name:"Karibu",   role:"Scout — Literacy Coach",  color:C.dustGold,   icon:"🌿", sms:"2 / 3 SMS used" },
    { name:"Msaada",   role:"Guardian — Loan Triage",  color:C.riftTeal,   icon:"🔎", sms:"12 processed today" },
    { name:"Mwangaza", role:"Hunter — Officer Coord.", color:C.harvestAmber,icon:"🏹", sms:"3 briefings sent" },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"20px" }} className="anim-up">
      {/* Welcome banner */}
      <div style={{
        background:`linear-gradient(135deg,rgba(46,196,182,0.11),rgba(244,162,97,0.07))`,
        border:`1px solid ${C.border}`, borderRadius:"18px", padding:"22px 26px",
        display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"14px",
      }}>
        <div>
          <div style={{ fontSize:"10px", color:C.riftTeal, fontWeight:"700", letterSpacing:"0.9px", marginBottom:"3px" }}>KARIBU SANA</div>
          <h2 style={{ fontSize:"21px", fontWeight:"800" }}>Habari, {user.name} 👋</h2>
          <p style={{ fontSize:"12px", color:C.textSub, marginTop:"4px" }}>Harvest-cycle aligned · bias-free · human-in-the-loop</p>
        </div>
        <div style={{ display:"flex", gap:"9px", flexWrap:"wrap" }}>
          <button className="btn btn-teal" onClick={() => setPage("apply")}>📝 Apply for a Loan</button>
          <button className="btn btn-teal" onClick={() => setPage("agents")} style={{background:`linear-gradient(135deg,${C.harvestAmber},#e0874a)`}}>▶ Agent Simulation</button>
          <button className="btn btn-mpesa" onClick={() => setPage("payments")}>📱 Pay via M-Pesa</button>
          <button className="btn btn-ghost" onClick={() => setPage("faq")} style={{borderColor:"rgba(233,196,106,0.35)",color:C.dustGold}}>💬 Ask Jibu</button>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(185px,1fr))", gap:"13px" }}>
        {stats.map((s,i) => (
          <div key={i} className="card anim-up" style={{ animationDelay:`${i*0.07}s`, cursor:"default" }}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
            onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
              <span style={{ fontSize:"21px" }}>{s.icon}</span>
              <span className="badge badge-teal" style={{ fontSize:"9px" }}>LIVE</span>
            </div>
            <div style={{ fontSize:"22px", fontWeight:"800", color:s.color }}>{s.value}</div>
            <div style={{ fontSize:"12px", color:C.textMuted, marginTop:"2px" }}>{s.label}</div>
            <div style={{ fontSize:"11px", color:C.textSub, marginTop:"4px" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
        {/* Loan history */}
        <div className="card">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px" }}>
            <h3 style={{ fontSize:"14px", fontWeight:"700" }}>Loan History</h3>
            <button className="btn btn-ghost" onClick={() => setPage("loans")} style={{ padding:"5px 12px", fontSize:"11px" }}>View all →</button>
          </div>
          {[
            { id:"UJ-2024-441", purpose:"School fees — Term 3", amount:"KES 28,000", status:"Active",  sc:C.harvestAmber, date:"Aug 2024" },
            { id:"UJ-2023-189", purpose:"Working capital",      amount:"KES 15,000", status:"Cleared", sc:C.approvalGreen,date:"Mar 2023" },
            { id:"UJ-2022-077", purpose:"Seeds + fertiliser",   amount:"KES 9,500",  status:"Cleared", sc:C.approvalGreen,date:"Sep 2022" },
          ].map((l,i) => (
            <div key={i} style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"10px 12px", borderRadius:"10px", marginBottom:"7px",
              background:"rgba(13,27,46,0.6)", border:`1px solid ${C.border}`,
            }}>
              <div>
                <div style={{ fontSize:"12px", fontWeight:"600" }}>{l.purpose}</div>
                <div style={{ fontSize:"10px", color:C.textMuted }}>{l.id} · {l.date}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:"12px", fontWeight:"700" }}>{l.amount}</div>
                <span className="badge" style={{ fontSize:"9px", background:`${l.sc}14`, color:l.sc, border:`1px solid ${l.sc}28` }}>{l.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Agent status */}
        <div className="card">
          <h3 style={{ fontSize:"14px", fontWeight:"700", marginBottom:"14px" }}>Agent Pride Status</h3>
          {agentStatus.map((a,i) => (
            <div key={i} style={{
              display:"flex", alignItems:"center", gap:"11px", padding:"10px 0",
              borderBottom: i < 2 ? `1px solid rgba(255,255,255,0.04)` : "none",
            }}>
              <div style={{
                width:"34px", height:"34px", borderRadius:"9px", flexShrink:0,
                background:`${a.color}1E`, border:`1px solid ${a.color}28`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px",
              }}>{a.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"12px", fontWeight:"600" }}>{a.name}</div>
                <div style={{ fontSize:"10px", color:a.color }}>{a.role}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"4px", justifyContent:"flex-end" }}>
                  <div style={{ width:"6px",height:"6px",borderRadius:"50%",background:C.approvalGreen,animation:"statusBlink 2.2s infinite" }}/>
                  <span style={{ fontSize:"10px", color:C.approvalGreen, fontWeight:"600" }}>Online</span>
                </div>
                <div style={{ fontSize:"10px", color:C.textMuted, marginTop:"1px" }}>{a.sms}</div>
              </div>
            </div>
          ))}
          <button className="btn btn-teal" onClick={() => setPage("agents")} style={{ width:"100%", marginTop:"13px" }}>Open Agent Console →</button>
        </div>
      </div>
    </div>
  );
}

// ─── PAYMENTS PAGE ────────────────────────────────────────────────────────────
function PaymentsPage({ addToast }) {
  const [tab, setTab]             = useState("mpesa");
  const [phone, setPhone]         = useState("+254 712 345 678");
  const [amount, setAmount]       = useState("3200");
  const [mpesaStep, setMpesaStep] = useState("idle"); // idle | sent | confirmed
  const [pin, setPin]             = useState("");
  const [loading, setLoading]     = useState(false);
  const [card, setCard]           = useState({ number:"", expiry:"", cvv:"", name:"" });
  const setC = (k,v) => setCard(c => ({ ...c, [k]:v }));
  const fmtCard = v => v.replace(/\D/g,"").replace(/(.{4})/g,"$1 ").trim().slice(0,19);
  const fmtExp  = v => v.replace(/\D/g,"").replace(/^(\d{2})(\d)/,"$1/$2").slice(0,5);

  const sendMpesa = async () => {
    if (!phone.trim() || !amount || +amount < 1) { addToast("Enter a valid phone and amount","error"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r,1400));
    setLoading(false);
    setMpesaStep("sent");
    addToast(`STK Push sent to ${phone} — check your phone`,"mpesa");
  };

  const confirmMpesa = async () => {
    if (pin.length < 4) { addToast("Enter your M-Pesa PIN (min 4 digits)","error"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r,1200));
    setLoading(false);
    setMpesaStep("confirmed");
    addToast(`M-Pesa payment of KES ${Number(amount).toLocaleString()} confirmed! ✓`,"success");
  };

  const payCard = async () => {
    if (!card.number || !card.expiry || !card.cvv || !card.name) {
      addToast("Please complete all card fields","error"); return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r,1800));
    setLoading(false);
    addToast(`Card payment of KES ${Number(amount).toLocaleString()} processed ✓`,"success");
    setCard({ number:"", expiry:"", cvv:"", name:"" });
  };

  const history = [
    { date:"12 Jun 2025", method:"M-Pesa", amount:"KES 3,200", ref:"MP25-44121", ok:true },
    { date:"14 May 2025", method:"M-Pesa", amount:"KES 3,200", ref:"MP25-39804", ok:true },
    { date:"10 Apr 2025", method:"Card",   amount:"KES 6,400", ref:"CD25-28811", ok:true },
    { date:"12 Mar 2025", method:"M-Pesa", amount:"KES 3,200", ref:"MP25-21044", ok:false},
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"18px" }} className="anim-up">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"10px" }}>
        <div>
          <h2 style={{ fontSize:"17px", fontWeight:"800" }}>Loan Repayment</h2>
          <p style={{ fontSize:"11px", color:C.textMuted, marginTop:"2px" }}>
            Loan <strong style={{ color:C.riftTeal }}>UJ-2024-441</strong> · Balance <strong style={{ color:C.harvestAmber }}>KES 14,500</strong>
          </p>
        </div>
        <div style={{ display:"flex", gap:"7px" }}>
          <span className="badge badge-amber">Active Loan</span>
          <span className="badge badge-teal">Due: Jan 2026</span>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
        {/* Payment panel */}
        <div className="card">
          {/* Tabs */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px",
            background:"rgba(0,0,0,0.3)", borderRadius:"11px", padding:"4px", marginBottom:"20px" }}>
            {[["mpesa","📱 M-Pesa"],["card","💳 Card"]].map(([t,l]) => (
              <button key={t} onClick={() => { setTab(t); setMpesaStep("idle"); setPin(""); }} className="btn" style={{
                padding:"9px 0", fontSize:"13px", borderRadius:"8px", fontWeight:"600",
                background: tab===t ? (t==="mpesa" ? `linear-gradient(135deg,${C.mpesaGreen},${C.mpesaDark})` : `linear-gradient(135deg,${C.riftTeal},#22a89e)`) : "transparent",
                color: tab===t ? "#fff" : C.textMuted,
              }}>{l}</button>
            ))}
          </div>

          {/* ── M-PESA FLOW ── */}
          {tab === "mpesa" && (
            <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
              <div style={{
                background:`linear-gradient(135deg,rgba(75,181,67,0.11),rgba(0,132,61,0.07))`,
                border:`1px solid rgba(75,181,67,0.24)`, borderRadius:"13px", padding:"16px",
                display:"flex", alignItems:"center", gap:"13px",
                animation: mpesaStep==="idle" ? "mpesaPulse 2.8s infinite" : "none",
              }}>
                <div style={{
                  width:"48px", height:"48px", borderRadius:"13px", flexShrink:0,
                  background:"linear-gradient(135deg,#4BB543,#00843D)",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px",
                  boxShadow:"0 4px 14px rgba(75,181,67,0.28)",
                }}>📱</div>
                <div>
                  <div style={{ fontSize:"14px", fontWeight:"800", color:C.mpesaGreen }}>M-Pesa</div>
                  <div style={{ fontSize:"11px", color:C.textSub }}>Safaricom · Instant · USSD *#733#</div>
                  <div style={{ fontSize:"10px", color:C.textMuted }}>Zero fee for SACCO members</div>
                </div>
              </div>

              {mpesaStep === "idle" && <>
                <div>
                  <label style={{ fontSize:"11px", color:C.textMuted, fontWeight:"700", display:"block", marginBottom:"5px" }}>PHONE NUMBER</label>
                  <input className="field" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254 7XX XXX XXX" />
                </div>
                <div>
                  <label style={{ fontSize:"11px", color:C.textMuted, fontWeight:"700", display:"block", marginBottom:"5px" }}>AMOUNT (KES)</label>
                  <input className="field" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="3200" />
                  <div style={{ display:"flex", gap:"6px", marginTop:"7px", flexWrap:"wrap" }}>
                    {[3200,6400,9600,14500].map(v => (
                      <button key={v} onClick={() => setAmount(String(v))} className="btn btn-ghost"
                        style={{ padding:"5px 11px", fontSize:"11px", borderRadius:"6px",
                          background: amount===String(v) ? `${C.riftTeal}14` : "transparent",
                          borderColor: amount===String(v) ? C.riftTeal : C.border,
                          color: amount===String(v) ? C.riftTeal : C.textMuted }}>
                        KES {v.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="btn btn-mpesa" onClick={sendMpesa} disabled={loading} style={{ padding:"13px", width:"100%" }}>
                  {loading ? <><span className="spinner"/>Sending STK Push…</> : "Send M-Pesa Request →"}
                </button>
              </>}

              {mpesaStep === "sent" && <>
                <div style={{ background:"rgba(75,181,67,0.08)", border:"1px solid rgba(75,181,67,0.22)",
                  borderRadius:"11px", padding:"14px", textAlign:"center" }}>
                  <div style={{ fontSize:"22px", marginBottom:"6px" }}>📲</div>
                  <div style={{ fontSize:"14px", fontWeight:"700", color:C.mpesaGreen }}>STK Push Sent!</div>
                  <div style={{ fontSize:"12px", color:C.textSub, marginTop:"3px" }}>
                    Confirm KES {Number(amount).toLocaleString()} on your phone, then enter PIN below
                  </div>
                </div>
                <div>
                  <label style={{ fontSize:"11px", color:C.textMuted, fontWeight:"700", display:"block", marginBottom:"5px" }}>M-PESA PIN (demo)</label>
                  <input className="field" type="password" maxLength={6} placeholder="••••" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g,""))} />
                </div>
                <button className="btn btn-mpesa" onClick={confirmMpesa} disabled={loading || pin.length < 4} style={{ padding:"13px", width:"100%" }}>
                  {loading ? <><span className="spinner"/>Confirming…</> : "Confirm Payment →"}
                </button>
                <button className="btn btn-ghost" onClick={() => setMpesaStep("idle")} style={{ width:"100%" }}>← Back</button>
              </>}

              {mpesaStep === "confirmed" && (
                <div style={{ background:"rgba(6,214,160,0.09)", border:"1px solid rgba(6,214,160,0.27)",
                  borderRadius:"13px", padding:"20px", textAlign:"center" }}>
                  <div style={{ fontSize:"34px", marginBottom:"7px" }}>✅</div>
                  <div style={{ fontSize:"16px", fontWeight:"800", color:C.approvalGreen }}>Payment Confirmed!</div>
                  <div style={{ fontSize:"12px", color:C.textSub, marginTop:"5px" }}>KES {Number(amount).toLocaleString()} received</div>
                  <div style={{ fontSize:"11px", color:C.textMuted, marginTop:"3px" }}>
                    New balance: KES {(14500 - Number(amount)).toLocaleString()}
                  </div>
                  <button className="btn btn-ghost" onClick={() => { setMpesaStep("idle"); setPin(""); }}
                    style={{ marginTop:"13px", width:"100%" }}>Make another payment</button>
                </div>
              )}
            </div>
          )}

          {/* ── CARD FLOW ── */}
          {tab === "card" && (
            <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
              {/* Card preview */}
              <div style={{
                background:"linear-gradient(135deg,rgba(46,196,182,0.11),rgba(233,196,106,0.07))",
                border:`1px solid ${C.border}`, borderRadius:"14px", padding:"16px", position:"relative", overflow:"hidden",
              }}>
                <div style={{ fontSize:"10px", color:C.riftTeal, fontWeight:"600", marginBottom:"11px", letterSpacing:"0.5px" }}>VISA / MASTERCARD</div>
                <div style={{ fontSize:"17px", fontWeight:"700", letterSpacing:"3px", color:C.textLight, marginBottom:"11px", fontVariantNumeric:"tabular-nums" }}>
                  {card.number || "•••• •••• •••• ••••"}
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", color:C.textMuted }}>
                  <span>{card.name || "CARDHOLDER NAME"}</span>
                  <span>{card.expiry || "MM/YY"}</span>
                </div>
                <div style={{ position:"absolute", right:"-18px", bottom:"-18px", fontSize:"72px", opacity:0.04, pointerEvents:"none" }}>💳</div>
              </div>
              <div>
                <label style={{ fontSize:"11px", color:C.textMuted, fontWeight:"700", display:"block", marginBottom:"5px" }}>CARD NUMBER</label>
                <input className="field" placeholder="1234 5678 9012 3456" value={card.number} onChange={e => setC("number",fmtCard(e.target.value))} maxLength={19} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"11px" }}>
                <div>
                  <label style={{ fontSize:"11px", color:C.textMuted, fontWeight:"700", display:"block", marginBottom:"5px" }}>EXPIRY</label>
                  <input className="field" placeholder="MM/YY" value={card.expiry} onChange={e => setC("expiry",fmtExp(e.target.value))} maxLength={5} />
                </div>
                <div>
                  <label style={{ fontSize:"11px", color:C.textMuted, fontWeight:"700", display:"block", marginBottom:"5px" }}>CVV</label>
                  <input className="field" type="password" placeholder="•••" value={card.cvv} onChange={e => setC("cvv",e.target.value.replace(/\D/g,"").slice(0,4))} />
                </div>
              </div>
              <div>
                <label style={{ fontSize:"11px", color:C.textMuted, fontWeight:"700", display:"block", marginBottom:"5px" }}>NAME ON CARD</label>
                <input className="field" placeholder="GRACE WANJIRU" value={card.name} onChange={e => setC("name",e.target.value.toUpperCase())} />
              </div>
              <div>
                <label style={{ fontSize:"11px", color:C.textMuted, fontWeight:"700", display:"block", marginBottom:"5px" }}>AMOUNT (KES)</label>
                <input className="field" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
              <button className="btn btn-teal" onClick={payCard} disabled={loading} style={{ padding:"13px", width:"100%" }}>
                {loading ? <><span className="spinner"/>Processing…</> : `Pay KES ${Number(amount||0).toLocaleString()} →`}
              </button>
              <div style={{ display:"flex", justifyContent:"center", gap:"14px" }}>
                {["🔒 SSL","🏦 PCI DSS","🇰🇪 CBK"].map(t => (
                  <span key={t} style={{ fontSize:"10px", color:C.textMuted }}>{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Payment history + schedule */}
        <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
          <div className="card">
            <h3 style={{ fontSize:"13px", fontWeight:"700", marginBottom:"13px" }}>Payment History</h3>
            {history.map((h,i) => (
              <div key={i} style={{
                display:"flex", alignItems:"center", gap:"11px", padding:"10px 12px",
                background:"rgba(13,27,46,0.6)", border:`1px solid ${C.border}`,
                borderRadius:"9px", marginBottom:"6px",
                animation:`fadeSlideUp 0.32s ease ${i*0.055}s both`,
              }}>
                <div style={{
                  width:"34px", height:"34px", borderRadius:"9px", flexShrink:0,
                  background: h.method==="M-Pesa" ? "rgba(75,181,67,0.13)" : "rgba(46,196,182,0.13)",
                  border: `1px solid ${h.method==="M-Pesa"?"rgba(75,181,67,0.25)":C.border}`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px",
                }}>{h.method==="M-Pesa"?"📱":"💳"}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"12px", fontWeight:"600" }}>{h.amount}</div>
                  <div style={{ fontSize:"10px", color:C.textMuted }}>{h.ref} · {h.date}</div>
                </div>
                <span className={`badge ${h.ok?"badge-green":"badge-red"}`}>{h.ok?"Success":"Failed"}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <h4 style={{ fontSize:"13px", fontWeight:"700", marginBottom:"11px" }}>🌾 Harvest-Aligned Schedule</h4>
            {[
              { month:"Sep 2025", amount:"KES 3,200", note:"Pre-harvest buffer" },
              { month:"Oct 2025", amount:"KES 5,800", note:"Maize harvest peak" },
              { month:"Nov 2025", amount:"KES 5,500", note:"Post-harvest income" },
            ].map((s,i) => (
              <div key={i} style={{
                display:"flex", alignItems:"center", gap:"9px", padding:"8px 11px",
                borderRadius:"8px", marginBottom:"5px",
                background:"linear-gradient(90deg,rgba(244,162,97,0.06),transparent)",
                border:"1px solid rgba(244,162,97,0.11)",
              }}>
                <div style={{ width:"6px",height:"6px",borderRadius:"50%",background:C.harvestAmber,flexShrink:0 }}/>
                <div style={{ flex:1 }}>
                  <span style={{ fontSize:"12px", fontWeight:"600" }}>{s.month}</span>
                  <span style={{ fontSize:"10px", color:C.textMuted, marginLeft:"7px" }}>{s.note}</span>
                </div>
                <span style={{ fontSize:"12px", fontWeight:"700", color:C.harvestAmber }}>{s.amount}</span>
              </div>
            ))}
            <div style={{ fontSize:"10px", color:C.textMuted, marginTop:"7px", textAlign:"center" }}>
              Source: Kenya Agricultural Observatory
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MY LOANS PAGE ────────────────────────────────────────────────────────────
function LoansPage({ setPage }) {
  const loans = [
    { id:"UJ-2024-441",amount:28000,balance:14500,purpose:"School fees — Term 3",status:"Active", date:"Aug 2024",rate:"12% p.a.",officer:"Sarah (Kakamega)",score:82 },
    { id:"UJ-2023-189",amount:15000,balance:0,    purpose:"Working capital",     status:"Cleared",date:"Mar 2023",rate:"11% p.a.",officer:"Ahmed (Mombasa)", score:79 },
    { id:"UJ-2022-077",amount:9500, balance:0,    purpose:"Seeds + fertiliser",  status:"Cleared",date:"Sep 2022",rate:"11% p.a.",officer:"Wanjiku (Busia)", score:76 },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"16px" }} className="anim-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h2 style={{ fontSize:"17px", fontWeight:"800" }}>My Loans</h2>
        <button className="btn btn-teal" onClick={() => setPage("apply")}>📝 Apply for a Loan</button>
      </div>
      {loans.map((l,i) => (
        <div key={i} className="card anim-up" style={{ animationDelay:`${i*0.09}s` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"12px" }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"9px", marginBottom:"10px" }}>
                <span style={{ fontSize:"15px" }}>📋</span>
                <span style={{ fontSize:"14px", fontWeight:"700" }}>{l.purpose}</span>
                <span className={`badge ${l.status==="Active"?"badge-amber":"badge-green"}`}>{l.status}</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:"9px" }}>
                {[["Loan ID",l.id],["Amount",`KES ${l.amount.toLocaleString()}`],
                  ["Balance",l.balance ? `KES ${l.balance.toLocaleString()}` : "Cleared ✓"],
                  ["Rate",l.rate],["Officer",l.officer],["Date",l.date]].map(([k,v]) => (
                  <div key={k}>
                    <div style={{ fontSize:"9px", color:C.textMuted, fontWeight:"700", letterSpacing:"0.5px" }}>{k.toUpperCase()}</div>
                    <div style={{ fontSize:"12px", fontWeight:"500", marginTop:"2px" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"3px" }}>
              <ScoreRing score={l.score} size={62}/>
              <div style={{ fontSize:"9px", color:C.textMuted, fontWeight:"600" }}>AI SCORE</div>
            </div>
          </div>
          {l.balance > 0 && (
            <>
              <div style={{ margin:"12px 0 5px", display:"flex", justifyContent:"space-between", fontSize:"10px", color:C.textMuted }}>
                <span>Repaid</span>
                <span>{Math.round((1 - l.balance/l.amount)*100)}%</span>
              </div>
              <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:"4px", height:"5px", overflow:"hidden" }}>
                <div style={{
                  height:"100%", borderRadius:"4px",
                  background:`linear-gradient(90deg,${C.riftTeal},${C.harvestAmber})`,
                  width:`${Math.round((1-l.balance/l.amount)*100)}%`,
                  transition:"width 1.2s ease",
                }}/>
              </div>
              <div style={{ display:"flex", gap:"8px", marginTop:"12px" }}>
                <button className="btn btn-mpesa" onClick={() => setPage("payments")} style={{ fontSize:"12px", padding:"8px 14px" }}>📱 Pay via M-Pesa</button>
                <button className="btn btn-ghost" onClick={() => setPage("payments")} style={{ fontSize:"12px" }}>💳 Pay by Card</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage({ user, onLogout, addToast }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ name:user.name, phone:user.phone||"+254 712 345 678", county:"Kakamega", occupation:"Maize farmer" });
  const [privacy, setPrivacy] = useState({ profiling:true, sms:true, thirdParty:false, retention:false });
  const [modal, setModal]     = useState(null); // "password" | "2fa" | "download"
  const [pw, setPw]           = useState({ current:"", next:"", confirm:"" });
  const setPwF = (k,v) => setPw(p => ({...p,[k]:v}));
  const [saving, setSaving]   = useState(false);

  const saveProfile = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r,900));
    setSaving(false);
    setEditing(false);
    addToast("Profile updated successfully","success");
  };

  const changePassword = async () => {
    if (!pw.current) { addToast("Enter your current password","error"); return; }
    if (pw.next.length < 6) { addToast("New password must be ≥ 6 characters","error"); return; }
    if (pw.next !== pw.confirm) { addToast("New passwords do not match","error"); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r,900));
    setSaving(false);
    setModal(null);
    setPw({ current:"", next:"", confirm:"" });
    addToast("Password changed successfully","success");
  };

  const download = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r,1200));
    setSaving(false);
    setModal(null);
    addToast("Your data export has been sent to " + user.email,"info");
  };

  const privacyItems = [
    { key:"profiling", label:"Performance profiling consent" },
    { key:"sms",       label:"SMS financial coaching (Karibu)" },
    { key:"thirdParty",label:"Third-party analytics sharing" },
    { key:"retention", label:"Long-term portfolio retention" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"16px" }} className="anim-up">
      {/* Hero */}
      <div className="card" style={{ background:`linear-gradient(135deg,rgba(46,196,182,0.09),rgba(244,162,97,0.06))`,
        display:"flex", alignItems:"center", gap:"18px", flexWrap:"wrap" }}>
        <div style={{
          width:"68px", height:"68px", borderRadius:"18px", flexShrink:0,
          background:`linear-gradient(135deg,${C.riftTeal},${C.harvestAmber})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:"26px", fontWeight:"800", color:"#fff",
          boxShadow:`0 8px 22px rgba(46,196,182,0.26)`,
        }}>{(user.name?.[0]||"U").toUpperCase()}</div>
        <div style={{ flex:1 }}>
          <h2 style={{ fontSize:"19px", fontWeight:"800" }}>{user.name}</h2>
          <p style={{ fontSize:"12px", color:C.textSub, marginTop:"2px" }}>{user.email}</p>
          <div style={{ display:"flex", gap:"7px", marginTop:"9px", flexWrap:"wrap" }}>
            <span className="badge badge-teal">SACCO Member</span>
            <span className="badge badge-gold">5 Years Active</span>
            <span className="badge badge-green">Good Standing</span>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={() => { if(editing) saveProfile(); else setEditing(true); }} disabled={saving}>
          {saving ? <><span className="spinner"/>Saving…</> : editing ? "Save Changes" : "Edit Profile"}
        </button>
        {editing && <button className="btn btn-ghost" onClick={() => setEditing(false)} style={{ marginLeft:"-6px" }}>Cancel</button>}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
        {/* Personal info */}
        <div className="card">
          <h3 style={{ fontSize:"13px", fontWeight:"700", marginBottom:"14px" }}>Personal Information</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
            {[["FULL NAME","name","Grace Wanjiru"],["PHONE (M-PESA)","phone","+254 712 345 678"],["COUNTY","county","Kakamega"],["OCCUPATION","occupation","Maize farmer"]].map(([l,k,ph]) => (
              <div key={k}>
                <label style={{ fontSize:"10px", color:C.textMuted, fontWeight:"700", display:"block", marginBottom:"4px" }}>{l}</label>
                {editing
                  ? <input className="field" value={form[k]} onChange={e => setForm(f=>({...f,[k]:e.target.value}))} placeholder={ph} style={{ padding:"9px 13px", fontSize:"13px" }}/>
                  : <div style={{ fontSize:"13px", fontWeight:"500", padding:"4px 0" }}>{form[k]}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
          {/* Privacy toggles */}
          <div className="card">
            <h3 style={{ fontSize:"13px", fontWeight:"700", marginBottom:"12px" }}>Data & Privacy</h3>
            {privacyItems.map((s,i) => (
              <div key={s.key} style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"8px 0", borderBottom: i<3?`1px solid rgba(255,255,255,0.04)`:"none",
              }}>
                <span style={{ fontSize:"12px", color:C.textSub }}>{s.label}</span>
                <Toggle on={privacy[s.key]} onToggle={() => {
                  setPrivacy(p => ({ ...p, [s.key]: !p[s.key] }));
                  addToast(`${s.label} ${!privacy[s.key]?"enabled":"disabled"}`,"info");
                }}/>
              </div>
            ))}
            <div style={{ fontSize:"10px", color:C.textMuted, marginTop:"10px", lineHeight:1.5 }}>
              🔒 Data stored on AWS Africa (Cape Town) · Kenya DPA 2022 · Auto-deleted 24 months after last session
            </div>
          </div>

          {/* Security */}
          <div className="card">
            <h3 style={{ fontSize:"13px", fontWeight:"700", marginBottom:"11px" }}>Security</h3>
            {[
              { label:"Change Password", icon:"🔑", action:()=>setModal("password") },
              { label:"Two-Factor Auth",  icon:"📲", action:()=>setModal("2fa") },
              { label:"Download My Data",icon:"📥", action:()=>setModal("download") },
            ].map((item,i) => (
              <div key={i} onClick={item.action} style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"10px 0", borderBottom:i<2?`1px solid rgba(255,255,255,0.04)`:"none",
                cursor:"pointer",
              }}
                onMouseEnter={e=>e.currentTarget.style.opacity="0.75"}
                onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                <span style={{ fontSize:"12px", color:C.textSub }}>{item.icon} {item.label}</span>
                <span style={{ fontSize:"12px", color:C.riftTeal }}>→</span>
              </div>
            ))}
            <button className="btn btn-danger" onClick={onLogout} style={{ width:"100%", marginTop:"13px" }}>
              ⎋ Sign Out of All Devices
            </button>
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}
      {modal === "password" && (
        <Modal title="🔑 Change Password" onClose={() => setModal(null)}>
          <div style={{ display:"flex", flexDirection:"column", gap:"13px" }}>
            {[["CURRENT PASSWORD","current"],["NEW PASSWORD","next"],["CONFIRM NEW PASSWORD","confirm"]].map(([l,k])=>(
              <div key={k}>
                <label style={{ fontSize:"11px", color:C.textMuted, fontWeight:"700", display:"block", marginBottom:"5px" }}>{l}</label>
                <input className="field" type="password" placeholder="••••••••" value={pw[k]} onChange={e=>setPwF(k,e.target.value)}/>
              </div>
            ))}
            <div style={{ display:"flex", gap:"8px", marginTop:"4px" }}>
              <button className="btn btn-teal" onClick={changePassword} disabled={saving} style={{ flex:1, padding:"12px" }}>
                {saving ? <><span className="spinner"/>Changing…</> : "Change Password"}
              </button>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {modal === "2fa" && (
        <Modal title="📲 Two-Factor Authentication" onClose={() => setModal(null)}>
          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            <div style={{ background:`${C.riftTeal}0D`, border:`1px solid ${C.riftTeal}22`, borderRadius:"10px", padding:"14px", fontSize:"12px", color:C.textSub, lineHeight:1.6 }}>
              2FA adds an extra layer of security. When enabled, you'll receive an SMS code on <strong style={{color:C.textLight}}>{user.phone}</strong> each time you log in.
            </div>
            <button className="btn btn-teal" onClick={() => { setModal(null); addToast("2FA enabled via SMS — "+user.phone,"success"); }} style={{ padding:"12px", width:"100%" }}>
              Enable SMS 2FA
            </button>
            <button className="btn btn-ghost" onClick={() => setModal(null)} style={{ width:"100%" }}>Not now</button>
          </div>
        </Modal>
      )}

      {modal === "download" && (
        <Modal title="📥 Download My Data" onClose={() => setModal(null)}>
          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            <div style={{ fontSize:"12px", color:C.textSub, lineHeight:1.6 }}>
              Your data export will include loan history, payment records, and savings data.
              It will be sent to <strong style={{color:C.textLight}}>{user.email}</strong> within
              24 hours, as required by Kenya DPA 2022.
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
              {["Loan history & officer notes","Payment transactions","Savings records","AI scoring explanations"].map(item=>(
                <div key={item} style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"12px", color:C.textSub }}>
                  <span style={{ color:C.approvalGreen }}>✓</span> {item}
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:"8px" }}>
              <button className="btn btn-teal" onClick={download} disabled={saving} style={{ flex:1, padding:"12px" }}>
                {saving ? <><span className="spinner"/>Preparing…</> : "Request Export"}
              </button>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── AGENT SIMULATION PAGE ────────────────────────────────────────────────────
function AgentsPage({ addToast }) {
  const [selIdx, setSelIdx]           = useState(0);
  const [stage, setStage]             = useState("idle");
  const [msgs, setMsgs]               = useState({ scout:[], guardian:[], hunter:[] });
  const [audit, setAudit]             = useState([]);
  const [scoreVal, setScoreVal]       = useState(null);
  const [decisionVal, setDecisionVal] = useState(null);
  const [flags, setFlags]             = useState({});
  const [killed, setKilled]           = useState(false);
  const [ld, setLd]                   = useState({ scout:false, guardian:false, hunter:false });

  // Refs at top level (no hooks-in-loops)
  const scoutEndRef    = useRef(null);
  const guardianEndRef = useRef(null);
  const hunterEndRef   = useRef(null);
  const killedRef      = useRef(false);
  useEffect(() => { killedRef.current = killed; }, [killed]);

  useEffect(() => {
    scoutEndRef.current?.scrollIntoView({ behavior:"smooth" });
    guardianEndRef.current?.scrollIntoView({ behavior:"smooth" });
    hunterEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [msgs]);

  const addMsg = useCallback((agent, type, text, label=null) =>
    setMsgs(m => ({ ...m, [agent]: [...m[agent], { type, text, label, time:ts() }] })), []);
  const addAudit = useCallback((msg, type="info") =>
    setAudit(a => [...a, { msg, type, time:ts() }]), []);
  const app = APPLICANTS[selIdx];

  const doReset = useCallback(() => {
    setStage("idle"); setMsgs({ scout:[], guardian:[], hunter:[] }); setAudit([]);
    setScoreVal(null); setDecisionVal(null); setFlags({}); setKilled(false);
    setLd({ scout:false, guardian:false, hunter:false });
  }, []);

  const run = useCallback(async () => {
    doReset();
    killedRef.current = false;
    const a = APPLICANTS[selIdx];

    // ── SCOUT ─────────────────────────────────────────────────────────────────
    setStage("scout"); setLd(l => ({...l, scout:true}));
    addAudit(`Simulation started — ${a.name}, ${a.county}`);
    addMsg("scout","system",`Application received: ${a.name} — ${a.occupation}, ${a.county}`,"📥 INTAKE");
    let scoutReply = "";
    try {
      scoutReply = await callClaude(SCOUT_SYS, [{role:"user", content:
        `Member: ${a.name}, ${a.age}yo, ${a.county} County. Occupation: ${a.occupation}. ` +
        `Children: ${a.children} (ages ${a.childrenAges.join(", ")}). ` +
        `Loan request: KES ${a.requestKES.toLocaleString()} for ${a.purpose}. ` +
        `Savings: ${a.savingsMonths} months, avg KES ${a.avgSavings}/mo. ` +
        `Harvest income: KES ${a.harvestIncome} (${a.harvestSeason}). ` +
        `Debt collector mentioned: ${a.debtCollector}. ` +
        `Conduct financial literacy check and flag any concerns.`}]);
    } catch(e) {
      setLd(l=>({...l,scout:false}));
      addMsg("scout","alert",`API Error: ${e.message}`,"❌ ERROR");
      setStage("idle"); return;
    }
    setLd(l=>({...l,scout:false}));
    addMsg("scout","ai", stripJSON(scoutReply), "🌿 KARIBU");

    const hasU5 = a.childrenAges.some(ag => ag < 5);
    if (a.debtCollector) { addMsg("scout","alert","⚠️ Debt collector mention — flagging for Guardian","🔴 GUARD"); addAudit("GUARD: Debt collector → Guardian escalation","alert"); setFlags(f=>({...f,debt:true})); }
    if (hasU5) { addMsg("scout","alert","👶 Children under 5 — vulnerability flag active","🔴 GUARD"); addAudit("GUARD: Children under 5 vulnerability","alert"); }
    if (a.county==="Busia") { addMsg("scout","alert","📍 Busia County — mandatory human review","🔴 GUARD"); addAudit("GUARD: Busia County mandatory review","alert"); setFlags(f=>({...f,busia:true})); }
    if (a.name==="Grace Wanjiru") { addMsg("scout","alert","🔴 RED TEAM: Female shea trader, 4 children, Busia — bias audit active","🔴 RED TEAM"); addAudit("RED TEAM TEST activated","alert"); setFlags(f=>({...f,redteam:true})); }
    addMsg("scout","system","HUNT trigger: escalating to Guardian Agent (Msaada)","🔀 HANDOFF");
    addAudit("Scout → Guardian handoff initiated");
    setStage("guardian_ready");

    await new Promise(r=>setTimeout(r,750));
    if (killedRef.current) return;

    // ── GUARDIAN ──────────────────────────────────────────────────────────────
    setStage("guardian"); setLd(l=>({...l,guardian:true}));
    addAudit("Guardian Agent (Msaada) activated");
    addMsg("guardian","system",`Received from Scout: ${a.name} — KES ${a.requestKES.toLocaleString()}`,"📥 INTAKE");
    let guardianReply = "";
    try {
      guardianReply = await callClaude(GUARDIAN_SYS, [{role:"user", content:
        `Applicant: ${a.name}, ${a.age}yo, ${a.county} County. Occupation: ${a.occupation}. ` +
        `Children: ${a.children} (ages ${a.childrenAges.join(", ")}). ` +
        `Request KES ${a.requestKES.toLocaleString()} — ${a.purpose}. ` +
        `Savings: ${a.savingsMonths} months, avg KES ${a.avgSavings}/mo. ` +
        `Harvest income: KES ${a.harvestIncome} (${a.harvestSeason}). ` +
        `Debt collector: ${a.debtCollector}. ` +
        `County flags: ${a.county==="Busia"?"Busia → mandatory human review":"none"}. ` +
        `Run TRACK audit and counterfactual. Output analysis then end with score JSON.`}]);
    } catch(e) {
      setLd(l=>({...l,guardian:false}));
      addMsg("guardian","alert",`API Error: ${e.message}`,"❌ ERROR");
      setStage("idle"); return;
    }
    setLd(l=>({...l,guardian:false}));
    const parsed = parseJSONBlock(guardianReply, "score");
    const localScore    = parsed?.score    ?? null;
    const localDecision = parsed?.decision ?? "ESCALATE";
    setScoreVal(localScore); setDecisionVal(localDecision);
    addMsg("guardian","ai", stripJSON(guardianReply), "🔎 MSAADA");
    if (parsed) {
      const t = parsed.score>=75?"success":parsed.score>=50?"system":"alert";
      addMsg("guardian",t,`Score: ${parsed.score}/100 | ${parsed.decision} | Bias: ${parsed.bias_check_passed?"✅ PASSED":"⚠️ NEEDS REVIEW"}`,"📊 SCORE");
      addAudit(`Guardian score: ${parsed.score}/100 — ${parsed.decision}`, parsed.score>=65?"info":"alert");
    }
    addMsg("guardian","system","HUNT trigger: passing to Hunter Agent (Mwangaza)","🔀 HANDOFF");
    addAudit("Guardian → Hunter handoff: packet prepared");
    setStage("hunter_ready");

    await new Promise(r=>setTimeout(r,750));
    if (killedRef.current) return;

    // ── HUNTER ────────────────────────────────────────────────────────────────
    setStage("hunter"); setLd(l=>({...l,hunter:true}));
    addAudit("Hunter Agent (Mwangaza) activated");
    addMsg("hunter","system",`Enriched packet received: ${a.name} — score ${localScore ?? "N/A"}/100`,"📥 INTAKE");
    let hunterReply = "";
    try {
      hunterReply = await callClaude(HUNTER_SYS, [{role:"user", content:
        `Applicant: ${a.name}, ${a.age}yo, ${a.county} County. Occupation: ${a.occupation}. ` +
        `Children: ${a.children} (ages ${a.childrenAges.join(", ")}). ` +
        `Request KES ${a.requestKES.toLocaleString()} — ${a.purpose}. ` +
        `Savings: ${a.savingsMonths} months, avg KES ${a.avgSavings}/mo. ` +
        `Harvest income: KES ${a.harvestIncome} (${a.harvestSeason}). ` +
        `Guardian score: ${localScore}/100. Decision: ${localDecision}. ` +
        `Flags: ${[a.debtCollector?"debt collector":null,a.childrenAges.some(ag=>ag<5)?"children under 5":null,a.county==="Busia"?"Busia mandatory review":null,a.requestKES>25000?"high-value loan":null].filter(Boolean).join("; ")||"None"}. ` +
        `Generate complete officer briefing packet.`}]);
    } catch(e) {
      setLd(l=>({...l,hunter:false}));
      addMsg("hunter","alert",`API Error: ${e.message}`,"❌ ERROR");
      setStage("idle"); return;
    }
    setLd(l=>({...l,hunter:false}));
    addMsg("hunter","ai", hunterReply, "🏹 MWANGAZA");
    addMsg("hunter","success","✅ Briefing ready. Officer alerted. Human sign-off required before any loan decision.","✅ COMPLETE");
    addAudit("Hunter briefing sent to human loan officer","success");
    addAudit("CYCLE ENGINE: CSAT + repayment rate logging initiated","info");
    addAudit("Audit log stored — AWS Africa (Cape Town) · DPA 2022","success");
    setStage("complete");
    addToast("Agent simulation complete — officer notified 🦁","success");
  }, [selIdx, addMsg, addAudit, doReset]);

  const kill = useCallback(() => {
    killedRef.current = true; setKilled(true); setStage("killed");
    setLd({ scout:false, guardian:false, hunter:false });
    addAudit("⛔ KILL SWITCH *#799# — full system pause","alert");
    addToast("Kill switch activated — all agents paused","error");
  }, [addAudit, addToast]);

  const isRunning = ["scout","guardian","hunter"].includes(stage);
  const agentDefs = [
    { id:"scout",   name:"Karibu",   role:"Financial Literacy Coach",  icon:"🌿", color:C.dustGold,    badge:"SCOUT",   authority:"Max 3 SMS/day · never recommends loan amounts" },
    { id:"guardian",name:"Msaada",   role:"Loan Triage Agent",         icon:"🔎", color:C.riftTeal,    badge:"GUARDIAN",authority:"Auto-approve ≤KES 15K · 3+ flags to deny" },
    { id:"hunter",  name:"Mwangaza", role:"Human-in-Loop Coordinator", icon:"🏹", color:C.harvestAmber,badge:"HUNTER",  authority:"NEVER approves/denies · briefings only" },
  ];
  const activeAgent = {scout:"scout",guardian_ready:"scout",guardian:"guardian",hunter_ready:"guardian",hunter:"hunter",complete:"hunter"}[stage]||null;
  const doneAgents  = {scout:[],guardian_ready:["scout"],guardian:["scout"],hunter_ready:["scout","guardian"],hunter:["scout","guardian"],complete:["scout","guardian","hunter"]}[stage]||[];
  const statusText  = {idle:"Idle — select applicant and run",scout:"Scout Karibu processing…",guardian_ready:"Scout done → Guardian queued",guardian:"Guardian Msaada scoring…",hunter_ready:"Guardian done → Hunter queued",hunter:"Hunter Mwangaza briefing officer…",complete:"✅ Complete — human officer alerted",killed:"⛔ System killed"}[stage];
  const endRefs = { scout:scoutEndRef, guardian:guardianEndRef, hunter:hunterEndRef };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"16px"}} className="anim-up">
      {/* Control bar */}
      <div className="card" style={{display:"flex",alignItems:"center",gap:"13px",flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:"210px"}}>
          <label style={{fontSize:"10px",color:C.textMuted,fontWeight:"700",display:"block",marginBottom:"5px"}}>APPLICANT PROFILE</label>
          <select className="field" value={selIdx} disabled={isRunning}
            onChange={e=>{setSelIdx(+e.target.value);doReset();}} style={{cursor:"pointer"}}>
            {APPLICANTS.map((a,i)=><option key={i} value={i}>{a.name} — {a.occupation}, {a.county} · KES {a.requestKES.toLocaleString()}</option>)}
          </select>
        </div>
        <div style={{display:"flex",gap:"7px",flexWrap:"wrap"}}>
          <button className="btn btn-teal" onClick={run} disabled={isRunning||killed}>
            {isRunning?<><span className="spinner"/>Running…</>:"▶ Run Simulation"}
          </button>
          <button className="btn btn-ghost" onClick={doReset} disabled={isRunning}>Reset</button>
          <button className="btn btn-danger" onClick={kill} disabled={killed||stage==="idle"} style={{fontSize:"11px"}}>
            {killed?"⛔ KILLED":"⛔ Kill *#799#"}
          </button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"5px",fontSize:"11px",
          color:stage==="complete"?C.approvalGreen:stage==="killed"?C.riskRed:isRunning?C.riftTeal:C.textMuted}}>
          <div style={{width:"7px",height:"7px",borderRadius:"50%",background:"currentColor",
            animation:isRunning?"statusBlink 1s infinite":"none"}}/>
          {statusText}
        </div>
      </div>

      {/* Applicant snapshot */}
      <div style={{background:"linear-gradient(135deg,rgba(244,162,97,0.07),rgba(46,196,182,0.04))",
        border:"1px solid rgba(244,162,97,0.18)",borderRadius:"13px",padding:"14px 18px",
        display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:"10px"}}>
        {[["Name",app.name],["Occupation",app.occupation],["County",`${app.county}${app.county==="Busia"?" 🔴":""}`],
          ["Request",`KES ${app.requestKES.toLocaleString()}`],["Children",`${app.children} (${app.childrenAges.join(", ")})`],["Harvest",app.harvestSeason]].map(([k,v])=>(
          <div key={k}>
            <div style={{fontSize:"9px",color:C.textMuted,fontWeight:"700",letterSpacing:"0.5px"}}>{k.toUpperCase()}</div>
            <div style={{fontSize:"12px",fontWeight:"600",marginTop:"2px"}}>{v}</div>
          </div>
        ))}
      </div>

      {/* Agent cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"11px"}}>
        {agentDefs.map(a=>{
          const isActive=activeAgent===a.id, isDone=doneAgents.includes(a.id), isLoad=ld[a.id];
          return (
            <div key={a.id} className="card" style={{
              border:`1px solid ${isActive?a.color:isDone?`${C.approvalGreen}40`:C.border}`,
              opacity:(!isActive&&!isDone&&stage!=="idle"&&stage!=="complete")?0.52:1,
              transition:"all 0.3s", boxShadow:isActive?`0 0 0 2px ${a.color}20`:"none"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"9px"}}>
                  <div style={{width:"38px",height:"38px",borderRadius:"10px",flexShrink:0,
                    background:`${a.color}1C`,border:`1px solid ${a.color}28`,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:"17px",
                    animation:isActive?"heartbeat 2s infinite":"none"}}>{a.icon}</div>
                  <div>
                    <div style={{fontSize:"13px",fontWeight:"700"}}>{a.name}</div>
                    <div style={{fontSize:"10px",color:a.color,fontWeight:"600"}}>{a.role}</div>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"4px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"4px"}}>
                    <div style={{width:"6px",height:"6px",borderRadius:"50%",
                      background:isActive?C.riftTeal:isDone?C.approvalGreen:C.textMuted,
                      animation:isActive?"statusBlink 1s infinite":"none"}}/>
                    <span style={{fontSize:"9px",fontWeight:"700",letterSpacing:"0.8px",
                      color:isActive?C.riftTeal:isDone?C.approvalGreen:C.textMuted}}>
                      {isActive?"ACTIVE":isDone?"DONE":"STANDBY"}
                    </span>
                  </div>
                  <span className={`badge badge-${a.id==="scout"?"gold":a.id==="guardian"?"teal":"amber"}`}>{a.badge}</span>
                </div>
              </div>
              <div style={{background:`${a.color}09`,border:`1px solid ${a.color}16`,
                borderRadius:"7px",padding:"5px 9px",fontSize:"10px",color:a.color,marginBottom:"10px"}}>
                <strong>RANK:</strong> {a.authority}
              </div>
              {a.id==="guardian"&&scoreVal!==null&&(
                <div style={{display:"flex",alignItems:"center",gap:"9px",background:C.deepNavy,
                  borderRadius:"9px",padding:"9px",marginBottom:"9px"}}>
                  <ScoreRing score={scoreVal} size={58}/>
                  <div>
                    <div style={{fontSize:"9px",color:C.textMuted,fontWeight:"700"}}>RISK SCORE</div>
                    <div style={{fontSize:"12px",fontWeight:"800",marginTop:"2px",
                      color:scoreVal>=75?C.approvalGreen:scoreVal>=50?C.harvestAmber:C.riskRed}}>
                      {decisionVal||"—"}
                    </div>
                  </div>
                </div>
              )}
              <div style={{display:"flex",flexDirection:"column",gap:"4px",maxHeight:"230px",overflowY:"auto"}} className="scrollbar-hide">
                {msgs[a.id].map((m,i)=>(
                  <div key={i} className={`msg-bubble msg-${m.type}`}>
                    {m.label&&<div style={{fontSize:"9px",fontWeight:"700",color:C.textMuted,marginBottom:"3px",letterSpacing:"0.4px"}}>{m.label}</div>}
                    <div>{m.text}</div>
                    <div style={{fontSize:"9px",color:C.textMuted,textAlign:"right",marginTop:"2px"}}>{m.time}</div>
                  </div>
                ))}
                {isLoad&&<div className="msg-bubble msg-ai" style={{display:"flex",alignItems:"center",gap:"7px"}}><span className="spinner"/><span style={{fontSize:"11px",color:C.textMuted}}>Processing…</span></div>}
                <div ref={endRefs[a.id]}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* Audit + Guard */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"13px"}}>
        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"11px"}}>
            <h3 style={{fontSize:"13px",fontWeight:"700"}}>📋 Audit Trail</h3>
            <span style={{fontSize:"9px",color:C.riftTeal,fontWeight:"700"}}>IMMUTABLE · SASRA</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"4px",maxHeight:"175px",overflowY:"auto"}} className="scrollbar-hide">
            {audit.length===0&&<div style={{fontSize:"11px",color:C.textMuted,textAlign:"center",padding:"16px"}}>Run a simulation to generate audit events</div>}
            {audit.map((e,i)=>(
              <div key={i} style={{display:"flex",gap:"8px",padding:"5px 9px",borderRadius:"6px",fontSize:"11px",
                background:e.type==="alert"?"rgba(230,57,70,0.07)":e.type==="success"?"rgba(6,214,160,0.07)":"rgba(46,196,182,0.05)",
                borderLeft:`3px solid ${e.type==="alert"?C.riskRed:e.type==="success"?C.approvalGreen:C.riftTeal}`}}>
                <span style={{fontSize:"9px",color:C.textMuted,whiteSpace:"nowrap",marginTop:"1px"}}>{e.time}</span>
                <span>{e.msg}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"11px"}}>
            <h3 style={{fontSize:"13px",fontWeight:"700"}}>🔒 GUARD Safety Rails</h3>
            <button className="btn btn-danger" onClick={kill} disabled={killed||stage==="idle"} style={{fontSize:"10px",padding:"4px 10px"}}>
              {killed?"⛔ KILLED":"⛔ *#799#"}
            </button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px"}}>
            {[["Gender/ethnicity proxy block",true,"🛡️"],["Max 3 SMS/day",true,"📱"],
              ["Busia County → human review",!!flags.busia,"📍"],["Debt collector → escalation",!!flags.debt,"⚠️"],
              ["Dignity filter active",true,"💛"],["Red Team bias test",!!flags.redteam,"🔴"]].map(([l,on,ic],i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:"6px",padding:"5px 9px",borderRadius:"7px",fontSize:"10px",
                background:on?"rgba(6,214,160,0.07)":"rgba(255,255,255,0.02)",
                border:`1px solid ${on?"rgba(6,214,160,0.2)":C.border}`}}>
                <span>{ic}</span><span style={{flex:1,color:on?C.approvalGreen:C.textMuted}}>{l}</span>
                <span style={{fontWeight:"700",color:on?C.approvalGreen:C.textMuted}}>{on?"●":"○"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LOAN APPLICATION PAGE ────────────────────────────────────────────────────
const LOAN_PURPOSES = [
  "School fees", "Working capital", "Seeds & fertiliser", "Stock replenishment",
  "Medical expenses", "Housing improvement", "Equipment purchase", "Livestock",
  "Irrigation / water", "Other",
];
const COUNTIES = [
  "Busia","Kakamega","Mombasa","Nairobi","Kisumu","Nakuru","Kiambu","Machakos",
  "Meru","Nyeri","Uasin Gishu","Trans Nzoia","Homa Bay","Migori","Siaya","Other",
];
const REPAYMENT_MONTHS = [3,6,9,12,18,24];

// ── Defined OUTSIDE LoanApplyPage so React never recreates them on re-render ──
// If defined inside the parent, React treats them as new component types each
// render → unmounts/remounts → input loses focus on every keystroke.
function StepDots({ steps, step, C }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"0", marginBottom:"24px" }}>
      {steps.map((s,i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", flex: i < steps.length-1 ? 1 : "none" }}>
          <div style={{
            width:"28px", height:"28px", borderRadius:"50%", flexShrink:0,
            background: i < step ? C.approvalGreen : i === step ? C.riftTeal : "rgba(255,255,255,0.08)",
            border: `2px solid ${i <= step ? (i < step ? C.approvalGreen : C.riftTeal) : "rgba(255,255,255,0.12)"}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"11px", fontWeight:"700", color: i <= step ? "#fff" : C.textMuted,
            transition:"all 0.3s",
          }}>
            {i < step ? "✓" : i+1}
          </div>
          {i < steps.length-1 && (
            <div style={{ flex:1, height:"2px", background: i < step ? C.approvalGreen : "rgba(255,255,255,0.07)", transition:"background 0.3s" }}/>
          )}
        </div>
      ))}
    </div>
  );
}

function FormField({ label, children, note }) {
  return (
    <div>
      <label style={{ fontSize:"10px", color:C.textMuted, fontWeight:"700", display:"block", marginBottom:"5px", letterSpacing:"0.4px" }}>{label}</label>
      {children}
      {note && <div style={{ fontSize:"10px", color:C.textMuted, marginTop:"4px" }}>{note}</div>}
    </div>
  );
}

function LoanApplyPage({ user, addToast, setPage }) {
  const STEPS = ["Personal Info","Loan Details","Review & Submit","Confirmation"];
  const [step,    setStep]    = useState(0);
  const [saving,  setSaving]  = useState(false);
  const [apps,    setApps]    = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const [form, setForm] = useState({
    // Step 0 — personal (pre-filled from user profile)
    fullName:    user?.name  || "",
    phone:       user?.phone && user.phone !== "+254 712 345 678" ? user.phone : "",
    email:       user?.email || "",
    county:      "",
    occupation:  "",
    monthlySavings: "",
    savingsMonths:  "",
    // Step 1 — loan
    amount:      "",
    purpose:     "",
    purposeDetail: "",
    repayMonths: "12",
    harvestMonth: "",
  });
  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  // Load existing applications on mount
  useEffect(() => {
    DB.loadLoanApps(user.email).then(data => { setApps(data); setLoadingApps(false); });
  }, [user.email]);

  // Derived calculations
  const amount   = parseFloat(form.amount)  || 0;
  const months   = parseInt(form.repayMonths) || 12;
  const rate     = 0.12 / 12; // 1% per month
  const emi      = amount > 0 ? Math.round((amount * rate * Math.pow(1+rate, months)) / (Math.pow(1+rate, months)-1)) : 0;
  const totalPay = emi * months;
  const interest = totalPay - amount;

  const canStep0 = !!(form.fullName.trim() && form.phone.trim() && form.county && form.occupation.trim() && +form.monthlySavings >= 500 && +form.savingsMonths >= 1);
  const canStep1 = !!(form.amount && +form.amount >= 1000 && form.purpose);

  // Show a hint under the Next button listing what's still needed
  const step0Missing = [
    !form.fullName.trim() && "Full name",
    !form.phone.trim()    && "Phone number",
    !form.county          && "County",
    !form.occupation.trim()&& "Occupation",
    (!form.monthlySavings || +form.monthlySavings < 500) && "Monthly savings (min KES 500)",
    (!form.savingsMonths  || +form.savingsMonths  < 1)   && "Months saving (min 1)",
  ].filter(Boolean);

  const step1Missing = [
    (!form.amount || +form.amount < 1000) && "Loan amount (min KES 1,000)",
    !form.purpose && "Loan purpose",
  ].filter(Boolean);

  const handleSubmit = async () => {
    setSaving(true);
    const appId = `UJ-${new Date().getFullYear()}-${Math.floor(Math.random()*90000+10000)}`;
    const application = {
      id:          appId,
      applicant:   form.fullName,
      email:       user.email,
      phone:       form.phone,
      county:      form.county,
      occupation:  form.occupation,
      amount,
      purpose:     form.purpose + (form.purposeDetail ? ` — ${form.purposeDetail}` : ""),
      repayMonths: months,
      emi,
      monthlySavings: +form.monthlySavings,
      savingsMonths:  +form.savingsMonths,
      status:      "Under Review",
      submittedAt: new Date().toISOString(),
    };
    await DB.saveLoanApp(user.email, application);
    // Also update the member record with latest profile
    await DB.saveMember({ name:form.fullName, email:user.email, phone:form.phone, role:"SACCO Member",
      county:form.county, occupation:form.occupation, updatedAt:new Date().toISOString() });
    setApps(prev => [application, ...prev]);
    setSaving(false);
    setStep(3);
    addToast(`Application ${appId} submitted successfully 🦁`, "success");
  };

  const restart = () => {
    setStep(0);
    setForm(f => ({ ...f, county:"", occupation:"", monthlySavings:"", savingsMonths:"", amount:"", purpose:"", purposeDetail:"", repayMonths:"12", harvestMonth:"" }));
    setShowHistory(false);
  };

  // ── STEP INDICATOR — defined outside component (see above) ──────────────────

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"16px" }} className="anim-up">

      {/* Header */}
      <div style={{
        background:`linear-gradient(135deg,rgba(46,196,182,0.09),rgba(244,162,97,0.06))`,
        border:`1px solid ${C.border}`, borderRadius:"18px", padding:"18px 22px",
        display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
          <div style={{
            width:"46px", height:"46px", borderRadius:"13px", flexShrink:0,
            background:`linear-gradient(135deg,${C.riftTeal},${C.harvestAmber})`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px",
            boxShadow:`0 6px 18px rgba(46,196,182,0.25)`,
          }}>📝</div>
          <div>
            <div style={{ fontSize:"16px", fontWeight:"800" }}>Loan Application</div>
            <div style={{ fontSize:"11px", color:C.textSub, marginTop:"2px" }}>
              Harvest-cycle aligned · AI-triaged · human officer review
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:"8px", alignItems:"center", flexWrap:"wrap" }}>
          <span className="badge badge-teal">12% p.a.</span>
          <span className="badge badge-green">Up to KES 3× savings</span>
          <button className="btn btn-ghost" onClick={() => setShowHistory(v=>!v)}
            style={{ fontSize:"11px", padding:"6px 13px" }}>
            {showHistory ? "← Apply" : `📋 History (${apps.length})`}
          </button>
        </div>
      </div>

      {/* Application history panel */}
      {showHistory ? (
        <div className="card anim-up">
          <h3 style={{ fontSize:"14px", fontWeight:"700", marginBottom:"14px" }}>My Applications</h3>
          {loadingApps ? (
            <div style={{ display:"flex", alignItems:"center", gap:"8px", color:C.textMuted, fontSize:"13px" }}>
              <span className="spinner"/> Loading…
            </div>
          ) : apps.length === 0 ? (
            <div style={{ textAlign:"center", padding:"28px 0", color:C.textMuted, fontSize:"13px" }}>
              No applications yet. Submit your first loan application above.
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {apps.map((a,i) => (
                <div key={a.id} className="anim-up" style={{
                  animationDelay:`${i*0.06}s`,
                  background:"rgba(13,27,46,0.6)", border:`1px solid ${C.border}`,
                  borderRadius:"12px", padding:"14px 16px",
                  display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"10px",
                }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"5px" }}>
                      <span style={{ fontSize:"13px", fontWeight:"700" }}>KES {a.amount.toLocaleString()}</span>
                      <span className={`badge ${a.status==="Approved"?"badge-green":a.status==="Declined"?"badge-red":"badge-amber"}`}>{a.status}</span>
                    </div>
                    <div style={{ fontSize:"11px", color:C.textMuted }}>{a.purpose}</div>
                    <div style={{ fontSize:"10px", color:C.textMuted, marginTop:"3px" }}>
                      {a.id} · {new Date(a.submittedAt).toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"})}
                      · {a.repayMonths} months · EMI KES {a.emi?.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:"10px", color:C.textMuted }}>{a.county}</div>
                    <div style={{ fontSize:"10px", color:C.textMuted }}>{a.occupation}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          <StepDots steps={STEPS} step={step} C={C}/>
          <div style={{ fontSize:"11px", color:C.riftTeal, fontWeight:"700", letterSpacing:"0.6px", marginBottom:"16px", marginTop:"-10px" }}>
            STEP {step + 1} OF {STEPS.length} — {STEPS[step]?.toUpperCase()}
          </div>

          {/* ── STEP 0: Personal Info ── */}
          {step === 0 && (
            <div style={{ display:"flex", flexDirection:"column", gap:"14px" }} className="anim-up">
              <div style={{ fontSize:"14px", fontWeight:"700", marginBottom:"4px" }}>Personal Information</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"13px" }}>
                <FormField label="FULL NAME">
                  <input className="field" value={form.fullName} onChange={e=>set("fullName",e.target.value)} placeholder="e.g. Grace Wanjiru"/>
                </FormField>
                <FormField label="PHONE (M-PESA)">
                  <input className="field" value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="+254 7XX XXX XXX"/>
                </FormField>
                <FormField label="EMAIL">
                  <input className="field" value={form.email} readOnly style={{opacity:0.6,cursor:"not-allowed"}}/>
                </FormField>
                <FormField label="COUNTY">
                  <select className="field" value={form.county} onChange={e=>set("county",e.target.value)} style={{cursor:"pointer"}}>
                    <option value="">Select county…</option>
                    {COUNTIES.map(c=><option key={c} value={c}>{c}{c==="Busia"?" (Human review required)":""}</option>)}
                  </select>
                </FormField>
                <FormField label="OCCUPATION / BUSINESS" note="Market vendor counts equal to formal employment">
                  <input className="field" value={form.occupation} onChange={e=>set("occupation",e.target.value)} placeholder="e.g. Maize farmer, Market vendor"/>
                </FormField>
                <FormField label="AVG MONTHLY SAVINGS (KES)">
                  <input className="field" type="number" min="500" value={form.monthlySavings} onChange={e=>set("monthlySavings",e.target.value)} placeholder="e.g. 3200"/>
                </FormField>
                <FormField label="MONTHS SAVING WITH UJIMA" note="More months = stronger profile">
                  <input className="field" type="number" min="1" max="120" value={form.savingsMonths} onChange={e=>set("savingsMonths",e.target.value)} placeholder="e.g. 8"/>
                </FormField>
              </div>
              {form.county === "Busia" && (
                <div style={{ background:"rgba(244,162,97,0.08)", border:`1px solid rgba(244,162,97,0.2)`,
                  borderRadius:"9px", padding:"10px 13px", fontSize:"11px", color:C.harvestAmber }}>
                  📍 Busia County applications are automatically routed to a human loan officer for review per SASRA policy.
                </div>
              )}
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"8px", marginTop:"6px" }}>
                {!canStep0 && step0Missing.length > 0 && (
                  <div style={{ fontSize:"11px", color:C.harvestAmber, textAlign:"right", lineHeight:1.6 }}>
                    ⚠ Still needed: {step0Missing.join(" · ")}
                  </div>
                )}
                <button className="btn btn-teal" onClick={()=>setStep(1)} disabled={!canStep0} style={{padding:"11px 28px"}}>
                  Next: Loan Details →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 1: Loan Details ── */}
          {step === 1 && (
            <div style={{ display:"flex", flexDirection:"column", gap:"14px" }} className="anim-up">
              <div style={{ fontSize:"14px", fontWeight:"700", marginBottom:"4px" }}>Loan Details</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"13px" }}>
                <FormField label="LOAN AMOUNT (KES)" note={`Max KES ${((+form.monthlySavings||0)*(+form.savingsMonths||0)*3).toLocaleString()} (3× total savings)`}>
                  <input className="field" type="number" min="1000" value={form.amount}
                    onChange={e=>set("amount",e.target.value)} placeholder="e.g. 25000"/>
                  <div style={{ display:"flex", gap:"5px", marginTop:"7px", flexWrap:"wrap" }}>
                    {[5000,10000,15000,25000,50000].map(v=>(
                      <button key={v} onClick={()=>set("amount",String(v))} className="btn btn-ghost"
                        style={{ padding:"4px 10px", fontSize:"10px", borderRadius:"6px",
                          background: form.amount===String(v)?`${C.riftTeal}14`:"transparent",
                          borderColor: form.amount===String(v)?C.riftTeal:C.border,
                          color: form.amount===String(v)?C.riftTeal:C.textMuted }}>
                        KES {v.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </FormField>
                <FormField label="REPAYMENT PERIOD">
                  <select className="field" value={form.repayMonths} onChange={e=>set("repayMonths",e.target.value)} style={{cursor:"pointer"}}>
                    {REPAYMENT_MONTHS.map(m=><option key={m} value={m}>{m} months</option>)}
                  </select>
                </FormField>
                <FormField label="LOAN PURPOSE">
                  <select className="field" value={form.purpose} onChange={e=>set("purpose",e.target.value)} style={{cursor:"pointer"}}>
                    <option value="">Select purpose…</option>
                    {LOAN_PURPOSES.map(p=><option key={p} value={p}>{p}</option>)}
                  </select>
                </FormField>
                <FormField label="HARVEST / INCOME MONTH" note="We align repayments to your cash-flow peaks">
                  <input className="field" value={form.harvestMonth} onChange={e=>set("harvestMonth",e.target.value)}
                    placeholder="e.g. October (maize harvest)"/>
                </FormField>
              </div>
              <FormField label="PURPOSE DETAILS (OPTIONAL)">
                <input className="field" value={form.purposeDetail} onChange={e=>set("purposeDetail",e.target.value)}
                  placeholder="Any extra context helps your loan officer…"/>
              </FormField>

              {/* EMI calculator card */}
              {amount > 0 && (
                <div style={{
                  background:`linear-gradient(135deg,rgba(46,196,182,0.08),rgba(244,162,97,0.05))`,
                  border:`1px solid ${C.border}`, borderRadius:"12px", padding:"16px 18px",
                  display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px", animation:"fadeSlideUp 0.25s ease",
                }}>
                  {[
                    ["Monthly EMI", `KES ${emi.toLocaleString()}`, C.riftTeal],
                    ["Total Interest", `KES ${interest.toLocaleString()}`, C.harvestAmber],
                    ["Total Repayable", `KES ${totalPay.toLocaleString()}`, C.textLight],
                  ].map(([l,v,col])=>(
                    <div key={l} style={{ textAlign:"center" }}>
                      <div style={{ fontSize:"9px", color:C.textMuted, fontWeight:"700", letterSpacing:"0.5px", marginBottom:"4px" }}>{l}</div>
                      <div style={{ fontSize:"16px", fontWeight:"800", color:col }}>{v}</div>
                    </div>
                  ))}
                  <div style={{ gridColumn:"1/-1", fontSize:"10px", color:C.textMuted, textAlign:"center", marginTop:"-4px" }}>
                    12% p.a. reducing balance · {months} months · interest = KES {interest.toLocaleString()}
                  </div>
                </div>
              )}

              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginTop:"6px", flexWrap:"wrap", gap:"8px" }}>
                <button className="btn btn-ghost" onClick={()=>setStep(0)}>← Back</button>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"6px" }}>
                  {!canStep1 && step1Missing.length > 0 && (
                    <div style={{ fontSize:"11px", color:C.harvestAmber }}>
                      ⚠ Still needed: {step1Missing.join(" · ")}
                    </div>
                  )}
                  <button className="btn btn-teal" onClick={()=>setStep(2)} disabled={!canStep1} style={{padding:"11px 28px"}}>
                    Review Application →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Review ── */}
          {step === 2 && (
            <div style={{ display:"flex", flexDirection:"column", gap:"14px" }} className="anim-up">
              <div style={{ fontSize:"14px", fontWeight:"700", marginBottom:"4px" }}>Review & Submit</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"11px" }}>
                {[
                  ["Full Name",form.fullName], ["Phone",form.phone],
                  ["County",form.county+(form.county==="Busia"?" 🔴":"")], ["Occupation",form.occupation],
                  ["Monthly Savings",`KES ${Number(form.monthlySavings).toLocaleString()}`], ["Savings Period",`${form.savingsMonths} months`],
                  ["Loan Amount",`KES ${amount.toLocaleString()}`], ["Purpose",form.purpose],
                  ["Repayment",`${months} months`], ["Monthly EMI",`KES ${emi.toLocaleString()}`],
                  ["Total Interest",`KES ${interest.toLocaleString()}`], ["Total Repayable",`KES ${totalPay.toLocaleString()}`],
                ].map(([k,v])=>(
                  <div key={k} style={{ background:"rgba(13,27,46,0.55)", borderRadius:"9px", padding:"10px 13px" }}>
                    <div style={{ fontSize:"9px", color:C.textMuted, fontWeight:"700", letterSpacing:"0.4px" }}>{k.toUpperCase()}</div>
                    <div style={{ fontSize:"13px", fontWeight:"500", marginTop:"3px" }}>{v}</div>
                  </div>
                ))}
              </div>
              {form.purposeDetail && (
                <div style={{ background:"rgba(13,27,46,0.55)", borderRadius:"9px", padding:"10px 13px" }}>
                  <div style={{ fontSize:"9px", color:C.textMuted, fontWeight:"700", letterSpacing:"0.4px" }}>DETAILS</div>
                  <div style={{ fontSize:"13px", marginTop:"3px" }}>{form.purposeDetail}</div>
                </div>
              )}
              <div style={{ background:"rgba(46,196,182,0.06)", border:`1px solid rgba(46,196,182,0.15)`,
                borderRadius:"9px", padding:"11px 13px", fontSize:"11px", color:C.textSub, lineHeight:1.6 }}>
                🔒 By submitting, you consent to Ujima SACCO processing your data under Kenya DPA 2022.
                Your application will be triaged by our AI agents and reviewed by a human loan officer before any decision.
                {form.county==="Busia" && " Busia County applications go directly to human officer review."}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:"4px" }}>
                <button className="btn btn-ghost" onClick={()=>setStep(1)}>← Back</button>
                <button className="btn btn-teal" onClick={handleSubmit} disabled={saving} style={{padding:"11px 28px"}}>
                  {saving ? <><span className="spinner"/>Submitting…</> : "Submit Application →"}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Confirmation ── */}
          {step === 3 && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"18px", padding:"14px 0 6px", textAlign:"center" }} className="anim-up">
              <div style={{
                width:"68px", height:"68px", borderRadius:"20px",
                background:`linear-gradient(135deg,${C.approvalGreen},#04b884)`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"32px", boxShadow:`0 10px 30px rgba(6,214,160,0.3)`,
                animation:"scaleIn 0.4s cubic-bezier(.22,1,.36,1)",
              }}>✓</div>
              <div>
                <div style={{ fontSize:"18px", fontWeight:"800", marginBottom:"6px" }}>Application Submitted!</div>
                <div style={{ fontSize:"13px", color:C.textSub, maxWidth:"340px", lineHeight:1.6 }}>
                  Your loan application for <strong style={{color:C.riftTeal}}>KES {amount.toLocaleString()}</strong> has been received.
                  Our AI agents will triage it and a human loan officer will be in touch.
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", width:"100%", maxWidth:"320px" }}>
                <div style={{ background:"rgba(6,214,160,0.08)", border:`1px solid rgba(6,214,160,0.18)`,
                  borderRadius:"10px", padding:"11px", textAlign:"center" }}>
                  <div style={{ fontSize:"9px", color:C.textMuted, fontWeight:"700" }}>MONTHLY EMI</div>
                  <div style={{ fontSize:"16px", fontWeight:"800", color:C.approvalGreen, marginTop:"3px" }}>KES {emi.toLocaleString()}</div>
                </div>
                <div style={{ background:"rgba(46,196,182,0.08)", border:`1px solid rgba(46,196,182,0.18)`,
                  borderRadius:"10px", padding:"11px", textAlign:"center" }}>
                  <div style={{ fontSize:"9px", color:C.textMuted, fontWeight:"700" }}>REPAYMENT</div>
                  <div style={{ fontSize:"16px", fontWeight:"800", color:C.riftTeal, marginTop:"3px" }}>{months} months</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:"9px", flexWrap:"wrap", justifyContent:"center", marginTop:"4px" }}>
                <button className="btn btn-teal" onClick={restart}>Apply for Another Loan</button>
                <button className="btn btn-ghost" onClick={()=>setShowHistory(true)}>View My Applications</button>
                <button className="btn btn-ghost" onClick={()=>setPage("agents")}>Run Agent Simulation →</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info strip */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"18px", padding:"4px 0", flexWrap:"wrap" }}>
        {["🔒 Kenya DPA 2022","🏦 SASRA Regulated","🤖 AI + Human Review","🌾 Harvest-Aligned"].map(t=>(
          <span key={t} style={{ fontSize:"10px", color:C.textMuted }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ─── FAQ PAGE ─────────────────────────────────────────────────────────────────
function FAQPage({ user }) {
  const [msgs,    setMsgs]    = useState([
    { role:"ai", text:`Karibu sana, ${user?.name?.split(" ")[0] || "rafiki"}! 👋\nI'm Jibu, your Ujima SACCO helper. Ask me anything about loans, savings, M-Pesa payments, or how our AI agents work — I'm here to make things clear and simple. What would you like to know?` }
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]); // Claude conversation history
  const endRef  = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [msgs, loading]);

  const send = useCallback(async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput("");

    const userMsg = { role:"user", text:q };
    setMsgs(m => [...m, userMsg]);
    setLoading(true);

    const newHistory = [...history, { role:"user", content:q }];
    let reply = "";
    try {
      reply = await callClaude(FAQ_SYS, newHistory);
    } catch(e) {
      reply = `Samahani — I couldn't reach the server right now. Please try again in a moment. (${e.message})`;
    }

    setHistory([...newHistory, { role:"assistant", content:reply }]);
    setMsgs(m => [...m, { role:"ai", text:reply }]);
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 60);
  }, [input, loading, history]);

  const handleKey = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  const clear = () => {
    setMsgs([{ role:"ai", text:`Karibu sana! 👋 Ask me anything about Ujima SACCO — loans, savings, M-Pesa, or our AI agents.` }]);
    setHistory([]);
    setInput("");
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"16px", height:"calc(100vh - 102px)" }} className="anim-up">

      {/* Header */}
      <div style={{
        background:`linear-gradient(135deg,rgba(233,196,106,0.1),rgba(46,196,182,0.06))`,
        border:`1px solid rgba(233,196,106,0.22)`, borderRadius:"18px", padding:"18px 22px",
        display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
          <div style={{
            width:"46px", height:"46px", borderRadius:"13px", flexShrink:0,
            background:`linear-gradient(135deg,${C.dustGold},${C.harvestAmber})`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px",
            boxShadow:`0 6px 18px rgba(233,196,106,0.28)`,
          }}>💬</div>
          <div>
            <div style={{ fontSize:"16px", fontWeight:"800" }}>Jibu — FAQ Assistant</div>
            <div style={{ fontSize:"11px", color:C.textSub, marginTop:"2px" }}>
              Ask anything about Ujima SACCO · loans · savings · M-Pesa · AI agents
            </div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"9px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"11px", color:C.approvalGreen }}>
            <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:C.approvalGreen, animation:"statusBlink 2.2s infinite" }}/>
            Online
          </div>
          <span className="badge badge-gold" style={{ fontSize:"10px" }}>JIBU · FAQ</span>
          <button className="btn btn-ghost" onClick={clear} style={{ padding:"6px 13px", fontSize:"11px" }}>
            🗑 Clear
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minHeight:0 }}>
        <div className="card" style={{ flex:1, display:"flex", flexDirection:"column", padding:"16px", gap:0, minHeight:0 }}>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:"10px", paddingRight:"4px" }} className="scrollbar-hide">
            {msgs.map((m, i) => (
              <div key={i} style={{
                display:"flex", gap:"10px",
                flexDirection: m.role === "user" ? "row-reverse" : "row",
                alignItems:"flex-end",
              }}>
                {/* Avatar */}
                <div style={{
                  width:"28px", height:"28px", borderRadius:"8px", flexShrink:0,
                  background: m.role === "user"
                    ? `linear-gradient(135deg,${C.riftTeal},${C.harvestAmber})`
                    : `linear-gradient(135deg,${C.dustGold},${C.harvestAmber})`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize: m.role === "user" ? "11px" : "14px", fontWeight:"700", color:"#fff",
                }}>
                  {m.role === "user" ? (user?.name?.[0] || "U").toUpperCase() : "💬"}
                </div>

                {/* Bubble */}
                <div style={{
                  maxWidth:"74%",
                  background: m.role === "user"
                    ? `linear-gradient(135deg,rgba(46,196,182,0.18),rgba(46,196,182,0.10))`
                    : "rgba(13,27,46,0.92)",
                  border:`1px solid ${m.role === "user" ? "rgba(46,196,182,0.3)" : C.border}`,
                  borderRadius: m.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
                  padding:"10px 14px",
                  fontSize:"13px", lineHeight:"1.58", color:C.textLight,
                  whiteSpace:"pre-wrap",
                  animation:"fadeSlideUp 0.25s ease",
                }}>
                  {m.text}
                </div>
              </div>
            ))}

            {/* Loading bubble */}
            {loading && (
              <div style={{ display:"flex", gap:"10px", alignItems:"flex-end" }}>
                <div style={{
                  width:"28px", height:"28px", borderRadius:"8px", flexShrink:0,
                  background:`linear-gradient(135deg,${C.dustGold},${C.harvestAmber})`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px",
                }}>💬</div>
                <div style={{
                  background:"rgba(13,27,46,0.92)", border:`1px solid ${C.border}`,
                  borderRadius:"4px 14px 14px 14px", padding:"11px 16px",
                  display:"flex", alignItems:"center", gap:"8px",
                }}>
                  <span className="spinner"/>
                  <span style={{ fontSize:"12px", color:C.textMuted }}>Jibu is thinking…</span>
                </div>
              </div>
            )}
            <div ref={endRef}/>
          </div>

          {/* Quick chips */}
          {msgs.length <= 2 && !loading && (
            <div style={{ marginTop:"14px", paddingTop:"12px", borderTop:`1px solid rgba(255,255,255,0.05)` }}>
              <div style={{ fontSize:"10px", color:C.textMuted, fontWeight:"700", letterSpacing:"0.5px", marginBottom:"8px" }}>
                QUICK QUESTIONS
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
                {FAQ_CHIPS.map(chip => (
                  <button key={chip} onClick={() => send(chip)} className="btn btn-ghost" style={{
                    fontSize:"11px", padding:"5px 11px", borderRadius:"20px",
                    border:`1px solid rgba(233,196,106,0.25)`, color:C.dustGold,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(233,196,106,0.1)"; e.currentTarget.style.borderColor = "rgba(233,196,106,0.5)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(233,196,106,0.25)"; }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input row */}
          <div style={{
            marginTop:"12px", paddingTop:"12px", borderTop:`1px solid rgba(255,255,255,0.05)`,
            display:"flex", gap:"8px", alignItems:"flex-end",
          }}>
            <textarea
              ref={inputRef}
              className="field"
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask Jibu anything about your SACCO… (Enter to send)"
              style={{
                flex:1, resize:"none", overflowY:"hidden", lineHeight:"1.5",
                padding:"10px 14px", fontSize:"13px", borderRadius:"12px",
                minHeight:"40px", maxHeight:"110px",
              }}
              onInput={e => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 110) + "px"; }}
              disabled={loading}
            />
            <button
              className="btn btn-amber"
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{ padding:"10px 18px", flexShrink:0, alignSelf:"flex-end" }}
            >
              {loading ? <><span className="spinner"/>…</> : "Send →"}
            </button>
          </div>
        </div>
      </div>

      {/* Info strip */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"center", gap:"18px",
        padding:"8px 0", flexWrap:"wrap",
      }}>
        {["🔒 Kenya DPA 2022", "🏦 SASRA Regulated", "🌍 AWS Africa (Cape Town)", "🦁 Ujima SACCO"].map(t => (
          <span key={t} style={{ fontSize:"10px", color:C.textMuted }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user,      setUser]      = useState(null);
  const [page,      setPage]      = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [toast,     setToast]     = useState(null);
  const addToast = useCallback((msg,type)=>setToast({msg,type}),[]);
  const logout   = useCallback(()=>{setUser(null);setPage("dashboard");},[]);

  if (!user) return (
    <><style>{GLOBAL_CSS}</style><AuthScreen onLogin={u=>setUser(u)}/></>
  );

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{display:"flex",minHeight:"100vh",background:C.midnight}}>
        <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",
          background:`radial-gradient(ellipse 55% 38% at 12% 0%,rgba(46,196,182,0.055) 0%,transparent 55%),
                      radial-gradient(ellipse 45% 32% at 88% 100%,rgba(244,162,97,0.045) 0%,transparent 55%)`}}/>
        <Sidebar page={page} setPage={setPage} user={user} onLogout={logout} collapsed={collapsed}/>
        <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative",zIndex:1,overflow:"hidden",minHeight:"100vh"}}>
          <Topbar page={page} user={user} onToggle={()=>setCollapsed(v=>!v)}/>
          <main style={{flex:1,overflowY:"auto",padding:"22px"}} className="scrollbar-hide">
            <div style={{display:page==="dashboard"?"block":"none"}}><DashboardPage user={user} setPage={setPage}/></div>
            <div style={{display:page==="agents"   ?"block":"none"}}><AgentsPage addToast={addToast}/></div>
            <div style={{display:page==="apply"    ?"block":"none"}}><LoanApplyPage user={user} addToast={addToast} setPage={setPage}/></div>
            <div style={{display:page==="payments" ?"block":"none"}}><PaymentsPage addToast={addToast}/></div>
            <div style={{display:page==="loans"    ?"block":"none"}}><LoansPage setPage={setPage}/></div>
            <div style={{display:page==="faq"      ?"block":"none"}}><FAQPage user={user}/></div>
            <div style={{display:page==="profile"  ?"block":"none"}}><ProfilePage user={user} onLogout={logout} addToast={addToast}/></div>
          </main>
        </div>
      </div>
      {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
    </>
  );
}
