import React, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Button } from 'primereact/button';
import type { ChurchEvent } from '../../types';
import RegisterForEventModal from '@/components/RegisterForEventModal';


const mockEvents = [
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
    // Add more events here
];

export default function EventDetailsPage() {
    const router = useRouter();
    const { eventid } = router.query;  // Get the event ID from the URL
    const [event, setEvent] = useState<ChurchEvent | undefined>(undefined);
    const [isDialogVisible, setDialogVisible] = useState(false);

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).format(new Date(date));
    };

    // Fetch event details based on event ID (mock data in this case)
    useEffect(() => {
        if (eventid) {
            const foundEvent = mockEvents.find(e => e.id === parseInt(eventid as string));
            setEvent(foundEvent);
        }
    }, [eventid]);

    if (!event) {
        return <div>Loading...</div>;
    }

    const handleRegisterClick = () => {
        setDialogVisible(true);
      };
    
      const handleCloseDialog = () => {
        setDialogVisible(false);
      };

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f9fa' }}>
            <Header />
            <main className="container mx-auto p-8">
                <img src={event.imageUrl} alt={event.title} className="w-full h-64 object-cover mb-4 rounded-lg shadow-md" />
                <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                    <i className="pi pi-calendar mr-2"></i>
                    <span>{formatDate(event.date)}</span>
                    <i className="pi pi-map-marker ml-4 mr-2"></i>
                    <span>{event.location}</span>
                </div>
                <p className="text-lg mb-4">{event.summary}</p>

                <h2 className="text-2xl font-bold mb-2">Details</h2>
                <p className="mb-4">{event.description}</p>

                <Button
                    label="Register Now"
                    icon="pi pi-pencil"
                    className="p-card-button"
                    onClick={handleRegisterClick}
                />
                <RegisterForEventModal 
                visible={isDialogVisible} 
                onClose={() => setDialogVisible(false)} 
                event={event}
                />
            </main>

        </div>
    );
}
