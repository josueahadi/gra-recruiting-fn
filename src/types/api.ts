export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: "pending" | "reviewing" | "accepted" | "rejected";
  position: string;
  appliedAt: string;
  lastUpdated: string;
  score?: number;
  testResults?: TestResult[];
}

export interface TestResult {
  id: string;
  applicantId: string;
  questionId: string;
  answer: string;
  score: number;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  type: "multiple_choice" | "essay" | "coding";
  difficulty: "easy" | "medium" | "hard";
  category: string;
  points: number;
  active: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
