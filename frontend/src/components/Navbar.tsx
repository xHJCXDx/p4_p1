import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold hover:text-gray-100 transition-colors">
          TP Programación IV - U5
        </Link>
        <div className="flex gap-6">
          <Link
            to="/categorias"
            className="text-white hover:text-gray-100 font-semibold transition-colors"
          >
            Categorías
          </Link>
          <Link
            to="/productos"
            className="text-white hover:text-gray-100 font-semibold transition-colors"
          >
            Productos
          </Link>
          <Link
            to="/ingredientes"
            className="text-white hover:text-gray-100 font-semibold transition-colors"
          >
            Ingredientes
          </Link>
          <Link
            to="/pedidos"
            className="text-white hover:text-gray-100 font-semibold transition-colors"
          >
            Pedidos
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
