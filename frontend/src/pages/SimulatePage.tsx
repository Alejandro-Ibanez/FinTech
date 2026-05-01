import { useState } from 'react';
import { LoanForm } from '../components/LoanForm';
import { LoanResultTable } from '../components/LoanResultTable';
import type { LoanSimulationResponse, LoanSimulationRequest } from '../types/loan';

export const SimulatePage = () => {
  const [simulation, setSimulation] = useState<LoanSimulationResponse | null>(null);
  
  const [requestData, setRequestData] = useState<LoanSimulationRequest | null>(null);

  const handleSimulated = (result: LoanSimulationResponse, originalRequest: LoanSimulationRequest) => {
    setSimulation(result);
    setRequestData(originalRequest);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-slate-900 uppercase">Simulador de Préstamos</h1>
        <p className="text-slate-500">Obtén una proyección detallada de tus cuotas en segundos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Columna del Formulario */}
        <div className="lg:col-span-4">
          <LoanForm onSimulated={handleSimulated} />
        </div>

        {/* Columna de la Tabla de Resultados */}
        <div className="lg:col-span-8">
          {simulation && requestData ? (
            <LoanResultTable data={simulation} originalRequest={requestData} />
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-10 text-slate-400">
              <p className="text-center font-medium">
                Completa el formulario para ver tu <br /> cronograma de pagos.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};