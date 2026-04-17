import "./styles/app.css";
import { marketData } from "./data/marketData";
import { vehicleCategories } from "./data/tripConfig";
import { formatCurrency } from "./utils/formatters";
import { useTripCalculator } from "./hooks/useTripCalculator";
import PageShell from "./components/PageShell";
import SectionCard from "./components/SectionCard";
import InputField from "./components/InputField";
import SelectField from "./components/SelectField";
import CheckboxField from "./components/CheckboxField";
import RecommendationCard from "./components/RecommendationCard";
import SummaryCard from "./components/SummaryCard";
import EstimateCard from "./components/EstimateCard";
import { SeoContent } from "./SeoContent";

function App() {
  const { state, setters, selectedLocation, calculations } =
    useTripCalculator();

  const locationOptions = marketData.map((market) => ({
    value: market.city,
    label: market.city,
  }));

  const bodyStyleOptions = Object.entries(vehicleCategories).map(
    ([value, config]) => ({
      value,
      label: config.label,
    })
  );

  const totalTrips = calculations.totalTrips;
  const surgeTrips = Math.min(Number(state.surgeTrips || 0), totalTrips);

  return (
    <PageShell
      title="Rental vs Rideshare Calculator"
      subtitle="Estimate whether renting a car or using rideshare is cheaper for a trip based on trip volume, ride mix, location pricing, gas, and parking."
      footerNote=""
    >
      <div className="main-grid">
        <div className="left-column">
          <SectionCard title="Trip Details">
            <div className="field-row field-row--narrow">
              <SelectField
                label="Location"
                value={state.selectedLocation}
                onChange={(e) => setters.setSelectedLocation(e.target.value)}
                options={locationOptions}
                helpText="Choose the city pricing profile used for rideshare and rental estimates"
              />
            </div>

            <div className="two-col">
              <InputField
                label="Short Trips"
                value={state.shortTrips}
                onChange={(e) => setters.setShortTrips(e.target.value)}
                min="0"
                helpText="About 3 miles each"
              />
              <InputField
                label="Medium Trips"
                value={state.mediumTrips}
                onChange={(e) => setters.setMediumTrips(e.target.value)}
                min="0"
                helpText="About 7 miles each"
              />
            </div>

            <div className="field-row">
              <InputField
                label="Long Trips"
                value={state.longTrips}
                onChange={(e) => setters.setLongTrips(e.target.value)}
                min="0"
                helpText="About 15 miles each"
              />
            </div>

            <div className="field slider-field">
              <label className="field-label">Trips During Peak Pricing</label>
              <input
                className="input slider-input"
                type="range"
                min="0"
                max={totalTrips}
                step="1"
                value={surgeTrips}
                onChange={(e) => setters.setSurgeTrips(e.target.value)}
                disabled={!totalTrips}
              />

              <div className="slider-meta">
                <span>
                  {surgeTrips} of {totalTrips} trips
                </span>
              </div>

              <span className="help-text">
                Estimate how many total rides happen during busy times when prices are higher.
              </span>
            </div>
          </SectionCard>

          <SectionCard title="Rental Inputs">
            <div className="two-col">
              <InputField
                label="Rental Days"
                value={state.days}
                onChange={(e) => setters.setDays(e.target.value)}
                min="1"
                helpText="Number of days you'll have the rental car"
              />

              <SelectField
                label="Body Style"
                value={state.bodyStyle}
                onChange={(e) => setters.setBodyStyle(e.target.value)}
                options={bodyStyleOptions}
                helpText="Vehicle type determines rental cost and fuel efficiency"
              />
            </div>

            <div className="two-col">
              <CheckboxField
                label="Overnight Parking Needed"
                checked={state.parkingNeeded}
                onChange={(e) => setters.setParkingNeeded(e.target.checked)}
              />

              <CheckboxField
                label="Event / Meal Parking Needed"
                checked={state.eventParkingNeeded}
                onChange={(e) => setters.setEventParkingNeeded(e.target.checked)}
              />
            </div>

            {state.parkingNeeded && (
              <InputField
                label="Overnight Parking Daily Rate ($)"
                value={state.parkingDailyRate}
                onChange={(e) => setters.setParkingDailyRate(e.target.value)}
                min="0"
                step="0.01"
                helpText="Use this for hotel or overnight parking charged per day."
              />
            )}

            {state.eventParkingNeeded && (
              <div className="two-col">
                <InputField
                  label="Paid Parking Stops"
                  value={state.paidParkingStops}
                  onChange={(e) => setters.setPaidParkingStops(e.target.value)}
                  min="0"
                  step="1"
                  helpText="How many times you’ll park somewhere that charges a fee."
                />

                <InputField
                  label="Parking Cost per Stop ($)"
                  value={state.parkingPerStopRate}
                  onChange={(e) => setters.setParkingPerStopRate(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            )}
          </SectionCard>
        </div>

        <div className="right-column">
          <RecommendationCard
            rentalWins={calculations.rentalWins}
            rideshareWins={calculations.rideshareWins}
            isTie={calculations.isTie}
            difference={calculations.difference}
          />

          {calculations.difference < 125 && (
            <div className="decision-note">
              <div className="decision-note-eyebrow">
                Close call
              </div>

              <div className="decision-note-heading">
                Verify before booking
              </div>

              <div className="decision-note-text">
                Around or less than $100 difference? Check live prices before deciding. And don't forget to account for other stresses.
              </div>

              <div className="decision-note-compare">
                <div className="decision-note-chip">
                  <span className="decision-note-chip-label">Driving</span>
                  <span className="decision-note-chip-text">
                    Parking, navigation, responsibility
                  </span>
                </div>

                <div className="decision-note-chip">
                  <span className="decision-note-chip-label">No car</span>
                  <span className="decision-note-chip-text">
                    Waiting, availability, less flexibility
                  </span>
                </div>
              </div>
            </div>
          )}

          <SummaryCard
            title="Trip Summary"
            rows={[
              { label: "Short trips", value: calculations.shortTrips },
              { label: "Medium trips", value: calculations.mediumTrips },
              { label: "Long trips", value: calculations.longTrips },
              { label: "Total trips", value: calculations.totalTrips },
              {
                label: "Trips during peak pricing",
                value: calculations.surgeTrips,
              },
            ]}
            totalLabel="Total miles driven"
            totalValue={calculations.milesDriven.toFixed(2)}
          />

          <div>
            <EstimateCard
              title="Rental Estimate"
              rows={[
                {
                  label: "Location",
                  value: selectedLocation.city,
                },
                {
                  label: "Body style",
                  value: vehicleCategories[state.bodyStyle]?.label ?? state.bodyStyle,
                },
                {
                  label: "Estimated daily rate",
                  value: formatCurrency(state.rentalDailyRate),
                },
                {
                  label: "Estimated fuel efficiency",
                  value: `${state.mpg} MPG`,
                },
                {
                  label: "Estimated Local gas price",
                  value: `${Number(state.gasPrice).toFixed(2)}/gal`,
                },
                {
                  label: "Rental subtotal",
                  value: formatCurrency(calculations.rentalSubtotal),
                },
                {
                  label: "Estimated fees & taxes",
                  value: formatCurrency(calculations.estimatedFees),
                },
                {
                  label: "Gas cost",
                  value: formatCurrency(calculations.gasCost),
                },
                ...(state.parkingNeeded
                  ? [
                    {
                      label: "Estimated Parking cost",
                      value: formatCurrency(calculations.parkingCost),
                    },
                  ]
                  : []),
                ...(state.eventParkingNeeded
                  ? [
                    {
                      label: "Estimated Event parking cost",
                      value: formatCurrency(calculations.eventParkingCost),
                    },
                  ]
                  : []),
              ]}
              totalLabel="Estimated Rental total"
              totalValue={formatCurrency(calculations.rentalTotal)}
            />

            <p className="footer-note">
              Fees and taxes are estimated at 100% of the base rental cost.
              Actual totals may vary by provider, pickup location, and add-ons.
            </p>
          </div>

          <EstimateCard
            title="Rideshare Estimate"
            rows={[
              {
                label: "Location",
                value: selectedLocation.city,
              },
              {
                label: `Short trips (${calculations.shortTrips} × ${formatCurrency(
                  calculations.shortTripCost
                )})`,
                value: formatCurrency(calculations.shortTripTotal),
              },
              {
                label: `Medium trips (${calculations.mediumTrips} × ${formatCurrency(
                  calculations.mediumTripCost
                )})`,
                value: formatCurrency(calculations.mediumTripTotal),
              },
              {
                label: `Long trips (${calculations.longTrips} × ${formatCurrency(
                  calculations.longTripCost
                )})`,
                value: formatCurrency(calculations.longTripTotal),
              },
              {
                label: "Estimated Peak-pricing uplift",
                value: formatCurrency(calculations.surgeUpcharge),
              },
              {
                label: "Peak trips",
                value: calculations.surgeTrips,
              },
            ]}
            totalLabel="Estimated Rideshare total"
            totalValue={formatCurrency(calculations.rideshareTotal)}
          />
        </div>
      </div>
      <SeoContent />
    </PageShell>
  );
}

export default App;