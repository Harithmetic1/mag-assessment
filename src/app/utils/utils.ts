
export interface TimerObjectDef {
    stop: () => TimerObjectDef
    start: () => TimerObjectDef
    reset: () => TimerObjectDef
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