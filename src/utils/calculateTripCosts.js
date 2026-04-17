import { clampMin } from "./sanitizeInputs";

export function calculateTripCosts({
  days,
  shortTrips,
  mediumTrips,
  longTrips,
  surgeTrips,
  rentalDailyRate,
  mpg,
  gasPrice,
  parkingNeeded,
  parkingDailyRate,
  eventParkingNeeded,
  parkingPerStopRate,
  paidParkingStops,
  selectedLocation,
  estimatedFeeRate = 1.0,
}) {
  const safeDays = clampMin(days, 0, 0);
  const safeShortTrips = clampMin(shortTrips, 0, 0);
  const safeMediumTrips = clampMin(mediumTrips, 0, 0);
  const safeLongTrips = clampMin(longTrips, 0, 0);
  const safeSurgeTripsInput = clampMin(surgeTrips, 0, 0);

  const safeRentalDailyRate = clampMin(rentalDailyRate, 0, 0);
  const safeMpg = clampMin(mpg, 1, 1);
  const safeGasPrice = clampMin(gasPrice, 0, 0);
  const safeParkingDailyRate = clampMin(parkingDailyRate, 0, 0);
  const safeParkingPerStopRate = clampMin(parkingPerStopRate, 0, 0);
  const safePaidParkingStopsInput = clampMin(paidParkingStops, 0, 0);
  const safeEstimatedFeeRate = clampMin(estimatedFeeRate, 0, 0);

  const shortTripDistance = 3;
  const shortTripDuration = 10;

  const mediumTripDistance = 7;
  const mediumTripDuration = 18;

  const longTripDistance = 15;
  const longTripDuration = 30;

  const totalTrips = safeShortTrips + safeMediumTrips + safeLongTrips;

  const safeSurgeTrips = Math.min(safeSurgeTripsInput, totalTrips);
  const safePaidParkingStops = Math.min(safePaidParkingStopsInput, totalTrips);

  const shortMpg = safeMpg * 0.75;
  const mediumMpg = safeMpg;
  const longMpg = safeMpg * 1.15;

  const shortMiles = safeShortTrips * shortTripDistance;
  const mediumMiles = safeMediumTrips * mediumTripDistance;
  const longMiles = safeLongTrips * longTripDistance;

  const totalMiles = shortMiles + mediumMiles + longMiles;

  const gallonsUsed =
    shortMiles / shortMpg +
    mediumMiles / mediumMpg +
    longMiles / longMpg;

  const gasCost = gallonsUsed * safeGasPrice;

  const totalMinutes =
    safeShortTrips * shortTripDuration +
    safeMediumTrips * mediumTripDuration +
    safeLongTrips * longTripDuration;

  const avgTripDistance = totalTrips > 0 ? totalMiles / totalTrips : 0;
  const avgTripDuration = totalTrips > 0 ? totalMinutes / totalTrips : 0;

  const rentalSubtotal = safeDays * safeRentalDailyRate;
  const parkingCost = parkingNeeded ? safeParkingDailyRate * safeDays : 0;
  const eventParkingCost = eventParkingNeeded
    ? safeParkingPerStopRate * safePaidParkingStops
    : 0;
  const estimatedFees = rentalSubtotal * safeEstimatedFeeRate;

  const rideshareBaseFare = selectedLocation?.baseFare ?? 0;
  const rideshareCostPerMile = selectedLocation?.costPerMile ?? 0;
  const rideshareCostPerMinute = selectedLocation?.costPerMinute ?? 0;
  const rideshareServiceFee = selectedLocation?.serviceFee ?? 0;

  const getTripCost = (distance, duration) =>
    rideshareBaseFare +
    distance * rideshareCostPerMile +
    duration * rideshareCostPerMinute +
    rideshareServiceFee;

  const shortTripCost = getTripCost(shortTripDistance, shortTripDuration);
  const mediumTripCost = getTripCost(mediumTripDistance, mediumTripDuration);
  const longTripCost = getTripCost(longTripDistance, longTripDuration);

  const shortTripTotal = safeShortTrips * shortTripCost;
  const mediumTripTotal = safeMediumTrips * mediumTripCost;
  const longTripTotal = safeLongTrips * longTripCost;

  const normalTripTotal = shortTripTotal + mediumTripTotal + longTripTotal;

  const surgeMultiplier = 1.5;
  const surgeShare = totalTrips > 0 ? safeSurgeTrips / totalTrips : 0;
  const surgeUpcharge = normalTripTotal * surgeShare * (surgeMultiplier - 1);

  const rideshareTotal = normalTripTotal + surgeUpcharge;

  const rentalTotal =
    rentalSubtotal +
    estimatedFees +
    gasCost +
    parkingCost +
    eventParkingCost;

  const rideshareCostPerTrip = totalTrips > 0 ? rideshareTotal / totalTrips : 0;
  const normalTripCost = totalTrips > 0 ? normalTripTotal / totalTrips : 0;

  const difference = Math.abs(rentalTotal - rideshareTotal);
  const rentalWins = rentalTotal < rideshareTotal;
  const rideshareWins = rideshareTotal < rentalTotal;
  const isTie = rentalTotal.toFixed(2) === rideshareTotal.toFixed(2);

  return {
    shortTrips: safeShortTrips,
    mediumTrips: safeMediumTrips,
    longTrips: safeLongTrips,
    totalTrips,
    surgeTrips: safeSurgeTrips,
    paidParkingStops: safePaidParkingStops,
    surgeShare,

    shortTripCost,
    mediumTripCost,
    longTripCost,

    shortTripTotal,
    mediumTripTotal,
    longTripTotal,
    normalTripTotal,
    surgeUpcharge,

    tripDistance: avgTripDistance,
    tripDuration: avgTripDuration,
    milesDriven: totalMiles,
    gasCost,
    rentalSubtotal,
    estimatedFees,
    parkingCost,
    eventParkingCost,
    rentalTotal,
    normalTripCost,
    rideshareCostPerTrip,
    rideshareTotal,
    weightedSurgeMultiplier: 1 + surgeShare * (surgeMultiplier - 1),

    difference,
    rentalWins,
    rideshareWins,
    isTie,
  };
}