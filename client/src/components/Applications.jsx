const apps = [
  { label: 'Residential', icon: '🏠', title: 'Housing & Apartments', desc: 'Column, beam & slab reinforcement for villas and multi-storey apartments.' },
  { label: 'Commercial', icon: '🏢', title: 'Offices & Malls', desc: 'High-strength reinforcement for commercial complexes, IT parks, and shopping centres.' },
  { label: 'Industrial', icon: '🏭', title: 'Factories & Warehouses', desc: 'Heavy-duty structural steel for manufacturing plants and logistics hubs.' },
  { label: 'Infrastructure', icon: '🌉', title: 'Bridges & Roads', desc: 'Precision-engineered stirrups for bridges, flyovers, and culverts.' },
  { label: 'Real Estate', icon: '🏘️', title: 'Townships & Layouts', desc: 'Bulk supply solutions for large-scale developers building integrated townships.' },
  { label: 'Government', icon: '🏛️', title: 'Public Projects', desc: 'Reliable supply for government housing schemes and civic infrastructure.' },
];

export default function Applications() {
  return (
    <section id="applications">
      <div className="section-label">Where We Build</div>
      <h2>Industries & <span className="accent">Applications</span></h2>
      <p className="section-sub">From small residential projects to mega infrastructure, Styron TSM steel reinforces every dream.</p>
      <div className="apps-grid">
        {apps.map((a) => (
          <div className="app-card" key={a.title}>
            <div className="app-label">{a.label}</div>
            <h3>{a.icon} {a.title}</h3>
            <p>{a.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
