import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as z from "zod";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Auth validation schemas
export const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = loginSchema.extend({
	name: z.string().min(2, "Name must be at least 2 characters"),
	terms: z.boolean().refine((val) => val === true, "You must accept terms"),
	// Additional fields for education background
	department: z.string().min(1, "Please select a department"),
	institution: z.string().min(1, "Please select an institution"),
	educationLevel: z.string().min(1, "Please select education level"),
	program: z.string().min(1, "Program is required"),
	graduationYear: z.string().min(1, "Please select graduation year"),
});

// Infer types from schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignUpFormData = z.infer<typeof signupSchema>;
