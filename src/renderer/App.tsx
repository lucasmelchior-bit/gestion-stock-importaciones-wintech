import { Routes, Route } from 'react-router-dom';
import { Layout } from './shell/Layout';
import { Dashboard } from './pages/Dashboard';
import { Placeholder } from './components/Placeholder';

// Rutas del diseño "Jardín de San José". Las pantallas aún no implementadas
// usan <Placeholder>; se van reemplazando por su versión real, fase por fase.
export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/importaciones" element={<Placeholder title="Importaciones" />} />
        <Route path="/pedidos" element={<Placeholder title="Pedidos" />} />
        <Route path="/stock" element={<Placeholder title="Stock & Alertas" />} />
        <Route path="/productos" element={<Placeholder title="Productos" />} />
        <Route path="/proveedores-adopen" element={<Placeholder title="Proveedores Adopen" />} />
        <Route
          path="/proveedores-logisticos"
          element={<Placeholder title="Proveedores logísticos" />}
        />
        <Route path="/rentabilidad" element={<Placeholder title="Rentabilidad" />} />
        <Route path="/estadisticas" element={<Placeholder title="Estadísticas" />} />
        <Route path="/gastos" element={<Placeholder title="Gastos operativos" />} />
        <Route path="/configuracion" element={<Placeholder title="Ajustes" />} />
        <Route path="/auditoria" element={<Placeholder title="Auditoría" />} />
        <Route path="*" element={<Placeholder title="Pantalla no encontrada" />} />
      </Route>
    </Routes>
  );
}
