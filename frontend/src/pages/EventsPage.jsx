import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  const defaultEvents = [
    {
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
    },
  ];

  const eventsList = (allEvents && allEvents.length > 0) ? allEvents : defaultEvents;

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">Loading...</div>
      ) : (
        <div>
          <Header activeHeading={4} />
          <div className={`${styles.section} my-8`}>
            {eventsList.map((event, index) => (
              <EventCard key={index} active={true} data={event} />
            ))}
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default EventsPage;
