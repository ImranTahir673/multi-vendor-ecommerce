import React from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import EventCard from "./EventCard";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  // Fallback sample event if none created yet
  const defaultEvent = {
    _id: "demo_event_1",
    name: "IPhone 14 Pro Max 256GB - Flash Festival Sale",
    description:
      "Exclusive multi-vendor annual flash sale. Massive 20% discount on official flagship devices with full warranty and express free shipping.",
    originalPrice: 1299,
    discountPrice: 999,
    sold_out: 42,
    stock: 15,
    Finish_Date: new Date(Date.now() + 4 * 86400000).toISOString(),
    images: [
      {
        url: "https://st-troy.mncdn.com/mnresize/1500/1500/Content/media/ProductImg/original/mpwp3tua-apple-iphone-14-256gb-mavi-mpwp3tua-637986832343472449.jpg",
      },
    ],
  };

  const currentEvent = (allEvents && allEvents.length !== 0) ? allEvents[0] : defaultEvent;

  return (
    <div>
      {!isLoading && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>Popular Events</h1>
          </div>

          <div className="w-full grid">
            <EventCard data={currentEvent} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
