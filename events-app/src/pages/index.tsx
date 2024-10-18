import React, { useEffect, useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Header from '@/components/Header';
import { useRouter } from 'next/router';
import { IEvent } from '../models/Event';

export default function HomePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [upcomingEvents, setUpcomingEvents] = useState<IEvent[]>([]);
    const [pastEvents, setPastEvents] = useState<IEvent[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/events');
                const data = await response.json();
                if (data.success) {
                    const currentDate = new Date();
                    // Filter events immediately after receiving them
                    const upcoming = data.data.filter(
                        (event: IEvent) => new Date(event.date) >= currentDate
                    );
                    const past = data.data.filter(
                        (event: IEvent) => new Date(event.date) < currentDate
                    );
                    
                    setUpcomingEvents(upcoming);
                    setPastEvents(past);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchEvents();
    }, []); // Empty dependency array since we only want to fetch once

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

    const cardHeader = (imageUrl: string) => (
        <img 
            alt="Event" 
            src={imageUrl} 
            className="w-full h-48 object-cover"
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/600x400";
            }}
        />
    );

    const cardFooter = (event: IEvent) => (
        <div className="flex justify-between items-center mt-4">
            <Button
                label="View More"
                icon="pi pi-arrow-right"
                outlined
                className='p-card-button'
                onClick={() => router.push(`/events/${event._id}`)}
            />
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f9fa' }}>
            <Header />

            <main className="flex-grow">
                <section style={{ backgroundColor: '#003e75', color: 'white' }} className="py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Welcome to My Father's House
                        </h1>
                        <p className="text-xl mb-8">
                            Join us for upcoming events and grow in faith together
                        </p>
                        <Button
                            label="View Events"
                            className="p-card-button"
                            style={{ backgroundColor: '#beb9e4', color: '#003e75', border: 'none' }}
                        />
                    </div>
                </section>

                <section className="container mx-auto p-4 mt-12">
                    <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: '#003e75' }}>Our Events</h2>
                    {!loading && (
                        <TabView>
                            <TabPanel header="Upcoming Events">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {upcomingEvents.length > 0 ? (
                                        upcomingEvents.map(event => (
                                            <Card
                                                title={event.title}
                                                subTitle={formatDate(event.date)}
                                                header={event.photoUrl ? () => cardHeader(event.photoUrl!) : () => cardHeader("https://placehold.co/600x400")}
                                                footer={() => cardFooter(event)}
                                                className="w-full shadow-md hover:shadow-lg transition-shadow"
                                            >
                                                <p>{event.summary}</p>
                                                <div className="flex items-center gap-2">
                                                    <i className="pi pi-map-marker text-gray-500" />
                                                    <span className="text-gray-500">{event.location}</span>
                                                </div>
                                            </Card>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-600">No upcoming events at the moment.</p>
                                    )}
                                </div>
                            </TabPanel>

                            <TabPanel header="Past Events">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {pastEvents.length > 0 ? (
                                        pastEvents.map(event => (
                                            <Card
                                                title={event.title}
                                                subTitle={formatDate(event.date)}
                                                header={event.photoUrl ? () => cardHeader(event.photoUrl!) : () => cardHeader("https://placehold.co/600x400")}
                                                footer={() => cardFooter(event)}
                                                className="w-full shadow-md hover:shadow-lg transition-shadow"
                                            >
                                                <p>{event.summary}</p>
                                                <div className="flex items-center gap-2">
                                                    <i className="pi pi-map-marker text-gray-500" />
                                                    <span className="text-gray-500">{event.location}</span>
                                                </div>
                                            </Card>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-600">No upcoming events at the moment.</p>
                                    )}
                                </div>
                            </TabPanel>
                        </TabView>
                    )}
                </section>
            </main>
        </div>
    );
}