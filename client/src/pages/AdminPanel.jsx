import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─── DESIGN TOKENS (matching Styron TSM site) ───────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

  :root {
    --steel: #F8FAFC;
    --steel-mid: #EDF1F5;
    --gold: #EA580C;
    --gold-light: #FB7C3C;
    --silver: #475569;
    --white: #FFFFFF;
    --bg: #F1F5F9;
    --card: #FFFFFF;
    --green: #16a34a;
    --red: #dc2626;
    --red-soft: rgba(220,38,38,0.08);
    --gold-soft: rgba(234,88,12,0.08);
    --green-soft: rgba(22,163,74,0.08);
    --blue: #2563eb;
    --blue-soft: rgba(37,99,235,0.08);
    --text: #111827;
    --text-light: #6B7280;
    --border: rgba(0,0,0,0.08);
    --radius: 12px;
    --shadow: 0 2px 12px rgba(0,0,0,0.07);
    --sidebar-w: 240px;
  }

  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',sans-serif; background:var(--bg); color:var(--text); min-height:100vh; }

  /* ── LAYOUT ── */
  .admin-shell { display:flex; min-height:100vh; }

  /* ── SIDEBAR ── */
  .sidebar {
    width: var(--sidebar-w); background: #1F2937;
    border-right: 1px solid rgba(0,0,0,0.12);
    display:flex; flex-direction:column; position:fixed; top:0; left:0; height:100vh;
    overflow-y:auto; z-index:50; transition:.3s;
  }
  .sidebar-logo {
    padding:1.5rem 1.25rem 1rem;
    border-bottom:1px solid rgba(234,88,12,0.25);
  }
  .sidebar-logo h1 {
    font-family:'Barlow Condensed',sans-serif; font-size:1.35rem; font-weight:800;
    color:var(--gold); letter-spacing:2px;
  }
  .sidebar-logo span { color:#fff; }
  .sidebar-logo p { font-size:.7rem; color:#9CA3AF; margin-top:.2rem; text-transform:uppercase; letter-spacing:1px; }

  .sidebar-section { padding:.75rem 0 .25rem; }
  .sidebar-section-label {
    font-size:.65rem; color:#9CA3AF; text-transform:uppercase;
    letter-spacing:2px; padding:.25rem 1.25rem .5rem; opacity:.7;
  }
  .nav-item {
    display:flex; align-items:center; gap:.75rem;
    padding:.65rem 1.25rem; cursor:pointer; transition:.2s;
    font-size:.875rem; color:#9CA3AF; border-left:3px solid transparent;
    position:relative;
  }
  .nav-item:hover { color:#fff; background:rgba(234,88,12,0.08); }
  .nav-item.active { color:var(--gold); border-left-color:var(--gold); background:rgba(234,88,12,0.12); font-weight:600; }
  .nav-item .icon { font-size:1rem; width:18px; text-align:center; }
  .nav-badge {
    margin-left:auto; background:var(--red); color:#fff;
    font-size:.6rem; font-weight:700; padding:.15rem .45rem;
    border-radius:20px; min-width:18px; text-align:center;
  }
  .nav-badge.gold { background:var(--gold); color:#fff; }

  .sidebar-footer {
    margin-top:auto; padding:1rem 1.25rem;
    border-top:1px solid rgba(255,255,255,0.08);
  }
  .admin-avatar {
    display:flex; align-items:center; gap:.75rem;
  }
  .avatar-circle {
    width:34px; height:34px; border-radius:50%;
    background:linear-gradient(135deg,var(--gold),var(--gold-light));
    display:flex; align-items:center; justify-content:center;
    font-weight:700; font-size:.8rem; color:#fff; flex-shrink:0;
  }
  .avatar-info p { font-size:.8rem; font-weight:600; color:#fff; }
  .avatar-info span { font-size:.7rem; color:#9CA3AF; }

  /* ── MAIN ── */
  .main-content {
    margin-left:var(--sidebar-w); flex:1; display:flex; flex-direction:column; min-height:100vh;
  }

  .topbar {
 
    background:rgba(255,255,255,0.97); backdrop-filter:blur(12px);
    border-bottom:1px solid var(--border);
    padding:.9rem 2rem; display:flex; align-items:center;
    justify-content:space-between; position:sticky; top:0; z-index:40;
    box-shadow: 0 1px 0 rgba(0,0,0,0.05);
  }
  .topbar-left h2 { font-family:'Barlow Condensed',sans-serif; font-size:1.4rem; font-weight:800; color:var(--text); }
  .topbar-left p { font-size:.75rem; color:var(--silver); margin-top:.1rem; }
  .topbar-right { display:flex; align-items:center; gap:1rem; }
  .topbar-pill {
    background:var(--green-soft); border:1px solid rgba(22,163,74,0.25);
    color:var(--green); padding:.35rem .85rem; border-radius:20px;
    font-size:.72rem; font-weight:600; display:flex; align-items:center; gap:.4rem;
  }
  .topbar-pill::before { content:'●'; font-size:.5rem; }
  .icon-btn {
    width:36px; height:36px; border-radius:8px; background:var(--steel);
    border:1px solid var(--border); display:flex; align-items:center;
    justify-content:center; cursor:pointer; font-size:1rem; transition:.2s;
  }
  .icon-btn:hover { border-color:var(--gold); color:var(--gold); }

  .page-body { padding:2rem; flex:1; }

  /* ── STAT CARDS ── */
  .stats-row { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:1rem; margin-bottom:2rem; }
  .stat-card {
    background:var(--card); border:1px solid var(--border);
    border-radius:var(--radius); padding:1.25rem 1.5rem;
    position:relative; overflow:hidden; transition:.2s;
    box-shadow: var(--shadow);
  }
  .stat-card:hover { border-color:rgba(234,88,12,0.25); transform:translateY(-1px); box-shadow:0 4px 20px rgba(0,0,0,0.1); }
  .stat-card::before {
    content:''; position:absolute; right:-20px; top:-20px;
    width:80px; height:80px; border-radius:50%; opacity:.07;
  }
  .stat-card.gold::before { background:var(--gold); }
  .stat-card.green::before { background:var(--green); }
  .stat-card.blue::before { background:var(--blue); }
  .stat-card.red::before { background:var(--red); }
  .stat-label { font-size:.72rem; color:var(--silver); text-transform:uppercase; letter-spacing:1px; margin-bottom:.5rem; }
  .stat-value { font-family:'Barlow Condensed',sans-serif; font-size:2rem; font-weight:800; }
  .stat-card.gold .stat-value { color:var(--gold); }
  .stat-card.green .stat-value { color:var(--green); }
  .stat-card.blue .stat-value { color:var(--blue); }
  .stat-card.red .stat-value { color:var(--red); }
  .stat-change { font-size:.72rem; margin-top:.4rem; }
  .stat-change.up { color:var(--green); }
  .stat-change.down { color:var(--red); }
  .stat-icon { position:absolute; right:1.25rem; top:1.25rem; font-size:1.5rem; opacity:.3; }

  /* ── GRID ── */
  .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem; }
  .grid-3 { display:grid; grid-template-columns:2fr 1fr; gap:1.5rem; margin-bottom:1.5rem; }

  /* ── PANEL / CARD ── */
  .panel {
    background:var(--card); border:1px solid var(--border);
    border-radius:var(--radius); overflow:hidden;
    box-shadow: var(--shadow);
  }
  .panel-head {
    padding:1rem 1.5rem; border-bottom:1px solid var(--border);
    display:flex; align-items:center; justify-content:space-between;
    background: var(--card);
  }
  .panel-head h3 { font-size:.95rem; font-weight:700; color:var(--text); }
  .panel-head span { font-size:.72rem; color:var(--silver); }
  .panel-body { padding:1.25rem 1.5rem; }

  /* ── TABLE ── */
  .data-table { width:100%; border-collapse:collapse; }
  .data-table th {
    font-size:.68rem; color:var(--silver); text-transform:uppercase;
    letter-spacing:1px; padding:.65rem 1rem; text-align:left;
    border-bottom:1px solid var(--border); font-weight:600;
    background: #F9FAFB;
  }
  .data-table td {
    padding:.75rem 1rem; font-size:.82rem; border-bottom:1px solid var(--border); color:var(--text);
  }
  .data-table tr:last-child td { border-bottom:none; }
  .data-table tr:hover td { background:rgba(234,88,12,0.03); }

  /* ── BADGES ── */
  .badge {
    display:inline-block; padding:.2rem .6rem; border-radius:20px;
    font-size:.67rem; font-weight:700; letter-spacing:.3px;
  }
  .badge-green { background:var(--green-soft); color:var(--green); border:1px solid rgba(22,163,74,0.2); }
  .badge-gold { background:var(--gold-soft); color:var(--gold); border:1px solid rgba(234,88,12,0.2); }
  .badge-red { background:var(--red-soft); color:var(--red); border:1px solid rgba(220,38,38,0.2); }
  .badge-blue { background:var(--blue-soft); color:var(--blue); border:1px solid rgba(37,99,235,0.2); }
  .badge-silver { background:rgba(71,85,105,0.08); color:var(--silver); border:1px solid rgba(71,85,105,0.15); }

  /* ── BUTTONS ── */
  .btn { padding:.5rem 1.1rem; border-radius:7px; font-size:.8rem; font-weight:600; cursor:pointer; transition:.2s; border:none; font-family:inherit; }
  .btn-gold { background:var(--gold); color:#fff; }
  .btn-gold:hover { background:var(--gold-light); }
  .btn-outline { background:transparent; color:var(--gold); border:1px solid var(--gold); }
  .btn-outline:hover { background:var(--gold-soft); }
  .btn-ghost { background:var(--steel); color:var(--silver); border:1px solid var(--border); }
  .btn-ghost:hover { background:var(--steel-mid); color:var(--text); }
  .btn-danger { background:var(--red-soft); color:var(--red); border:1px solid rgba(220,38,38,0.2); }
  .btn-danger:hover { background:rgba(220,38,38,0.15); }
  .btn-sm { padding:.32rem .75rem; font-size:.73rem; }

  /* ── FORM ── */
  .form-group { margin-bottom:1.1rem; }
  .form-label { font-size:.75rem; color:var(--silver); margin-bottom:.4rem; display:block; font-weight:500; }
  .form-input, .form-select, .form-textarea {
    width:100%; background:var(--steel);
    border:1px solid var(--border); border-radius:7px;
    padding:.6rem .9rem; color:var(--text); font-size:.83rem; font-family:inherit;
    transition:.2s; outline:none;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    border-color:var(--gold); background:#fff; box-shadow:0 0 0 3px rgba(234,88,12,0.08);
  }
  .form-select { appearance:none; cursor:pointer; }
  .form-textarea { resize:vertical; min-height:80px; }
  .form-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }

  /* ── ACTIVITY ── */
  .activity-item { display:flex; gap:.85rem; padding:.75rem 0; border-bottom:1px solid var(--border); align-items:flex-start; }
  .activity-item:last-child { border-bottom:none; }
  .activity-dot { width:8px; height:8px; border-radius:50%; margin-top:.3rem; flex-shrink:0; }
  .activity-dot.gold { background:var(--gold); }
  .activity-dot.green { background:var(--green); }
  .activity-dot.blue { background:var(--blue); }
  .activity-dot.red { background:var(--red); }
  .activity-text { font-size:.8rem; line-height:1.5; color:var(--silver); }
  .activity-text strong { color:var(--text); }
  .activity-time { font-size:.68rem; color:var(--text-light); margin-top:.15rem; }

  /* ── CHART BARS ── */
  .chart-bar-row { display:flex; align-items:center; gap:.75rem; margin-bottom:.75rem; }
  .chart-bar-label { font-size:.75rem; color:var(--silver); width:110px; flex-shrink:0; }
  .chart-bar-track { flex:1; height:7px; background:var(--steel-mid); border-radius:99px; overflow:hidden; }
  .chart-bar-fill { height:100%; border-radius:99px; transition:width .6s ease; }
  .chart-bar-val { font-size:.73rem; color:var(--gold); width:45px; text-align:right; font-weight:600; }

  /* ── DONUT ── */
  .donut-wrap { display:flex; align-items:center; gap:2rem; }
  .donut-svg { flex-shrink:0; }
  .donut-legend { flex:1; }
  .donut-leg-item { display:flex; align-items:center; gap:.6rem; margin-bottom:.6rem; font-size:.78rem; color:var(--silver); }
  .donut-leg-dot { width:10px; height:10px; border-radius:3px; flex-shrink:0; }

  /* ── SEARCH / FILTER ── */
  .filter-bar { display:flex; gap:.75rem; margin-bottom:1.25rem; flex-wrap:wrap; align-items:center; }
  .search-input-wrap { position:relative; flex:1; min-width:180px; }
  .search-input-wrap span { position:absolute; left:.75rem; top:50%; transform:translateY(-50%); opacity:.4; font-size:.9rem; }
  .search-input { background:var(--card); border:1px solid var(--border); border-radius:7px; padding:.55rem .75rem .55rem 2.25rem; color:var(--text); font-size:.82rem; font-family:inherit; outline:none; width:100%; box-shadow:var(--shadow); }
  .search-input:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(234,88,12,0.08); }

  /* ── KPI ── */
  .kpi-ring { display:flex; flex-direction:column; align-items:center; gap:.4rem; }
  .kpi-val { font-family:'Barlow Condensed',sans-serif; font-size:1.6rem; font-weight:800; color:var(--gold); }
  .kpi-lbl { font-size:.68rem; color:var(--silver); text-align:center; text-transform:uppercase; letter-spacing:.5px; }

  /* ── PRODUCT ROW ── */
  .product-row { display:flex; align-items:center; gap:1rem; padding:.85rem 0; border-bottom:1px solid var(--border); }
  .product-row:last-child { border-bottom:none; }
  .product-icon-box { width:40px; height:40px; background:var(--steel-mid); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0; }
  .product-info { flex:1; min-width:0; }
  .product-info p { font-size:.85rem; font-weight:600; color:var(--text); }
  .product-info span { font-size:.72rem; color:var(--silver); }
  .product-price-input { width:90px; background:var(--steel); border:1px solid var(--border); border-radius:6px; padding:.4rem .6rem; color:var(--gold); font-size:.82rem; font-family:'Barlow Condensed',sans-serif; font-weight:700; text-align:right; outline:none; }
  .product-price-input:focus { border-color:var(--gold); }

  /* ── TABS ── */
  .tabs { display:flex; gap:.25rem; background:var(--steel-mid); border-radius:8px; padding:.25rem; margin-bottom:1.5rem; }
  .tab { flex:1; padding:.5rem 1rem; border-radius:6px; font-size:.8rem; font-weight:600; cursor:pointer; transition:.2s; text-align:center; color:var(--silver); border:none; background:transparent; font-family:inherit; }
  .tab.active { background:var(--card); color:var(--gold); box-shadow:0 1px 4px rgba(0,0,0,0.08); }

  /* ── QUOTE CARD ── */
  .quote-card { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:1.1rem 1.25rem; margin-bottom:.75rem; position:relative; box-shadow:var(--shadow); }
  .quote-card:hover { border-color:rgba(234,88,12,0.3); }
  .quote-card-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:.6rem; }
  .quote-card-body { font-size:.8rem; color:var(--silver); line-height:1.5; }
  .quote-card-footer { margin-top:.8rem; display:flex; gap:.6rem; }

  /* ── MESSAGE CARD ── */
  .msg-card { display:flex; gap:.85rem; padding:.9rem 0; border-bottom:1px solid var(--border); }
  .msg-card:last-child { border-bottom:none; }
  .msg-avatar { width:36px; height:36px; border-radius:50%; background:var(--gold-soft); border:1.5px solid rgba(234,88,12,0.25); display:flex; align-items:center; justify-content:center; font-size:.8rem; font-weight:700; flex-shrink:0; color:var(--gold); }
  .msg-body { flex:1; }
  .msg-name { font-size:.82rem; font-weight:600; color:var(--text); }
  .msg-preview { font-size:.77rem; color:var(--silver); margin-top:.2rem; line-height:1.4; }
  .msg-meta { font-size:.68rem; color:var(--text-light); margin-top:.2rem; }

  /* ── MODAL ── */
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.4); z-index:200; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); }
  .modal-box { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); width:90%; max-width:500px; max-height:90vh; overflow-y:auto; box-shadow:0 24px 64px rgba(0,0,0,0.15); }
  .modal-head { padding:1.25rem 1.5rem; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; }
  .modal-head h3 { font-size:1rem; font-weight:700; color:var(--text); }
  .modal-body { padding:1.5rem; }
  .modal-foot { padding:1rem 1.5rem; border-top:1px solid var(--border); display:flex; gap:.75rem; justify-content:flex-end; }
  .modal-body label { display:flex; flex-direction:column; gap:.35rem; font-size:.78rem; font-weight:600; color:var(--text-light); }
  .modal-body input, .modal-body textarea { font-family:inherit; font-size:.85rem; padding:.55rem .7rem; border:1px solid var(--border); border-radius:8px; background:var(--steel); color:var(--text); }
  .modal-body input:focus, .modal-body textarea:focus { outline:none; border-color:var(--gold); } ;


  /* ── TOAST ── */
  .toast { position:fixed; bottom:2rem; right:2rem; background:var(--green); color:#fff; padding:.75rem 1.25rem; border-radius:8px; font-size:.82rem; font-weight:600; z-index:9999; box-shadow:0 8px 24px rgba(22,163,74,0.25); animation:slideUp .3s ease; }
  @keyframes slideUp { from { transform:translateY(20px); opacity:0; } to { transform:translateY(0); opacity:1; } }

  /* ── SETTINGS ── */
  .settings-section { margin-bottom:2rem; }
  .settings-section h3 { font-size:.95rem; font-weight:700; margin-bottom:1rem; color:var(--gold); border-bottom:2px solid rgba(234,88,12,0.15); padding-bottom:.6rem; }
  .toggle-row { display:flex; align-items:center; justify-content:space-between; padding:.75rem 0; border-bottom:1px solid var(--border); }
  .toggle-row:last-child { border-bottom:none; }
  .toggle-info p { font-size:.83rem; font-weight:500; color:var(--text); }
  .toggle-info span { font-size:.73rem; color:var(--silver); }
  .toggle { width:40px; height:22px; border-radius:11px; position:relative; cursor:pointer; transition:.2s; flex-shrink:0; }
  .toggle.on { background:var(--gold); }
  .toggle.off { background:#D1D5DB; }
  .toggle-thumb { position:absolute; width:18px; height:18px; border-radius:50%; background:#fff; top:2px; transition:.2s; box-shadow:0 1px 3px rgba(0,0,0,0.2); }
  .toggle.on .toggle-thumb { left:20px; }
  .toggle.off .toggle-thumb { left:2px; }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width:5px; height:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(234,88,12,0.2); border-radius:99px; }

  /* ── EMPTY STATE ── */
  .empty { text-align:center; padding:3rem 1rem; color:var(--silver); }
  .empty .empty-icon { font-size:2.5rem; margin-bottom:1rem; opacity:.4; }
  .empty p { font-size:.85rem; }

  /* ── SPARKLINE ── */
  .sparkline { display:flex; align-items:flex-end; gap:3px; height:36px; }
  .spark-bar { flex:1; border-radius:3px 3px 0 0; min-width:6px; }

  /* ── RESPONSIVE ── */
  @media (max-width:900px) {
    .grid-2, .grid-3 { grid-template-columns:1fr; }
    .stats-row { grid-template-columns:repeat(2,1fr); }
  }
  @media (max-width:600px) {
    :root { --sidebar-w: 0px; }
    .sidebar { transform:translateX(-100%); }
    .stats-row { grid-template-columns:1fr; }
  }

`

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const ORDERS = [
  { id: "ORD-2024", customer: "Rajesh Constructions", product: "TSM Steel Stirrups", qty: 50, total: 425000, status: "Delivered", date: "27 Jun 2026", city: "Pune" },
  { id: "ORD-2023", customer: "Shri Builders Pvt Ltd", product: "Custom Bent Stirrups", qty: 30, total: 294000, status: "Processing", date: "27 Jun 2026", city: "Mumbai" },
  { id: "ORD-2022", customer: "Agarwal Steel Works", product: "Bulk Steel Supply", qty: 200, total: 1440000, status: "Shipped", date: "26 Jun 2026", city: "Nashik" },
  { id: "ORD-2021", customer: "Meera Infrastructure", product: "Square / Ring Stirrups", qty: 45, total: 355500, status: "Pending", date: "26 Jun 2026", city: "Solapur" },
  { id: "ORD-2020", customer: "Patil Constructions", product: "TSM Steel Stirrups", qty: 80, total: 680000, status: "Delivered", date: "25 Jun 2026", city: "Aurangabad" },
  { id: "ORD-2019", customer: "Krishna Infra", product: "Custom Bent Stirrups", qty: 20, total: 196000, status: "Cancelled", date: "24 Jun 2026", city: "Kolhapur" },
];

const QUOTES = [
  { id: "QT-089", name: "Suresh Patel", company: "SP Infratech", product: "Custom Bent Stirrups", qty: "100 quintal", phone: "+91 98765 43210", date: "27 Jun", status: "New" },
  { id: "QT-088", name: "Anita Sharma", company: "Sharma Builders", product: "Bulk Steel Supply", qty: "500 quintal", phone: "+91 87654 32109", date: "27 Jun", status: "Contacted" },
  { id: "QT-087", name: "Vikram Singh", company: "VS Construction", product: "TSM Steel Stirrups", qty: "200 quintal", phone: "+91 76543 21098", date: "26 Jun", status: "Quoted" },
  { id: "QT-086", name: "Priya Nair", company: "Nair Infra Pvt Ltd", product: "Square / Ring Stirrups", qty: "75 quintal", phone: "+91 65432 10987", date: "25 Jun", status: "Won" },
];

const MESSAGES = [
  { id: 1, name: "Rajesh Kumar", initials: "RK", subject: "Custom stirrup specifications", preview: "I need 135° hooks with 8mm diameter for columns. Can you provide samples?", time: "2h ago", read: false },
  { id: 2, name: "Meena Patel", initials: "MP", subject: "Bulk order inquiry", preview: "We are planning a 500MT order for our upcoming housing project in Pune...", time: "5h ago", read: false },
  { id: 3, name: "Arun Sharma", initials: "AS", subject: "Invoice correction", preview: "The GST number on invoice ORD-2019 seems incorrect. Please re-issue.", time: "1d ago", read: true },
  { id: 4, name: "Suresh Nair", initials: "SN", subject: "Delivery schedule", preview: "When can we expect delivery for order ORD-2022? Site is ready.", time: "2d ago", read: true },
];

const ACTIVITY = [
  { color: "green", text: <><strong>New order</strong> from Rajesh Constructions — ₹4.25L</>, time: "5 min ago" },
  { color: "gold", text: <><strong>Quote request</strong> QT-089 from Suresh Patel</>, time: "22 min ago" },
  { color: "blue", text: <><strong>Order ORD-2022</strong> dispatched to Nashik</>, time: "1h ago" },
  { color: "red", text: <><strong>Order ORD-2019</strong> cancelled by Krishna Infra</>, time: "3h ago" },
  { color: "green", text: <><strong>Payment received</strong> for ORD-2020 — ₹6.80L</>, time: "5h ago" },
  { color: "gold", text: <><strong>Stock alert:</strong> Custom Bent Stirrups below 100 quintal</>, time: "8h ago" },
];

const SALES_DATA = [
  { label: "TSM Stirrups", value: 42, color: "var(--gold)" },
  { label: "Bulk Steel", value: 28, color: "var(--blue)" },
  { label: "Custom Bent", value: 20, color: "#a78bfa" },
  { label: "Square / Ring", value: 10, color: "var(--green)" },
];

const MONTHLY = [65, 48, 72, 55, 89, 78, 95, 82, 110, 98, 88, 120];

// ─── STATUS COLOR MAP ─────────────────────────────────────────────────────────
const statusBadge = (s) => {
  const map = { Delivered: "badge-green", Processing: "badge-blue", Shipped: "badge-gold", Pending: "badge-silver", Cancelled: "badge-red", New: "badge-blue", Contacted: "badge-gold", Quoted: "badge-silver", Won: "badge-green" };
  return map[s] || "badge-silver";
};

// ─── MINI COMPONENTS ─────────────────────────────────────────────────────────
const DonutChart = ({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  let offset = 0;
  const r = 42, cx = 54, cy = 54, circ = 2 * Math.PI * r;
  const segments = data.map((d) => {
    const dash = (d.value / total) * circ;
    const gap = circ - dash;
    const seg = { ...d, dash, gap, offset };
    offset += dash;
    return seg;
  });
  return (
    <div className="donut-wrap">
      <svg width="108" height="108" className="donut-svg">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
        {segments.map((s, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth="14"
            strokeDasharray={`${s.dash} ${s.gap}`} strokeDashoffset={-s.offset + circ * 0.25}
            style={{ transition: ".6s ease" }} />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" fill="var(--text)" fontSize="16" fontWeight="800" fontFamily="'Barlow Condensed',sans-serif">100%</text>
        <text x={cx} y={cy + 13} textAnchor="middle" fill="var(--text-light)" fontSize="9">Share</text>
      </svg>
      <div className="donut-legend">
        {data.map((d, i) => (
          <div key={i} className="donut-leg-item">
            <div className="donut-leg-dot" style={{ background: d.color }} />
            <span style={{ color: "var(--silver)", flex: 1 }}>{d.label}</span>
            <strong style={{ color: d.color }}>{d.value}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

const Sparkline = () => (
  <div className="sparkline">
    {MONTHLY.map((v, i) => (
      <div key={i} className="spark-bar" style={{ height: `${(v / 120) * 36}px`, background: i === 11 ? "var(--gold)" : "rgba(212,160,23,0.25)" }} />
    ))}
  </div>
);

const Toggle = ({ value, onChange }) => (
  <div className={`toggle ${value ? "on" : "off"}`} onClick={() => onChange(!value)}>
    <div className="toggle-thumb" />
  </div>
);

// ─── PAGES ────────────────────────────────────────────────────────────────────

// DASHBOARD
function Dashboard() {
  return (
    <>
      <div className="stats-row">
        {[
          { label: "Total Revenue", value: "₹28.4L", change: "↑ 18.3% vs last month", cls: "gold", icon: "💰" },
          { label: "Active Orders", value: "14", change: "↑ 3 since yesterday", cls: "blue", icon: "📦" },
          { label: "Quote Requests", value: "9", change: "↑ 4 new today", cls: "green", icon: "📋" },
          { label: "Pending Delivery", value: "6", change: "↓ 2 shipped today", cls: "red", icon: "🚛" },
        ].map((s) => (
          <div key={s.label} className={`stat-card ${s.cls}`}>
            <span className="stat-icon">{s.icon}</span>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className={`stat-change ${s.change.startsWith("↑") ? "up" : "down"}`}>{s.change}</div>
          </div>
        ))}
      </div>

      <div className="grid-3">
        <div className="panel">
          <div className="panel-head">
            <h3>Monthly Revenue</h3>
            <Sparkline />
          </div>
          <div className="panel-body">
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "2.2rem", fontWeight: 800, color: "var(--gold)" }}>₹28,40,000</div>
              <div style={{ fontSize: ".75rem", color: "var(--silver)", marginTop: ".2rem" }}>June 2026 · 18.3% growth over May</div>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              {[
                { label: "Week 1", v: 58 }, { label: "Week 2", v: 72 },
                { label: "Week 3", v: 84 }, { label: "Week 4", v: 91 },
              ].map(({ label, v }) => (
                <div key={label} className="chart-bar-row">
                  <span className="chart-bar-label">{label}</span>
                  <div className="chart-bar-track"><div className="chart-bar-fill" style={{ width: `${v}%`, background: "linear-gradient(90deg,var(--gold),var(--gold-light))" }} /></div>
                  <span className="chart-bar-val">{v}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head"><h3>Product Mix</h3><span>By revenue</span></div>
          <div className="panel-body">
            <DonutChart data={SALES_DATA} />
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head"><h3>Recent Orders</h3><span style={{ color: "var(--gold)", cursor: "pointer", fontSize: ".78rem", fontWeight: 600 }}>See all →</span></div>
          <div className="panel-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {ORDERS.slice(0, 5).map((o) => (
                  <tr key={o.id}>
                    <td style={{ color: "var(--gold)", fontWeight: 600 }}>{o.id}</td>
                    <td>{o.customer}</td>
                    <td style={{ fontWeight: 600 }}>₹{(o.total / 100000).toFixed(1)}L</td>
                    <td><span className={`badge ${statusBadge(o.status)}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head"><h3>Activity Feed</h3><span>Live</span></div>
          <div className="panel-body">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="activity-item">
                <div className={`activity-dot ${a.color}`} />
                <div>
                  <div className="activity-text">{a.text}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ORDERS
function Orders() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Delivered", "Processing", "Shipped", "Pending", "Cancelled"];
  const filtered = ORDERS.filter(o =>
    (filter === "All" || o.status === filter) &&
    (o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search))
  );
  return (
    <>
      <div className="filter-bar">
        <div className="search-input-wrap">
          <span>🔍</span>
          <input className="search-input" placeholder="Search orders, customers…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: "auto" }} value={filter} onChange={e => setFilter(e.target.value)}>
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
        <button className="btn btn-gold">+ New Order</button>
      </div>
      <div className="panel">
        <table className="data-table">
          <thead>
            <tr><th>Order ID</th><th>Customer</th><th>City</th><th>Product</th><th>Qty</th><th>Total</th><th>Date</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td style={{ color: "var(--gold)", fontWeight: 700 }}>{o.id}</td>
                <td style={{ fontWeight: 600 }}>{o.customer}</td>
                <td style={{ color: "var(--silver)" }}>{o.city}</td>
                <td style={{ fontSize: ".78rem", color: "var(--silver)" }}>{o.product}</td>
                <td>{o.qty}q</td>
                <td style={{ fontWeight: 700 }}>₹{o.total.toLocaleString("en-IN")}</td>
                <td style={{ color: "var(--silver)", fontSize: ".78rem" }}>{o.date}</td>
                <td><span className={`badge ${statusBadge(o.status)}`}>{o.status}</span></td>
                <td>
                  <div style={{ display: "flex", gap: ".4rem" }}>
                    <button className="btn btn-ghost btn-sm">Edit</button>
                    <button className="btn btn-outline btn-sm">Invoice</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty"><div className="empty-icon">📦</div><p>No orders found</p></div>}
      </div>
    </>
  );
}

// PRODUCTS
function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [original, setOriginal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { text, ok }
  const [showAdd, setShowAdd] = useState(false);
  const token = () => localStorage.getItem('admin_token');
  
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (!res.ok) throw new Error();
      loadProducts();
      setToast({ text: '✅ Product deleted', ok: true });
    } catch {
      setToast({ text: '❌ Failed to delete product', ok: false });
    } finally {
      setTimeout(() => setToast(null), 2500);
    }
  };

  const loadProducts = () => {
    setLoading(true);
    // ?all=true so the admin also sees inactive/disabled products
    fetch('/api/products?all=true')
      .then(res => res.json())
      .then(data => {
        const withId = data.map(p => ({ ...p, id: p.slug }));
        setProducts(withId);
        setOriginal(withId);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadProducts(); }, []);

  const handleField = (id, key, val) => setProducts(ps => ps.map(p => p.id === id ? { ...p, [key]: +val } : p));

 // Only sends a PUT request for products whose price or stock actually changed
  const handleSave = async () => {
    setSaving(true);
    const changed = products.filter(p => {
      const before = original.find(o => o.id === p.id);
      return before && (before.price !== p.price || before.stock !== p.stock);
    });

    try {
      await Promise.all(changed.map(p =>
        fetch(`/api/products/${p.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token()}`,
          },
        body: JSON.stringify({ price: p.price, stock: p.stock }),
        }).then(res => {
          if (!res.ok) throw new Error();
        })
      ));
      setOriginal(products);
      setToast({ text: `✅ ${changed.length || 'No'} product${changed.length === 1 ? '' : 's'} saved successfully!`, ok: true });
    } catch {
      setToast({ text: '❌ Failed to save some changes. Please try again.', ok: false }); 
    }finally {
      setSaving(false);
      setTimeout(() => setToast(null), 2500);
    }
  };

  const handleReset = () => setProducts(original);

  if (loading) {
    return <div className="panel"><div className="panel-body">Loading products…</div></div>;
  }

  return (
    <>
      {toast && <div className="toast">{toast.text}</div>}
      <div className="grid-2">
        <div className="panel">
          <div className="panel-head"><h3>Product Catalogue</h3><button className="btn btn-gold btn-sm" onClick={() => setShowAdd(true)}>+ Add Product</button></div>
          <div className="panel-body">
            {products.map(p => (
              <div key={p.id} className="product-row">
                <div className="product-icon-box">
                  {p.image ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} /> : p.icon}
                </div>
                <div className="product-info">
                  <p>{p.title}</p>
                  <span>{p.sku}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: ".3rem" }}>
                  <span style={{ color: "var(--silver)", fontSize: ".7rem" }}>Stock</span>
                  <input className="product-price-input" type="number" style={{ width: '70px' }} value={p.stock} onChange={e => handleField(p.id, 'stock', e.target.value)} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                  <span style={{ color: "var(--silver)", fontSize: ".75rem" }}>₹</span>
                  <input className="product-price-input" type="number" value={p.price} onChange={e => handleField(p.id, 'price', e.target.value)} />
                </div>
                <span className={`badge ${p.active ? "badge-green" : "badge-red"}`} style={{ marginLeft: ".5rem" }}>{p.active ? "Active" : "Off"}</span>
                <button className="btn btn-ghost btn-sm" style={{ marginLeft: ".5rem" }} onClick={() => handleDelete(p.id)}>Delete</button>
              </div>
            ))}
            <div style={{ marginTop: "1.25rem", display: "flex", gap: ".75rem" }}>
              <button className="btn btn-gold" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button className="btn btn-ghost" onClick={handleReset}>Reset</button>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="panel">
            <div className="panel-head"><h3>Stock Levels</h3><span>quintal</span></div>
            <div className="panel-body">
              {products.map(p => (
                <div key={p.id} className="chart-bar-row">
                  <span className="chart-bar-label" style={{ fontSize: ".72rem" }}>{p.title.split(" ").slice(0, 2).join(" ")}</span>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill" style={{ width: `${(p.stock / 500) * 100}%`, background: p.stock < 100 ? "var(--red)" : "linear-gradient(90deg,var(--gold),var(--gold-light))" }} />
                  </div>
                  <span className="chart-bar-val">{p.stock}q</span>
                </div>
              ))}
            </div>
          </div>
<div className="panel">
            <div className="panel-head"><h3>Top Selling</h3><span>June 2026</span></div>
            <div className="panel-body">
              <DonutChart data={SALES_DATA} />
            </div>
          </div>
        </div>
      </div>


      {showAdd && (
        <AddProductModal
          onClose={() => setShowAdd(false)}
          onCreated={() => {
            setShowAdd(false);
            loadProducts();
            setToast({ text: '✅ Product added', ok: true });
            setTimeout(() => setToast(null), 2500);
          }}
        />
      )}
    </>
  );
}

// ─── ADD PRODUCT MODAL ──────────────────────────────────────────────────────
function AddProductModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    slug: '', sku: '', title: '', category: 'Stirrups', grade: 'Fe 500',
    desc: '', price: '', stock: '', unit: 'per quintal (100 kg)', badge: '',
  });
  const [image, setImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleTitleChange = (v) => {
    setForm(f => ({
      ...f,
      title: v,
      slug: f.slug === slugify(f.title) ? slugify(v) : f.slug,
    }));
  };

  const handleImageFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.slug || !form.sku || !form.price || !form.stock) {
      setError('Title, slug, SKU, price, and stock are required.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify({
          ...form,
          price: +form.price,
          stock: +form.stock,
          badge: form.badge || null,
          image,
          icon: '⬡',
          tags: [],
          active: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create product');
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-head"><h3>Add Product</h3><button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button></div>
        <form onSubmit={handleSubmit} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
          {error && <div className="toast" style={{ position: 'static' }}>❌ {error}</div>}

          <label>Product Image
            <input type="file" accept="image/*" onChange={e => handleImageFile(e.target.files[0])} />
          </label>
          {image && <img src={image} alt="preview" style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '8px' }} />}

          <label>Title
            <input required value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="e.g. TSM Steel Stirrups" />
          </label>

          <label>Slug (unique URL id)
            <input required value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="e.g. tsm-stirrups" />
          </label>

          <label>SKU (unique)
            <input required value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="e.g. TSM-005" />
          </label>

          <div style={{ display: 'flex', gap: '.75rem' }}>
            <label style={{ flex: 1 }}>Price (₹)
              <input required type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} />
            </label>
            <label style={{ flex: 1 }}>Stock (quintal)
              <input required type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} />
            </label>
          </div>

          <div style={{ display: 'flex', gap: '.75rem' }}>
            <label style={{ flex: 1 }}>Category
              <input value={form.category} onChange={e => set('category', e.target.value)} />
            </label>
            <label style={{ flex: 1 }}>Grade
              <input value={form.grade} onChange={e => set('grade', e.target.value)} />
            </label>
          </div>

          <label>Description
            <textarea rows={3} value={form.desc} onChange={e => set('desc', e.target.value)} />
          </label>

          <label>Badge (optional, e.g. "Best Seller")
            <input value={form.badge} onChange={e => set('badge', e.target.value)} />
          </label>

          <div style={{ display: 'flex', gap: '.75rem', marginTop: '.5rem' }}>
            <button type="submit" className="btn btn-gold" disabled={saving}>{saving ? 'Adding…' : 'Add Product'}</button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function slugify(str) {
  return (str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// QUOTES
function QuotesPage() {
  const [tab, setTab] = useState("New");
  const tabs = ["New", "Contacted", "Quoted", "Won"];
  const filtered = QUOTES.filter(q => q.status === tab);
  return (
    <>
      <div className="tabs">
        {tabs.map(t => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t} {QUOTES.filter(q => q.status === t).length > 0 && <span className={`nav-badge ${t === "New" ? "gold" : ""}`} style={{ marginLeft: ".4rem", position: "static" }}>{QUOTES.filter(q => q.status === t).length}</span>}
          </button>
        ))}
      </div>
      {filtered.length === 0 && <div className="empty"><div className="empty-icon">📋</div><p>No {tab.toLowerCase()} quotes</p></div>}
      {filtered.map(q => (
        <div key={q.id} className="quote-card">
          <div className="quote-card-head">
            <div>
              <strong style={{ color: "var(--gold)" }}>{q.id}</strong>
              <span style={{ marginLeft: ".75rem", fontSize: ".78rem", color: "var(--silver)" }}>{q.date}</span>
            </div>
            <span className={`badge ${statusBadge(q.status)}`}>{q.status}</span>
          </div>
          <div className="quote-card-body">
            <div style={{ marginBottom: ".35rem" }}>
              <strong style={{ color:"var(--text)" }}>{q.name}</strong>
              {q.company && <span> · {q.company}</span>}
            </div>
            <div>Product: <span style={{ color:"var(--text)" }}>{q.product}</span> · Qty: <span style={{ color:"var(--text)" }}>{q.qty}</span></div>
            <div style={{ marginTop: ".3rem" }}>📞 {q.phone}</div>
          </div>
          <div className="quote-card-footer">
            <button className="btn btn-gold btn-sm">Send Quote</button>
            <button className="btn btn-ghost btn-sm">📞 Call</button>
            <button className="btn btn-ghost btn-sm">💬 WhatsApp</button>
            <button className="btn btn-danger btn-sm" style={{ marginLeft: "auto" }}>Discard</button>
          </div>
        </div>
      ))}
    </>
  );
}

// MESSAGES
function MessagesPage() {
  const [selected, setSelected] = useState(null);
  return (
    <div className="grid-2">
      <div className="panel">
        <div className="panel-head">
          <h3>Inbox</h3>
          <span className="badge badge-blue">{MESSAGES.filter(m => !m.read).length} unread</span>
        </div>
        <div className="panel-body" style={{ padding: "0 1.5rem" }}>
          {MESSAGES.map(m => (
            <div key={m.id} className="msg-card" style={{ cursor: "pointer", opacity: m.read ? .7 : 1 }} onClick={() => setSelected(m)}>
              <div className="msg-avatar">{m.initials}</div>
              <div className="msg-body">
                <div className="msg-name">{m.name} {!m.read && <span className="badge badge-blue" style={{ marginLeft: ".4rem" }}>New</span>}</div>
                <div className="msg-preview"><strong style={{ color:"var(--text)" }}>{m.subject}</strong><br />{m.preview}</div>
                <div className="msg-meta">{m.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        {selected ? (
          <>
            <div className="panel-head">
              <div>
                <h3>{selected.subject}</h3>
                <span>{selected.name} · {selected.time}</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="panel-body">
              <div style={{ background: "var(--steel)", border: "1px solid var(--border)", borderRadius: "8px", padding: "1rem", marginBottom: "1.25rem", fontSize: ".85rem", lineHeight: "1.7", color: "var(--text)" }}>
                {selected.preview} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Regarding the order specifications for your project.
              </div>
              <div className="form-group">
                <label className="form-label">Reply</label>
                <textarea className="form-textarea" placeholder="Type your reply…" rows={4} />
              </div>
              <div style={{ display: "flex", gap: ".75rem" }}>
                <button className="btn btn-gold">Send Reply</button>
                <button className="btn btn-ghost">💬 WhatsApp</button>
              </div>
            </div>
          </>
        ) : (
          <div className="empty" style={{ paddingTop: "5rem" }}>
            <div className="empty-icon">✉️</div>
            <p>Select a message to read</p>
          </div>
        )}
      </div>
    </div>
  );
}

// CUSTOMERS
function CustomersPage() {
  const customers = [
    { name: "Rajesh Constructions", city: "Pune", orders: 12, spend: "₹48.5L", type: "Enterprise", since: "2023" },
    { name: "Agarwal Steel Works", city: "Nashik", orders: 8, spend: "₹31.2L", type: "Business", since: "2024" },
    { name: "Shri Builders Pvt Ltd", city: "Mumbai", orders: 5, spend: "₹18.8L", type: "Business", since: "2024" },
    { name: "Meera Infrastructure", city: "Solapur", orders: 3, spend: "₹9.1L", type: "Regular", since: "2025" },
    { name: "Patil Constructions", city: "Aurangabad", orders: 6, spend: "₹22.4L", type: "Business", since: "2024" },
    { name: "Krishna Infra", city: "Kolhapur", orders: 2, spend: "₹4.5L", type: "Regular", since: "2025" },
  ];
  return (
    <>
      <div className="filter-bar">
        <div className="search-input-wrap">
          <span>🔍</span>
          <input className="search-input" placeholder="Search customers…" />
        </div>
        <button className="btn btn-gold">+ Add Customer</button>
      </div>
      <div className="panel">
        <table className="data-table">
          <thead><tr><th>Customer</th><th>City</th><th>Type</th><th>Orders</th><th>Total Spend</th><th>Since</th><th></th></tr></thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td style={{ color: "var(--silver)" }}>{c.city}</td>
                <td><span className={`badge ${c.type === "Enterprise" ? "badge-gold" : c.type === "Business" ? "badge-blue" : "badge-silver"}`}>{c.type}</span></td>
                <td>{c.orders}</td>
                <td style={{ fontWeight: 700, color: "var(--gold)" }}>{c.spend}</td>
                <td style={{ color: "var(--silver)" }}>{c.since}</td>
                <td><button className="btn btn-ghost btn-sm">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// SETTINGS
function SettingsPage() {
  const [toggles, setToggles] = useState({
    whatsapp: true, emailNotif: true, aiChat: true, razorpay: false,
    autoReply: false, stockAlerts: true, orderNotif: true, sms: false,
  });
  const [toast, setToast] = useState(false);
  const tog = (k) => setToggles(t => ({ ...t, [k]: !t[k] }));
  const save = () => { setToast(true); setTimeout(() => setToast(false), 2500); };

  return (
    <>
      {toast && <div className="toast">✅ Settings saved!</div>}
      <div className="grid-2">
        <div>
          <div className="panel" style={{ marginBottom: "1.5rem" }}>
            <div className="panel-body">
              <div className="settings-section">
                <h3>Company Info</h3>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Company Name</label><input className="form-input" defaultValue="STYRON TSM Steel" /></div>
                  <div className="form-group"><label className="form-label">GST Number</label><input className="form-input" defaultValue="27XXXXX0000X1ZX" /></div>
                </div>
                <div className="form-group"><label className="form-label">Address</label><input className="form-input" defaultValue="Pune, Maharashtra, India" /></div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Phone</label><input className="form-input" defaultValue="+91 98XXX XXXXX" /></div>
                  <div className="form-group"><label className="form-label">Email</label><input className="form-input" defaultValue="info@styrontsm.com" /></div>
                </div>
              </div>
              <div className="settings-section">
                <h3>Pricing</h3>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">GST Rate (%)</label><input className="form-input" type="number" defaultValue="18" /></div>
                  <div className="form-group"><label className="form-label">Delivery Charge (₹)</label><input className="form-input" type="number" defaultValue="1500" /></div>
                </div>
              </div>
              <button className="btn btn-gold" onClick={save}>Save Changes</button>
            </div>
          </div>
        </div>

        <div>
          <div className="panel" style={{ marginBottom: "1.5rem" }}>
            <div className="panel-head"><h3>Integrations & Features</h3></div>
            <div className="panel-body">
              {[
                { key: "whatsapp", label: "WhatsApp Button", desc: "Floating WhatsApp chat widget on site" },
                { key: "aiChat", label: "AI Chat Assistant", desc: "Claude-powered customer support bot" },
                { key: "razorpay", label: "Razorpay Payments", desc: "Accept online payments at checkout" },
                { key: "autoReply", label: "Auto Reply (Quote)", desc: "Auto-send acknowledgement on new quotes" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="toggle-row">
                  <div className="toggle-info"><p>{label}</p><span>{desc}</span></div>
                  <Toggle value={toggles[key]} onChange={() => tog(key)} />
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-head"><h3>Notifications</h3></div>
            <div className="panel-body">
              {[
                { key: "emailNotif", label: "Email Notifications", desc: "Orders, quotes, messages" },
                { key: "sms", label: "SMS Alerts", desc: "Critical order updates via SMS" },
                { key: "stockAlerts", label: "Stock Alerts", desc: "Alert when stock falls below threshold" },
                { key: "orderNotif", label: "Order Updates", desc: "Status change notifications" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="toggle-row">
                  <div className="toggle-info"><p>{label}</p><span>{desc}</span></div>
                  <Toggle value={toggles[key]} onChange={() => tog(key)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── NAV CONFIG ───────────────────────────────────────────────────────────────
const NAV = [
  {
    section: "Main", items: [
      { id: "dashboard", icon: "📊", label: "Dashboard" },
      { id: "orders", icon: "📦", label: "Orders", badge: "14" },
      { id: "products", icon: "⬡", label: "Products" },
    ]
  },
  {
    section: "Sales", items: [
      { id: "quotes", icon: "📋", label: "Quote Requests", badge: "4", badgeColor: "gold" },
      { id: "customers", icon: "🏗️", label: "Customers" },
      { id: "messages", icon: "✉️", label: "Messages", badge: "2" },
    ]
  },
  {
    section: "Config", items: [
      { id: "settings", icon: "⚙️", label: "Settings" },
    ]
  },
];

const PAGE_TITLES = {
  dashboard: { title: "Dashboard", sub: "Welcome back, Admin · June 2026" },
  orders: { title: "Orders", sub: "Manage and track all customer orders" },
  products: { title: "Products", sub: "Manage catalogue, prices, and stock" },
  quotes: { title: "Quote Requests", sub: "Respond to customer enquiries" },
  customers: { title: "Customers", sub: "View and manage client accounts" },
  messages: { title: "Messages", sub: "Customer enquiries and correspondence" },
  settings: { title: "Settings", sub: "Company info, integrations, notifications" },
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [page, setPage] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authed');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    navigate('/');
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard />;
      case "orders": return <Orders />;
      case "products": return <ProductsPage />;
      case "quotes": return <QuotesPage />;
      case "customers": return <CustomersPage />;
      case "messages": return <MessagesPage />;
      case "settings": return <SettingsPage />;
      default: return <Dashboard />;
    }
  };

  const pt = PAGE_TITLES[page];

  return (
    <>
      <style>{CSS}</style>
      <div className="admin-shell">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <h1>STYRON<span>™</span> TSM</h1>
            <p>Admin Panel</p>
          </div>
          {NAV.map(({ section, items }) => (
            <div key={section} className="sidebar-section">
              <div className="sidebar-section-label">{section}</div>
              {items.map(({ id, icon, label, badge, badgeColor }) => (
                <div key={id} className={`nav-item ${page === id ? "active" : ""}`} onClick={() => setPage(id)}>
                  <span className="icon">{icon}</span>
                  {label}
                  {badge && <span className={`nav-badge ${badgeColor || ""}`}>{badge}</span>}
                </div>
              ))}
            </div>
          ))}
          <div className="sidebar-footer">
            <div className="admin-avatar">
              <div className="avatar-circle">AD</div>
              <div className="avatar-info">
                <p>Admin</p>
                <span>info@styrontsm.com</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main-content">
          <div className="topbar">
            <div className="topbar-left">
              <h2>{pt.title}</h2>
              <p>{pt.sub}</p>
            </div>
            <div className="topbar-right">
              <div className="topbar-pill">Live</div>
              <div className="icon-btn" title="Notifications">🔔</div>
              <div className="icon-btn" title="Refresh">🔄</div>
              <button onClick={handleLogout} title="Sign Out & Back to Website" style={{
                background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)',
                color: '#dc2626', borderRadius: 8, padding: '.4rem .85rem',
                fontSize: '.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: '.35rem',
              }}>
                🚪 Sign Out
              </button>
            </div>
          </div>
          <div className="page-body">
            {renderPage()}
          </div>
        </main>
      </div>
    </>
  );
}
