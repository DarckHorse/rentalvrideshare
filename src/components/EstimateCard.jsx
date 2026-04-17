function EstimateCard({ title, rows, totalLabel, totalValue }) {
  return (
    <section className="card">
      <h2 className="section-title">{title}</h2>
      <div className="summary-stack">
        {rows.map((row) => (
          <div className="result-row" key={`${title}-${row.label}`}>
            <span>{row.label}</span>
            <strong>{row.value}</strong>
          </div>
        ))}
        <div className="total-row">
          <span>{totalLabel}</span>
          <span>{totalValue}</span>
        </div>
      </div>
    </section>
  );
}

export default EstimateCard;