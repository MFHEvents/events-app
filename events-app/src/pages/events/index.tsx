import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Header from '../../components/Header';
import type { ChurchEvent } from '../../types';

const Events = () => {
  const [events, setEvents] = useState<ChurchEvent[]>([]);

  useEffect(() => {
    const mockEvents: ChurchEvent[] = [
      {
        id: 1,
        title: 'Sunday Worship Service',
        date: new Date('2024-10-20T10:00:00'),
        description: 'Join us for our weekly worship service with special musical performance.',
        summary: 'Hello there I am summary',
        location: 'Main Sanctuary',
        imageUrl: 'https://placehold.co/600x400'
      },
      {
        id: 2,
        title: 'Youth Group Meeting',
        date: new Date('2024-10-22T18:30:00'),
        description: 'Weekly youth group gathering with games, worship, and Bible study.',
        summary: 'Hello there I am summary',
        location: 'Youth Center',
        imageUrl: 'https://placehold.co/600x400'
      },
      {
        id: 3,
        title: 'Community Outreach',
        date: new Date('2024-10-25T09:00:00'),
        description: 'Monthly community service event at the local food bank.',
        summary: 'Hello there I am summary',
        location: 'Community Center',
        imageUrl: 'https://placehold.co/600x400'
      },
      {
        id: 4,
        title: 'Community Outreach',
        date: new Date('2024-10-25T09:00:00'),
        description: 'Monthly community service event at the local food bank.',
        summary: 'Hello there I am summary',
        location: 'Community Center',
        imageUrl: 'https://placehold.co/600x400'
      },
      {
        id: 5,
        title: 'Community Outreach',
        date: new Date('2024-10-25T09:00:00'),
        description: 'Monthly community service event at the local food bank.',
        summary: 'Hello there I am summary',
        location: 'Community Center',
        imageUrl: 'https://placehold.co/600x400'
      }
    ];

    setEvents(mockEvents);
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const cardHeader = (imageUrl: string) => (
    <img alt="Event" src={imageUrl} className="w-full h-48 object-cover" />
  );

  const cardFooter = (event: ChurchEvent) => (
    <div className="flex justify-between items-center mt-4">
      <Button 
        label="View More" 
        icon="pi pi-arrow-right" 
        outlined
        className='p-card-button'
        onClick={() => console.log(`Viewing event: ${event.id}`)}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <h1 className="text-3xl font-bold mb-8">All Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card
              key={event.id}
              title={event.title}
              subTitle={formatDate(event.date)}
              header={event.imageUrl ? () => cardHeader(event.imageUrl!) : undefined}
              footer={() => cardFooter(event)}
              className="w-full shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="space-y-2">
                <p className="text-gray-600">{event.summary}</p>
                <div className="flex items-center gap-2">
                  <i className="pi pi-map-marker text-gray-500" />
                  <span className="text-gray-500">{event.location}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Events;