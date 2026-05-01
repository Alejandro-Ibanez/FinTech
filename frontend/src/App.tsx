import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SimulatePage } from './pages/SimulatePage';
import { MyLoansPage } from './pages/MyLoansPage';
import { LoanDetailPage } from './pages/LoanDetailPage';
import { TransactionsPage } from './pages/TransactionsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-black tracking-tighter group">
              SGIP<span className="text-blue-600 group-hover:animate-pulse">.</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              <Link to="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
              <Link to="/loans/simulate" className="hover:text-blue-600 transition-colors">Simulador</Link>
              <Link to="/loans" className="hover:text-blue-600 transition-colors">Mis Préstamos</Link>
              <Link to="/transactions" className="hover:text-blue-600 transition-colors">Transacciones</Link>
            </div>

            <div className="h-8 w-8 bg-slate-900 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
              JD
            </div>
          </div>
        </nav>

        <main className="py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/loans/simulate" element={<SimulatePage />} />
            <Route path="/loans" element={<MyLoansPage />} />
            <Route path="/loans/:id" element={<LoanDetailPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
          </Routes>
        </main>
        
        <footer className="py-10 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.5em]">
          &copy; 2026 FinTech Management System
        </footer>
      </div>
    </Router>
  );
}

export default App;