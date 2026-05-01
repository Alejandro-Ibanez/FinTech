import { useEffect, useState } from 'react';
import { loanService } from '../services/loanService';
import type { LoanSimulationResponse } from '../types/loan';
import { Link } from 'react-router-dom';

export const MyLoansPage = () => {
  const [loans, setLoans] = useState<LoanSimulationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeUser, setActiveUser] = useState("user-alpha-01");

  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      try {
        const data = await loanService.getAll(activeUser);
        setLoans(data);
      } catch (err) {
        console.error("Error al cargar préstamos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, [activeUser]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Selector de Usuario - Estilo Fintech */}
      <div className="flex justify-center mb-10">
        <div className="bg-slate-100 p-1 rounded-2xl flex gap-1 border border-slate-200">
          <button
            onClick={() => setActiveUser("user-alpha-01")}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeUser === "user-alpha-01" 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            User Alpha
          </button>
          <button
            onClick={() => setActiveUser("user-beta-02")}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeUser === "user-beta-02" 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            User Beta
          </button>
        </div>
      </div>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Mis Préstamos
          </h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
            Expedientes de: <span className="text-blue-600">{activeUser}</span>
          </p>
        </div>
        <Link 
          to="/loans/simulate" 
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 uppercase tracking-widest"
        >
          + Nueva Simulación
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {loans.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-20 text-center">
              <div className="mb-4 text-slate-200 flex justify-center">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-400 font-black uppercase text-xs tracking-widest">
                No hay préstamos activos para este perfil
              </p>
            </div>
          ) : (
            loans.map((loan) => (
              <div 
                key={loan.loanId} 
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-blue-400 hover:shadow-2xl transition-all group"
              >
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    <span className="font-black text-xl">$</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">REF: {loan.loanId.split('-')[0]}</p>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                      ${loan.monthlyPayment.toFixed(2)} <span className="text-sm text-slate-400 font-medium">/ mes</span>
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black rounded-md uppercase">
                        {loan.status}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[9px] font-black rounded-md uppercase">
                        {loan.schedule.length} Cuotas
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                  <Link 
                    to={`/loans/${loan.loanId}`}
                    className="w-full md:w-auto text-center px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all uppercase tracking-widest text-[10px] shadow-lg shadow-slate-200"
                  >
                    Gestionar Crédito
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};