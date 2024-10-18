import mongoose, { Document, Model, Schema } from 'mongoose';
import Event from './Event';

// Define the interface for the Attendee document
export interface IAttendee extends Document {
  firstName: string;
  lastName: string;
  email: string;
  registeredEvents?: Schema.Types.ObjectId[];
}

// Define the schema for the Attendee
const AttendeeSchema: Schema<IAttendee> = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  registeredEvents: [{
    type: Schema.Types.ObjectId, 
    ref: 'Event',
    required: false 
   }],
});

// Post-findOneAndUpdate hook to automatically update Event's registeredAttendees array
AttendeeSchema.post('findOneAndUpdate', async function(doc) {
  if (doc && doc.registeredEvents.length > 0) {
      try {
          const eventId = doc.registeredEvents[doc.registeredEvents.length - 1]; // Get the most recent eventId
          const attendeeId = doc._id;

          // Add attendeeId to the Event's registeredAttendees array
          await Event.findOneAndUpdate(
              { _id: eventId },
              { $addToSet: { registeredAttendees: attendeeId } }
          );
      } catch (error) {
          console.error('Error updating Event with attendeeId:', error);
          throw new Error('Failed to update Event with the attendeeId.');
      }
  }
});

// Export the Attendee model (reuse if already defined)
const Attendee: Model<IAttendee> = mongoose.models.Attendee || mongoose.model<IAttendee>('Attendee', AttendeeSchema);

export default Attendee;
