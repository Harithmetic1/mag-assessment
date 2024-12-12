"use client";
import React, { useEffect, useState } from "react";
import FormInput from "./shared/FormInput";
import CustomButton from "./shared/CustomButton";
import { useForm } from "react-hook-form";
import { leadPayloadType } from "../api/leads/model";
import { useMutation } from "@tanstack/react-query";
import { processFormDataPayload } from "../utils/utils";
import ImageContainer from "./shared/ImageContainer";

const HeaderForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<leadPayloadType>({
    defaultValues: {
      fullName: "",
      consent: false,
      email: "",
      leadId: "",
    },
  });

  const [leadError, setleadError] = useState("");

  const formValue = watch();

  const {
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    error: submitLeadError,
  } = useMutation({
    mutationKey: ["lead", formValue.email],
    mutationFn: async (data: FormData) => {
      const submitLeadReq = await fetch("/api/leads", {
        method: "POST",
        body: data,
      });

      const request = await submitLeadReq.json();

      if (!submitLeadReq.ok) {
        throw new Error(`Could not submit lead: ${request.error}`);
      }

      return request;
    },
    onError: (err) => {
      setleadError(err.message);
      setShowStatus(true);
    },
  });

  const [showStatus, setShowStatus] = useState(false);

  const handleSubmitLead = async (data: leadPayloadType) => {
    const formDataPayload = processFormDataPayload(data);

    await mutateAsync(formDataPayload);

    setShowStatus(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setShowStatus(false);
      setleadError("");
    }, 5000);
  }, [showStatus]);

  return (
    <form
      className="w-full flex-start gap-6 flex-col h-full relative"
      onSubmit={handleSubmit(handleSubmitLead)}
    >
      {showStatus && isSuccess && (
        <span className="text-green-400 text-lg">
          Thank you for contacting us, a member of the team should reach out to
          you soon!
        </span>
      )}
      {showStatus && leadError !== "" && (
        <span className="text-red-400 text-lg">{leadError}</span>
      )}
      <div className="absolute -top-14 right-0">
        <ImageContainer
          src="/icons/form_big_star.png"
          alt="form star"
          className="hover:animate-ping"
          w={68}
          h={68}
        />
      </div>
      <div className="flex-center flex-col w-full gap-6">
        <FormInput
          register={register}
          label="Full name"
          name="fullName"
          errors={errors}
          options={{
            required: "Full Name is required",
          }}
        />
        <FormInput
          register={register}
          label="Email address"
          name="email"
          errors={errors}
          options={{
            required: "Email Address is required",
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "Email Address must be valid",
            },
          }}
        />
        <FormInput
          register={register}
          label="consent"
          name="consent"
          inputType="checkbox"
          errors={errors}
          options={{
            required: "Consent is required",
          }}
        />
      </div>

      <div className="w-full flex-start items-start flex-col gap-4">
        <div className="flex-center w-full flex-col lg:flex-row gap-3">
          <CustomButton btnName="Book your demo" isPending={isPending} />
          <CustomButton
            isLink
            href="/"
            btnName="Start a free trial"
            invertBtn
          />
        </div>
        <p className="text-accent">Free 14-day trial. Cancel anytime.</p>
      </div>
    </form>
  );
};

export default HeaderForm;
