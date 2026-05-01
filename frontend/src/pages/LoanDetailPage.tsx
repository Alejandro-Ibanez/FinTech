import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { loanService } from '../services/loanService';
import { transactionService } from '../services/transactionService';
import { LoanResultTable } from '../components/LoanResultTable';
import { TransactionList } from '../components/TransactionList';
import { PaymentModal } from '../components/PaymentModal';
import type { LoanSimulationResponse } from '../types/loan';
import type { TransactionResponse } from '../types/transaction';

export const LoanDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [loan, setLoan] = useState<LoanSimulationResponse | null>(null);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [loanData, allTransactions] = await Promise.all([
          loanService.getById(id),
          transactionService.getAll()
        ]);
        setLoan(loanData);
        setTransactions(allTransactions.filter(t => t.loanId === id));
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);


  const nextInstallment = loan?.schedule.find(s => s.status !== 1);
  const isFullyPaid = !nextInstallment;

  const handlePaymentSuccess = async () => {
    setShowPaymentModal(false);
    if (!id) return;

    const [loanData, allTransactions] = await Promise.all([
      loanService.getById(id),
      transactionService.getAll()
    ]);
    setLoan(loanData);
    setTransactions(allTransactions.filter(t => t.loanId === id));
  };

  if (loading && !loan) return <div className="p-20 text-center font-black animate-pulse">Sincronizando...</div>;
  if (!loan) return <div className="p-20 text-center">No se encontró el expediente.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <Link to="/loans" className="p-3 bg-white border border-slate-100 rounded-2xl">←</Link>
          <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Gestión de Crédito</h1>
        </div>

        <button 
          onClick={() => setShowPaymentModal(true)}
          disabled={isFullyPaid}
          className={`px-8 py-4 font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl transition-all ${
            isFullyPaid 
            ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 hover:-translate-y-1'
          }`}
        >
          {isFullyPaid ? 'Crédito Finalizado' : 'Aplicar Siguiente Pago'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-12">
        <section className="space-y-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Cronograma de Pagos</h2>
          <LoanResultTable data={loan} isReadOnly={true} />
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Historial de Movimientos</h2>
          <TransactionList transactions={transactions} />
        </section>
      </div>

      {showPaymentModal && (
        <PaymentModal 
          loanId={id!} 
          suggestedAmount={nextInstallment?.totalPayment || 0} 
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};