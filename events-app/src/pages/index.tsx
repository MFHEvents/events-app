'use client'

import React, { useEffect, useState } from 'react'
import { TabView, TabPanel } from 'primereact/tabview'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import Header from '@/components/Header'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { EventWithId } from '../types'

export default function HomePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [upcomingEvents, setUpcomingEvents] = useState<EventWithId[]>([])
    const [pastEvents, setPastEvents] = useState<EventWithId[]>([])
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/events')
                const data = await response.json()
                if (data.success) {
                    const currentDate = new Date()
                    const upcoming = data.data.filter(
                        (event: EventWithId) => new Date(event.date) >= currentDate
                    )
                    const past = data.data.filter(
                        (event: EventWithId) => new Date(event.date) < currentDate
                    )
                    setUpcomingEvents(upcoming)
                    setPastEvents(past)
                }
            } catch (error) {
                console.error('Error fetching events:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchEvents()
    }, [])

    const handleImageError = (eventId: string) => {
        setImageErrors(prev => ({ ...prev, [eventId]: true }))
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).format(new Date(date))
    }

    const cardHeader = (event: EventWithId) => (
        <div className="relative w-full h-48">
            {!imageErrors[event._id] ? (
                <Image
                    src={`/api/events/${event._id}/image`}
                    alt={event.title}
                    layout="fill"
                    objectFit="cover"
                    onError={() => handleImageError(event._id)}
                    loading="lazy"
                />
            ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Placeholder Image</span>
                </div>
            )}
        </div>
    )

    const cardFooter = (event: EventWithId) => (
        <div className="flex justify-between items-center mt-4">
            <Button
                label="View More"
                icon="pi pi-arrow-right"
                outlined
                className='p-card-button'
                onClick={() => router.push(`/events/${event._id}`)}
            />
        </div>
    )

    const renderEventCards = (events: EventWithId[]) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
                <Card
                    key={event._id}
                    title={event.title}
                    subTitle={formatDate(event.date)}
                    header={() => cardHeader(event)}
                    footer={() => cardFooter(event)}
                    className="w-full shadow-md hover:shadow-lg transition-shadow"
                >
                    <p>{event.summary}</p>
                    <div className="flex items-center gap-2">
                        <i className="pi pi-map-marker text-gray-500" />
                        <span className="text-gray-500">{event.location}</span>
                    </div>
                </Card>
            ))}
        </div>
    )

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
                            onClick={() => {
                                const section = document.getElementById('viewEvents');
                                if (section) {
                                    section.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                        />
                    </div>
                </section>

                <section id="viewEvents" className="container mx-auto p-4 mt-12">
                    <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: '#003e75' }}>Our Events</h2>
                    {!loading && (
                        <TabView>
                            <TabPanel header="Upcoming Events">
                                {upcomingEvents.length > 0 ? (
                                    renderEventCards(upcomingEvents)
                                ) : (
                                    <p className="text-center text-gray-600">No upcoming events at the moment.</p>
                                )}
                            </TabPanel>

                            <TabPanel header="Past Events">
                                {pastEvents.length > 0 ? (
                                    renderEventCards(pastEvents)
                                ) : (
                                    <p className="text-center text-gray-600">No past events to display.</p>
                                )}
                            </TabPanel>
                        </TabView>
                    )}
                </section>
            </main>
        </div>
    )
}