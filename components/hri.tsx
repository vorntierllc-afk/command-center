"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ─── DATA ──────────────────────────────────────────────────────────────────────
const FEATURES = [
  { title: "AI Risk Engine", desc: "Every transaction scored 0–100 in real-time using 40+ signals including BIN data, IP reputation, velocity patterns, and device fingerprinting.", num: "01", icon: "⬡" },
  { title: "EDR Network", desc: "Connected to Chargebacks911, Verifi, and Ethoca. We catch disputes the moment they're filed — before they become chargebacks.", num: "02", icon: "◈" },
  { title: "MID Protection", desc: "Predict processor termination 30 days out. We monitor your dispute ratio, reserve levels, and processing patterns continuously.", num: "03", icon: "⬟" },
  { title: "Human Review", desc: "Every 12 hours, real analysts review your risk profile, flag emerging patterns, and update your action advisory.", num: "04", icon: "◇" },
  { title: "Reserve Forecasting", desc: "Know exactly how much cash is tied up in rolling reserves and when it releases. Model future reserve requirements by volume.", num: "05", icon: "⬠" },
  { title: "Weekly Intel Reports", desc: "White-labeled reports delivered every week: dispute trends, risk score history, action items, and processor health summary.", num: "06", icon: "◆" },
  { title: "Reason Code Analysis", desc: "Every dispute decoded. We map reason codes to root causes — whether it's friendly fraud, fulfillment issues, or processor errors.", num: "07", icon: "▣" },
  { title: "Action Advisory", desc: "We don't just alert you — we tell you exactly what to do. Refund, fight, review, or block with confidence on every transaction.", num: "08", icon: "▤" },
  { title: "Automation Rules", desc: "Set rules to auto-refund high risk orders, auto-block suspicious BIN ranges, and auto-flag risky geographies before disputes occur.", num: "09", icon: "▥" },
];

const PRICING = [
  {
    name: "Starter", price: "$250", period: "/mo",
    desc: "For merchants under $50k/mo getting started with risk management.",
    features: ["Up to $50k monthly volume","AI risk scoring on all transactions","EDR alerts via Chargebacks911","Weekly branded reports","Dispute reason code analysis","Email support"],
    cta: "Get Started", highlight: false,
  },
  {
    name: "Professional", price: "$600", period: "/mo",
    desc: "Full intelligence suite for established high-risk merchants.",
    features: ["Up to $500k monthly volume","Everything in Starter","12hr human review cycle","MID termination prediction","Rolling reserve forecasting","Automation rules builder","Priority support + analyst access"],
    cta: "Get Started", highlight: true,
  },
  {
    name: "Enterprise", price: "Custom", period: "",
    desc: "For high-volume merchants, ISOs, and payment facilitators.",
    features: ["Unlimited volume","Everything in Professional","Dedicated risk analyst","Custom integrations","SLA guarantee","White-glove onboarding","Direct acquirer relationships"],
    cta: "Contact Us", highlight: false,
  },
];

const FAQS = [
  { q: "What processors do you support?", a: "We support MXMerchant, Stripe, Checkout.com, Adyen, and most major high-risk processors. New integrations are added regularly. If your processor isn't listed, contact us." },
  { q: "How does the EDR network work?", a: "Early Detection and Resolution (EDR) networks like Chargebacks911, Verifi, and Ethoca allow merchants to receive dispute alerts before they convert to chargebacks. We connect you to these networks and act on alerts on your behalf." },
  { q: "What is a MID and why would it get terminated?", a: "A MID (Merchant ID) is your account with a payment processor. Processors terminate MIDs when chargeback ratios exceed thresholds (typically 1% for Visa, 0.9% for Mastercard). HighRiskIntel monitors these ratios and warns you 30 days before you're at risk." },
  { q: "Do I need technical skills to use this?", a: "No. HighRiskIntel is a fully managed service. You connect your processor, and we handle everything — monitoring, alerts, analysis, and reporting. No code required." },
  { q: "What's the performance fee?", a: "We charge a 10% fee on the value of disputes we prevent. For example, if we help you avoid $10,000 in chargebacks in a month, our performance fee is $1,000. This aligns our incentives with yours." },
  { q: "How long does onboarding take?", a: "Most merchants are fully onboarded within 24–48 hours. We connect your processor, configure your risk thresholds, and begin monitoring immediately." },
  { q: "Is my data secure?", a: "Yes. All data is encrypted in transit and at rest. We never store raw card numbers. Our analysts operate under strict confidentiality agreements." },
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
  { quote: "We were sitting at 2.1% dispute ratio — HighRiskIntel got us to 0.9% in 60 days. Our processor stopped threatening termination.", name: "Mark R.", role: "Supplements brand, $400k/mo" },
  { quote: "The action advisory is what sold me. Not just alerts — actual instructions. Refund this, block that. Saved us three times in the first month.", name: "Jennifer K.", role: "Travel agency, high-risk vertical" },
  { quote: "As an ISO we white-label this for our merchants. The reports look completely custom. None of them know what's behind it.", name: "David L.", role: "ISO / Payment facilitator" },
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

const rc = (r: number) => r >= 80 ? "#EF4444" : r >= 50 ? "#F59E0B" : "#10B981";
const sc = (st: string) => ({ Approved: "#10B981", Flagged: "#EF4444", Held: "#F59E0B", Review: "#F59E0B", Blocked: "#EF4444" } as Record<string,string>)[st] || "#9CA3AF";
const ac = (t: string) => ({ critical: "#EF4444", warning: "#F59E0B", info: "#60A5FA" } as Record<string,string>)[t];

// ─── CSS ───────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Epilogue:ital,wght@0,400;0,600;0,700;0,800;1,700;1,800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .fu { opacity:0; transform:translateY(18px); animation:fu 0.6s ease forwards; }
  .d1{animation-delay:.08s}.d2{animation-delay:.18s}.d3{animation-delay:.28s}.d4{animation-delay:.42s}
  @keyframes fu { to { opacity:1; transform:none; } }
  .ch { transition: box-shadow 0.2s, transform 0.2s; }
  .ch:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.35); transform: translateY(-1px); }
  .tr-hover { transition: background 0.1s; }
  .tr-hover:hover { background: rgba(255,255,255,0.02); }
  .pdot { display:inline-block; width:7px; height:7px; border-radius:50%; background:#10B981; animation:pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
  a { text-decoration:none; }
  button { cursor:pointer; font-family:'Outfit',sans-serif; }
  input:focus { outline:none; border-color:#2563EB !important; box-shadow:0 0 0 3px rgba(37,99,235,0.15); }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-thumb { background:#1F2937; border-radius:3px; }
`;

// ─── STYLES ────────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  root: { fontFamily:"'Outfit',sans-serif", background:"#0F1217", color:"#F9FAFB", minHeight:"100vh", overflowX:"hidden" },
  nav: { position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"0 40px", transition:"all 0.3s" },
  navSolid: { background:"rgba(15,18,23,0.96)", backdropFilter:"blur(14px)", borderBottom:"1px solid #1F2937" },
  navInner: { maxWidth:1160, margin:"0 auto", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" },
  navLinks: { display:"flex", gap:32 },
  navLink: { color:"#9CA3AF", fontSize:14, fontWeight:500 },
  navActions: { display:"flex", gap:10, alignItems:"center" },
  navSignIn: { background:"none", border:"none", color:"#9CA3AF", fontSize:14, fontWeight:500, padding:"8px 14px" },
  navCta: { background:"#2563EB", color:"#fff", border:"none", padding:"9px 20px", borderRadius:8, fontSize:14, fontWeight:600 },
  hero: { maxWidth:1160, margin:"0 auto", padding:"150px 40px 100px", display:"flex", alignItems:"center", gap:80 },
  heroLeft: { flex:1, maxWidth:560 },
  pill: { display:"inline-flex", alignItems:"center", gap:7, background:"rgba(37,99,235,0.12)", border:"1px solid rgba(37,99,235,0.25)", color:"#60A5FA", fontSize:11, fontWeight:600, padding:"5px 14px", borderRadius:100, marginBottom:28, letterSpacing:"0.2px" },
  pillDot: { width:6, height:6, borderRadius:"50%", background:"#60A5FA" },
  h1: { fontFamily:"'Epilogue',sans-serif", fontSize:58, fontWeight:800, lineHeight:1.06, letterSpacing:"-2px", marginBottom:22, color:"#F9FAFB" },
  h1Em: { fontStyle:"italic", color:"#60A5FA" },
  heroP: { fontSize:17, color:"#9CA3AF", lineHeight:1.8, marginBottom:36 },
  heroBtns: { display:"flex", gap:12, alignItems:"center", marginBottom:28 },
  trustBadges: { display:"flex", gap:16, marginBottom:44, flexWrap:"wrap" },
  trustBadge: { fontSize:12, color:"#4B5563", display:"flex", alignItems:"center", gap:5 },
  statsRow: { display:"flex", borderTop:"1px solid #1F2937", paddingTop:32, gap:0 },
  statItem: { flex:1, display:"flex", flexDirection:"column", gap:4 },
  statV: { fontFamily:"'Epilogue',sans-serif", fontSize:26, fontWeight:800, color:"#F9FAFB", letterSpacing:"-0.5px" },
  statL: { fontSize:11, color:"#6B7280" },
  mockCard: { flex:"0 0 400px", width:400, background:"#161B23", border:"1px solid #1F2937", borderRadius:14, overflow:"hidden", boxShadow:"0 24px 64px rgba(0,0,0,0.5)" },
  mockBar: { background:"#0F1217", borderBottom:"1px solid #1F2937", padding:"10px 16px", display:"flex", alignItems:"center", gap:12 },
  mockBody: { padding:20, display:"flex", flexDirection:"column", gap:16 },
  trustBar: { borderTop:"1px solid #1F2937", borderBottom:"1px solid #1F2937", padding:"18px 40px", background:"#0A0D11", display:"flex", alignItems:"center", gap:28, flexWrap:"wrap" },
  trustBarLabel: { fontSize:12, color:"#4B5563", whiteSpace:"nowrap" },
  trustBarItem: { fontSize:13, color:"#6B7280", fontWeight:500 },
  section: { padding:"100px 40px", background:"#0F1217" },
  sInner: { maxWidth:1160, margin:"0 auto" },
  eyebrow: { fontSize:11, fontWeight:700, letterSpacing:"1.2px", textTransform:"uppercase", color:"#2563EB", marginBottom:14 },
  h2: { fontFamily:"'Epilogue',sans-serif", fontSize:40, fontWeight:800, letterSpacing:"-1px", marginBottom:20, color:"#F9FAFB", maxWidth:560, lineHeight:1.15 },
  bodyTxt: { fontSize:15, color:"#9CA3AF", lineHeight:1.8 },
  splitSection: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:60 },
  splitLeft: { paddingRight:20 },
  splitRight: { paddingLeft:20, borderLeft:"1px solid #1F2937" },
  problemList: { display:"flex", flexDirection:"column", gap:12, marginTop:28 },
  problemItem: { display:"flex", gap:12, alignItems:"flex-start" },
  problemX: { color:"#EF4444", fontWeight:700, fontSize:14, flexShrink:0, marginTop:1 },
  solutionCheck: { color:"#10B981", fontWeight:700, fontSize:14, flexShrink:0, marginTop:1 },
  featGrid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1 },
  featCard: { padding:"32px 28px", border:"1px solid #1F2937", background:"#0F1217" },
  featNum: { fontSize:10, fontWeight:700, color:"#374151", letterSpacing:"1px" },
  featTitle: { fontFamily:"'Epilogue',sans-serif", fontWeight:700, fontSize:16, marginBottom:10, color:"#F9FAFB" },
  featDesc: { fontSize:13, color:"#9CA3AF", lineHeight:1.75 },
  stepsGrid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 },
  step: { padding:"28px 24px", background:"#141820", borderRadius:12, border:"1px solid #1F2937" },
  stepN: { fontFamily:"'Epilogue',sans-serif", fontSize:32, fontWeight:900, color:"#1F2937", lineHeight:1 },
  stepTag: { fontSize:10, fontWeight:700, color:"#60A5FA", background:"rgba(96,165,250,0.1)", padding:"3px 9px", borderRadius:100, letterSpacing:"0.3px" },
  stepT: { fontFamily:"'Epilogue',sans-serif", fontWeight:700, fontSize:15, marginBottom:10, color:"#F9FAFB" },
  stepD: { fontSize:13, color:"#9CA3AF", lineHeight:1.75 },
  integGrid: { display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14, marginBottom:40 },
  integCard: { background:"#141820", border:"1px solid #1F2937", borderRadius:12, padding:"20px 18px" },
  integTop: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 },
  integIcon: { width:36, height:36, borderRadius:9, background:"#1F2937", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Epilogue',sans-serif", fontWeight:800, fontSize:15, color:"#F9FAFB" },
  integStatus: { fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:100 },
  integName: { fontFamily:"'Epilogue',sans-serif", fontWeight:700, fontSize:14, color:"#F9FAFB", marginBottom:4 },
  integType: { fontSize:11, color:"#6B7280" },
  apiBox: { background:"#141820", border:"1px solid #1F2937", borderRadius:14, overflow:"hidden", display:"grid", gridTemplateColumns:"1fr 1fr" },
  apiLeft: { padding:"40px 36px" },
  apiCode: { background:"#0A0D11", borderLeft:"1px solid #1F2937" },
  apiCodeBar: { padding:"12px 20px", borderBottom:"1px solid #1F2937", background:"#0F1217" },
  apiCodeBody: { padding:"20px", fontSize:12, color:"#9CA3AF", fontFamily:"monospace", lineHeight:1.8, whiteSpace:"pre" },
  testiGrid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 },
  testiCard: { background:"#141820", border:"1px solid #1F2937", borderRadius:14, padding:"28px 24px", display:"flex", flexDirection:"column", gap:16 },
  stars: { color:"#F59E0B", fontSize:14, letterSpacing:2 },
  testiQ: { fontSize:14, color:"#D1D5DB", lineHeight:1.75, flex:1, fontStyle:"italic" },
  testiMeta: { display:"flex", alignItems:"center", gap:12 },
  testiAvatar: { width:36, height:36, borderRadius:"50%", background:"#2563EB", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14, flexShrink:0 },
  pricingGrid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginBottom:24 },
  pricingCard: { background:"#141820", border:"1px solid #1F2937", borderRadius:14, padding:32, display:"flex", flexDirection:"column", gap:0, position:"relative" },
  pricingHL: { border:"2px solid #2563EB", boxShadow:"0 8px 40px rgba(37,99,235,0.15)" },
  pricingBadge: { position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", background:"#2563EB", color:"#fff", fontSize:11, fontWeight:700, padding:"4px 14px", borderRadius:100, whiteSpace:"nowrap" },
  pricingName: { fontSize:12, fontWeight:600, color:"#6B7280", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:12 },
  pricingAmt: { fontFamily:"'Epilogue',sans-serif", fontSize:44, fontWeight:800, color:"#F9FAFB", letterSpacing:"-1px" },
  btnPrimary: { background:"#2563EB", color:"#fff", border:"none", padding:"13px 28px", borderRadius:9, fontSize:15, fontWeight:600 },
  btnPrimaryFull: { background:"#2563EB", color:"#fff", border:"none", padding:"13px", borderRadius:9, fontSize:15, fontWeight:600, width:"100%", marginTop:20 },
  btnOutlineFull: { background:"transparent", border:"1px solid #374151", color:"#F9FAFB", padding:"13px", borderRadius:9, fontSize:15, fontWeight:600, width:"100%", marginTop:20 },
  btnGhost: { background:"none", border:"none", color:"#9CA3AF", fontSize:15 },
  perfFeeBox: { background:"rgba(37,99,235,0.06)", border:"1px solid rgba(37,99,235,0.15)", borderRadius:12, padding:"24px 28px" },
  faqGrid: { display:"flex", flexDirection:"column", maxWidth:720 },
  faqQ: { width:"100%", background:"none", border:"none", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 0", fontSize:15, fontWeight:600, color:"#F9FAFB", textAlign:"left", gap:20 },
  faqA: { fontSize:14, color:"#9CA3AF", lineHeight:1.8, paddingBottom:20 },
  ctaSec: { padding:"120px 40px", background:"#0A0D11", textAlign:"center" },
  ctaInner: { maxWidth:640, margin:"0 auto", display:"flex", flexDirection:"column", alignItems:"center" },
  footer: { background:"#0A0D11", borderTop:"1px solid #1F2937" },
  footerTop: { maxWidth:1160, margin:"0 auto", padding:"60px 40px 40px", display:"grid", gridTemplateColumns:"280px 1fr", gap:80 },
  footerBrand: {},
  footerCols: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:40 },
  footerCol: { display:"flex", flexDirection:"column", gap:12 },
  footerColTitle: { fontSize:12, fontWeight:700, color:"#F9FAFB", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:4 },
  footerColLink: { fontSize:13, color:"#6B7280" },
  footerBottom: { maxWidth:1160, margin:"0 auto", padding:"20px 40px", borderTop:"1px solid #1F2937", display:"flex", justifyContent:"space-between", alignItems:"center" },
};

const a: Record<string, React.CSSProperties> = {
  root: { minHeight:"100vh", background:"#0F1217", fontFamily:"'Outfit',sans-serif" },
  nav: { padding:"0 40px", borderBottom:"1px solid #1F2937", background:"#0A0D11" },
  wrap: { display:"flex", alignItems:"center", justifyContent:"center", minHeight:"calc(100vh - 65px)", padding:40 },
  card: { width:"100%", maxWidth:400, background:"#141820", border:"1px solid #1F2937", borderRadius:14, padding:40, display:"flex", flexDirection:"column", gap:20 },
  h2: { fontFamily:"'Epilogue',sans-serif", fontSize:26, fontWeight:800, letterSpacing:"-0.5px", color:"#F9FAFB" },
  sub: { color:"#6B7280", fontSize:14, marginTop:-12 },
  error: { background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#EF4444", fontSize:13, padding:"10px 14px", borderRadius:8 },
  form: { display:"flex", flexDirection:"column", gap:16 },
  fg: { display:"flex", flexDirection:"column", gap:7 },
  label: { fontSize:13, fontWeight:500, color:"#9CA3AF" },
  input: { background:"#0F1217", border:"1px solid #1F2937", borderRadius:8, padding:"11px 14px", color:"#F9FAFB", fontSize:14, fontFamily:"'Outfit',sans-serif", transition:"border-color 0.15s" },
  toggle: { fontSize:13, color:"#6B7280", textAlign:"center" },
  toggleLink: { color:"#60A5FA", cursor:"pointer", fontWeight:600 },
};

const d: Record<string, any> = {
  root: { display:"flex", minHeight:"100vh", background:"#0F1217", fontFamily:"'Outfit',sans-serif", color:"#F9FAFB" },
  sidebar: { width:220, flexShrink:0, background:"#0A0D11", borderRight:"1px solid #1F2937", display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"24px 14px", position:"sticky", top:0, height:"100vh" },
  sTop: { display:"flex", flexDirection:"column" },
  tab: { display:"flex", alignItems:"center", gap:10, background:"none", border:"none", textAlign:"left", padding:"10px 12px", borderRadius:8, fontSize:13, fontWeight:500, color:"#6B7280", transition:"all 0.15s" },
  tabOn: { background:"rgba(37,99,235,0.15)", color:"#60A5FA", fontWeight:600 },
  badge: { marginLeft:"auto", background:"#EF4444", color:"#fff", fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:100 },
  sBottom: { display:"flex", flexDirection:"column", gap:12 },
  userRow: { display:"flex", alignItems:"center", gap:10, padding:"12px", background:"#141820", borderRadius:10, border:"1px solid #1F2937" },
  avatar: { width:32, height:32, borderRadius:8, background:"#2563EB", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14, flexShrink:0 },
  signOut: { background:"none", border:"none", fontSize:12, color:"#6B7280", textAlign:"left", padding:"8px 12px" },
  main: { flex:1, padding:"36px 44px", overflowY:"auto" },
  topBar: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:32 },
  pageTitle: { fontFamily:"'Epilogue',sans-serif", fontSize:24, fontWeight:800, letterSpacing:"-0.5px" },
  pageSub: { fontSize:12, color:"#4B5563", marginTop:4 },
  liveChip: { display:"flex", alignItems:"center", fontSize:12, color:"#10B981", fontWeight:600, background:"rgba(16,185,129,0.1)", padding:"6px 14px", borderRadius:100, border:"1px solid rgba(16,185,129,0.2)" },
  grid4: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:14 },
  card: { background:"#141820", border:"1px solid #1F2937", borderRadius:10, padding:"20px 22px" },
  cardLbl: { fontSize:11, color:"#6B7280", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:10 },
  cardVal: { fontFamily:"'Epilogue',sans-serif", fontSize:28, fontWeight:800, marginBottom:6, letterSpacing:"-0.5px" },
  cardSub: { fontSize:11, color:"#4B5563" },
  flatCard: { background:"#141820", border:"1px solid #1F2937", borderRadius:10, padding:"16px 22px", display:"flex", justifyContent:"space-between", alignItems:"center" },
  flatLbl: { fontSize:13, color:"#6B7280" },
  flatVal: { fontFamily:"'Epilogue',sans-serif", fontWeight:700, fontSize:15 },
  tableWrap: { background:"#141820", border:"1px solid #1F2937", borderRadius:10, overflow:"hidden" },
  tableTop: { padding:"14px 18px", borderBottom:"1px solid #1F2937", display:"flex", justifyContent:"space-between", alignItems:"center" },
  search: { background:"#0F1217", border:"1px solid #1F2937", borderRadius:7, padding:"8px 12px", fontSize:13, color:"#F9FAFB", fontFamily:"'Outfit',sans-serif", width:260 },
  filterBtn: { background:"transparent", border:"1px solid #1F2937", color:"#6B7280", padding:"6px 12px", borderRadius:6, fontSize:12, fontWeight:500 },
  filterOn: { background:"rgba(37,99,235,0.15)", border:"1px solid rgba(37,99,235,0.4)", color:"#60A5FA" },
  table: { width:"100%", borderCollapse:"collapse" },
  th: { padding:"11px 16px", textAlign:"left", fontSize:10, color:"#4B5563", fontWeight:700, letterSpacing:"0.6px", textTransform:"uppercase", borderBottom:"1px solid #1F2937", background:"#0F1217" },
  td: { padding:"13px 16px", fontSize:13, color:"#9CA3AF", borderBottom:"1px solid #0F1217" },
  code: { fontFamily:"monospace", fontSize:12, color:"#D1D5DB", background:"#1F2937", padding:"2px 7px", borderRadius:4 },
  pill: (c: string) => ({ fontSize:11, fontWeight:700, color:c, background:c+"20", padding:"3px 10px", borderRadius:100, display:"inline-block" }),
  actionBtn: { background:"#1F2937", border:"1px solid #374151", color:"#9CA3AF", fontSize:11, fontWeight:600, padding:"5px 10px", borderRadius:6 },
  actionBtnHL: { background:"rgba(37,99,235,0.15)", border:"1px solid rgba(37,99,235,0.4)", color:"#60A5FA" },
  alertRow: { background:"#141820", border:"1px solid #1F2937", borderRadius:10, display:"flex", alignItems:"center", overflow:"hidden", cursor:"pointer", marginBottom:10 },
  alertUnread: { background:"#161B26" },
  alertStripe: { width:4, alignSelf:"stretch", flexShrink:0 },
  markAllBtn: { background:"transparent", border:"none", color:"#60A5FA", fontSize:13, fontWeight:600 },
  settingsCard: { background:"#141820", border:"1px solid #1F2937", borderRadius:10, padding:"24px 28px", display:"flex", flexDirection:"column", gap:16 },
  settingsTitle: { fontFamily:"'Epilogue',sans-serif", fontWeight:700, fontSize:16, color:"#F9FAFB", marginBottom:4 },
  settingsInput: { background:"#0F1217", border:"1px solid #1F2937", borderRadius:8, padding:"10px 14px", color:"#F9FAFB", fontSize:14, fontFamily:"'Outfit',sans-serif" },
};

// ─── HELPER COMPONENTS ─────────────────────────────────────────────────────────
function Logo() {
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
      <div style={{width:30,height:30,borderRadius:8,background:"#2563EB",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Epilogue',sans-serif",fontWeight:800,fontSize:14}}>H</div>
      <span style={{fontFamily:"'Epilogue',sans-serif",fontWeight:700,fontSize:15,color:"#F9FAFB",letterSpacing:"-0.2px"}}>HighRiskIntel</span>
    </div>
  );
}

function FAQItem({ q, a: ans }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{borderBottom:"1px solid #1F2937"}}>
      <button style={s.faqQ} onClick={()=>setOpen(!open)}>
        <span>{q}</span>
        <span style={{color:"#6B7280",fontSize:18,transition:"transform 0.2s",transform:open?"rotate(45deg)":"none",display:"inline-block"}}>+</span>
      </button>
      {open && <p style={s.faqA}>{ans}</p>}
    </div>
  );
}

function ToggleRow({ label, sub, defaultOn }: { label: string; sub: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:"1px solid #1F2937"}}>
      <div><p style={{fontSize:14,color:"#D1D5DB",marginBottom:2}}>{label}</p><p style={{fontSize:12,color:"#6B7280"}}>{sub}</p></div>
      <div style={{width:42,height:24,borderRadius:12,background:on?"#2563EB":"#374151",cursor:"pointer",position:"relative",transition:"background 0.2s"}} onClick={()=>setOn(!on)}>
        <div style={{position:"absolute",top:3,left:on?20:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
      </div>
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
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
      <nav style={{ ...s.nav, ...(scrolled ? s.navSolid : {}) }}>
        <div style={s.navInner}>
          <Logo />
          <div style={s.navLinks}>
            {["Product", "How It Works", "Integrations", "Pricing", "FAQ"].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g,"-")}`} style={s.navLink}>{l}</a>
            ))}
          </div>
          <div style={s.navActions}>
            <button style={s.navSignIn} onClick={() => router.push("/signin")}>Sign in</button>
            <button style={s.navCta} onClick={() => router.push("/signup")}>Start free →</button>
          </div>
        </div>
      </nav>

      <section style={s.hero}>
        <div style={s.heroLeft}>
          <div className="fu" style={s.pill}><span style={s.pillDot} />Risk Intelligence Platform — Built for High-Risk Merchants</div>
          <h1 className="fu d1" style={s.h1}>Stop chargebacks<br /><em style={s.h1Em}>before they happen.</em></h1>
          <p className="fu d2" style={s.heroP}>HighRiskIntel is a 24/7 AI-powered risk monitoring service. We score every transaction, connect you to EDR networks, predict MID termination 30 days out, and tell you exactly what action to take — before your processor acts first.</p>
          <div className="fu d3" style={s.heroBtns}>
            <button style={s.btnPrimary} onClick={() => router.push("/signup")}>Start free trial</button>
            <button style={s.btnGhost} onClick={() => router.push("/signin")}>Sign in →</button>
          </div>
          <div className="fu d4" style={s.trustBadges}>
            {["SOC 2", "PCI DSS", "99.9% Uptime", "GDPR Ready"].map(b => (
              <span key={b} style={s.trustBadge}>✓ {b}</span>
            ))}
          </div>
          <div className="fu d4" style={s.statsRow}>
            {[{v:"1.2%",l:"Avg chargeback rate after 90 days"},{v:"30d",l:"MID termination prediction window"},{v:"12hr",l:"Human review cycle"},{v:"99.9%",l:"Uptime SLA"}].map(st => (
              <div key={st.l} style={s.statItem}>
                <span style={s.statV}>{st.v}</span>
                <span style={s.statL}>{st.l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="fu d2" style={s.mockCard}>
          <div style={s.mockBar}>
            <div style={{display:"flex",gap:6}}>{["#FF5F57","#FEBC2E","#28C840"].map(c=><span key={c} style={{width:10,height:10,borderRadius:"50%",background:c,display:"inline-block"}}/>)}</div>
            <span style={{fontSize:11,color:"#4B5563",fontFamily:"monospace"}}>app.highriskintel.com</span>
          </div>
          <div style={s.mockBody}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <span style={{fontFamily:"'Epilogue',sans-serif",fontWeight:700,fontSize:13,color:"#F9FAFB"}}>Risk Monitor</span>
              <span style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#10B981",fontWeight:600}}><span className="pdot"/>Live</span>
            </div>
            <div style={{display:"flex",gap:0,paddingBottom:16,borderBottom:"1px solid #1F2937",marginBottom:16}}>
              {[{l:"Chargeback Rate",v:"1.84%",c:"#10B981"},{l:"Risk Score",v:"62",c:"#F59E0B"},{l:"Active Alerts",v:"7",c:"#EF4444"}].map(m=>(
                <div key={m.l} style={{flex:1,display:"flex",flexDirection:"column",gap:3}}>
                  <span style={{fontFamily:"'Epilogue',sans-serif",fontSize:20,fontWeight:800,color:m.c}}>{m.v}</span>
                  <span style={{fontSize:10,color:"#6B7280"}}>{m.l}</span>
                </div>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:16}}>
              {[{c:"#EF4444",t:"Chargeback probability rising — NG cluster"},{c:"#F59E0B",t:"BIN mismatch — 501234 series"},{c:"#60A5FA",t:"MID monitoring risk detected"}].map((al,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{width:6,height:6,borderRadius:"50%",background:al.c,flexShrink:0}}/>
                  <span style={{fontSize:11,color:"#9CA3AF"}}>{al.t}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#6B7280",marginBottom:6}}>
                <span>Dispute Probability</span><span style={{color:"#F59E0B"}}>14.2%</span>
              </div>
              <div style={{height:3,background:"#1F2937",borderRadius:2}}>
                <div style={{height:"100%",width:"14.2%",background:"#F59E0B",borderRadius:2}}/>
              </div>
            </div>
            <div style={{marginTop:16,display:"flex",gap:8}}>
              <div style={{flex:1,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:8,padding:"10px 12px"}}>
                <p style={{fontSize:10,color:"#EF4444",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Action Required</p>
                <p style={{fontSize:11,color:"#D1D5DB"}}>Refund TX-88290 — IP mismatch confirmed</p>
              </div>
              <div style={{flex:1,background:"rgba(96,165,250,0.08)",border:"1px solid rgba(96,165,250,0.2)",borderRadius:8,padding:"10px 12px"}}>
                <p style={{fontSize:10,color:"#60A5FA",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Weekly Report</p>
                <p style={{fontSize:11,color:"#D1D5DB"}}>Ready — 14 actions, 3 saves</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={s.trustBar}>
        <span style={s.trustBarLabel}>Trusted by high-risk merchants in</span>
        {["E-commerce", "Nutraceuticals", "Travel", "SaaS", "Gaming", "Firearms", "Crypto"].map(l => (
          <span key={l} style={s.trustBarItem}>{l}</span>
        ))}
      </div>

      <section id="product" style={s.section}>
        <div style={s.sInner}>
          <div style={s.splitSection}>
            <div style={s.splitLeft}>
              <p style={s.eyebrow}>The problem</p>
              <h2 style={s.h2}>High-risk merchants lose MIDs they didn't know were at risk.</h2>
              <p style={s.bodyTxt}>Processors monitor your chargeback ratio, dispute velocity, and reserve levels 24/7. When you breach their thresholds, they terminate your MID — sometimes without warning.</p>
              <div style={s.problemList}>
                {["Chargeback ratios climb before you notice","EDR windows close in 24–72 hours","Processors act first, notify second","Rolling reserves get frozen without warning","High-risk industry averages 2–4% dispute rates"].map((p,i)=>(
                  <div key={i} style={s.problemItem}><span style={s.problemX}>✗</span><span style={{fontSize:14,color:"#9CA3AF"}}>{p}</span></div>
                ))}
              </div>
            </div>
            <div style={s.splitRight}>
              <p style={s.eyebrow}>The solution</p>
              <h2 style={s.h2}>HighRiskIntel watches everything so you don't have to.</h2>
              <p style={s.bodyTxt}>We sit between your transactions and your processor — monitoring every signal, catching every dispute early, and giving you actionable intelligence before problems become crises.</p>
              <div style={s.problemList}>
                {["Real-time risk score on every transaction","EDR alerts caught within minutes of filing","30-day MID termination prediction","Reserve forecasting updated weekly","Human analyst review every 12 hours"].map((p,i)=>(
                  <div key={i} style={s.problemItem}><span style={s.solutionCheck}>✓</span><span style={{fontSize:14,color:"#D1D5DB"}}>{p}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{...s.section, background:"#0A0D11"}}>
        <div style={s.sInner}>
          <p style={s.eyebrow}>What we do</p>
          <h2 style={s.h2}>Intelligence at every layer of your payment stack.</h2>
          <p style={{...s.bodyTxt, marginBottom:56, maxWidth:520}}>From transaction scoring to MID protection, HighRiskIntel covers the full risk surface of your business.</p>
          <div style={s.featGrid}>
            {FEATURES.map((f,i)=>(
              <div key={i} className="ch" style={s.featCard}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                  <span style={{fontSize:22,color:"#2563EB"}}>{f.icon}</span>
                  <span style={s.featNum}>{f.num}</span>
                </div>
                <h3 style={s.featTitle}>{f.title}</h3>
                <p style={s.featDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" style={s.section}>
        <div style={s.sInner}>
          <p style={s.eyebrow}>How it works</p>
          <h2 style={s.h2}>From connection to protection in 48 hours.</h2>
          <div style={s.stepsGrid}>
            {[
              {n:"01",t:"Connect your processor",d:"Link MXMerchant, Stripe, Checkout.com, or your gateway. Setup takes under 5 minutes.",tag:"5 min setup"},
              {n:"02",t:"We sync your transaction data",d:"HighRiskIntel pulls your transaction history and begins building your baseline risk profile within 24 hours.",tag:"24hr baseline"},
              {n:"03",t:"AI scores every transaction",d:"Our risk engine scores 0–100 in real-time using 40+ signals. High-risk transactions trigger immediate alerts.",tag:"Real-time"},
              {n:"04",t:"Alerts hit your dashboard",d:"See every flag with severity level, reason code, and an action advisory — refund, review, or block.",tag:"Instant"},
              {n:"05",t:"Human analysts review",d:"Every 12 hours, our team reviews your risk profile, validates AI flags, and updates your weekly report.",tag:"12hr cycle"},
              {n:"06",t:"You stay protected",d:"Follow the action advisory. Stay ahead of your processor. Keep your MID safe and your ratios in check.",tag:"Ongoing"},
            ].map((st,i)=>(
              <div key={i} className="ch" style={s.step}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
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

      <section id="integrations" style={{...s.section, background:"#0A0D11"}}>
        <div style={s.sInner}>
          <p style={s.eyebrow}>Integrations</p>
          <h2 style={s.h2}>Connects to your existing stack.</h2>
          <p style={{...s.bodyTxt, marginBottom:48, maxWidth:500}}>No switching processors. No new infrastructure. HighRiskIntel plugs into what you already use.</p>
          <div style={s.integGrid}>
            {INTEGRATIONS.map((int,i)=>(
              <div key={i} className="ch" style={s.integCard}>
                <div style={s.integTop}>
                  <div style={s.integIcon}>{int.name[0]}</div>
                  <span style={{...s.integStatus, color: int.status==="Live"?"#10B981":"#F59E0B", background: int.status==="Live"?"rgba(16,185,129,0.1)":"rgba(245,158,11,0.1)", border:`1px solid ${int.status==="Live"?"rgba(16,185,129,0.2)":"rgba(245,158,11,0.2)"}`}}>{int.status}</span>
                </div>
                <p style={s.integName}>{int.name}</p>
                <p style={s.integType}>{int.type}</p>
              </div>
            ))}
            <div className="ch" style={{...s.integCard, border:"1px dashed #1F2937", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:8}}>
              <span style={{fontSize:24,color:"#374151"}}>+</span>
              <p style={{fontSize:13,color:"#4B5563",textAlign:"center"}}>More coming soon</p>
            </div>
          </div>
          <div style={s.apiBox}>
            <div style={s.apiLeft}>
              <p style={s.eyebrow}>API Access</p>
              <h3 style={{fontFamily:"'Epilogue',sans-serif",fontSize:24,fontWeight:800,color:"#F9FAFB",marginBottom:12,letterSpacing:"-0.5px"}}>Built for developers too.</h3>
              <p style={{fontSize:14,color:"#9CA3AF",lineHeight:1.7}}>Use our REST API to score transactions in real-time, pull alerts, and receive webhook events directly in your system.</p>
            </div>
            <div style={s.apiCode}>
              <div style={s.apiCodeBar}><span style={{color:"#4B5563",fontSize:12}}>POST /v1/risk-score</span></div>
              <pre style={s.apiCodeBody}>{`{
  "transaction_id": "TX-88291",
  "amount": 349.00,
  "currency": "USD",
  "card_bin": "424242",
  "country": "US",
  "ip_address": "192.168.1.1"
}

→ Response
{
  "risk_score": 22,
  "action": "approve",
  "signals": ["low_velocity", "known_bin"]
}`}</pre>
            </div>
          </div>
        </div>
      </section>

      <section style={s.section}>
        <div style={s.sInner}>
          <p style={s.eyebrow}>Results</p>
          <h2 style={s.h2}>Merchants who stopped losing money to chargebacks.</h2>
          <div style={s.testiGrid}>
            {TESTIMONIALS.map((t,i)=>(
              <div key={i} className="ch" style={s.testiCard}>
                <div style={s.stars}>{"★★★★★"}</div>
                <p style={s.testiQ}>"{t.quote}"</p>
                <div style={s.testiMeta}>
                  <div style={s.testiAvatar}>{t.name[0]}</div>
                  <div>
                    <p style={{fontSize:13,fontWeight:600,color:"#F9FAFB"}}>{t.name}</p>
                    <p style={{fontSize:12,color:"#6B7280"}}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" style={{...s.section, background:"#0A0D11"}}>
        <div style={s.sInner}>
          <p style={s.eyebrow}>Pricing</p>
          <h2 style={s.h2}>Pay for results.</h2>
          <p style={{...s.bodyTxt, marginBottom:12, maxWidth:500}}>Flat monthly fee covers monitoring, reports, and support. We also charge a 10% performance fee on the value of disputes we prevent.</p>
          <p style={{fontSize:13,color:"#60A5FA",marginBottom:52}}>No setup fees. No contracts. Cancel anytime.</p>
          <div style={s.pricingGrid}>
            {PRICING.map((p,i)=>(
              <div key={i} className="ch" style={{...s.pricingCard,...(p.highlight?s.pricingHL:{})}}>
                {p.highlight && <div style={s.pricingBadge}>Most popular</div>}
                <p style={s.pricingName}>{p.name}</p>
                <div style={{display:"flex",alignItems:"baseline",gap:3,marginBottom:8}}>
                  <span style={s.pricingAmt}>{p.price}</span>
                  <span style={{fontSize:14,color:"#6B7280"}}>{p.period}</span>
                </div>
                <p style={{fontSize:13,color:"#9CA3AF",lineHeight:1.6,marginBottom:20}}>{p.desc}</p>
                <div style={{height:1,background:"#1F2937",marginBottom:20}}/>
                <div style={{display:"flex",flexDirection:"column",gap:10,flex:1}}>
                  {p.features.map((f,j)=>(
                    <div key={j} style={{fontSize:13,color:"#D1D5DB",display:"flex",gap:9,alignItems:"flex-start"}}>
                      <span style={{color:"#10B981",fontWeight:700,flexShrink:0,marginTop:1}}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <button style={{...(p.highlight?s.btnPrimaryFull:s.btnOutlineFull)}} onClick={()=>router.push("/signup")}>{p.cta}</button>
              </div>
            ))}
          </div>
          <div style={s.perfFeeBox}>
            <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
              <span style={{fontSize:28}}>+</span>
              <div>
                <p style={{fontFamily:"'Epilogue',sans-serif",fontWeight:700,fontSize:17,color:"#F9FAFB",marginBottom:6}}>10% Performance Fee</p>
                <p style={{fontSize:14,color:"#9CA3AF",lineHeight:1.7,maxWidth:600}}>On top of your monthly plan, we take 10% of the value of disputes we prevent. No prevention, no fee.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" style={s.section}>
        <div style={s.sInner}>
          <p style={s.eyebrow}>FAQ</p>
          <h2 style={s.h2}>Common questions.</h2>
          <div style={s.faqGrid}>
            {FAQS.map((faq,i)=>(
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      <section style={s.ctaSec}>
        <div style={s.ctaInner}>
          <div style={{...s.pill, marginBottom:28, display:"inline-flex"}}>Built for high-risk. Trusted by serious merchants.</div>
          <h2 style={{fontFamily:"'Epilogue',sans-serif",fontSize:52,fontWeight:800,letterSpacing:"-1.5px",color:"#F9FAFB",marginBottom:20,lineHeight:1.1}}>Your processor is<br />already watching.</h2>
          <p style={{fontSize:18,color:"#9CA3AF",marginBottom:40,maxWidth:480,lineHeight:1.7}}>Start monitoring before they make the first move. Free trial, no card required.</p>
          <div style={{display:"flex",gap:14,justifyContent:"center",marginBottom:28}}>
            <button style={s.btnPrimary} onClick={()=>router.push("/signup")}>Start free trial</button>
            <button style={{...s.btnGhost, color:"#9CA3AF"}} onClick={()=>router.push("/signin")}>Sign in →</button>
          </div>
          <div style={{display:"flex",gap:20,justifyContent:"center"}}>
            {["No setup fees","No contracts","Cancel anytime","Free onboarding"].map(b=>(
              <span key={b} style={{fontSize:13,color:"#4B5563"}}>✓ {b}</span>
            ))}
          </div>
        </div>
      </section>

      <footer style={s.footer}>
        <div style={s.footerTop}>
          <div style={s.footerBrand}>
            <Logo />
            <p style={{fontSize:13,color:"#4B5563",marginTop:12,lineHeight:1.7,maxWidth:260}}>AI-powered risk intelligence for high-risk merchants. Built to protect your MID.</p>
          </div>
          <div style={s.footerCols}>
            {[
              {title:"Product", links:["Overview","Features","Integrations","API Docs","Changelog"]},
              {title:"Company", links:["About","Blog","Careers","Privacy Policy","Terms of Service"]},
              {title:"Support", links:["Help Center","Contact Us","Status Page","Onboarding Guide","Security"]},
            ].map(col=>(
              <div key={col.title} style={s.footerCol}>
                <p style={s.footerColTitle}>{col.title}</p>
                {col.links.map(l=><a key={l} href="#" style={s.footerColLink}>{l}</a>)}
              </div>
            ))}
          </div>
        </div>
        <div style={s.footerBottom}>
          <span style={{fontSize:12,color:"#374151"}}>© 2025 HighRiskIntel. All rights reserved.</span>
          <div style={{display:"flex",gap:20}}>
            {["SOC 2","PCI DSS","GDPR"].map(b=>(
              <span key={b} style={{fontSize:11,color:"#374151",background:"#141820",border:"1px solid #1F2937",padding:"4px 10px",borderRadius:6}}>✓ {b}</span>
            ))}
          </div>
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
  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f=>({...f,[k]:e.target.value}));
  const handle = () => {
    setError("");
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    if (!form.email.includes("@")) { setError("Enter a valid email address."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (mode==="signup" && !form.name) { setError("Enter your business name."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); router.push("/dashboard"); }, 900);
  };
  return (
    <div style={a.root}>
      <style>{css}</style>
      <nav style={a.nav}>
        <div style={{...s.navInner}}>
          <div onClick={()=>router.push("/")} style={{cursor:"pointer"}}><Logo /></div>
          <button style={s.navSignIn} onClick={()=>router.push("/")}>← Back to site</button>
        </div>
      </nav>
      <div style={a.wrap}>
        <div style={a.card}>
          <h2 style={a.h2}>{mode==="signin"?"Welcome back.":"Create your account."}</h2>
          <p style={a.sub}>{mode==="signin"?"Sign in to your dashboard.":"Start protecting your MID today."}</p>
          {error && <div style={a.error}>{error}</div>}
          <div style={a.form}>
            {mode==="signup" && (
              <div style={a.fg}><label style={a.label}>Business name</label>
                <input style={a.input} placeholder="Acme Payments Ltd." value={form.name} onChange={update("name")} onKeyDown={e=>e.key==="Enter"&&handle()}/>
              </div>
            )}
            <div style={a.fg}><label style={a.label}>Email address</label>
              <input style={a.input} type="email" placeholder="you@company.com" value={form.email} onChange={update("email")} onKeyDown={e=>e.key==="Enter"&&handle()}/>
            </div>
            <div style={a.fg}><label style={a.label}>Password</label>
              <input style={a.input} type="password" placeholder="••••••••" value={form.password} onChange={update("password")} onKeyDown={e=>e.key==="Enter"&&handle()}/>
            </div>
            <button style={{...s.btnPrimaryFull,opacity:loading?0.7:1}} onClick={handle} disabled={loading}>
              {loading?"Please wait...":mode==="signin"?"Sign in →":"Create account →"}
            </button>
          </div>
          <p style={a.toggle}>{mode==="signin"?"No account? ":"Already have an account? "}
            <span style={a.toggleLink} onClick={()=>router.push(mode==="signin"?"/signup":"/signin")}>{mode==="signin"?"Sign up":"Sign in"}</span>
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
  const [actionDone, setActionDone] = useState<Record<string,string>>({});
  const [riskFilter, setRiskFilter] = useState("all");
  const user = { name: "Demo Merchant", email: "demo@highriskintel.com" };
  const unread = alerts.filter(a=>!a.read).length;
  const markRead = (id: number) => setAlerts(prev=>prev.map(a=>a.id===id?{...a,read:true}:a));
  const markAllRead = () => setAlerts(prev=>prev.map(a=>({...a,read:true})));
  const doAction = (tx: string, action: string) => setActionDone(prev=>({...prev,[tx]:action}));
  const filteredTxns = TXNS.filter(tx=>{
    const ms = tx.id.toLowerCase().includes(search.toLowerCase())||tx.email.toLowerCase().includes(search.toLowerCase());
    const mr = riskFilter==="all"||(riskFilter==="high"&&tx.risk>=70)||(riskFilter==="med"&&tx.risk>=40&&tx.risk<70)||(riskFilter==="low"&&tx.risk<40);
    return ms && mr;
  });
  const tabs = [
    {id:"overview",label:"Overview",icon:"◈"},
    {id:"transactions",label:"Transactions",icon:"⬡"},
    {id:"risk",label:"Risk Monitor",icon:"⬟"},
    {id:"alerts",label:"Alerts",icon:"◇",badge:unread},
    {id:"settings",label:"Settings",icon:"⚙"},
  ];
  return (
    <div style={d.root}>
      <style>{css}</style>
      <aside style={d.sidebar}>
        <div style={d.sTop}>
          <div style={{marginBottom:36}}><Logo /></div>
          {tabs.map(t=>(
            <button key={t.id} style={{...d.tab,...(tab===t.id?d.tabOn:{})}} onClick={()=>setTab(t.id)}>
              <span style={{fontSize:13,width:18}}>{t.icon}</span><span>{t.label}</span>
              {(t as any).badge>0&&<span style={d.badge}>{(t as any).badge}</span>}
            </button>
          ))}
        </div>
        <div style={d.sBottom}>
          <div style={d.userRow}>
            <div style={d.avatar}>{user.name[0].toUpperCase()}</div>
            <div>
              <p style={{fontSize:13,fontWeight:600,color:"#F9FAFB"}}>{user.name}</p>
              <p style={{fontSize:11,color:"#6B7280"}}>{user.email}</p>
            </div>
          </div>
          <button style={d.signOut} onClick={()=>router.push("/")}>Sign out</button>
        </div>
      </aside>
      <main style={d.main}>
        <div style={d.topBar}>
          <div><h1 style={d.pageTitle}>{tabs.find(t=>t.id===tab)?.label}</h1><p style={d.pageSub}>Last updated just now</p></div>
          <div style={d.liveChip}><span className="pdot" style={{marginRight:6}}/>Live monitoring</div>
        </div>
        {tab==="overview"&&(
          <div>
            <div style={d.grid4}>
              {[{label:"Total Volume",val:"$284,920",sub:"↑ 12% this week",c:"#60A5FA"},{label:"Chargeback Rate",val:"1.84%",sub:"↓ 0.3% vs last week",c:"#10B981"},{label:"Risk Score",val:"62",sub:"Moderate risk",c:"#F59E0B"},{label:"Active Alerts",val:"7",sub:"2 critical",c:"#EF4444"}].map((c,i)=>(
                <div key={i} className="ch" style={d.card}><p style={d.cardLbl}>{c.label}</p><p style={{...d.cardVal,color:c.c}}>{c.val}</p><p style={d.cardSub}>{c.sub}</p></div>
              ))}
            </div>
            <div style={d.grid4}>
              {[{label:"Transactions Today",val:"438"},{label:"Refunds Issued",val:"12"},{label:"Processor Risk",val:"Moderate"},{label:"Dispute Probability",val:"14.2%"}].map((c,i)=>(
                <div key={i} style={d.flatCard}><span style={d.flatLbl}>{c.label}</span><span style={d.flatVal}>{c.val}</span></div>
              ))}
            </div>
            <div style={{...d.card,marginTop:14,padding:"20px 24px"}}>
              <p style={d.cardLbl}>Recent Activity</p>
              {ALERTS_DATA.slice(0,3).map((al,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<2?"1px solid #1F2937":"none"}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:ac(al.type),flexShrink:0}}/><span style={{fontSize:13,color:"#D1D5DB",flex:1}}>{al.msg}</span><span style={{fontSize:11,color:"#6B7280"}}>{al.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab==="transactions"&&(
          <div style={d.tableWrap}>
            <div style={d.tableTop}>
              <input style={d.search} placeholder="Search ID or email..." value={search} onChange={e=>setSearch(e.target.value)}/>
              <div style={{display:"flex",gap:8}}>
                {["all","high","med","low"].map(f=>(
                  <button key={f} style={{...d.filterBtn,...(riskFilter===f?d.filterOn:{})}} onClick={()=>setRiskFilter(f)}>
                    {f==="all"?"All":f==="high"?"High":f==="med"?"Medium":"Low"}
                  </button>
                ))}
              </div>
            </div>
            <table style={d.table}><thead><tr>{["Transaction","Email","Amount","Country","BIN","Risk","Processor","Status"].map(h=><th key={h} style={d.th}>{h}</th>)}</tr></thead>
              <tbody>{filteredTxns.map((tx,i)=>(
                <tr key={i} className="tr-hover">
                  <td style={d.td}><code style={d.code}>{tx.id}</code></td><td style={d.td}>{tx.email}</td>
                  <td style={d.td}><strong style={{color:"#F9FAFB"}}>{tx.amount}</strong></td><td style={d.td}>{tx.country}</td>
                  <td style={d.td}><code style={d.code}>{tx.bin}</code></td>
                  <td style={d.td}><span style={d.pill(rc(tx.risk))}>{tx.risk}</span></td>
                  <td style={d.td}>{tx.processor}</td><td style={d.td}><span style={d.pill(sc(tx.status))}>{tx.status}</span></td>
                </tr>
              ))}{filteredTxns.length===0&&<tr><td colSpan={8} style={{...d.td,textAlign:"center",padding:32,color:"#6B7280"}}>No results.</td></tr>}</tbody>
            </table>
          </div>
        )}
        {tab==="risk"&&(
          <div>
            <div style={d.grid4}>{[{label:"High Risk Transactions",val:"4",c:"#EF4444"},{label:"BIN Mismatch Activity",val:"12",c:"#F59E0B"},{label:"Chargeback Probability",val:"14.2%",c:"#F59E0B"},{label:"Suspicious Patterns",val:"3",c:"#EF4444"}].map((c,i)=>(
              <div key={i} style={d.card}><p style={d.cardLbl}>{c.label}</p><p style={{...d.cardVal,color:c.c}}>{c.val}</p></div>
            ))}</div>
            <div style={d.tableWrap}><table style={d.table}><thead><tr>{["Transaction","Risk Score","Reason","Suggested Action"].map(h=><th key={h} style={d.th}>{h}</th>)}</tr></thead>
              <tbody>{RISK_ITEMS.map((r,i)=>(
                <tr key={i} className="tr-hover">
                  <td style={d.td}><code style={d.code}>{r.tx}</code></td>
                  <td style={d.td}><span style={d.pill(rc(r.score))}>{r.score}</span></td>
                  <td style={d.td}>{r.reason}</td>
                  <td style={d.td}>{actionDone[r.tx]?(<span style={{fontSize:12,color:"#10B981",fontWeight:600}}>✓ {actionDone[r.tx]} applied</span>):(
                    <div style={{display:"flex",gap:6}}>{["Refund","Block","Review"].map(act=>(
                      <button key={act} style={{...d.actionBtn,...(r.action===act?d.actionBtnHL:{})}} onClick={()=>doAction(r.tx,act)}>{act}</button>
                    ))}</div>
                  )}</td>
                </tr>
              ))}</tbody>
            </table></div>
          </div>
        )}
        {tab==="alerts"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <p style={{fontSize:13,color:"#6B7280"}}>{unread} unread alert{unread!==1?"s":""}</p>
              {unread>0&&<button style={d.markAllBtn} onClick={markAllRead}>Mark all read</button>}
            </div>
            {alerts.map(al=>(
              <div key={al.id} className="ch" style={{...d.alertRow,...(!al.read?d.alertUnread:{})}} onClick={()=>markRead(al.id)}>
                <div style={{...d.alertStripe,background:ac(al.type)}}/>
                <div style={{flex:1,padding:"14px 18px"}}>
                  <p style={{fontSize:14,color:al.read?"#9CA3AF":"#F9FAFB",marginBottom:4}}>{al.msg}</p>
                  <p style={{fontSize:11,color:"#4B5563"}}>{al.time}</p>
                </div>
                <span style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",padding:"3px 10px",borderRadius:100,background:ac(al.type)+"20",color:ac(al.type),margin:"0 16px",whiteSpace:"nowrap"}}>{al.type}</span>
                {!al.read&&<span style={{width:8,height:8,borderRadius:"50%",background:"#2563EB",marginRight:16,flexShrink:0}}/>}
              </div>
            ))}
          </div>
        )}
        {tab==="settings"&&(
          <div style={{display:"flex",flexDirection:"column",gap:20,maxWidth:600}}>
            <div style={d.settingsCard}><h3 style={d.settingsTitle}>Account Information</h3>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {[{l:"Business Name",v:user.name},{l:"Email Address",v:user.email},{l:"Plan",v:"Professional"}].map(f=>(
                  <div key={f.l} style={{display:"flex",flexDirection:"column",gap:6}}>
                    <label style={{fontSize:12,fontWeight:600,color:"#6B7280",textTransform:"uppercase",letterSpacing:"0.5px"}}>{f.l}</label>
                    <input style={d.settingsInput} defaultValue={f.v} readOnly={f.l==="Plan"}/>
                  </div>
                ))}
                <button style={{...s.btnPrimary,alignSelf:"flex-start"}}>Save changes</button>
              </div>
            </div>
            <div style={d.settingsCard}><h3 style={d.settingsTitle}>Notifications</h3>
              {[{l:"Critical alerts",sub:"MID risk, high chargeback probability"},{l:"Weekly reports",sub:"Delivered every Monday"},{l:"EDR notifications",sub:"Real-time dispute alerts"}].map((n,i)=>(
                <ToggleRow key={i} label={n.l} sub={n.sub} defaultOn={true}/>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
