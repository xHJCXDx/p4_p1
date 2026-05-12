import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CategoriasPage from './pages/CategoriasPage';
import ProductsPage from './pages/ProductsPage';
import IngredientesPageRefactored from './pages/IngredientesPageRefactored';
import PedidosPageRefactored from './pages/PedidosPageRefactored';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/ingredientes" element={<IngredientesPageRefactored />} />
          <Route path="/pedidos" element={<PedidosPageRefactored />} />
          <Route path="/" element={<Navigate to="/categorias" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
