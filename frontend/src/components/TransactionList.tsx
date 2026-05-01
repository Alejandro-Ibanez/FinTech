import type { TransactionResponse } from '../types/transaction';

interface Props {
  transactions: TransactionResponse[];
}

export const TransactionList = ({ transactions }: Props) => {
  if (transactions.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
        <p className="font-bold uppercase tracking-widest text-xs">Sin movimientos registrados</p>
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'completed') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (s === 'pending') return 'bg-amber-100 text-amber-700 border-amber-200';
    if (s === 'failed') return 'bg-rose-100 text-rose-700 border-rose-200';
    return 'bg-slate-100 text-slate-600 border-slate-200';
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Tipo</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-right">Monto</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-center">Estado</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Idempotencia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-5 text-sm text-slate-600 font-medium">
                  {new Date(t.createdAt).toLocaleDateString(undefined, { 
                    day: '2-digit', month: 'short', year: 'numeric' 
                  })}
                </td>
                <td className="p-5">
                  <span className="text-[10px] font-black px-2 py-1 bg-slate-100 rounded-md text-slate-500 uppercase tracking-tighter">
                    {t.type}
                  </span>
                </td>
                <td className="p-5 text-right font-black text-slate-900 text-lg">
                  ${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="p-5 text-center">
                  <span className={`text-[10px] font-black px-3 py-1.5 rounded-full border uppercase ${getStatusStyle(t.status)}`}>
                    {t.status}
                  </span>
                </td>
                <td className="p-5">
                  <code className="text-[10px] bg-slate-50 px-2 py-1 rounded text-slate-400 font-mono">
                    {t.idempotencyKey.substring(0, 12)}...
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};