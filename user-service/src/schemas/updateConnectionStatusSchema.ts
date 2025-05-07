import { z } from "zod";

const updateConnectionStatusSchema = z.object({
  status: z.enum(["accepted", "rejected"], {
    errorMap: () => ({
      message: "Status must be 'accepted' or 'rejected'",
    }),
  }),
});

export default updateConnectionStatusSchema;
