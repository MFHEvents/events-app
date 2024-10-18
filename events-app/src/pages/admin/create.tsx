'use client'

import React, { useEffect, useState } from 'react'
import Header from '../../components/Header';
import { useRouter } from 'next/navigation'
import { Steps } from 'primereact/steps'
import { Calendar } from 'primereact/calendar'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import { RadioButton } from 'primereact/radiobutton'
import { FileUpload } from 'primereact/fileupload'
import { InputTextarea } from 'primereact/inputtextarea'
import { Editor } from 'primereact/editor'
import { Button } from 'primereact/button'
import 'react-quill/dist/quill.snow.css';
import {Event} from '../../types'
import { RecurrenceFrequency, RecurrencePattern, Days, Months } from '@/constants/constants';
import { Nullable } from 'primereact/ts-helpers';
import { Checkbox } from 'primereact/checkbox';


export default function CreateEventPage() {
    const router = useRouter()
    const [activeIndex, setActiveIndex] = useState(0)

    const [calDate, setCalDate] = useState<Nullable<Date>>(new Date())

    const [startTime, setStartTime] = useState<Nullable<Date>>()
    const [endTime, setEndTime] = useState<Nullable<Date>>()
    const [endDate, setEndDate] = useState<Nullable<Date>>()
    const [isRecurringInput, setIsRecurringInput] = useState(false)
    const [recurringInterval, setRecurringInterval] = useState<Nullable<number | null>>()
    const [recurringType, setRecurringType] = useState<Nullable<string | null>>('')
    const [locationType, setLocationType] = useState('physical')
    const [eventLocation, setEventLocation] = useState('')
    const [eventFee, setEventFee] = useState<Nullable<number>>()
    const [eventTitile, setEventTitle] = useState('')
    const [eventDesc, setEventDesc] = useState('')
    const [eventSum, setEventSum] = useState('')

    const [uploadedImg, setUploadedImg] = useState<File>()

    const [selectedDays, setSelectedDays] = useState<Days[]>([]);
    const [selectedDayOfMonth, setSelectedDayOfMonth] = useState<Nullable<number | null>>();

    const buildRecurrencePattern = (): RecurrencePattern | undefined => {
        if(calDate == null || calDate == undefined){
            return undefined;
        }
        switch (recurringType) {
            case RecurrenceFrequency.Daily: {
                // Daily recurrence pattern
                return {
                    frequency: RecurrenceFrequency.Daily,
                    startDate: calDate || new Date(),
                    endDate: endDate || undefined,
                    interval: recurringInterval || 1, // Default to 1 if no interval provided
                };
            }

            case RecurrenceFrequency.Weekly: {
                // Weekly recurrence pattern
                return {
                    frequency: RecurrenceFrequency.Weekly,
                    startDate: calDate || new Date(),
                    endDate: endDate || undefined,
                    daysOfWeek: selectedDays || [],
                    interval: recurringInterval || 1, // Weekly interval (e.g., every week, every 2 weeks)
                };
            }

            case RecurrenceFrequency.Monthly: {
                // Monthly recurrence pattern
                return {
                    frequency: RecurrenceFrequency.Monthly,
                    startDate: calDate || new Date(),
                    endDate: endDate || undefined,
                    dayOfMonth: selectedDayOfMonth || calDate?.getDate() || 1,
                    interval: recurringInterval || 1, // Monthly interval (e.g., every month, every 2 months)
                };
            }

            case RecurrenceFrequency.Yearly: {
                // Yearly recurrence pattern
                const monthNameToEnum = (monthName: string): Months | undefined => {
                    const monthMap: { [key: string]: Months } = {
                        January: Months.January,
                        February: Months.February,
                        March: Months.March,
                        April: Months.April,
                        May: Months.May,
                        June: Months.June,
                        July: Months.July,
                        August: Months.August,
                        September: Months.September,
                        October: Months.October,
                        November: Months.November,
                        December: Months.December,
                    };
                    return monthMap[monthName] as Months;
                };
            
                const startDateMonth = calDate?.toLocaleString('default', { month: 'long' });
                const todayDateMonth = new Date().toLocaleString('default', { month: 'long' });

                const month = monthNameToEnum(startDateMonth) || monthNameToEnum(todayDateMonth);

                if (!month) {
                    throw new Error("Invalid month selected");
                }
                return {
                    frequency: RecurrenceFrequency.Yearly,
                    startDate: calDate || new Date(),
                    endDate: endDate || undefined,
                    month: month,
                    dayOfMonth: new Date(calDate).getDate(),
                    interval: recurringInterval || 1, // Yearly interval (e.g., every year, every 2 years)
                };
            }

            default:
                // If no valid recurringType is selected, return null
                return undefined;
        }
    };

    const daysOfWeekOptions = [
        { label: Days.Monday, value: Days.Monday },
        { label: Days.Tuesday, value: Days.Tuesday },
        { label: Days.Wednesday, value: Days.Wednesday },
        { label: Days.Thursday, value: Days.Thursday },
        { label: Days.Friday, value: Days.Friday },
        { label: Days.Saturday, value: Days.Saturday },
        { label: Days.Sunday, value: Days.Sunday },
    ];

    const recurringTypeOptions = [
        { value: RecurrenceFrequency.Daily, label: RecurrenceFrequency.Daily },
        { value: RecurrenceFrequency.Weekly, label: RecurrenceFrequency.Weekly },
        { value: RecurrenceFrequency.Monthly, label: RecurrenceFrequency.Monthly },
        { value: RecurrenceFrequency.Yearly, label: RecurrenceFrequency.Yearly },
    ];

    const frequencyOptions = [
        { value: 'single', label: 'Single Event' },
        { value: 'recurring', label: 'Recurring Event' },
    ];

    const steps = [
        { label: 'Event Details' },
        { label: 'Date and Location' },
        { label: 'Additional Info' }
    ]

    const handleDayChange = (day: Days) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter((d) => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleFileUpload = (e: any) => {
        console.log(e.files)
        console.log(e.files[0])
        if (e.files && e.files.length > 0) {
            setUploadedImg(e.files[0]);
        };
    };

    const handleRichTextChange = (e: any) => {
        console.log(e.htmlValue)
        setEventDesc(e.htmlValue);
        console.log(eventDesc)
    };

    const renderStepContent = () => {
        switch (activeIndex) {
            case 0:
                return renderEventDetails()
            case 1:
                return renderDateAndLocation()
            case 2:
                return renderAdditionalInfo()
            default:
                return null
        }
    }


    const handleNext = () => {
        if (activeIndex < steps.length - 1) {
            setActiveIndex(activeIndex + 1)
        } else {
            // Submit form logic here
            submitEvent()

            console.log('Form submitted:')
            router.push('/admin')
        }
    }

    const submitEvent = async () => {

        const eventDetails: Event = {
            title: eventTitile,
            date: calDate || new Date ,
            location: eventLocation,
            fee: eventFee || undefined,
            summary: eventSum,
            description: eventDesc,
            isRecurring: isRecurringInput,
            recurrencePattern: buildRecurrencePattern(),
            image: uploadedImg
        };

        console.log(JSON.stringify(eventDetails))
        console.log(eventDetails)

        const response = await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventDetails), 
        });
        if (response.ok) {
            console.log('Event created successfully!');
            router.push('/admin'); // Navigate to the admin page after submission
        } else {
            console.error('Failed to create event');
        }
    };

    const handleBack = () => {
        if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1)
        } else {
            router.push('/admin');
        }
    }


    const renderEventDetails = () => (
        <div className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
                <InputText id="title" name="title" value={eventTitile} onChange={(e) => { setEventTitle(e.target.value) }} className="mt-1 block w-full" required />
            </div>
            <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Event Summary</label>
                <InputTextarea id="summary" name="summary" value={eventSum} onChange={(e) => { setEventSum(e.target.value) }} rows={3} className="mt-1 block w-full" required />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Event Description</label>
                <Editor id="description" value={eventDesc} onTextChange={handleRichTextChange} style={{ height: '320px' }} required />
            </div>
        </div>
    )

    const renderDateAndLocation = () => (
        <div className="space-y-6">
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Event Date</label>
                <Calendar
                    id="date"
                    name="date"
                    value={calDate}
                    onChange={(e) => setCalDate(e.value)}
                    className="mt-1 block w-full p-calendar-large"
                    required
                />

            </div>
            <div className="flex space-x-6">
                <div className="flex-1">
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                    <Calendar
                        id="startTime"
                        name="startTime"
                        value={startTime}
                        onChange={(e) => setStartTime(e.value)}
                        timeOnly
                        className="mt-1 block w-full p-calendar-large"
                        required
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                    <Calendar
                        id="endTime"
                        name="endTime"
                        value={endTime}
                        onChange={(e) => setEndTime(e.value)}
                        timeOnly
                        className="mt-1 block w-full p-calendar-large"
                        required
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Frequency</label>
                <div className="mt-2 space-y-2">
                    {frequencyOptions.map((option) => (
                        <div key={option.value} className="flex items-center">
                            <RadioButton
                                inputId={option.value}
                                name="frequency"
                                value={option.value}
                                onChange={(e) => setIsRecurringInput(e.value === 'recurring')} // Set isRecurring based on frequency selection
                                checked={isRecurringInput ? option.value === 'recurring' : option.value === 'single'}
                            />
                            <label htmlFor={option.value} className="ml-2">{option.label}</label>
                        </div>
                    ))}
                </div>
            </div>

            {isRecurringInput && (
                <div className="space-y-6">
                    <Dropdown
                        name="recurringType"
                        value={recurringType}
                        options={recurringTypeOptions}
                        onChange={(e) => setRecurringType(e.value)}
                        className="p-dropdown-large"
                    />

                    {/* Show weekly options (selecting days) only if 'Weekly' is selected */}
                    {recurringType === RecurrenceFrequency.Weekly && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Days of the Week</label>
                            <div className="mt-2 grid grid-cols-3 gap-4">
                                {daysOfWeekOptions.map((day) => (
                                    <div key={day.value} className="flex items-center">
                                        <Checkbox
                                            inputId={day.value}
                                            value={day.value}
                                            checked={selectedDays.includes(day.value)}
                                            onChange={() => handleDayChange(day.value)}
                                        />
                                        <label htmlFor={day.value} className="ml-2">{day.label}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Show monthly options (selecting day of the month) only if 'Monthly' is selected */}
                    {recurringType === RecurrenceFrequency.Monthly && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Day of the Month</label>
                            <InputNumber
                                value={selectedDayOfMonth}
                                onValueChange={(e) => setSelectedDayOfMonth(e.value)}
                                min={1}
                                max={31}
                                placeholder="Day of the Month"
                                className="mt-2 w-full"
                            />
                        </div>
                    )}

                    <div className="flex items-center space-x-6">
                        <span>
                            <p className='text-sm font-medium text-gray-700'>Every</p>
                        </span>
                        <InputNumber
                            name="recurringInterval"
                            value={recurringInterval}
                            onValueChange={(e) => setRecurringInterval(e.value)}
                            className="w-60 mt-1 block w-full"
                            min={1}
                            max={99}
                        />
                        <span>{recurringType === RecurrenceFrequency.Weekly ? 'weeks' : recurringType === RecurrenceFrequency.Monthly ? 'months' : recurringType === RecurrenceFrequency.Yearly ? 'years' : recurringType === RecurrenceFrequency.Daily ? 'days' : recurringType?.toLowerCase() + 's'}</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">End Date</label>
                        <Calendar
                            id="recurrenceEndDate"
                            name="recurrenceEndDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.value)}
                            className="mt-1 block w-full p-calendar-large"
                            required
                        />
                    </div>
                </div>
            )}
            <div>
                <label className="block text-sm font-medium text-gray-700">Location Type</label>
                <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                        <RadioButton
                            inputId="physical"
                            name="locationType"
                            value="physical"
                            onChange={(e) => setLocationType(e.value)}
                            checked={locationType === 'physical'} />
                        <label htmlFor="physical" className="ml-2">Physical</label>
                    </div>
                    <div className="flex items-center">
                        <RadioButton
                            inputId="virtual"
                            name="locationType"
                            value="virtual"
                            onChange={(e) => setLocationType(e.value)}
                            checked={locationType === 'virtual'} />
                        <label htmlFor="virtual" className="ml-2">Virtual</label>
                    </div>
                </div>
            </div>
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    {locationType === 'physical' ? 'Address' : 'Meeting Link'}
                </label>
                <InputText
                    id="location"
                    name="location"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="mt-1 block w-full p-input-large"
                    required
                />
            </div>
        </div>
    )

    const renderAdditionalInfo = () => (
        <div className="space-y-4">
            <div>
                <label htmlFor="fee" className="block text-sm font-medium text-gray-700">Event Fee</label>
                <InputNumber
                    id="fee"
                    name="fee"
                    value={eventFee}
                    onValueChange={(e) => setEventFee(e.value)}
                    mode="currency"
                    currency="CAD"
                    className="mt-1 block w-full"
                />
            </div>
            <div>
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Event Photo</label>
                <FileUpload
                    name="photo"
                    accept="image/*"
                    maxFileSize={1000000}
                    onSelect={handleFileUpload}
                />
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 pt-24 pb-8">
                <h1 className="text-2xl font-bold mb-6">Create Event</h1>
                <Steps model={steps} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false} />
                <div className="mt-8">
                    {renderStepContent()}
                </div>
                <div className="mt-8 flex justify-between">
                    <Button label="Back" icon="pi pi-arrow-left" onClick={handleBack} disabled={activeIndex === 0} />
                    <Button label={activeIndex === steps.length - 1 ? 'Submit' : 'Next'} icon="pi pi-arrow-right" iconPos="right" onClick={handleNext} />
                </div>
            </main>
        </div>
    )
}



