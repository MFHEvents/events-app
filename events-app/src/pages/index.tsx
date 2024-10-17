import React, { useEffect, useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Header from '@/components/Header';
import type { ChurchEvent } from '../types';
import { useRouter } from 'next/router';

// Mock event data
const mockEvents: ChurchEvent[] = [
    {
        id: 1,
        title: "Sunday Worship Service",
        date: new Date('2024-10-20T10:00:00'),
        description: 'Join us for our weekly worship service with special musical performance.',
        summary: 'Sunday service summary',
        location: 'Main Sanctuary',
        imageUrl: 'https://placehold.co/600x400'
    },
    {
        id: 2,
        title: "Youth Bible Study",
        date: new Date('2024-10-22T18:30:00'),
        description: 'Weekly Bible study for young adults.',
        summary: 'Youth study summary',
        location: 'Youth Center',
        imageUrl: 'https://placehold.co/600x400'
    },
    {
        id: 3,
        title: "Community Outreach",
        date: new Date('2024-09-15T09:00:00'),
        description: 'Monthly community service event.',
        summary: 'Outreach event summary',
        location: 'Community Center',
        imageUrl: 'https://placehold.co/600x400'
    }
];

export default function HomePage() {
    const router = useRouter();
    const [upcomingEvents, setUpcomingEvents] = useState<ChurchEvent[]>([]);
    const [pastEvents, setPastEvents] = useState<ChurchEvent[]>([]);

    useEffect(() => {
        // Get the current date
        const currentDate = new Date();

        // Separate upcoming and past events
        const upcoming = mockEvents.filter(event => new Date(event.date) >= currentDate);
        const past = mockEvents.filter(event => new Date(event.date) < currentDate);

        setUpcomingEvents(upcoming);
        setPastEvents(past);
    }, [])

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
        <img alt="Event" src={imageUrl} className="w-full h-48 object-cover" />
    );

    const cardFooter = (event: ChurchEvent) => (
        <div className="flex justify-between items-center mt-4">
            <Button
                label="View More"
                icon="pi pi-arrow-right"
                outlined
                className='p-card-button'
                onClick={() => router.push(`/events/${event.id}`)}
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
                    <TabView>
                        <TabPanel header="Upcoming Events">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {upcomingEvents.length > 0 ? (
                                    upcomingEvents.map(event => (
                                        <Card
                                            key={event.id}
                                            title={event.title}
                                            subTitle={formatDate(event.date)}
                                            header={() => cardHeader(event.imageUrl)}
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
                                            key={event.id}
                                            title={event.title}
                                            subTitle={formatDate(event.date)}
                                            header={() => cardHeader(event.imageUrl)}
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
                                    <p className="text-center text-gray-600">No past events available.</p>
                                )}
                            </div>
                        </TabPanel>
                    </TabView>
                </section>
            </main>
        </div>
    );
}
