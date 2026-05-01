import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { loanSchema } from '../lib/validation';
import type { LoanFormData } from '../lib/validation';
import { loanService } from '../services/loanService';
import { LoanType, type LoanSimulationResponse, type LoanSimulationRequest, type ApiValidationError} from '../types/loan';

interface Props {
  onSimulated: (data: LoanSimulationResponse, request: LoanSimulationRequest) => void;
}

export const LoanForm = ({ onSimulated }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(loanSchema),
    defaultValues: { 
      userId: 'user-alpha-01',
      loanType: 'Fixed',
      tea: 20,
      amount: 1000,
      term: 12,
      monthlyIncome: 1500
    }
  });

  const currentUserId = watch('userId');

  const onSubmit = async (values: LoanFormData): Promise<void> => {
    try {
      const payload: LoanSimulationRequest = {
        UserId: values.userId || "user-alpha-01", 
        Amount: Number(values.amount),
        Term: Number(values.term),
        TEA: Number(values.tea) / 100, 
        LoanType: values.loanType === 'Fixed' ? LoanType.Fixed : LoanType.Decreasing,
        MonthlyIncome: Number(values.monthlyIncome)
      };

      const result = await loanService.simulate(payload);
      onSimulated(result, payload);
      
    } catch (err: unknown) {
      if (axios.isAxiosError<ApiValidationError>(err)) {
        const serverError = err.response?.data;
        if (serverError?.errors) {
          const messages = Object.values(serverError.errors).flat().join('\n');
          alert(`Error de validación:\n${messages}`);
        } else {
          alert(serverError?.title || "Error inesperado en el servidor");
        }
      } else {
        alert("Ocurrió un error de conexión.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight italic">Simulador de Crédito</h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Configuración de parámetros financieros</p>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Perfil del Solicitante</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setValue('userId', 'user-alpha-01')}
            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
              currentUserId === 'user-alpha-01' 
                ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
            }`}
          >
            User Alpha 01
          </button>
          <button
            type="button"
            onClick={() => setValue('userId', 'user-beta-02')}
            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
              currentUserId === 'user-beta-02' 
                ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
            }`}
          >
            User Beta 02
          </button>
        </div>
        <input type="hidden" {...register('userId')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-600">Monto del Crédito ($)</label>
          <input 
            type="number" 
            {...register('amount')} 
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-600">Ingresos Mensuales ($)</label>
          <input 
            type="number" 
            {...register('monthlyIncome')} 
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-600">Plazo (meses)</label>
          <input 
            type="number" 
            {...register('term')} 
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-600">TEA (%)</label>
          <input 
            type="number" 
            step="0.01"
            {...register('tea')} 
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-600">Sistema de Amortización</label>
        <select 
          {...register('loanType')} 
          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none appearance-none cursor-pointer"
        >
          <option value="Fixed">FRANCÉS (CUOTA FIJA)</option>
          <option value="Decreasing">ALEMÁN (CUOTA VARIABLE)</option>
        </select>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-100 disabled:bg-slate-200 uppercase text-[12px] tracking-[0.3em]"
      >
        {isSubmitting ? 'Procesando...' : 'Calcular Simulación'}
      </button>
    </form>
  );
};