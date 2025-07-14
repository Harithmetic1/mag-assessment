"use client";
import React, { useState } from "react";
import { agentLeadType } from "../api/booking/model";
import { processFormDataPayload } from "../utils/utils";
import FormInput from "./shared/FormInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import CustomButton from "./shared/CustomButton";

const ContactForm = () => {

    const [showStatus, setShowStatus] = useState(false);

  const queryClient = useQueryClient();

      const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<agentLeadType>({
    defaultValues: {
      email: "",
      name: "",
      message: "",
      mobile: "",
    },
  });

  const formValue = watch()

      const {
    mutateAsync,
    isPending,
    isSuccess,
    isError: makeBookingReqIsError,
    error: makeBookingReqError,
  } = useMutation({
    mutationKey: ["make-booking", formValue.email],
    mutationFn: async (data: FormData) => {
      const makeBookingReq = await fetch("https://mag-dev.app.n8n.cloud/webhook/92a4bd63-f2cf-4a39-b980-7066f9e45cc6", {
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

      const handleSubmitBooking = async (data: agentLeadType) => {

    data.mobile = data.mobile.split(" ").join("");
    // Convert data to FormData format
    const formDataPayload = processFormDataPayload(data);

    await mutateAsync(formDataPayload);
    setShowStatus(true);
    await queryClient.refetchQueries({ queryKey: ["bookings"] });

  };
     return ( 
        <div className="w-full lg:w-full bg-secondary flex-center flex-col items-start rounded-3xl py-10">
            {showStatus && isSuccess && (
              <span className="text-green-400 w-11/12 px-4 text-lg lg:text-xl">
                Thank you for requesting for a booking. Someone from the team
                should reach out to you soon!
              </span>
            )}

            {showStatus && makeBookingReqIsError && (
              <span className="text-red-400 w-11/12 px-4 text-lg lg:text-xl">
                {makeBookingReqError.message}
              </span>
            )}
         <form
              onSubmit={handleSubmit(handleSubmitBooking)}
              className="flex-center flex-col gap-10 lg:w-full w-full h-full"
            >
              <div className="flex-center flex-col gap-10 w-11/12 h-full">
                <div className="name_email w-11/12 h-full flex-center justify-start gap-4 flex-col">
                  <FormInput
                    register={register}
                    label="Full name"
                    name="name"
                    options={{
                      required: "Full Name is required",
                    }}
                    className="bg-white text-black"
                    errors={errors}
                  />
                  <FormInput
                    register={register}
                    label="Email Address"
                    name="email"
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
                    name="mobile"
                    inputType="phone"
                    setValue={setValue}
                    value={formValue.mobile}
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
                    label="Message"
                    name="message"
                    inputType="textarea"
                    errors={errors}
                    className="bg-white text-black"
                    options={{
                      required: "Message is required",
                    }}
                  />
                  {/* <div className="w-full">
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
                  </div> */}
                  <div className="flex-start justify-start w-full">
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
    ) 
} 
export default ContactForm;