import { z } from "zod";

export const leadInquirySchema = z.object({
  name: z.string().trim().min(2, "Please add your name.").max(80),
  businessName: z
    .string()
    .trim()
    .min(2, "Please add your business name.")
    .max(120),
  businessType: z
    .string()
    .trim()
    .min(2, "Please describe the business type.")
    .max(80),
  projectGoal: z
    .string()
    .trim()
    .min(20, "Please share a bit more detail about the project.")
    .max(1200),
  preferredContact: z.enum(["Telegram", "Email"]),
  contactValue: z
    .string()
    .trim()
    .min(3, "Please share your Telegram handle or email.")
    .max(120),
});

export type LeadInquiry = z.infer<typeof leadInquirySchema>;

export function mapLeadInquiryToInsert(lead: LeadInquiry) {
  return {
    name: lead.name,
    business_name: lead.businessName,
    business_type: lead.businessType,
    project_goal: lead.projectGoal,
    preferred_contact: lead.preferredContact,
    contact_value: lead.contactValue,
  };
}
