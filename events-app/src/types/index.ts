import { RecurrencePattern } from '@/constants/constants';

export interface ChurchEvent {
    id: number;
    title: string;
    date: Date;
    description: string;
    location: string;
    summary: string;
    imageUrl: string;
  }

  export interface Event {
    title: string;
    date: Date;
    location: string;
    fee?: number;
    summary: string;
    description: string;
    isRecurring?: boolean;
    recurrencePattern?: RecurrencePattern;
    image?: File
  }