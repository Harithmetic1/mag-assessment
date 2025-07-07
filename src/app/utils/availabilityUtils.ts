"use server"
import { tryCatch } from "./utils";

  export type TimeSlot = {
  start: string;   // ISO date string
  end: string;     // ISO date string
  staffIds: string[]; // Array of UUID strings
};

export type TimeSlotsResponse = TimeSlot[];

  export const getAvailableBusinessTimeSlots = async ( {date} :  { date?: Date | undefined }) => {
    const today = date ? date : new Date()
    const getAvailabilityQueryParams = {
      date: today.toISOString(),
      businessName: "MAG Int Booking Test",
      bookingBusinessServiceName: "Introductory Call - MAG INT test"
    }

    const queryParams = new URLSearchParams(getAvailabilityQueryParams)

    console.log(queryParams.toString());
    

    const { data, error } = await tryCatch(
      fetch(process.env.MAG_BOOKING_API + `/availability?${queryParams.toString()}`)
    )

    if(error !== null){
      console.log(`Could not get the booking time slots: `, error.message);
      return {
        data: null,
        error: error.message
      }
    }

    if(!data.ok){
    console.log(`Could not get the booking time slots: `, data.statusText);
      return {
        data: null,
        error: data.statusText
      }
    }

    const { data: fetchResponse, error: fetchResponseErr } = await tryCatch(data.json() as Promise<TimeSlotsResponse>)

    if(fetchResponseErr !== null){
      console.log(`Could not get response: `, fetchResponseErr);
      
      return {
        data: null,
        error: fetchResponseErr.message
      }
    }

    console.log(`Fetch Response: `, fetchResponse);
    

    return {
      data: fetchResponse,
      error: null
    }
  }