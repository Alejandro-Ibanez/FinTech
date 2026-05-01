import api from "../lib/api";
import {
  type TransactionResponse,
  type TransactionType,
  type TransactionStatus,
  type TransactionRequest,
} from "../types/transaction";

export const transactionService = {
  /**
   * Obtiene todas las transacciones con filtros opcionales.
   * @param type - El valor numérico de TransactionType
   * @param status - El valor numérico de TransactionStatus
   */
  getAll: async (
    type?: TransactionType,
    status?: TransactionStatus,
  ): Promise<TransactionResponse[]> => {
    const response = await api.get<TransactionResponse[]>("/transactions", {
      params: {
        type,
        status,
      },
    });
    return response.data;
  },
  create: async (request: TransactionRequest): Promise<TransactionResponse> => {
    const response = await api.post<TransactionResponse>(
      "/transactions",
      request,
    );
    return response.data;
  },
};
