import z from 'zod';

export const companySchema = z.object({
	name: z.string().min(1, { message: 'This field is required.' })
});

export type CompanySchema = typeof companySchema;
export type ICompanySchema = z.infer<typeof companySchema>;
