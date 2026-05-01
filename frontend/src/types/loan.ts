export const LoanType = {
  Fixed: 0,
  Decreasing: 1,
} as const;

export type LoanType = (typeof LoanType)[keyof typeof LoanType];

export const PaymentStatus = {
  Pending: 0,
  Paid: 1,
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export interface LoanSimulationRequest {
  UserId: string;
  Amount: number;
  Term: number;
  MonthlyIncome: number;
  LoanType: LoanType;
  TEA: number;
}

export interface LoanSchedule {
  installmentNumber: number;
  dueDate: string;
  totalPayment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface LoanSimulationResponse {
  monthlyInstallment: number;
  totalInterest: number;
  totalPayment: number;
  schedules: LoanSchedule[];
}

export interface ApiValidationError {
  title?: string;
  status?: number;
  errors?: Record<string, string[]>; // Ejemplo: { "TEA": ["La TEA debe estar entre 0.18 y 0.35"] }
}

export interface ScheduleDto {
  paymentNumber: number;
  dueDate: string;
  totalPayment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  status: PaymentStatus;
}

export interface LoanSimulationResponse {
  loanId: string;
  status: string;
  monthlyPayment: number;
  schedule: ScheduleDto[];
}
