"use client";
import React, { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import TimeSlotCards from "./shared/TimeSlotCards";
import FormInput from "./shared/FormInput";
import CustomButton from "./shared/CustomButton";
import { useComponentStore } from "../store/componentStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { bookingType } from "../api/booking/model";
import {
  formatDate,
  getAviailableTimeSlots,
  processFormDataPayload,
} from "../utils/utils";

const BookingModal = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [bookingDateCollection, setBookingDateCollection] = useState<
    Record<string, any>
  >([]);
  const [selectedDateBookedTime, setSelectedDateBookedTime] = useState<
    string[]
  >([""]);
  const [scrollY, setScrollY] = useState(0);
  const [showStatus, setShowStatus] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<bookingType>({
    defaultValues: {
      bookingDate: "",
      bookingEmail: "",
      bookingName: "",
      bookingTime: "",
      bookingNote: "",
      bookingPhoneNumber: "",
      bookingConsent: false,
    },
  });
  const queryClient = useQueryClient();

  const openModal = useComponentStore((state) => state.openModal);
  const setOpenModal = useComponentStore((state) => state.setOpenModal);
  const selectedTimeSlot = useComponentStore((state) => state.selectedTimeSlot);

  // const handleSetScrollY = () => {
  //   if (openModal) {
  //     setScrollY(window.scrollY);
  //   }
  // };

  useEffect(() => {
    // This code runs only in the browser
    setScrollY(window.scrollY);
    queryClient.refetchQueries({
      queryKey: ["bookings"],
      refetchType: "active",
    });
  }, [openModal]);

  useEffect(() => {
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowStatus(false);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [showStatus]);

  const handleSelectedBookedTime = () => {
    let index;
    if (selectedDate) {
      index = formatDate(selectedDate);
    } else {
      index = formatDate(today);
    }
    setSelectedDateBookedTime(bookingDateCollection[index] ?? []);
  };

  const handleCollectBookedTimes = (bookings: Record<string, any>[]) => {
    const bookingDateCollection: Record<string, any> = {};

    bookings.forEach((booking) => {
      if (bookingDateCollection[booking["bookingDate"]]) {
        bookingDateCollection[booking["bookingDate"]].push(
          booking["bookingTime"]
        );
      } else {
        bookingDateCollection[booking["bookingDate"]] = [
          booking["bookingTime"],
        ];
      }
    });

    // console.log(bookingDateCollection);
    setBookingDateCollection(bookingDateCollection);
  };

  const { data, isError, error } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const getBookingsReq = await fetch(`/api/booking`);

      const request = await getBookingsReq.json();

      if (!getBookingsReq.ok) {
        setShowStatus(true);
        throw new Error(request.error);
      }
      return request;
    },
  });

  useEffect(() => {
    if (data) {
      handleCollectBookedTimes(data.data);
    }
  }, [data]);

  const formValue = watch();

  const {
    mutateAsync,
    isPending,
    isSuccess,
    isError: makeBookingReqIsError,
    error: makeBookingReqError,
  } = useMutation({
    mutationKey: ["make-booking", formValue.bookingEmail],
    mutationFn: async (data: FormData) => {
      const makeBookingReq = await fetch("/api/booking", {
        method: "POST",
        body: data,
      });

      const request = await makeBookingReq.json();

      if (!makeBookingReq.ok) {
        setShowStatus(true);
        throw new Error(`Could not make booking: ${request.error}`);
      }

      return request;
    },
  });

  useEffect(() => {
    handleSelectedBookedTime();
  }, [data, bookingDateCollection, selectedDate]);

  const handleSubmitBooking = async (data: bookingType) => {
    if (selectedDate) {
      data.bookingDate = formatDate(selectedDate);
    }

    if (selectedTimeSlot) {
      data.bookingTime = selectedTimeSlot;
    }

    data.bookingPhoneNumber = data.bookingPhoneNumber.split(" ").join("");
    // Convert data to FormData format
    const formDataPayload = processFormDataPayload(data);

    await mutateAsync(formDataPayload);
    setShowStatus(true);
    await queryClient.refetchQueries({ queryKey: ["bookings"] });

    const timeout = setTimeout(() => {
      setOpenModal(false);
    }, 3000);

    clearTimeout(timeout);
  };

  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleModalOutsideClick = (e: MouseEvent | TouchEvent) => {
    // console.log(e.target);

    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setOpenModal(false);
    }
  };

  useEffect(() => {
    if (openModal) {
      document.addEventListener("click", handleModalOutsideClick);
    } else {
      document.removeEventListener("click", handleModalOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleModalOutsideClick);
    };
  }, [openModal]);

  return (
    <div
      style={{
        top: scrollY,
        left: 0,
      }}
      className={` ${
        openModal ? "flex" : "hidden"
      } flex-center modal-grey-bg absolute w-full h-full top-0 left-0 z-10`}
    >
      <div
        ref={modalRef}
        className="modal max-h-[83.33%] h-5/6 bg-background rounded-2xl lg:rounded-[50px] flex-center flex-col w-11/12 lg:w-10/12 py-4"
      >
        <div className="w-11/12 lg:p-10 flex-start flex-col h-full modal-overflow overflow-auto gap-10">
          <div className="modal-header flex-between w-full">
            <h1 className="text-2xl lg:text-4xl text-text-body font-quicksand font-semibold">
              Schedule a call at a time that suits you
            </h1>
            <button
              onClick={() => setOpenModal(false)}
              className="bg-btn-secondary p-3 text-white rounded-md"
            >
              <IoMdClose fontSize={24} />
            </button>
          </div>
          <div className="modal-booking flex-center flex-col lg:flex-row lg:justify-evenly w-full items-start gap-10 lg:gap-20">
            <div className="flex-center rounded-md flex-col w-full gap-4">
              <div>
                <h2>Select a Date</h2>
              </div>
              <DayPicker
                className="border border-primary rounded-md"
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                footer={
                  selectedDate
                    ? `Selected: ${selectedDate.toLocaleDateString()}`
                    : "Pick a day."
                }
              />
            </div>
            <div className="flex-center flex-col w-full gap-4">
              {showStatus && isError && (
                <span className="text-red-500">{error.message}</span>
              )}
              <div>
                <h2>Select a Time</h2>
              </div>
              <div className="timings grid grid-cols-2 lg:grid-cols-3 items-center align-middle justify-center gap-4">
                {getAviailableTimeSlots().map((timeSlot) => (
                  <TimeSlotCards
                    key={timeSlot.time}
                    timeSlot={timeSlot.time}
                    timeSlotValue={timeSlot.value}
                    bookedTimeSlots={selectedDateBookedTime}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-full bg-secondary flex-center flex-col items-start rounded-3xl py-10">
            {showStatus && isSuccess && (
              <span className="text-green-400 w-11/12 text-lg lg:text-xl">
                Thank you for requesting for a booking. Someone from the team
                should reach out to you soon!
              </span>
            )}

            {showStatus && makeBookingReqIsError && (
              <span className="text-red-400 w-11/12 text-lg lg:text-xl">
                {makeBookingReqError.message}
              </span>
            )}
            <form
              onSubmit={handleSubmit(handleSubmitBooking)}
              className="flex-center flex-col gap-10 lg:w-full w-full h-full"
            >
              <div className="flex-center flex-col lg:flex-row gap-10 w-11/12 h-full">
                <div className="name_email w-11/12 h-full flex-center justify-start gap-4 flex-col">
                  <FormInput
                    register={register}
                    label="Full name"
                    name="bookingName"
                    options={{
                      required: "Full Name is required",
                    }}
                    className="bg-white text-black"
                    errors={errors}
                  />
                  <FormInput
                    register={register}
                    label="Email Address"
                    name="bookingEmail"
                    options={{
                      required: "Email Address is required",
                      pattern: {
                        value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                        message: "Email Address must be valid",
                      },
                    }}
                    className="bg-white text-black"
                    errors={errors}
                  />
                  <FormInput
                    register={register}
                    label="Phone Number"
                    name="bookingPhoneNumber"
                    inputType="phone"
                    setValue={setValue}
                    value={formValue.bookingPhoneNumber}
                    options={{
                      required: "Phone Number is required",
                    }}
                    className="bg-white text-black"
                    errors={errors}
                  />
                </div>
                <div className="notes flex-start flex-col gap-4 w-11/12 h-full">
                  <FormInput
                    register={register}
                    label="Call notes"
                    name="bookingNote"
                    inputType="textarea"
                    errors={errors}
                    className="bg-white text-black"
                    options={{
                      required: "Call Notes is required",
                    }}
                  />
                  <div className="w-full">
                    <FormInput
                      register={register}
                      label="Consent"
                      name="bookingConsent"
                      inputType="checkbox"
                      errors={errors}
                      className="bg-white text-black"
                      options={{
                        required: "Consent is required",
                      }}
                    />
                  </div>
                  <div className="flex-start justify-end w-full">
                    <div className="w-full lg:w-6/12">
                      <CustomButton
                        btnName="Schedule my call"
                        isPending={isPending}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
