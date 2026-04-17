import { useEffect, useMemo, useState } from "react";
import { marketData } from "../data/marketData";
import { vehicleCategories } from "../data/tripConfig";
import { calculateTripCosts } from "../utils/calculateTripCosts";

export function useTripCalculator() {
  // 1) state hooks first, always in the same order
  const [days, setDays] = useState(1);

  const [shortTrips, setShortTrips] = useState(4);
  const [mediumTrips, setMediumTrips] = useState(0);
  const [longTrips, setLongTrips] = useState(2);

  const [selectedLocation, setSelectedLocation] = useState(
    marketData[0]?.city ?? ""
  );

  const [surgeTrips, setSurgeTrips] = useState(() => {
    const defaultTotalTrips = 6;
    return Math.floor(defaultTotalTrips / 2);
  });

  const [bodyStyle, setBodyStyle] = useState("midsize");

  const [parkingNeeded, setParkingNeeded] = useState(false);
  const [parkingDailyRate, setParkingDailyRate] = useState(25);

  const [eventParkingNeeded, setEventParkingNeeded] = useState(false);
  const [parkingPerStopRate, setParkingPerStopRate] = useState(15);
  const [paidParkingStops, setPaidParkingStops] = useState(2);

  const [gasPrice, setGasPrice] = useState(marketData[0]?.gasPrice ?? 0);

  // 2) derived values next
  const selectedMarket = useMemo(() => {
    return (
      marketData.find((item) => item.city === selectedLocation) ?? marketData[0]
    );
  }, [selectedLocation]);

  const rentalDailyRate = useMemo(() => {
    return selectedMarket?.rentalRates?.[bodyStyle] ?? 0;
  }, [selectedMarket, bodyStyle]);

  const mpg = useMemo(() => {
    return vehicleCategories?.[bodyStyle]?.mpg ?? 25;
  }, [bodyStyle]);

  const calculations = useMemo(() => {
    return calculateTripCosts({
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
      selectedLocation: selectedMarket?.rideshare,
      estimatedFeeRate: 1.0,
    });
  }, [
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
    selectedMarket,
  ]);

  // 3) effects last
  useEffect(() => {
    if (selectedMarket?.gasPrice !== undefined) {
      setGasPrice(selectedMarket.gasPrice);
    }
  }, [selectedMarket]);

  return {
    state: {
      days,
      shortTrips,
      mediumTrips,
      longTrips,
      selectedLocation,
      surgeTrips,
      bodyStyle,
      mpg,
      parkingNeeded,
      parkingDailyRate,
      eventParkingNeeded,
      parkingPerStopRate,
      paidParkingStops,
      rentalDailyRate,
      gasPrice,
    },
    setters: {
      setDays,
      setShortTrips,
      setMediumTrips,
      setLongTrips,
      setSelectedLocation,
      setSurgeTrips,
      setBodyStyle,
      setParkingNeeded,
      setParkingDailyRate,
      setEventParkingNeeded,
      setParkingPerStopRate,
      setPaidParkingStops,
    },
    selectedLocation: selectedMarket,
    calculations,
  };
}