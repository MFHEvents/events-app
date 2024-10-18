import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Button } from 'primereact/button';
import type { ChurchEvent } from '../../types';
import RegisterForEventModal from '@/components/RegisterForEventModal';
import { formatDate } from '../../lib/utils'
import { IEvent } from '../../models/Event';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

export default function EventDetailsPage() {
  const router = useRouter();
  const { eventid } = router.query;  // Get the event ID from the URL
  const [event, setEvent] = useState<IEvent | undefined>(undefined);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [loading, setLoading] = useState(true);


  // Fetch event details based on event ID
  useEffect(() => {
    if (eventid) {
      const fetchEvent = async () => {
        try {
          const response = await fetch(`/api/events/${eventid}`);
          if (response.ok) {
            const eventData = await response.json();
            console.log(eventData)
            setEvent(eventData.data);
          } else {
            console.error('Failed to fetch event:', response.status);
          }
        } catch (error) {
          console.error('Error fetching event:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchEvent();
    }
  }, [eventid]);

  const handleRegisterClick = () => {
    setDialogVisible(true);
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f9fa' }}>
      <Header />
      {!event && (
        <div>Event not found</div>
      )}
      {loading && (
        <div>Loading...</div>
      )}
      {event && (
        <main className="container mx-auto p-8">
          <img
            src={event?.photoUrl}
            alt={event?.title}
            className="w-full h-64 object-cover mb-4 rounded-lg shadow-md"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://placehold.co/600x400";
            }}
          />
          <h1 className="text-4xl font-bold mb-4">{event?.title}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <i className="pi pi-calendar mr-2"></i>
            <span>{formatDate(event.date)}</span>
            <i className="pi pi-map-marker ml-4 mr-2"></i>
            <span>{event?.location}</span>
          </div>
          <p className="text-lg mb-4">{event?.summary}</p>

          <h2 className="text-2xl font-bold mb-2">Details</h2>

          {/* Scoped styles for lists */}
          <style jsx>{`
            .event-details-content ul {
              list-style-position: inside;
              list-style-type: disc; /* Bullet points */
              margin-left: 20px;
            }
            .event-details-content ol {
              list-style-position: inside;
              list-style-type: decimal; /* Numbered list */
              margin-left: 20px;
            }
            .event-details-content li {
              margin-bottom: 10px; /* Spacing between list items */
              font-size: 1rem;
            }
          `}</style>

          {/* Render the rich text description */}
          {/* <div className="mb-4" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(event?.description || '') }} /> */}
          <div className="mb-4">{event?.description && parse(event.description)}</div>


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
      )}
    </div>
  );
}
