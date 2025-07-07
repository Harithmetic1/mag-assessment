
export interface TimerObjectDef {
    stop: () => TimerObjectDef
    start: () => TimerObjectDef
    reset: () => TimerObjectDef
}

export class ServerActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServerActionError";
  }
}

// Types for the result object with discriminated union
type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

type Result<T, E = ServerActionError> = Success<T> | Failure<E>;

// Main wrapper function
export async function tryCatch<T, E = ServerActionError>(
  promise: Promise<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorType?: new (...args: any[]) => E
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    // If an error is of type server error return the server action error instance
    if (error instanceof ServerActionError) {
      return { data: null, error: error as E };
    }

    // If an error type is provided, return it
    if (errorType) {
      return { data: null, error: error as E };
    }

    // If no error type is provided, return a generic error
    return { data: null, error: error as E };
  }
}

export function Timer(fn: () => void, t: number | undefined): TimerObjectDef {

    let timerObj: ReturnType<typeof setInterval> | undefined;

    const stop = function() {
        if (timerObj) {
            clearInterval(timerObj);
            timerObj = undefined
        }
        return methods;
    }

    // start timer using current settings (if it's not already running)
    const start = function() {
        if (!timerObj) {
           stop();
            timerObj = setInterval(fn, t);
        }
        return methods;
    }

    // start with new or original interval, stop current interval
    const reset = function(newT = t) {
        t = newT;
        return stop().start();
    }

    const methods: TimerObjectDef = { start, stop, reset }
    return methods;
}


export enum TimeSlotCardState {
    AVAILABLE = "available",
    SELECTED = "selected",
    BOOKED = "booked"
}

export function processFormDataPayload(data: Record<string, any>){
    const fd = new FormData();
    for (const [key, value] of Object.entries(data)) {
        fd.append(key, String(value));
      }

      return fd;
}

export const getAviailableTimeSlots = (): Record<string, any>[] => {
    const availableTimeSlots = [];
    let timeSlot;
    for (let i = 9; i <= 18; i++) {
      if (i > 12) {
        timeSlot = {
          time: `${i - 12}:00 PM`,
          value: `${i}:00:00`,
        };
      } else {
        timeSlot = {
          time: `${i}:00 AM`,
          value: `${i < 10 ? "0" + i: i}:00:00`,
        };
      }

      if (i == 12) {
        timeSlot.time = `${i}:00 PM`;
      }
      availableTimeSlots.push(timeSlot);
    }
    return availableTimeSlots;
  };


 export const formatDate = (d: Date) => {
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };