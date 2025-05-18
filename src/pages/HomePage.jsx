
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeaturedEvent from '../components/FeaturedEvent';
import SearchBar from '../components/SearchBar';
import EventList from '../components/EventList';
import { getEvents } from '../lib/events';

const HomePage = () => {
  const allEvents = getEvents();
  const featuredEvent = allEvents.find(event => event.featured);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {featuredEvent && <FeaturedEvent event={featuredEvent} />}
      
      <div className="container mx-auto -mt-8 px-4 z-10 relative">
        <SearchBar />
      </div>
      
      <EventList title="Eventos em alta" events={allEvents} />
      
      <Footer />
    </div>
  );
};

export default HomePage;
