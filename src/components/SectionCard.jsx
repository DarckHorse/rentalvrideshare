function SectionCard({ title, children }) {
  return (
    <section className="card">
      <h2 className="section-title">{title}</h2>
      <div className="card-content">{children}</div>
    </section>
  );
}

export default SectionCard;