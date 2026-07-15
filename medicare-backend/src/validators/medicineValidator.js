const { z } = require('zod');

const medicineSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Medicine name is required' }).min(1),
    category: z.enum(['Pill', 'Syrup', 'Injection', 'Drops', 'Inhaler', 'Other']).default('Pill'),
    dosage: z.string({ required_error: 'Dosage is required' }),
    frequency: z.array(z.enum(['Morning', 'Afternoon', 'Night'])).min(1, 'Select at least one frequency'),
    reminderTimes: z.array(z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, 'Invalid time format (HH:mm)')),
    duration: z.object({
      startDate: z.string().or(z.date()),
      endDate: z.string().or(z.date()),
    }),
    doctorName: z.string().optional(),
    notes: z.string().max(500).optional(),
    priority: z.enum(['Low', 'Medium', 'High']).default('Medium'),
    colorLabel: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color').optional(),
  }),
});

module.exports = {
  medicineSchema,
};
