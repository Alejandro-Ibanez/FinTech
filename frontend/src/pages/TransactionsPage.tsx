import { useEffect, useState } from 'react';
import { transactionService } from '../services/transactionService';
import type { TransactionResponse, TransactionType, TransactionStatus } from '../types/transaction';
import { TransactionList } from '../components/TransactionList';

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [type, setType] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const tFilter = type !== "" ? (Number(type) as TransactionType) : undefined;
        const sFilter = status !== "" ? (Number(status) as TransactionStatus) : undefined;

        const data = await transactionService.getAll(tFilter, sFilter);
        setTransactions(data);
      } catch (err) {
        console.error("Error cargando transacciones", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [type, status]);

  return (
    <div className="max-w-6xl mx-auto p-6 animate-in fade-in duration-500 space-y-8">
      <header>
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
          Historial de Transacciones
        </h1>
        <p className="text-slate-500 font-medium">
          Registro detallado de movimientos financieros e idempotencia.
        </p>
      </header>

      {/* Panel de Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tipo de Movimiento</label>
          <select 
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-bold text-slate-700"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Todos los Tipos</option>
            <option value="0">Desembolso</option>
            <option value="1">Pago de Cuota</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Estado del Pago</label>
          <select 
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-bold text-slate-700"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Todos los Estados</option>
            <option value="0">Pendiente</option>
            <option value="1">Completado</option>
            <option value="2">Fallido</option>
          </select>
        </div>
      </div>

      {/* Lista de Transacciones */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Sincronizando movimientos...</p>
        </div>
      ) : (
        <TransactionList transactions={transactions} />
      )}
    </div>
  );
};