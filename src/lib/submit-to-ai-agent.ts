"use server"

export const submitLeadToAIAgent = async (data: FormData) => {
      const makeBookingReq = await fetch(`${process.env.N8N_FLOW_API}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.N8N_FLOW_API_JWT}`
        },
        body: data,
      });

      const request = await makeBookingReq.json();

      if (!makeBookingReq.ok) {
        throw new Error(`Could not make booking: ${request.error}`);
      }

      return request;
}