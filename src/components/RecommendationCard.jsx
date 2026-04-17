function RecommendationCard({
  rentalWins,
  rideshareWins,
  isTie,
  difference,
}) {
  let badgeClass = "badge gray";
  let summaryClass = "summary gray";
  let badgeText = "Close call";
  let title = "Either works";
  let savings = "Costs are nearly the same";
  let message =
    "Verify before booking since small price changes could flip the cheaper option.";

  if (rentalWins) {
    badgeClass = "badge green";
    summaryClass = "summary green";
    badgeText = "Rental is cheaper";
    title = "Rent the car";
    savings = `Save about $${difference.toFixed(0)} over your trip`;
  }

  if (rideshareWins) {
    badgeClass = "badge blue";
    summaryClass = "summary blue";
    badgeText = "Rideshare is cheaper";
    title = "Use rideshare";
    savings = `Save about $${difference.toFixed(0)} over your trip`;
  }

  if (isTie) {
    badgeClass = "badge gray";
    summaryClass = "summary gray";
    badgeText = "Close call";
    title = "Either works";
    savings = "Costs are nearly the same";
    message =
      "Verify before booking since parking, surge, or route changes could swing the result.";
  }

  return (
    <section className="card">
      <div className={badgeClass}>{badgeText}</div>

      <div className={summaryClass}>
        <div className="summary-label">Recommendation</div>
        <div className="summary-title">{title}</div>
        <div className="summary-savings">{savings}</div>
        <div className="summary-text">{message}</div>
      </div>
    </section>
  );
}

export default RecommendationCard;