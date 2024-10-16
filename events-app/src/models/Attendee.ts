import mongoose, { Document, Model, Schema } from 'mongoose';

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
  email: { type: String, required: true },
  registeredEvents: [{
    type: Schema.Types.ObjectId, 
    ref: 'Event',
    required: false 
   }],
});

// Export the Attendee model (reuse if already defined)
const Attendee: Model<IAttendee> = mongoose.models.Attendee || mongoose.model<IAttendee>('Attendee', AttendeeSchema);

export default Attendee;
