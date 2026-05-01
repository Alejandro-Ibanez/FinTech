import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-4xl px-6">
        <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          Sistema de Gestión de Préstamos v1.0
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
          Toma el control de tu <span className="text-blue-600">futuro financiero.</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
          Simula créditos con sistemas Francés o Alemán, visualiza tu cronograma de pagos detallado y gestiona tus préstamos en un solo lugar.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link 
            to="/loans/simulate" 
            className="w-full sm:w-auto px-10 py-4 bg-slate-900 hover:bg-blue-600 text-white font-black rounded-2xl transition-all shadow-2xl shadow-slate-200 transform hover:-translate-y-1 uppercase tracking-widest text-sm"
          >
            Iniciar Simulador
          </Link>
          <Link 
            to="/loans" 
            className="w-full sm:w-auto px-10 py-4 bg-white border-2 border-slate-200 hover:border-blue-600 text-slate-900 font-black rounded-2xl transition-all transform hover:-translate-y-1 uppercase tracking-widest text-sm"
          >
            Ver mis Préstamos
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full px-6">
        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-blue-600 font-black text-2xl mb-2">01.</div>
          <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wider">Simulación Precisa</h3>
          <p className="text-slate-500 text-sm mt-2">Cálculos exactos basados en tasas efectivas anuales y plazos flexibles.</p>
        </div>
        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-blue-600 font-black text-2xl mb-2">02.</div>
          <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wider">Múltiples Sistemas</h3>
          <p className="text-slate-500 text-sm mt-2">Soporte completo para amortización constante o cuota fija.</p>
        </div>
        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-blue-600 font-black text-2xl mb-2">03.</div>
          <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wider">Gestión Real</h3>
          <p className="text-slate-500 text-sm mt-2">Guarda tus simulaciones y conviértelas en préstamos reales en nuestra base de datos.</p>
        </div>
      </div>
    </div>
  );
};