import React, { useState, useEffect, useCallback } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Toast } from 'primereact/toast'
import Header from '@/components/Header'
import { IEvent } from '../../models/Event';

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment)

interface CalendarEvent {
  start: Date;
  end: Date;
  title: string;
  allDay?: boolean;
}

// Create a type that extends CalendarEvent with the properties from IEvent
type EventType = CalendarEvent & IEvent

export default function CalendarView() {
  const [events, setEvents] = useState<EventType[]>([])
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        const data = await response.json()
        if (data.success) {
          setEvents(data.data.map((event: IEvent) => ({
            ...event,
            start: new Date(event.date),
            end: new Date(event.date),
            allDay: false,
          })))
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }
    fetchEvents()
  }, [])

  const handleSelectEvent = useCallback((event: EventType) => {
    setSelectedEvent(event)
    setShowEventDialog(true)
  }, [])

  const handleShareEvent = useCallback(() => {
    if (selectedEvent) {
       const eventDetails = [
        "Woohoo🎉🎉!! myFather's House is having an event!!",
        "Check out the details below:",
        `${selectedEvent.title} on ${moment(selectedEvent.date).format('MMMM Do YYYY, [@]h:mm a')}`,
        `***Location*** : ${selectedEvent.location}`
      ].join('\n');

      navigator.clipboard.writeText(eventDetails)
      if (toast && toast.show) {
        toast.show({ severity: 'info', summary: 'Copied', detail: 'Event details copied to clipboard', life: 3000 })
      }
    }
  }, [selectedEvent, toast])

  const eventStyleGetter = useCallback((event: EventType) => {
    const eventColors: { [key: string]: string } = {
      'Product launch': '#ff69b4',
      'Webinar': '#00ff00',
      'Conference': '#1e90ff',
      'Workshop': '#8a2be2',
      'Tech demo': '#ff0000',
      'Progress report': '#ffd700',
      'Project update': '#ffa500',
      'Design meeting': '#4b0082',
      'Review call': '#9400d3',
    }

    return {
      style: {
        backgroundColor: eventColors[event.title] || '#003e75',
        color: 'white',
        borderRadius: '5px',
        border: 'none'
      }
    }
  }, [])

  const handleCloseDialog = useCallback(() => {
    setShowEventDialog(false)
  }, [])

  const dialogFooter = (
    <div className="flex justify-center gap-4">
      <Button label="Share" icon="pi pi-share-alt" onClick={handleShareEvent} className="p-button-text" style={{ backgroundColor: 'white', color: '#003e75' }} />
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f9fa' }}>
      <Header />
      <Toast ref={setToast} />
      <main className="flex-grow container mx-auto p-4 mt-12">
        <h1 className="text-4xl font-bold mb-6 text-center" style={{ color: '#003e75' }}>Event Calendar</h1>
        <Card className="shadow-lg">
          <Calendar<EventType>
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 'calc(100vh - 200px)' }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            views={['month', 'week', 'day']}
            toolbar={true}
          />
        </Card>
      </main>

      <Dialog 
        header={selectedEvent?.title}
        visible={showEventDialog} 
        style={{ width: '90%', maxWidth: '500px' }} 
        onHide={handleCloseDialog}
        footer={dialogFooter}
        closeOnEscape={true}
        closable={true}
        modal={true}
        headerStyle={{
        background: '#003e75', // A nice shade of blue
        color: 'white',
        textAlign: 'center',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        padding: '1rem'
      }}
      >
        {selectedEvent && (
          <div className="p-4">
            <div className="mb-4 text-lg font-semibold" style={{ color: '#003e75' }}></div>
            <div className="mb-2">
              <i className="pi pi-calendar mr-2" style={{ color: '#003e75' }}></i>
              <span>{moment(selectedEvent.date).format('MMMM Do YYYY, h:mm a')}</span>
            </div>
            <div className="mb-2">
              <i className="pi pi-map-marker mr-2" style={{ color: '#003e75' }}></i>
              <span>{selectedEvent.location}</span>
            </div>
            {selectedEvent.fee !== undefined && (
              <div className="mb-2">
                <i className="pi pi-dollar mr-2" style={{ color: '#003e75' }}></i>
                <span>Fee: ${selectedEvent.fee.toFixed(2)}</span>
              </div>
            )}
            <div className="mb-4">
              <div className="font-semibold mb-1">Summary:</div>
              <p>{selectedEvent.summary}</p>
            </div>
            <div>
              <div className="font-semibold mb-1">Description:</div>
              <p>{selectedEvent.description}</p>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}