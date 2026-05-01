import { useState } from 'react';
import { transactionService } from '../services/transactionService';
import { TransactionType } from '../types/transaction';

interface Props {
  loanId: string;
  suggestedAmount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal = ({ loanId, suggestedAmount, onClose, onSuccess }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      await transactionService.create({
        loanId,
        amount: suggestedAmount,
        type: TransactionType.Payment,
        idempotencyKey: crypto.randomUUID()
      });
      
      onSuccess();
    } catch (err) {
      console.log(err);
      alert("Error al procesar el pago");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-3xl max-w-sm w-full shadow-2xl">
        <h2 className="text-2xl font-black uppercase mb-2">Confirmar Pago</h2>
        <p className="text-slate-500 mb-6 font-medium text-sm">Vas a registrar un abono por un monto de:</p>
        
        <div className="bg-slate-50 p-4 rounded-2xl mb-6">
          <p className="text-[10px] font-black text-slate-400 uppercase">Monto total</p>
          <p className="text-2xl font-black text-blue-600">${suggestedAmount.toFixed(2)}</p>
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 p-4 font-bold text-slate-400">Cancelar</button>
          <button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="flex-1 bg-slate-900 text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest disabled:opacity-50"
          >
            {isProcessing ? 'Procesando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};