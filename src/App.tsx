/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './store/StoreContext';
import PublicStore from './pages/PublicStore';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicStore />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
