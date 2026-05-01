import { loanService } from '../services/loanService';
import type { LoanSimulationResponse, LoanSimulationRequest } from '../types/loan';

interface Props {
  data: LoanSimulationResponse;
  originalRequest?: LoanSimulationRequest;
  isReadOnly?: boolean;
}

export const LoanResultTable = ({ data, originalRequest, isReadOnly = false }: Props) => {
  if (!data || !data.schedule) return null;

  const handleRequestLoan = async () => {
    if (!originalRequest) return;

    try {
      await loanService.create(originalRequest);
      alert(`¡Préstamo solicitado con éxito para ${originalRequest.UserId}!`);
      window.location.href = '/loans';
    } catch (err: unknown) {
      console.error(err);
      alert("Error al procesar la solicitud financiera.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-200">
          <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest">Cuota Mensual</p>
          <h3 className="text-3xl font-black">${(data.monthlyPayment || 0).toFixed(2)}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Estado</p>
          <h3 className="text-xl font-bold text-slate-800 uppercase italic">{data.status || 'Simulación'}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Referencia</p>
          <h3 className="text-xs font-mono text-slate-500 truncate">{data.loanId || 'Draft'}</h3>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase">N°</th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase">Fecha</th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase">Cuota</th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase text-center">Estado</th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase text-right">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.schedule.map((row) => {
                const isPaid = row.status === 1;
                return (
                  <tr key={row.paymentNumber} className={`transition-colors ${isPaid ? 'bg-emerald-50/40' : 'hover:bg-blue-50/50'}`}>
                    <td className="p-4 font-bold text-slate-700">{row.paymentNumber}</td>
                    <td className="p-4 text-slate-500 text-sm">{new Date(row.dueDate).toLocaleDateString()}</td>
                    <td className={`p-4 font-bold ${isPaid ? 'text-emerald-600 line-through' : 'text-blue-600'}`}>
                      ${(row.totalPayment || 0).toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      {isPaid ? (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase italic">Pagado</span>
                      ) : (
                        <span className="px-3 py-1 bg-slate-100 text-slate-400 text-[10px] font-black rounded-full uppercase italic">Pendiente</span>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-slate-800 text-right">${row.remainingBalance.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {!isReadOnly && originalRequest && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">¿Confirmar solicitud para {originalRequest.UserId}?</p>
          <button 
            onClick={handleRequestLoan}
            className="px-12 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 transition-all transform active:scale-95 uppercase text-[12px] tracking-[0.2em]"
          >
            Confirmar y Solicitar Préstamo
          </button>
        </div>
      )}     
    </div>
  );
};