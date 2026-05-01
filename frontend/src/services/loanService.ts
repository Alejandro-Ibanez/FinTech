import api from "../lib/api";
import type {
  LoanSimulationRequest,
  LoanSimulationResponse,
} from "../types/loan";

export const loanService = {
  simulate: async (
    data: LoanSimulationRequest,
  ): Promise<LoanSimulationResponse> => {
    const response = await api.post<LoanSimulationResponse>(
      "/loans/simulate",
      data,
    );
    return response.data;
  },
  create: async (data: LoanSimulationRequest): Promise<void> => {
    await api.post("/loans", data);
  },

  getAll: async (userId?: string): Promise<LoanSimulationResponse[]> => {
    const response = await api.get<LoanSimulationResponse[]>("/loans", {
      params: { userId },
    });
    return response.data;
  },
  getById: async (id: string): Promise<LoanSimulationResponse> => {
    const response = await api.get<LoanSimulationResponse>(`/loans/${id}`);
    return response.data;
  },
};
