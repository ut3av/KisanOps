import { z } from 'zod';

export const TaskCategoryEnum = z.enum([
  'ploughing',
  'sowing',
  'spraying',
  'harvesting',
  'threshing',
  'transport',
]);

export const UrgencyEnum = z.enum(['low', 'normal', 'urgent']);

export const FarmerRequirementIntentSchema = z.object({
  task_category: TaskCategoryEnum.nullable(),
  crop_name: z.string().nullable(),
  farm_acres: z.number().positive().nullable(),
  target_date: z.string().nullable(),
  target_location: z.string().nullable(),
  machine_type_required: z.string().nullable(),
  urgency: UrgencyEnum.nullable(),
  additional_requirements: z.string().nullable(),
  search_radius_km: z.number().positive().nullable().optional(),
});

export type FarmerRequirementIntentDto = z.infer<typeof FarmerRequirementIntentSchema>;
