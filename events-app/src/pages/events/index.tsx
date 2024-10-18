import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Header from '../../components/Header';
import {formatDate} from '../../lib/utils'
import { IEvent } from '../../models/Event';


const Events = () => {
  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
        try {
            const response = await fetch('/api/events')
            const data = await response.json()
            if (data.success) {
                console.log(data.data)
                setEvents(data.data);
            }
        } catch (error) {
            console.error('Error fetching events:', error)
        }
    }
    fetchEvents()
}, [])


  const cardFooter = (event: IEvent) => (
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