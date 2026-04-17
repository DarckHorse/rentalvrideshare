function RecommendationCard({
  rentalWins,
  rideshareWins,
  isTie,
  difference,
}) {
  let badgeClass = "badge gray";
  let summaryClass = "summary gray";
  let badgeText = "Close call";
  let title = "Recommendation";
  let message = "Both options are about the same cost.";

  if (rentalWins) {
    badgeClass = "badge green";
    summaryClass = "summary green";
    badgeText = "Rental comes out cheaper";
    title = "Rent the car";
    message = `The cheaper option saves about $${difference.toFixed(2)} over the trip.`;
  }

  if (rideshareWins) {
    badgeClass = "badge blue";
    summaryClass = "summary blue";
    badgeText = "Rideshare comes out cheaper";
    title = "Use rideshare";
    message = `The cheaper option saves about $${difference.toFixed(2)} over the trip.`;
  }

  if (isTie) {
    message = "Both options land at nearly the same total cost.";
  }

  return (
    <section className="card">
      <div className={badgeClass}>{badgeText}</div>
      <div className={summaryClass}>
        <div className="summary-label">Recommendation</div>
        <div className="summary-title">{title}</div>
        <div className="summary-text">{message}</div>
      </div>
    </section>
  );
}

export default RecommendationCard;