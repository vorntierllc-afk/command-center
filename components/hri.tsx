"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ─── DATA ──────────────────────────────────────────────────────────────────────
const FEATURES = [
  { title: "AI Risk Engine", desc: "Every transaction scored 0–100 in real-time using 40+ signals — BIN data, IP reputation, velocity patterns, device fingerprinting.", num: "01", icon: "◈" },
  { title: "EDR Network", desc: "Connected to Chargebacks911, Verifi, and Ethoca. We catch disputes the moment they're filed, before they become chargebacks.", num: "02", icon: "⬡" },
  { title: "MID Protection", desc: "Predict processor termination 30 days out. We monitor your dispute ratio, reserve levels, and processing patterns continuously.", num: "03", icon: "⬟" },
  { title: "Human Review", desc: "Every 12 hours, real analysts review your risk profile, flag emerging patterns, and update your action advisory.", num: "04", icon: "◇" },
  { title: "Reserve Forecasting", desc: "Know exactly how much cash is tied up in rolling reserves and when it releases. Model future reserve requirements by volume.", num: "05", icon: "⬠" },
  { title: "Weekly Intel Reports", desc: "White-labeled reports every week: dispute trends, risk score history, action items, and processor health summary.", num: "06", icon: "◆" },
  { title: "Reason Code Analysis", desc: "Every dispute decoded. We map reason codes to root causes — friendly fraud, fulfillment issues, or processor errors.", num: "07", icon: "▣" },
  { title: "Action Advisory", desc: "Not just alerts — actual instructions. Refund, fight, review, or block with confidence on every transaction.", num: "08", icon: "▤" },
  { title: "Automation Rules", desc: "Auto-refund high-risk orders, auto-block suspicious BIN ranges, and auto-flag risky geographies before disputes occur.", num: "09", icon: "▥" },
];

const PRICING = [
  {
    name: "Basic", price: "$30", period: "/mo",
    desc: "For solo merchants under $50k/mo getting started with risk management.",
    features: ["Up to $50k monthly volume", "AI risk scoring on all transactions", "Weekly intel reports", "Email support"],
    cta: "Get started", highlight: false,
  },
  {
    name: "Pro", price: "$50", period: "/mo",
    desc: "Full intelligence suite for established high-risk merchants up to $500k/mo.",
    features: ["Up to $500k monthly volume", "Everything in Basic", "AI chat analyst", "EDR dispute alerts", "MID termination prediction", "Priority support"],
    cta: "Get started", highlight: true,
  },
  {
    name: "Agency", price: "$200", period: "/mo",
    desc: "For ISOs, payment facilitators, and agencies managing multiple merchants.",
    features: ["Unlimited MIDs", "Everything in Pro", "White-label reports", "Dedicated support"],
    cta: "Contact sales", highlight: false,
  },
];

const FAQS = [
  { q: "What processors do you support?", a: "We support MXMerchant, Stripe, Checkout.com, Adyen, and most major high-risk processors. New integrations are added regularly." },
  { q: "How does the EDR network work?", a: "Early Detection and Resolution networks like Chargebacks911, Verifi, and Ethoca allow merchants to receive dispute alerts before they convert to chargebacks. We connect you and act on alerts on your behalf." },
  { q: "What is a MID and why would it get terminated?", a: "A MID (Merchant ID) is your account with a payment processor. Processors terminate MIDs when chargeback ratios exceed thresholds (typically 1% for Visa, 0.9% for Mastercard). We warn you 30 days before you're at risk." },
  { q: "Do I need technical skills to use this?", a: "No. HighRiskIntel is a fully managed service. You connect your processor, and we handle everything — monitoring, alerts, analysis, and reporting. No code required." },
  { q: "What's the performance fee?", a: "We charge a 10% fee on the value of disputes we prevent. No prevention, no fee. This aligns our incentives with yours." },
  { q: "How long does onboarding take?", a: "Most merchants are fully onboarded within 24–48 hours. We connect your processor, configure your risk thresholds, and begin monitoring immediately." },
  { q: "Is my data secure?", a: "All data is encrypted in transit and at rest. We never store raw card numbers. Our analysts operate under strict confidentiality agreements." },
];

const INTEGRATIONS = [
  { name: "MXMerchant", type: "Processor", status: "Live" },
  { name: "Stripe", type: "Processor", status: "Live" },
  { name: "Checkout.com", type: "Processor", status: "Live" },
  { name: "Adyen", type: "Processor", status: "Live" },
  { name: "Chargebacks911", type: "EDR Network", status: "Live" },
  { name: "Verifi", type: "EDR Network", status: "Beta" },
  { name: "Ethoca", type: "EDR Network", status: "Beta" },
  { name: "Shopify", type: "Platform", status: "Live" },
  { name: "WooCommerce", type: "Platform", status: "Live" },
];

const TESTIMONIALS = [
  { quote: "We were sitting at 2.1% dispute ratio — HighRiskIntel got us to 0.9% in 60 days. Our processor stopped threatening termination.", name: "Mark R.", role: "Supplements brand · $400k/mo" },
  { quote: "The action advisory is what sold me. Not just alerts — actual instructions. Refund this, block that. Saved us three times in the first month.", name: "Jennifer K.", role: "Travel agency · High-risk vertical" },
  { quote: "As an ISO we white-label this for our merchants. The reports look completely custom. None of them know what's behind it.", name: "David L.", role: "ISO · Payment facilitator" },
];

const TXNS = [
  { id: "TX-88291", email: "j***@gmail.com", amount: "$349.00", country: "US", bin: "424242", risk: 22, processor: "Stripe", status: "Approved" },
  { id: "TX-88290", email: "m***@yahoo.com", amount: "$1,200.00", country: "NG", bin: "523456", risk: 91, processor: "Psifi", status: "Flagged" },
  { id: "TX-88289", email: "k***@outlook.com", amount: "$87.50", country: "GB", bin: "411111", risk: 34, processor: "Stripe", status: "Approved" },
  { id: "TX-88288", email: "r***@proton.me", amount: "$2,450.00", country: "RU", bin: "676767", risk: 88, processor: "Checkout", status: "Held" },
  { id: "TX-88287", email: "s***@icloud.com", amount: "$199.00", country: "CA", bin: "512345", risk: 15, processor: "Adyen", status: "Approved" },
  { id: "TX-88286", email: "t***@gmail.com", amount: "$590.00", country: "BR", bin: "501234", risk: 67, processor: "Psifi", status: "Review" },
  { id: "TX-88285", email: "a***@mail.ru", amount: "$4,100.00", country: "UA", bin: "498765", risk: 95, processor: "Psifi", status: "Blocked" },
];

const ALERTS_DATA = [
  { id: 1, time: "2m ago", type: "critical", msg: "Chargeback probability rising — TX cluster NG/RU", read: false },
  { id: 2, time: "18m ago", type: "warning", msg: "Suspicious traffic spike — 3x normal volume from VPN IPs", read: false },
  { id: 3, time: "1h ago", type: "warning", msg: "BIN mismatch pattern — 501234 series flagged", read: true },
  { id: 4, time: "3h ago", type: "info", msg: "Processor monitoring risk — Checkout.com threshold", read: true },
  { id: 5, time: "Yesterday", type: "critical", msg: "MID termination risk elevated — dispute ratio 1.9%", read: true },
  { id: 6, time: "Yesterday", type: "info", msg: "Rolling reserve adjustment recommended — $12,400", read: true },
];

const RISK_ITEMS = [
  { tx: "TX-88290", score: 91, reason: "IP mismatch + high ticket + country risk", action: "Refund" },
  { tx: "TX-88288", score: 88, reason: "Unusual BIN + VPN detected + high amount", action: "Block" },
  { tx: "TX-88285", score: 95, reason: "Blacklisted IP + max ticket + proxy confirmed", action: "Block" },
  { tx: "TX-88286", score: 67, reason: "High velocity + suspicious country pattern", action: "Review" },
];

const rc = (r: number) => r >= 80 ? "#EF4444" : r >= 50 ? "#F59E0B" : "#22C55E";
const sc = (st: string) => ({ Approved: "#22C55E", Flagged: "#EF4444", Held: "#F59E0B", Review: "#F59E0B", Blocked: "#EF4444" } as Record<string, string>)[st] || "#71717A";
const ac = (t: string) => ({ critical: "#EF4444", warning: "#F59E0B", info: "#3B82F6" } as Record<string, string>)[t];

// ─── CSS ───────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Epilogue:ital,wght@0,700;0,800;0,900;1,700;1,800;1,900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

  /* Subtle dot grid for hero */
  .dot-bg {
    background-image: radial-gradient(rgba(255,255,255,0.022) 1px, transparent 1px);
    background-size: 32px 32px;
  }

  /* Animations */
  .fu { opacity:0; transform:translateY(14px); animation:fu 0.65s cubic-bezier(0.16,1,0.3,1) forwards; }
  .d1{animation-delay:.05s}.d2{animation-delay:.12s}.d3{animation-delay:.2s}.d4{animation-delay:.3s}
  @keyframes fu { to { opacity:1; transform:none; } }

  /* Card hover */
  .ch { transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
  .ch:hover { transform: translateY(-2px); box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1); }

  /* Feature card hover — inset top accent */
  .feat-ch { transition: background 0.2s ease, box-shadow 0.2s ease; }
  .feat-ch:hover { background: rgba(59,130,246,0.035) !important; box-shadow: inset 0 1.5px 0 rgba(59,130,246,0.5) !important; }

  /* Table rows */
  .tr-hover { transition: background 0.1s; }
  .tr-hover:hover { background: rgba(255,255,255,0.018); }

  /* Live dot */
  .pdot { display:inline-block; width:6px; height:6px; border-radius:50%; background:#22C55E; box-shadow:0 0 6px #22C55E; animation:pdot 2s ease infinite; }
  @keyframes pdot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }

  /* Primary button */
  .btn-p {
    transition: all 0.15s ease !important;
    background: linear-gradient(180deg, #4F8EF7 0%, #2563EB 100%) !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.18) !important;
  }
  .btn-p:hover {
    background: linear-gradient(180deg, #60A5FA 0%, #3B82F6 100%) !important;
    box-shadow: 0 6px 20px rgba(37,99,235,0.55), 0 0 0 1px rgba(96,165,250,0.4), inset 0 1px 0 rgba(255,255,255,0.22) !important;
    transform: translateY(-1px);
  }
  .btn-p:active { transform: none !important; filter: brightness(0.95) !important; }

  /* Outline button hover */
  .btn-o { transition: all 0.15s ease !important; }
  .btn-o:hover { border-color: rgba(255,255,255,0.2) !important; color: #F4F4F5 !important; background: rgba(255,255,255,0.04) !important; }

  /* Nav links */
  .nav-lnk { transition: color 0.12s; }
  .nav-lnk:hover { color: #F4F4F5 !important; }

  /* Gradient text */
  .g-text {
    background: linear-gradient(125deg, #60A5FA 0%, #818CF8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-style: italic;
  }

  /* Dashboard stat card top accents */
  .ca-blue  { border-top: 1.5px solid #3B82F6 !important; }
  .ca-green { border-top: 1.5px solid #22C55E !important; }
  .ca-amber { border-top: 1.5px solid #F59E0B !important; }
  .ca-red   { border-top: 1.5px solid #EF4444 !important; }

  /* Pricing highlight glow pulse */
  @keyframes pglow { 0%,100%{box-shadow:0 0 24px rgba(59,130,246,0.18),0 0 0 1px rgba(59,130,246,0.25)} 50%{box-shadow:0 0 48px rgba(59,130,246,0.3),0 0 0 1px rgba(59,130,246,0.4)} }
  .p-glow { animation: pglow 3s ease-in-out infinite; }

  /* Badge shimmer */
  @keyframes shimmer { 0%{background-position:200%} 100%{background-position:-200%} }
  .badge-sh {
    background: linear-gradient(90deg,#3B82F6,#818CF8,#3B82F6) !important;
    background-size: 200% !important;
    animation: shimmer 2.5s linear infinite !important;
  }

  /* Gradient rule */
  .g-rule { height:1px; background:linear-gradient(90deg,transparent,rgba(59,130,246,0.3),rgba(129,140,248,0.3),transparent); border:none; margin:0; }

  a { text-decoration:none; }
  button { cursor:pointer; }
  ::selection { background:rgba(59,130,246,0.3); color:#F4F4F5; }
  input:focus { outline:none !important; border-color:#3B82F6 !important; box-shadow:0 0 0 3px rgba(59,130,246,0.14) !important; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.07); border-radius:4px; }
  ::-webkit-scrollbar-thumb:hover { background:rgba(255,255,255,0.15); }

  @media (max-width: 768px) {
    .nav-links { display:none !important; }
    .nav-actions { gap:6px !important; }
    .hero-section { flex-direction:column !important; padding:100px 20px 60px !important; gap:40px !important; }
    .mock-preview { display:none !important; }
    .hero-h1 { font-size:40px !important; letter-spacing:-1.5px !important; }
    .hero-p { font-size:16px !important; }
    .stats-row { flex-wrap:wrap !important; gap:24px !important; padding-top:24px !important; }
    .stat-item { flex:0 0 45% !important; }
    .split-grid { grid-template-columns:1fr !important; gap:40px !important; }
    .split-right { border-left:none !important; padding-left:0 !important; border-top:1px solid rgba(255,255,255,0.06); padding-top:40px !important; }
    .feat-grid { grid-template-columns:1fr !important; }
    .steps-grid { grid-template-columns:1fr !important; }
    .integ-grid { grid-template-columns:repeat(2,1fr) !important; }
    .api-box { grid-template-columns:1fr !important; }
    .api-code { border-left:none !important; border-top:1px solid rgba(255,255,255,0.06) !important; }
    .testi-grid { grid-template-columns:1fr !important; }
    .pricing-grid { grid-template-columns:1fr !important; }
    .trust-bar { padding:14px 20px !important; gap:16px !important; flex-wrap:wrap !important; }
    .cta-sec { padding:80px 20px !important; }
    .footer-top { grid-template-columns:1fr !important; gap:32px !important; padding:40px 20px !important; }
    .footer-cols { grid-template-columns:repeat(2,1fr) !important; gap:24px !important; }
    .footer-bottom { flex-direction:column !important; gap:12px !important; padding:20px !important; }
    .dash-root { flex-direction:column !important; }
    .dash-sidebar { width:100% !important; height:auto !important; position:static !important; padding:10px 8px !important; border-right:none !important; border-bottom:1px solid rgba(255,255,255,0.05) !important; flex-direction:row !important; align-items:center !important; }
    .dash-stop { flex-direction:row !important; gap:2px !important; overflow-x:auto !important; flex:1 !important; margin-bottom:0 !important; }
    .dash-stop::-webkit-scrollbar { display:none; }
    .dash-logo { display:none !important; }
    .dash-sbottom { display:none !important; }
    .dash-tab { padding:8px 10px !important; font-size:11px !important; white-space:nowrap !important; }
    .dash-main { padding:20px 16px !important; }
    .dash-grid4 { grid-template-columns:repeat(2,1fr) !important; }
    .dash-table { display:block; overflow-x:auto; }
  }
  @media (max-width: 480px) {
    .hero-h1 { font-size:32px !important; }
    .dash-grid4 { grid-template-columns:1fr 1fr !important; }
    .integ-grid { grid-template-columns:repeat(2,1fr) !important; }
    .nav-cta { padding:7px 14px !important; font-size:13px !important; }
  }
`;

// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────────
const T = {
  bg0:    "#07070A",
  bg1:    "#0C0C10",
  bg2:    "#111118",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.13)",
  text1:  "#F1F1F3",
  text2:  "#8C8C9A",
  text3:  "#55555F",
  blue:   "#3B82F6",
  blueD:  "#2563EB",
  green:  "#22C55E",
  amber:  "#F59E0B",
  red:    "#EF4444",
  purple: "#818CF8",
};

// ─── STYLES ────────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  // Root + Nav
  root: { fontFamily:"'Inter',sans-serif", background:T.bg0, color:T.text1, minHeight:"100vh", overflowX:"hidden" },
  nav: { position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"0 48px", transition:"all 0.25s" },
  navSolid: { background:"rgba(7,7,10,0.88)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", borderBottom:`1px solid ${T.border}` },
  navInner: { maxWidth:1200, margin:"0 auto", height:66, display:"flex", alignItems:"center", justifyContent:"space-between" },
  navLinks: { display:"flex", gap:36 },
  navLink: { color:T.text2, fontSize:14, fontWeight:500, letterSpacing:"-0.01em" },
  navActions: { display:"flex", gap:10, alignItems:"center" },
  navSignIn: { background:"none", border:"none", color:T.text2, fontSize:14, fontWeight:500, padding:"8px 14px", transition:"color 0.12s" },
  navCta: { background:`linear-gradient(180deg,#4F8EF7 0%,${T.blueD} 100%)`, color:"#fff", border:"none", padding:"9px 22px", borderRadius:8, fontSize:14, fontWeight:600, letterSpacing:"-0.01em" },

  // Hero
  hero: { maxWidth:1200, margin:"0 auto", padding:"168px 48px 116px", display:"flex", alignItems:"center", gap:80, position:"relative" },
  heroLeft: { flex:1, maxWidth:600 },

  // Pill badge
  pill: { display:"inline-flex", alignItems:"center", gap:8, background:"rgba(59,130,246,0.08)", border:`1px solid rgba(59,130,246,0.2)`, color:"#93C5FD", fontSize:12, fontWeight:500, padding:"6px 14px", borderRadius:100, marginBottom:36, letterSpacing:"0.01em" },
  pillDot: { width:5, height:5, borderRadius:"50%", background:T.green, boxShadow:`0 0 6px ${T.green}` },

  // Headline
  h1: { fontFamily:"'Epilogue',sans-serif", fontSize:68, fontWeight:900, lineHeight:1.02, letterSpacing:"-3px", marginBottom:24, color:T.text1 },

  // Hero body
  heroP: { fontSize:18, color:T.text2, lineHeight:1.8, marginBottom:40, maxWidth:520, fontWeight:400 },
  heroBtns: { display:"flex", gap:12, alignItems:"center", marginBottom:36 },
  trustBadges: { display:"flex", gap:20, marginBottom:56, flexWrap:"wrap" },
  trustBadge: { fontSize:12, color:T.text3, display:"flex", alignItems:"center", gap:6, fontWeight:500 },

  // Stats row
  statsRow: { display:"flex", borderTop:`1px solid ${T.border}`, paddingTop:36, gap:0 },
  statItem: { flex:1, display:"flex", flexDirection:"column", gap:6 },
  statV: { fontFamily:"'Epilogue',sans-serif", fontSize:28, fontWeight:800, color:T.text1, letterSpacing:"-0.5px" },
  statL: { fontSize:12, color:T.text3, fontWeight:500 },

  // Mock card
  mockCard: { flex:"0 0 380px", width:380, background:T.bg1, border:`1px solid ${T.border}`, borderRadius:16, overflow:"hidden", boxShadow:"0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(59,130,246,0.08)" },
  mockBar: { background:T.bg0, borderBottom:`1px solid ${T.border}`, padding:"11px 16px", display:"flex", alignItems:"center", gap:10 },
  mockBody: { padding:20, display:"flex", flexDirection:"column", gap:14 },

  // Trust bar
  trustBar: { borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}`, padding:"16px 48px", background:T.bg0, display:"flex", alignItems:"center", gap:40, flexWrap:"wrap" },
  trustBarLabel: { fontSize:12, color:T.text3, whiteSpace:"nowrap", fontWeight:500 },
  trustBarItem: { fontSize:13, color:T.text3, fontWeight:500 },

  // Sections
  section: { padding:"120px 48px", background:T.bg0 },
  sectionAlt: { padding:"120px 48px", background:T.bg1 },
  sInner: { maxWidth:1200, margin:"0 auto" },

  // Section headers
  eyebrow: { fontSize:11, fontWeight:600, letterSpacing:"1.8px", textTransform:"uppercase", color:T.blue, marginBottom:16, display:"block" },
  h2: { fontFamily:"'Epilogue',sans-serif", fontSize:44, fontWeight:800, letterSpacing:"-1.5px", marginBottom:20, color:T.text1, maxWidth:600, lineHeight:1.1 },
  bodyTxt: { fontSize:15, color:T.text2, lineHeight:1.85, fontWeight:400 },

  // Problem/solution split
  splitSection: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:72 },
  splitLeft: {},
  splitRight: { paddingLeft:24, borderLeft:`1px solid ${T.border}` },
  problemList: { display:"flex", flexDirection:"column", gap:14, marginTop:32 },
  problemItem: { display:"flex", gap:12, alignItems:"flex-start" },
  problemX: { color:T.red, fontWeight:700, fontSize:14, flexShrink:0, marginTop:1 },
  solutionCheck: { color:T.green, fontWeight:700, fontSize:14, flexShrink:0, marginTop:1 },

  // Feature grid
  featGrid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, border:`1px solid ${T.border}`, overflow:"hidden", borderRadius:2 },
  featCard: { padding:"36px 32px", background:T.bg0, borderRight:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}` },
  featNum: { fontSize:11, fontWeight:600, color:T.text3, letterSpacing:"1.5px", marginBottom:16, display:"block" },
  featTitle: { fontFamily:"'Epilogue',sans-serif", fontWeight:700, fontSize:16, marginBottom:10, color:T.text1, letterSpacing:"-0.2px" },
  featDesc: { fontSize:13, color:T.text2, lineHeight:1.78, fontWeight:400 },

  // Steps
  stepsGrid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 },
  step: { padding:"32px 28px", background:T.bg2, borderRadius:14, border:`1px solid ${T.border}` },
  stepN: { fontFamily:"'Epilogue',sans-serif", fontSize:36, fontWeight:900, color:"rgba(255,255,255,0.06)", lineHeight:1, marginBottom:20 },
  stepTag: { fontSize:10, fontWeight:600, color:T.blue, background:"rgba(59,130,246,0.08)", padding:"3px 10px", borderRadius:100, letterSpacing:"0.5px", marginBottom:16, display:"inline-block" },
  stepT: { fontFamily:"'Epilogue',sans-serif", fontWeight:700, fontSize:15, marginBottom:10, color:T.text1, letterSpacing:"-0.2px" },
  stepD: { fontSize:13, color:T.text2, lineHeight:1.78 },

  // Integrations
  integGrid: { display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:40 },
  integCard: { background:T.bg2, border:`1px solid ${T.border}`, borderRadius:12, padding:"20px 16px" },
  integTop: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 },
  integIcon: { width:36, height:36, borderRadius:9, background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Epilogue',sans-serif", fontWeight:800, fontSize:15, color:T.text1 },
  integStatus: { fontSize:10, fontWeight:600, padding:"3px 9px", borderRadius:100 },
  integName: { fontFamily:"'Epilogue',sans-serif", fontWeight:700, fontSize:13, color:T.text1, marginBottom:3, letterSpacing:"-0.1px" },
  integType: { fontSize:11, color:T.text3 },

  // API box
  apiBox: { background:T.bg2, border:`1px solid ${T.border}`, borderRadius:16, overflow:"hidden", display:"grid", gridTemplateColumns:"1fr 1fr" },
  apiLeft: { padding:"44px 40px" },
  apiCode: { background:T.bg0, borderLeft:`1px solid ${T.border}` },
  apiCodeBar: { padding:"12px 20px", borderBottom:`1px solid ${T.border}`, background:T.bg1, display:"flex", alignItems:"center", gap:8 },
  apiCodeBody: { padding:"24px", fontSize:12, color:T.text2, fontFamily:"'Menlo','Monaco',monospace", lineHeight:1.9, whiteSpace:"pre" },

  // Testimonials
  testiGrid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 },
  testiCard: { background:T.bg2, border:`1px solid ${T.border}`, borderRadius:16, padding:"32px 28px", display:"flex", flexDirection:"column", gap:20 },
  stars: { color:"#F59E0B", fontSize:13, letterSpacing:2 },
  testiQ: { fontSize:14, color:"#A1A1AA", lineHeight:1.82, flex:1, fontStyle:"italic", fontWeight:400 },
  testiMeta: { display:"flex", alignItems:"center", gap:12 },
  testiAvatar: { width:38, height:38, borderRadius:"50%", background:`linear-gradient(135deg,${T.blue},${T.blueD})`, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14, flexShrink:0 },

  // Pricing
  pricingGrid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 },
  pricingCard: { background:T.bg2, border:`1px solid ${T.border}`, borderRadius:16, padding:36, display:"flex", flexDirection:"column", gap:0, position:"relative" },
  pricingHL: { background:"linear-gradient(180deg,rgba(30,50,100,0.4) 0%,rgba(15,20,40,0.4) 100%)", border:`1px solid rgba(59,130,246,0.35)` },
  pricingBadge: { position:"absolute", top:-13, left:"50%", transform:"translateX(-50%)", color:"#fff", fontSize:11, fontWeight:600, padding:"5px 16px", borderRadius:100, whiteSpace:"nowrap", letterSpacing:"0.02em" },
  pricingName: { fontSize:11, fontWeight:600, color:T.text3, textTransform:"uppercase", letterSpacing:"1.2px", marginBottom:14 },
  pricingAmt: { fontFamily:"'Epilogue',sans-serif", fontSize:48, fontWeight:900, color:T.text1, letterSpacing:"-2px" },

  // Buttons
  btnPrimary: { background:`linear-gradient(180deg,#4F8EF7 0%,${T.blueD} 100%)`, color:"#fff", border:"none", padding:"13px 28px", borderRadius:9, fontSize:15, fontWeight:600, letterSpacing:"-0.01em" },
  btnPrimaryFull: { background:`linear-gradient(180deg,#4F8EF7 0%,${T.blueD} 100%)`, color:"#fff", border:"none", padding:"14px", borderRadius:9, fontSize:15, fontWeight:600, width:"100%", marginTop:24, letterSpacing:"-0.01em" },
  btnOutline: { background:"transparent", border:`1px solid ${T.border}`, color:T.text1, padding:"13px 28px", borderRadius:9, fontSize:15, fontWeight:500, letterSpacing:"-0.01em" },
  btnOutlineFull: { background:"transparent", border:`1px solid ${T.border}`, color:T.text1, padding:"14px", borderRadius:9, fontSize:15, fontWeight:500, width:"100%", marginTop:24, letterSpacing:"-0.01em" },
  btnGhost: { background:"none", border:"none", color:T.text2, fontSize:15, fontWeight:500, letterSpacing:"-0.01em" },

  // Perf fee box
  perfFeeBox: { background:"rgba(59,130,246,0.04)", border:`1px solid rgba(59,130,246,0.14)`, borderRadius:14, padding:"28px 32px", display:"flex", alignItems:"flex-start", gap:20 },

  // FAQ
  faqGrid: { display:"flex", flexDirection:"column", maxWidth:760 },
  faqQ: { width:"100%", background:"none", border:"none", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"22px 0", fontSize:15, fontWeight:600, color:T.text1, textAlign:"left", gap:24, letterSpacing:"-0.01em", fontFamily:"'Inter',sans-serif" },
  faqA: { fontSize:14, color:T.text2, lineHeight:1.85, paddingBottom:22, fontWeight:400 },

  // CTA section
  ctaSec: { padding:"140px 48px", background:`radial-gradient(ellipse 80% 70% at 50% 100%, rgba(37,99,235,0.1) 0%, transparent 65%), ${T.bg1}`, textAlign:"center" },
  ctaInner: { maxWidth:680, margin:"0 auto", display:"flex", flexDirection:"column", alignItems:"center" },

  // Footer
  footer: { background:T.bg0, borderTop:`1px solid ${T.border}` },
  footerTop: { maxWidth:1200, margin:"0 auto", padding:"72px 48px 48px", display:"grid", gridTemplateColumns:"300px 1fr", gap:96 },
  footerBrand: {},
  footerCols: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:40 },
  footerCol: { display:"flex", flexDirection:"column", gap:14 },
  footerColTitle: { fontSize:12, fontWeight:600, color:T.text1, textTransform:"uppercase", letterSpacing:"1px", marginBottom:4 },
  footerColLink: { fontSize:13, color:T.text3, fontWeight:400, transition:"color 0.12s" },
  footerBottom: { maxWidth:1200, margin:"0 auto", padding:"20px 48px", borderTop:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" },
};

const a: Record<string, React.CSSProperties> = {
  root: { minHeight:"100vh", background:T.bg0, fontFamily:"'Inter',sans-serif" },
  nav: { padding:"0 48px", borderBottom:`1px solid ${T.border}`, background:T.bg0 },
  wrap: { display:"flex", alignItems:"center", justifyContent:"center", minHeight:"calc(100vh - 65px)", padding:40, background:`radial-gradient(ellipse 60% 50% at 50% 0%, rgba(37,99,235,0.07) 0%, transparent 60%)` },
  card: { width:"100%", maxWidth:420, background:T.bg2, border:`1px solid ${T.border}`, borderRadius:18, padding:44, display:"flex", flexDirection:"column", gap:24, boxShadow:"0 32px 80px rgba(0,0,0,0.6)" },
  h2: { fontFamily:"'Epilogue',sans-serif", fontSize:28, fontWeight:800, letterSpacing:"-0.8px", color:T.text1 },
  sub: { color:T.text3, fontSize:14, marginTop:-16 },
  error: { background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.22)", color:T.red, fontSize:13, padding:"11px 15px", borderRadius:9 },
  form: { display:"flex", flexDirection:"column", gap:18 },
  fg: { display:"flex", flexDirection:"column", gap:8 },
  label: { fontSize:13, fontWeight:500, color:T.text2 },
  input: { background:T.bg0, border:`1px solid ${T.border}`, borderRadius:9, padding:"12px 15px", color:T.text1, fontSize:14, fontFamily:"'Inter',sans-serif", transition:"border-color 0.15s" },
  toggle: { fontSize:13, color:T.text3, textAlign:"center" },
  toggleLink: { color:"#60A5FA", cursor:"pointer", fontWeight:600 },
};

const d: Record<string, any> = {
  root: { display:"flex", minHeight:"100vh", background:T.bg0, fontFamily:"'Inter',sans-serif", color:T.text1 },
  sidebar: { width:232, flexShrink:0, background:T.bg0, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"24px 12px", position:"sticky", top:0, height:"100vh" },
  sTop: { display:"flex", flexDirection:"column" },
  tab: { display:"flex", alignItems:"center", gap:10, background:"none", border:"none", textAlign:"left", padding:"9px 12px", borderRadius:8, fontSize:13, fontWeight:500, color:T.text3, transition:"all 0.15s", letterSpacing:"-0.01em" },
  tabOn: { background:"rgba(59,130,246,0.1)", color:"#60A5FA", fontWeight:600 },
  badge: { marginLeft:"auto", background:T.red, color:"#fff", fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:100 },
  sBottom: { display:"flex", flexDirection:"column", gap:10 },
  userRow: { display:"flex", alignItems:"center", gap:10, padding:"12px", background:"rgba(255,255,255,0.025)", borderRadius:10, border:`1px solid ${T.border}` },
  avatar: { width:32, height:32, borderRadius:8, background:`linear-gradient(135deg,${T.blue},${T.blueD})`, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, flexShrink:0 },
  signOut: { background:"none", border:"none", fontSize:13, color:T.text3, textAlign:"left", padding:"8px 12px", transition:"color 0.12s", fontFamily:"'Inter',sans-serif" },
  main: { flex:1, padding:"40px 48px", overflowY:"auto" },
  topBar: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:36 },
  pageTitle: { fontFamily:"'Epilogue',sans-serif", fontSize:24, fontWeight:800, letterSpacing:"-0.5px" },
  pageSub: { fontSize:12, color:T.text3, marginTop:4, fontWeight:400 },
  liveChip: { display:"flex", alignItems:"center", fontSize:12, color:T.green, fontWeight:600, background:"rgba(34,197,94,0.07)", padding:"7px 14px", borderRadius:100, border:"1px solid rgba(34,197,94,0.16)", gap:8, letterSpacing:"-0.01em" },
  grid4: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:12 },
  card: { background:T.bg2, border:`1px solid ${T.border}`, borderRadius:12, padding:"22px 24px" },
  cardLbl: { fontSize:11, color:T.text3, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:12 },
  cardVal: { fontFamily:"'Epilogue',sans-serif", fontSize:30, fontWeight:800, marginBottom:6, letterSpacing:"-1px" },
  cardSub: { fontSize:11, color:T.text3, fontWeight:500 },
  flatCard: { background:T.bg2, border:`1px solid ${T.border}`, borderRadius:12, padding:"16px 22px", display:"flex", justifyContent:"space-between", alignItems:"center" },
  flatLbl: { fontSize:13, color:T.text2, fontWeight:400 },
  flatVal: { fontFamily:"'Epilogue',sans-serif", fontWeight:700, fontSize:15, color:T.text1 },
  tableWrap: { background:T.bg2, border:`1px solid ${T.border}`, borderRadius:12, overflow:"hidden" },
  tableTop: { padding:"14px 20px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" },
  search: { background:T.bg0, border:`1px solid ${T.border}`, borderRadius:8, padding:"8px 13px", fontSize:13, color:T.text1, fontFamily:"'Inter',sans-serif", width:260 },
  filterBtn: { background:"transparent", border:`1px solid ${T.border}`, color:T.text3, padding:"6px 13px", borderRadius:7, fontSize:12, fontWeight:500, transition:"all 0.15s", fontFamily:"'Inter',sans-serif" },
  filterOn: { background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.28)", color:"#60A5FA" },
  table: { width:"100%", borderCollapse:"collapse" },
  th: { padding:"10px 18px", textAlign:"left", fontSize:10, color:T.text3, fontWeight:600, letterSpacing:"0.8px", textTransform:"uppercase", borderBottom:`1px solid ${T.border}`, background:"rgba(0,0,0,0.3)" },
  td: { padding:"13px 18px", fontSize:13, color:T.text2, borderBottom:`1px solid rgba(255,255,255,0.03)` },
  code: { fontFamily:"'Menlo','Monaco',monospace", fontSize:12, color:T.text1, background:"rgba(255,255,255,0.055)", padding:"2px 8px", borderRadius:4 },
  pill: (c: string) => ({ fontSize:11, fontWeight:600, color:c, background:c+"16", padding:"3px 10px", borderRadius:100, display:"inline-block" }),
  actionBtn: { background:"rgba(255,255,255,0.035)", border:`1px solid ${T.border}`, color:T.text2, fontSize:11, fontWeight:600, padding:"5px 11px", borderRadius:7, transition:"all 0.15s", fontFamily:"'Inter',sans-serif" },
  actionBtnHL: { background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.28)", color:"#60A5FA" },
  alertRow: { background:T.bg2, border:`1px solid ${T.border}`, borderRadius:10, display:"flex", alignItems:"center", overflow:"hidden", cursor:"pointer", marginBottom:8, transition:"border-color 0.15s" },
  alertUnread: { borderColor:"rgba(59,130,246,0.22)" },
  alertStripe: { width:3, alignSelf:"stretch", flexShrink:0 },
  markAllBtn: { background:"transparent", border:"none", color:"#60A5FA", fontSize:13, fontWeight:600, fontFamily:"'Inter',sans-serif" },
  settingsCard: { background:T.bg2, border:`1px solid ${T.border}`, borderRadius:12, padding:"28px 32px", display:"flex", flexDirection:"column", gap:16 },
  settingsTitle: { fontFamily:"'Epilogue',sans-serif", fontWeight:700, fontSize:16, color:T.text1, marginBottom:4, letterSpacing:"-0.2px" },
  settingsInput: { background:T.bg0, border:`1px solid ${T.border}`, borderRadius:9, padding:"11px 14px", color:T.text1, fontSize:14, fontFamily:"'Inter',sans-serif" },
};

// ─── HELPER COMPONENTS ─────────────────────────────────────────────────────────
function Logo() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
      <div style={{ width:30, height:30, borderRadius:8, background:`linear-gradient(135deg,${T.blue},${T.blueD})`, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Epilogue',sans-serif", fontWeight:900, fontSize:14, boxShadow:`0 2px 10px rgba(37,99,235,0.45)` }}>H</div>
      <span style={{ fontFamily:"'Epilogue',sans-serif", fontWeight:700, fontSize:15, color:T.text1, letterSpacing:"-0.3px" }}>HighRisk<span style={{ color:T.blue }}>Intel</span></span>
    </div>
  );
}

function FAQItem({ q, a: ans }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom:`1px solid ${T.border}` }}>
      <button style={s.faqQ} onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span style={{ color:T.text3, fontSize:18, transition:"transform 0.2s", transform:open?"rotate(45deg)":"none", display:"inline-block", flexShrink:0 }}>+</span>
      </button>
      {open && <p style={s.faqA}>{ans}</p>}
    </div>
  );
}

function ToggleRow({ label, sub, defaultOn }: { label: string; sub: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"15px 0", borderBottom:`1px solid ${T.border}` }}>
      <div><p style={{ fontSize:14, color:T.text1, marginBottom:3, fontWeight:500 }}>{label}</p><p style={{ fontSize:12, color:T.text3 }}>{sub}</p></div>
      <div style={{ width:40, height:22, borderRadius:11, background:on?T.blueD:"rgba(255,255,255,0.08)", cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0 }} onClick={() => setOn(!on)}>
        <div style={{ position:"absolute", top:3, left:on?19:3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.3)" }}/>
      </div>
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
// ─── NEWSLETTER SECTION ────────────────────────────────────────────────────────
function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) { setMsg("Enter a valid email."); setStatus("error"); return; }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "landing" })
      });
      const data = await res.json();
      if (!res.ok && res.status !== 200) { setMsg(data.error || "Something went wrong."); setStatus("error"); return; }
      setMsg(data.message || "You're subscribed!");
      setStatus("success");
      setEmail("");
    } catch {
      setMsg("Network error. Try again.");
      setStatus("error");
    }
  }

  return (
    <section style={{ background: T.bg1, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "80px 48px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <div>
          <span style={s.eyebrow}>Weekly Intel Brief</span>
          <h2 style={{ fontFamily: "'Epilogue',sans-serif", fontSize: 36, fontWeight: 800, letterSpacing: "-1.2px", color: T.text1, marginBottom: 16, lineHeight: 1.1 }}>
            Stay ahead of chargeback trends.
          </h2>
          <p style={{ fontSize: 15, color: T.text2, lineHeight: 1.8, maxWidth: 440 }}>
            Weekly intelligence on dispute ratios, processor changes, risk tactics, and MID protection strategies — sent every Tuesday to 2,400+ high-risk merchants.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 24 }}>
            {[
              "Dispute ratio benchmarks by industry",
              "MID termination warnings & processor news",
              "Authorization rate trends & tactics"
            ].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: T.text3 }}>
                <span style={{ color: T.green, fontWeight: 700 }}>✓</span> {item}
              </div>
            ))}
          </div>
        </div>
        <div>
          {status === "success" ? (
            <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 14, padding: "32px 36px", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>✓</div>
              <p style={{ fontSize: 16, fontWeight: 600, color: T.text1, marginBottom: 8 }}>You&rsquo;re subscribed.</p>
              <p style={{ fontSize: 13, color: T.text2 }}>Check your inbox for a welcome email from HighRiskIntel.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 16, padding: "36px" }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: T.text1, marginBottom: 6 }}>Get the weekly brief</p>
              <p style={{ fontSize: 13, color: T.text3, marginBottom: 24 }}>Free. No spam. Unsubscribe anytime.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setStatus("idle"); setMsg(""); }}
                  placeholder="you@company.com"
                  style={{ background: T.bg0, border: `1px solid ${T.border}`, borderRadius: 9, padding: "12px 16px", color: T.text1, fontSize: 14, fontFamily: "'Inter',sans-serif" }}
                  required
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={{ ...s.btnPrimary, padding: "13px", width: "100%", opacity: status === "loading" ? 0.7 : 1, cursor: status === "loading" ? "not-allowed" : "pointer" }}
                  className="btn-p"
                >
                  {status === "loading" ? "Subscribing…" : "Subscribe →"}
                </button>
                {status === "error" && <p style={{ fontSize: 12, color: T.red, margin: 0 }}>{msg}</p>}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={s.root}>
      <style>{css}</style>

      {/* ── NAV ── */}
      <nav style={{ ...s.nav, ...(scrolled ? s.navSolid : {}) }}>
        <div style={s.navInner}>
          <Logo />
          <div style={s.navLinks} className="nav-links">
            {["Product","How It Works","Integrations","Pricing","FAQ"].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g,"-")}`} style={s.navLink} className="nav-lnk">{l}</a>
            ))}
          </div>
          <div style={s.navActions} className="nav-actions">
            <button style={s.navSignIn} className="nav-lnk" onClick={() => router.push("/signin")}>Sign in</button>
            <button style={s.navCta} className="btn-p nav-cta" onClick={() => router.push("/signup")}>Get started →</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="dot-bg" style={{ background:T.bg0 }}>
        <section style={s.hero} className="hero-section">
          {/* Orbs */}
          <div style={{ position:"absolute", top:-300, right:-200, width:800, height:800, borderRadius:"50%", background:"radial-gradient(circle,rgba(37,99,235,0.08) 0%,transparent 60%)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:-200, left:-150, width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(129,140,248,0.05) 0%,transparent 60%)", pointerEvents:"none" }}/>

          <div style={s.heroLeft}>
            <div className="fu" style={s.pill}>
              <span style={s.pillDot}/>
              Live Intelligence Platform — Built for High-Risk Merchants
            </div>

            <h1 className="fu d1 hero-h1" style={s.h1}>
              Stop losing revenue<br />
              <em className="g-text">to chargebacks.</em>
            </h1>

            <p className="fu d2 hero-p" style={s.heroP}>
              HighRiskIntel monitors every transaction 24/7, connects you to EDR networks, predicts MID termination 30 days out, and delivers action-ready intelligence — so your processor never acts first.
            </p>

            <div className="fu d3" style={s.heroBtns}>
              <button style={s.btnPrimary} className="btn-p" onClick={() => router.push("/signup")}>Start free trial</button>
              <button style={s.btnOutline} className="btn-o" onClick={() => router.push("/signin")}>Sign in →</button>
            </div>

            <div className="fu d4" style={s.trustBadges}>
              {["SOC 2 Type II","PCI DSS Level 1","99.9% Uptime SLA","GDPR Compliant"].map(b => (
                <span key={b} style={s.trustBadge}>
                  <span style={{ color:T.green, fontWeight:700 }}>✓</span> {b}
                </span>
              ))}
            </div>

            <div className="fu d4 stats-row" style={s.statsRow}>
              {[
                { v:"$2.4B+", l:"Protected in merchant volume" },
                { v:"30 days", l:"MID termination prediction" },
                { v:"98.6%", l:"Dispute prevention rate" },
                { v:"12 hrs", l:"Human review cycle" },
              ].map(st => (
                <div key={st.l} style={s.statItem} className="stat-item">
                  <span style={s.statV}>{st.v}</span>
                  <span style={s.statL}>{st.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mock preview */}
          <div className="fu d2 mock-preview" style={s.mockCard}>
            <div style={s.mockBar}>
              <div style={{ display:"flex", gap:5 }}>
                {["#FF5F57","#FEBC2E","#28C840"].map(c => <span key={c} style={{ width:10, height:10, borderRadius:"50%", background:c, display:"inline-block" }}/>)}
              </div>
              <span style={{ fontSize:11, color:T.text3, fontFamily:"monospace", marginLeft:4 }}>app.highriskintel.com</span>
            </div>
            <div style={s.mockBody}>
              {/* Header row */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontFamily:"'Epilogue',sans-serif", fontWeight:700, fontSize:13, color:T.text1, letterSpacing:"-0.2px" }}>Risk Monitor</span>
                <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:T.green, fontWeight:600 }}><span className="pdot"/>Live</span>
              </div>

              {/* Key metrics */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                {[{ l:"Chargeback Rate", v:"1.84%", c:T.green },{ l:"Risk Score", v:"62 / 100", c:T.amber },{ l:"Alerts", v:"7 active", c:T.red }].map(m => (
                  <div key={m.l} style={{ background:"rgba(255,255,255,0.03)", borderRadius:8, padding:"10px 10px", border:`1px solid ${T.border}` }}>
                    <p style={{ fontSize:10, color:T.text3, marginBottom:4, fontWeight:500 }}>{m.l}</p>
                    <p style={{ fontFamily:"'Epilogue',sans-serif", fontSize:15, fontWeight:800, color:m.c }}>{m.v}</p>
                  </div>
                ))}
              </div>

              {/* Recent transactions */}
              <div>
                <p style={{ fontSize:10, fontWeight:600, color:T.text3, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:8 }}>Recent Transactions</p>
                {[
                  { id:"TX-88291", amt:"$349", risk:22 },
                  { id:"TX-88290", amt:"$1,200", risk:91 },
                  { id:"TX-88289", amt:"$87.50", risk:34 },
                ].map(tx => (
                  <div key={tx.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:`1px solid rgba(255,255,255,0.04)` }}>
                    <span style={{ fontFamily:"monospace", fontSize:11, color:T.text2 }}>{tx.id}</span>
                    <span style={{ fontSize:12, fontWeight:600, color:T.text1 }}>{tx.amt}</span>
                    <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:100, background:rc(tx.risk)+"18", color:rc(tx.risk) }}>{tx.risk}</span>
                  </div>
                ))}
              </div>

              {/* Action advisory */}
              <div style={{ background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.18)", borderRadius:9, padding:"10px 12px" }}>
                <p style={{ fontSize:10, color:T.red, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:4 }}>Action Required</p>
                <p style={{ fontSize:11, color:"#D1D5DB", fontWeight:400, lineHeight:1.5 }}>Refund TX-88290 — IP mismatch confirmed. Risk: 91/100</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── TRUST BAR ── */}
      <hr className="g-rule"/>
      <div style={s.trustBar} className="trust-bar">
        <span style={s.trustBarLabel}>Protecting merchants in</span>
        {["E-commerce","Nutraceuticals","Travel","SaaS","Gaming","Firearms","Crypto","Adult"].map(l => (
          <span key={l} style={s.trustBarItem}>{l}</span>
        ))}
      </div>
      <hr className="g-rule"/>

      {/* ── PROBLEM / SOLUTION ── */}
      <section id="product" style={s.section}>
        <div style={s.sInner}>
          <div style={{ maxWidth:600, marginBottom:72 }}>
            <span style={s.eyebrow}>The problem</span>
            <h2 style={s.h2}>High-risk merchants lose MIDs they didn't know were at risk.</h2>
            <p style={s.bodyTxt}>Your processor monitors your chargeback ratio, dispute velocity, and reserve levels 24/7. When you breach their thresholds, they terminate your MID — sometimes without warning.</p>
          </div>
          <div style={s.splitSection} className="split-grid">
            <div style={s.splitLeft}>
              <p style={{ ...s.eyebrow, color:T.red }}>Without HighRiskIntel</p>
              <div style={s.problemList}>
                {[
                  "Chargeback ratios climb before you notice",
                  "EDR windows close in 24–72 hours",
                  "Processors act first, notify second",
                  "Rolling reserves get frozen without warning",
                  "High-risk averages 2–4% dispute rates",
                  "MID termination destroys revenue overnight",
                ].map((p, i) => (
                  <div key={i} style={s.problemItem}>
                    <span style={s.problemX}>✗</span>
                    <span style={{ fontSize:14, color:T.text2, lineHeight:1.7 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={s.splitRight} className="split-right">
              <p style={{ ...s.eyebrow, color:T.green }}>With HighRiskIntel</p>
              <div style={s.problemList}>
                {[
                  "Real-time risk score on every transaction",
                  "EDR alerts caught within minutes of filing",
                  "30-day MID termination prediction",
                  "Reserve forecasting updated weekly",
                  "Human analyst review every 12 hours",
                  "Action advisory tells you exactly what to do",
                ].map((p, i) => (
                  <div key={i} style={s.problemItem}>
                    <span style={s.solutionCheck}>✓</span>
                    <span style={{ fontSize:14, color:T.text1, lineHeight:1.7 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={s.sectionAlt}>
        <div style={s.sInner}>
          <span style={s.eyebrow}>What we do</span>
          <h2 style={s.h2}>Intelligence at every layer of your payment stack.</h2>
          <p style={{ ...s.bodyTxt, marginBottom:60, maxWidth:540 }}>From transaction scoring to MID protection, HighRiskIntel covers the full risk surface of your business.</p>
          <div style={s.featGrid} className="feat-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feat-ch" style={s.featCard}>
                <span style={s.featNum}>{f.num}</span>
                <span style={{ fontSize:20, color:T.blue, display:"block", marginBottom:14 }}>{f.icon}</span>
                <h3 style={s.featTitle}>{f.title}</h3>
                <p style={s.featDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={s.section}>
        <div style={s.sInner}>
          <span style={s.eyebrow}>How it works</span>
          <h2 style={s.h2}>From connection to full protection in 48 hours.</h2>
          <div style={s.stepsGrid} className="steps-grid">
            {[
              { n:"01", t:"Connect your processor", d:"Link MXMerchant, Stripe, Checkout.com, or your gateway. Setup takes under 5 minutes.", tag:"5 min" },
              { n:"02", t:"We sync your transaction data", d:"HighRiskIntel pulls your history and builds your baseline risk profile within 24 hours.", tag:"24hr baseline" },
              { n:"03", t:"AI scores every transaction", d:"Our engine scores 0–100 in real-time using 40+ signals. High-risk transactions trigger immediate alerts.", tag:"Real-time" },
              { n:"04", t:"Alerts hit your dashboard", d:"Every flag with severity, reason code, and an action advisory — refund, review, or block.", tag:"Instant" },
              { n:"05", t:"Human analysts review", d:"Every 12 hours, our team validates AI flags and updates your weekly report.", tag:"12hr cycle" },
              { n:"06", t:"You stay protected", d:"Follow the advisory. Keep your MID safe and your ratios in check — indefinitely.", tag:"Ongoing" },
            ].map((st, i) => (
              <div key={i} className="ch" style={s.step}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                  <span style={s.stepN}>{st.n}</span>
                  <span style={s.stepTag}>{st.tag}</span>
                </div>
                <h3 style={s.stepT}>{st.t}</h3>
                <p style={s.stepD}>{st.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ── */}
      <section id="integrations" style={s.sectionAlt}>
        <div style={s.sInner}>
          <span style={s.eyebrow}>Integrations</span>
          <h2 style={s.h2}>Plugs into your existing stack.</h2>
          <p style={{ ...s.bodyTxt, marginBottom:52, maxWidth:520 }}>No switching processors. No new infrastructure. HighRiskIntel connects to what you already use.</p>
          <div style={s.integGrid} className="integ-grid">
            {INTEGRATIONS.map((int, i) => (
              <div key={i} className="ch" style={s.integCard}>
                <div style={s.integTop}>
                  <div style={s.integIcon}>{int.name[0]}</div>
                  <span style={{ ...s.integStatus, color:int.status==="Live"?T.green:T.amber, background:int.status==="Live"?"rgba(34,197,94,0.08)":"rgba(245,158,11,0.08)", border:`1px solid ${int.status==="Live"?"rgba(34,197,94,0.2)":"rgba(245,158,11,0.2)"}` }}>{int.status}</span>
                </div>
                <p style={s.integName}>{int.name}</p>
                <p style={s.integType}>{int.type}</p>
              </div>
            ))}
            <div className="ch" style={{ ...s.integCard, border:`1px dashed ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:6 }}>
              <span style={{ fontSize:22, color:T.text3 }}>+</span>
              <p style={{ fontSize:12, color:T.text3, textAlign:"center" }}>More soon</p>
            </div>
          </div>

          {/* API box */}
          <div style={s.apiBox} className="api-box">
            <div style={s.apiLeft}>
              <span style={s.eyebrow}>API Access</span>
              <h3 style={{ fontFamily:"'Epilogue',sans-serif", fontSize:26, fontWeight:800, color:T.text1, marginBottom:14, letterSpacing:"-0.5px" }}>Built for developers too.</h3>
              <p style={{ fontSize:14, color:T.text2, lineHeight:1.78 }}>Use our REST API to score transactions in real-time, pull alerts, and receive webhook events directly in your system.</p>
            </div>
            <div style={s.apiCode} className="api-code">
              <div style={s.apiCodeBar}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:T.green, display:"inline-block" }}/>
                <span style={{ color:T.text3, fontSize:12, fontFamily:"monospace" }}>POST /v1/risk-score</span>
              </div>
              <pre style={s.apiCodeBody}>{`{
  "transaction_id": "TX-88291",
  "amount": 349.00,
  "currency": "USD",
  "card_bin": "424242",
  "country": "US",
  "ip_address": "192.168.1.1"
}

→ 200 OK
{
  "risk_score": 22,
  "action": "approve",
  "signals": ["low_velocity", "known_bin"]
}`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={s.section}>
        <div style={s.sInner}>
          <span style={s.eyebrow}>Results</span>
          <h2 style={s.h2}>Merchants who stopped losing money to chargebacks.</h2>
          <div style={s.testiGrid} className="testi-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="ch" style={s.testiCard}>
                <div style={s.stars}>{"★★★★★"}</div>
                <p style={s.testiQ}>"{t.quote}"</p>
                <div style={s.testiMeta}>
                  <div style={s.testiAvatar}>{t.name[0]}</div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:600, color:T.text1 }}>{t.name}</p>
                    <p style={{ fontSize:12, color:T.text3 }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={s.sectionAlt}>
        <div style={s.sInner}>
          <span style={s.eyebrow}>Pricing</span>
          <h2 style={s.h2}>Pay for results.</h2>
          <p style={{ ...s.bodyTxt, marginBottom:12, maxWidth:540 }}>Flat monthly fee for monitoring, reports, and support. Plus a 10% performance fee on disputes we prevent.</p>
          <p style={{ fontSize:13, color:T.blue, marginBottom:56, fontWeight:500 }}>No setup fees · No long-term contracts · Cancel anytime</p>
          <div style={s.pricingGrid} className="pricing-grid">
            {PRICING.map((p, i) => (
              <div key={i} className={`ch${p.highlight?" p-glow":""}`} style={{ ...s.pricingCard, ...(p.highlight ? s.pricingHL : {}) }}>
                {p.highlight && <div style={s.pricingBadge} className="badge-sh">Most popular</div>}
                <p style={s.pricingName}>{p.name}</p>
                <div style={{ display:"flex", alignItems:"baseline", gap:2, marginBottom:10 }}>
                  <span style={s.pricingAmt}>{p.price}</span>
                  <span style={{ fontSize:14, color:T.text3, marginBottom:6 }}>{p.period}</span>
                </div>
                <p style={{ fontSize:13, color:T.text2, lineHeight:1.65, marginBottom:24, fontWeight:400 }}>{p.desc}</p>
                <div style={{ height:1, background:T.border, marginBottom:24 }}/>
                <div style={{ display:"flex", flexDirection:"column", gap:11, flex:1 }}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{ fontSize:13, color:T.text2, display:"flex", gap:10, alignItems:"flex-start", lineHeight:1.5 }}>
                      <span style={{ color:T.green, fontWeight:700, flexShrink:0, marginTop:1 }}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <button
                  style={{ ...(p.highlight ? s.btnPrimaryFull : s.btnOutlineFull) }}
                  className={p.highlight ? "btn-p" : "btn-o"}
                  onClick={() => router.push("/signup")}
                >{p.cta}</button>
              </div>
            ))}
          </div>

          {/* Performance fee */}
          <div style={s.perfFeeBox}>
            <span style={{ fontSize:28, lineHeight:1 }}>+</span>
            <div>
              <p style={{ fontFamily:"'Epilogue',sans-serif", fontWeight:700, fontSize:17, color:T.text1, marginBottom:8, letterSpacing:"-0.3px" }}>10% Performance Fee</p>
              <p style={{ fontSize:14, color:T.text2, lineHeight:1.75, maxWidth:620, fontWeight:400 }}>On top of your monthly plan, we take 10% of the value of disputes we prevent. If we don't prevent anything, you don't pay a performance fee. Our incentives are perfectly aligned with yours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={s.section}>
        <div style={s.sInner}>
          <span style={s.eyebrow}>FAQ</span>
          <h2 style={s.h2}>Common questions.</h2>
          <div style={s.faqGrid}>
            {FAQS.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={s.ctaSec} className="cta-sec">
        <div style={s.ctaInner}>
          <div style={{ ...s.pill, marginBottom:32, display:"inline-flex" }}>
            <span style={s.pillDot}/> Trusted by serious high-risk merchants
          </div>
          <h2 style={{ fontFamily:"'Epilogue',sans-serif", fontSize:56, fontWeight:900, letterSpacing:"-2.5px", color:T.text1, marginBottom:20, lineHeight:1.04 }}>
            Your processor is<br />already watching.
          </h2>
          <p style={{ fontSize:17, color:T.text2, marginBottom:44, maxWidth:500, lineHeight:1.78, fontWeight:400 }}>
            Start monitoring before they make the first move. Free trial, no card required.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", marginBottom:32 }}>
            <button style={s.btnPrimary} className="btn-p" onClick={() => router.push("/signup")}>Start free trial</button>
            <button style={s.btnGhost} onClick={() => router.push("/signin")}>Sign in →</button>
          </div>
          <div style={{ display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap" }}>
            {["No setup fees","No contracts","Cancel anytime","Free onboarding"].map(b => (
              <span key={b} style={{ fontSize:13, color:T.text3, fontWeight:500 }}>✓ {b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <NewsletterSection />

      {/* ── FOOTER ── */}
      <footer style={s.footer}>
        <div style={s.footerTop} className="footer-top">
          <div style={s.footerBrand}>
            <Logo />
            <p style={{ fontSize:13, color:T.text3, marginTop:14, lineHeight:1.75, maxWidth:260, fontWeight:400 }}>AI-powered risk intelligence for high-risk merchants. Built to protect your MID and your revenue.</p>
            <div style={{ display:"flex", gap:10, marginTop:20 }}>
              {["SOC 2","PCI DSS","GDPR"].map(b => (
                <span key={b} style={{ fontSize:10, color:T.text3, background:"rgba(255,255,255,0.03)", border:`1px solid ${T.border}`, padding:"4px 10px", borderRadius:6, fontWeight:600 }}>✓ {b}</span>
              ))}
            </div>
          </div>
          <div style={s.footerCols} className="footer-cols">
            {[
              { title:"Product", links:["Overview","Features","Integrations","API Docs","Changelog"] },
              { title:"Company", links:["About","Blog","Careers","Privacy Policy","Terms of Service"] },
              { title:"Support", links:["Help Center","Contact Us","Status Page","Onboarding Guide","Security"] },
            ].map(col => (
              <div key={col.title} style={s.footerCol}>
                <p style={s.footerColTitle}>{col.title}</p>
                {col.links.map(l => <a key={l} href="#" style={s.footerColLink} className="nav-lnk">{l}</a>)}
              </div>
            ))}
          </div>
        </div>
        <div style={s.footerBottom} className="footer-bottom">
          <span style={{ fontSize:12, color:T.text3 }}>© 2025 HighRiskIntel, Inc. All rights reserved.</span>
          <span style={{ fontSize:12, color:T.text3 }}>Made for high-risk merchants worldwide.</span>
        </div>
      </footer>
    </div>
  );
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
export function HRIAuthPage({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]:e.target.value }));
  const handle = async () => {
    setError("");
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    if (!form.email.includes("@")) { setError("Enter a valid email address."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (mode === "signup" && !form.name) { setError("Enter your business name."); return; }
    setLoading(true);
    try {
      const body = mode === "signup"
        ? { email:form.email, password:form.password, business_name:form.name, plan:"starter" }
        : { email:form.email, password:form.password };
      const res = await fetch(`/api/auth/${mode}`, { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); setLoading(false); return; }
      router.push(mode === "signup" ? "/onboarding" : "/dashboard");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={a.root}>
      <style>{css}</style>
      <nav style={a.nav}>
        <div style={{ ...s.navInner }}>
          <div onClick={() => router.push("/")} style={{ cursor:"pointer" }}><Logo /></div>
          <button style={s.navSignIn} className="nav-lnk" onClick={() => router.push("/")}>← Back to site</button>
        </div>
      </nav>
      <div style={a.wrap}>
        <div style={a.card}>
          <div>
            <h2 style={a.h2}>{mode === "signin" ? "Welcome back." : "Create your account."}</h2>
            <p style={a.sub}>{mode === "signin" ? "Sign in to your dashboard." : "Start protecting your MID today."}</p>
          </div>
          {error && <div style={a.error}>{error}</div>}
          <div style={a.form}>
            {mode === "signup" && (
              <div style={a.fg}>
                <label style={a.label}>Business name</label>
                <input style={a.input} placeholder="Acme Payments Ltd." value={form.name} onChange={update("name")} onKeyDown={e => e.key === "Enter" && handle()}/>
              </div>
            )}
            <div style={a.fg}>
              <label style={a.label}>Email address</label>
              <input style={a.input} type="email" placeholder="you@company.com" value={form.email} onChange={update("email")} onKeyDown={e => e.key === "Enter" && handle()}/>
            </div>
            <div style={a.fg}>
              <label style={a.label}>Password</label>
              <input style={a.input} type="password" placeholder="••••••••" value={form.password} onChange={update("password")} onKeyDown={e => e.key === "Enter" && handle()}/>
            </div>
            <button style={{ ...s.btnPrimaryFull, opacity:loading ? 0.7 : 1 }} className="btn-p" onClick={handle} disabled={loading}>
              {loading ? "Please wait..." : mode === "signin" ? "Sign in →" : "Create account →"}
            </button>
          </div>
          <p style={a.toggle}>
            {mode === "signin" ? "No account? " : "Already have an account? "}
            <span style={a.toggleLink} onClick={() => router.push(mode === "signin" ? "/signup" : "/signin")}>
              {mode === "signin" ? "Sign up" : "Sign in"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
export function HRIDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("overview");
  const [alerts, setAlerts] = useState(ALERTS_DATA);
  const [search, setSearch] = useState("");
  const [actionDone, setActionDone] = useState<Record<string, string>>({});
  const [riskFilter, setRiskFilter] = useState("all");
  const [overview, setOverview] = useState<any>(null);
  const [txns, setTxns] = useState(TXNS);
  const [isSample, setIsSample] = useState(true);
  const [user, setUser] = useState({ name:"Demo Merchant", email:"demo@highriskintel.com" });

  useEffect(() => {
    fetch("/api/dashboard/overview").then(r => r.ok ? r.json() : null).then(data => {
      if (data && !data.error) { setOverview(data); setIsSample(data.isSample !== false); }
    }).catch(() => {});
    fetch("/api/transactions?limit=50").then(r => r.ok ? r.json() : null).then(data => {
      if (data?.data?.length) {
        setTxns(data.data.map((tx: any) => ({
          id: tx.txId || tx.id, email: tx.email || "—",
          amount: "$" + Number(tx.amount).toLocaleString("en-US", { minimumFractionDigits:2 }),
          country: tx.country || "—", bin: tx.cardBin || "—", risk: tx.riskScore ?? 0,
          processor: tx.processor || "—",
          status: tx.status ? tx.status.charAt(0).toUpperCase() + tx.status.slice(1) : "—",
        })));
      }
    }).catch(() => {});
    fetch("/api/alerts").then(r => r.ok ? r.json() : null).then(data => {
      if (Array.isArray(data) && data.length) {
        setAlerts(data.map((a: any, i: number) => ({ id:i+1, time:new Date(a.createdAt).toLocaleString(), type:a.type, msg:a.message, read:a.read })));
      }
    }).catch(() => {});
    fetch("/api/admin/merchants").then(r => r.ok ? r.json() : null).then(data => {
      if (Array.isArray(data) && data[0]?.businessName) setUser({ name:data[0].businessName, email:"" });
    }).catch(() => {});
  }, []);

  const unread = alerts.filter(a => !a.read).length;
  const markRead = (id: number) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, read:true } : a));
  const markAllRead = () => setAlerts(prev => prev.map(a => ({ ...a, read:true })));
  const doAction = (tx: string, action: string) => setActionDone(prev => ({ ...prev, [tx]:action }));
  const filteredTxns = txns.filter(tx => {
    const ms = tx.id.toLowerCase().includes(search.toLowerCase()) || tx.email.toLowerCase().includes(search.toLowerCase());
    const mr = riskFilter === "all" || (riskFilter === "high" && tx.risk >= 70) || (riskFilter === "med" && tx.risk >= 40 && tx.risk < 70) || (riskFilter === "low" && tx.risk < 40);
    return ms && mr;
  });

  const stats = overview ? {
    totalVolume: "$" + Number(overview.totalVolume).toLocaleString("en-US", { minimumFractionDigits:0 }),
    chargebackRate: Number(overview.chargebackRate).toFixed(2) + "%",
    riskScore: String(overview.riskScore ?? 62),
    activeAlerts: String(overview.activeAlerts ?? 7),
    transactionsToday: String(overview.transactionsToday ?? 438),
    refundsIssued: String(overview.refundsIssued ?? 12),
    processorRisk: overview.processorRisk > 60 ? "High" : overview.processorRisk > 30 ? "Moderate" : "Low",
    disputeProbability: Number(overview.disputeProbability).toFixed(1) + "%",
  } : {
    totalVolume:"$284,920", chargebackRate:"1.84%", riskScore:"62",
    activeAlerts:"7", transactionsToday:"438", refundsIssued:"12",
    processorRisk:"Moderate", disputeProbability:"14.2%",
  };

  const tabs = [
    { id:"overview", label:"Overview", icon:"◈" },
    { id:"transactions", label:"Transactions", icon:"⬡" },
    { id:"risk", label:"Risk Monitor", icon:"⬟" },
    { id:"alerts", label:"Alerts", icon:"◇", badge:unread },
    { id:"settings", label:"Settings", icon:"⚙" },
  ];

  return (
    <div style={d.root} className="dash-root">
      <style>{css}</style>

      {/* ── SIDEBAR ── */}
      <aside style={d.sidebar} className="dash-sidebar">
        <div style={d.sTop} className="dash-stop">
          <div style={{ marginBottom:32, paddingLeft:4 }} className="dash-logo"><Logo /></div>
          <div style={{ height:1, background:T.border, marginBottom:16 }}/>
          {tabs.map(t => (
            <button key={t.id} style={{ ...d.tab, ...(tab === t.id ? d.tabOn : {}) }} className="dash-tab" onClick={() => setTab(t.id)}>
              <span style={{ fontSize:14, width:20, textAlign:"center", flexShrink:0 }}>{t.icon}</span>
              <span>{t.label}</span>
              {(t as any).badge > 0 && <span style={d.badge}>{(t as any).badge}</span>}
            </button>
          ))}
        </div>
        <div style={d.sBottom} className="dash-sbottom">
          <div style={{ height:1, background:T.border, marginBottom:8 }}/>
          <div style={d.userRow}>
            <div style={d.avatar}>{user.name[0].toUpperCase()}</div>
            <div style={{ overflow:"hidden" }}>
              <p style={{ fontSize:13, fontWeight:600, color:T.text1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name}</p>
              <p style={{ fontSize:11, color:T.text3 }}>Professional plan</p>
            </div>
          </div>
          <button style={d.signOut} onClick={() => router.push("/")}>Sign out</button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={d.main} className="dash-main">
        <div style={d.topBar}>
          <div>
            <h1 style={d.pageTitle}>{tabs.find(t => t.id === tab)?.label}</h1>
            <p style={d.pageSub}>Last updated just now · {new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" })}</p>
          </div>
          <div style={d.liveChip}><span className="pdot"/>Live monitoring active</div>
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && (
          <div>
            {isSample && (
              <div style={{ background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:10, padding:"13px 18px", marginBottom:20, fontSize:13, color:T.amber, display:"flex", justifyContent:"space-between", alignItems:"center", gap:16 }}>
                <span>📊 Sample data — Complete onboarding to connect your real merchant data.</span>
                <button onClick={() => router.push("/onboarding")} style={{ background:T.amber, color:"#000", border:"none", borderRadius:7, padding:"7px 16px", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>Complete setup →</button>
              </div>
            )}

            {/* Primary stat cards */}
            <div style={d.grid4} className="dash-grid4">
              {[
                { label:"Total Volume", val:stats.totalVolume, sub:"↑ 12% this week", c:T.blue, ca:"ca-blue" },
                { label:"Chargeback Rate", val:stats.chargebackRate, sub:"↓ 0.3% vs last week", c:T.green, ca:"ca-green" },
                { label:"MID Risk Score", val:stats.riskScore + "/100", sub:"Moderate — action advisory active", c:T.amber, ca:"ca-amber" },
                { label:"Active Alerts", val:stats.activeAlerts, sub:"2 critical, 1 warning", c:T.red, ca:"ca-red" },
              ].map((c, i) => (
                <div key={i} className={`ch ${c.ca}`} style={d.card}>
                  <p style={d.cardLbl}>{c.label}</p>
                  <p style={{ ...d.cardVal, color:c.c }}>{c.val}</p>
                  <p style={d.cardSub}>{c.sub}</p>
                </div>
              ))}
            </div>

            {/* Secondary flat cards */}
            <div style={d.grid4} className="dash-grid4">
              {[
                { label:"Transactions Today", val:stats.transactionsToday },
                { label:"Refunds Issued", val:stats.refundsIssued },
                { label:"Processor Risk", val:stats.processorRisk },
                { label:"Dispute Probability", val:stats.disputeProbability },
              ].map((c, i) => (
                <div key={i} style={d.flatCard}>
                  <span style={d.flatLbl}>{c.label}</span>
                  <span style={d.flatVal}>{c.val}</span>
                </div>
              ))}
            </div>

            {/* Recent activity */}
            <div style={{ ...d.card, marginTop:12, padding:"22px 26px" }}>
              <p style={{ ...d.cardLbl, marginBottom:16 }}>Recent Activity</p>
              {ALERTS_DATA.slice(0, 4).map((al, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i < 3 ? `1px solid ${T.border}` : "none" }}>
                  <span style={{ width:7, height:7, borderRadius:"50%", background:ac(al.type), flexShrink:0 }}/>
                  <span style={{ fontSize:13, color:T.text2, flex:1 }}>{al.msg}</span>
                  <span style={{ fontSize:11, color:T.text3, whiteSpace:"nowrap" }}>{al.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TRANSACTIONS TAB ── */}
        {tab === "transactions" && (
          <div style={d.tableWrap} className="dash-table">
            <div style={d.tableTop}>
              <input style={d.search} placeholder="Search by ID or email..." value={search} onChange={e => setSearch(e.target.value)}/>
              <div style={{ display:"flex", gap:6 }}>
                {["all","high","med","low"].map(f => (
                  <button key={f} style={{ ...d.filterBtn, ...(riskFilter === f ? d.filterOn : {}) }} onClick={() => setRiskFilter(f)}>
                    {f === "all" ? "All" : f === "high" ? "High risk" : f === "med" ? "Medium" : "Low risk"}
                  </button>
                ))}
              </div>
            </div>
            <table style={d.table}>
              <thead><tr>{["Transaction","Email","Amount","Country","BIN","Risk","Processor","Status"].map(h => <th key={h} style={d.th}>{h}</th>)}</tr></thead>
              <tbody>
                {filteredTxns.map((tx, i) => (
                  <tr key={i} className="tr-hover">
                    <td style={d.td}><code style={d.code}>{tx.id}</code></td>
                    <td style={d.td}>{tx.email}</td>
                    <td style={d.td}><strong style={{ color:T.text1, fontWeight:600 }}>{tx.amount}</strong></td>
                    <td style={d.td}>{tx.country}</td>
                    <td style={d.td}><code style={d.code}>{tx.bin}</code></td>
                    <td style={d.td}><span style={d.pill(rc(tx.risk))}>{tx.risk}</span></td>
                    <td style={d.td}>{tx.processor}</td>
                    <td style={d.td}><span style={d.pill(sc(tx.status))}>{tx.status}</span></td>
                  </tr>
                ))}
                {filteredTxns.length === 0 && <tr><td colSpan={8} style={{ ...d.td, textAlign:"center", padding:40, color:T.text3 }}>No transactions match your filter.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* ── RISK TAB ── */}
        {tab === "risk" && (
          <div>
            <div style={d.grid4} className="dash-grid4">
              {[
                { label:"High Risk Transactions", val:"4", c:T.red, ca:"ca-red" },
                { label:"BIN Mismatch Activity", val:"12", c:T.amber, ca:"ca-amber" },
                { label:"Chargeback Probability", val:"14.2%", c:T.amber, ca:"ca-amber" },
                { label:"Suspicious Patterns", val:"3", c:T.red, ca:"ca-red" },
              ].map((c, i) => (
                <div key={i} className={c.ca} style={d.card}>
                  <p style={d.cardLbl}>{c.label}</p>
                  <p style={{ ...d.cardVal, color:c.c }}>{c.val}</p>
                </div>
              ))}
            </div>
            <div style={d.tableWrap}>
              <table style={d.table}>
                <thead><tr>{["Transaction","Risk Score","Reason","Suggested Action"].map(h => <th key={h} style={d.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {RISK_ITEMS.map((r, i) => (
                    <tr key={i} className="tr-hover">
                      <td style={d.td}><code style={d.code}>{r.tx}</code></td>
                      <td style={d.td}><span style={d.pill(rc(r.score))}>{r.score}</span></td>
                      <td style={d.td}>{r.reason}</td>
                      <td style={d.td}>
                        {actionDone[r.tx]
                          ? <span style={{ fontSize:12, color:T.green, fontWeight:600 }}>✓ {actionDone[r.tx]} applied</span>
                          : <div style={{ display:"flex", gap:6 }}>
                              {["Refund","Block","Review"].map(act => (
                                <button key={act} style={{ ...d.actionBtn, ...(r.action === act ? d.actionBtnHL : {}) }} onClick={() => doAction(r.tx, act)}>{act}</button>
                              ))}
                            </div>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ALERTS TAB ── */}
        {tab === "alerts" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <p style={{ fontSize:13, color:T.text3, fontWeight:500 }}>{unread} unread alert{unread !== 1 ? "s" : ""}</p>
              {unread > 0 && <button style={d.markAllBtn} onClick={markAllRead}>Mark all read</button>}
            </div>
            {alerts.map(al => (
              <div key={al.id} className="ch" style={{ ...d.alertRow, ...(!al.read ? d.alertUnread : {}) }} onClick={() => markRead(al.id)}>
                <div style={{ ...d.alertStripe, background:ac(al.type) }}/>
                <div style={{ flex:1, padding:"14px 18px" }}>
                  <p style={{ fontSize:14, color:al.read ? T.text2 : T.text1, marginBottom:4, fontWeight:al.read ? 400 : 500 }}>{al.msg}</p>
                  <p style={{ fontSize:11, color:T.text3 }}>{al.time}</p>
                </div>
                <span style={{ fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.5px", padding:"3px 10px", borderRadius:100, background:ac(al.type)+"16", color:ac(al.type), margin:"0 16px", whiteSpace:"nowrap" }}>{al.type}</span>
                {!al.read && <span style={{ width:7, height:7, borderRadius:"50%", background:T.blue, marginRight:18, flexShrink:0 }}/>}
              </div>
            ))}
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === "settings" && (
          <div style={{ display:"flex", flexDirection:"column", gap:20, maxWidth:620 }}>
            <div style={d.settingsCard}>
              <h3 style={d.settingsTitle}>Account Information</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {[{ l:"Business Name", v:user.name },{ l:"Email Address", v:user.email },{ l:"Plan", v:"Professional" }].map(f => (
                  <div key={f.l} style={{ display:"flex", flexDirection:"column", gap:7 }}>
                    <label style={{ fontSize:12, fontWeight:600, color:T.text3, textTransform:"uppercase", letterSpacing:"0.8px" }}>{f.l}</label>
                    <input style={d.settingsInput} defaultValue={f.v} readOnly={f.l === "Plan"}/>
                  </div>
                ))}
                <button style={{ ...s.btnPrimary, alignSelf:"flex-start", marginTop:4 }} className="btn-p">Save changes</button>
              </div>
            </div>
            <div style={d.settingsCard}>
              <h3 style={d.settingsTitle}>Notifications</h3>
              {[
                { l:"Critical alerts", sub:"MID risk, high chargeback probability" },
                { l:"Weekly reports", sub:"Delivered every Monday" },
                { l:"EDR notifications", sub:"Real-time dispute alerts" },
              ].map((n, i) => <ToggleRow key={i} label={n.l} sub={n.sub} defaultOn={true}/>)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
