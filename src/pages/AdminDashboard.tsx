import React, { useState, useEffect } from 'react';
import { useStore } from '../store/StoreContext';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Package, 
  Tags, 
  Plus, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag,
  ArrowLeft,
  Bell,
  Check,
  X,
  Search,
  Flame,
  Settings,
  LogOut,
  Lock,
  User,
  Trash2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { categories, products, sales, pendingTransactions, banner, admins, addCategory, updateStock, addProduct, removeProduct, resolvePendingTransaction, updateBanner, updateAdminPassword } = useStore();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'categories' | 'pesanan' | 'banner' | 'settings'>('overview');
  const [searchHistoryQuery, setSearchHistoryQuery] = useState('');
  
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Settings State
  const [newPassword, setNewPassword] = useState('');
  const [settingsMessage, setSettingsMessage] = useState('');
  
  // Category Form State
  const [newCatName, setNewCatName] = useState('');
  
  // Product Form State
  const [newProd, setNewProd] = useState({ name: '', categoryId: '', price: 0, stock: 0, image: '', description: '' });

  // Banner Form State
  const [bannerForm, setBannerForm] = useState(banner);

  useEffect(() => {
    const user = sessionStorage.getItem('kopsudi_admin_user');
    if (user) {
      setIsLoggedIn(true);
      setLoggedInUser(user);
    }
  }, []);

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const totalItemsSold = sales.reduce((sum, sale) => sum + sale.qty, 0);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const admin = admins.find(a => a.username.toLowerCase() === loginUsername.toLowerCase());
    
    if (admin && admin.password === loginPassword) {
      setIsLoggedIn(true);
      setLoggedInUser(admin.username);
      sessionStorage.setItem('kopsudi_admin_user', admin.username);
      setLoginError('');
    } else {
      setLoginError('Username atau password salah.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('kopsudi_admin_user');
    setIsLoggedIn(false);
    setLoggedInUser(null);
    navigate('/');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (loggedInUser && newPassword.trim()) {
      updateAdminPassword(loggedInUser, newPassword.trim());
      setSettingsMessage('Password berhasil diubah.');
      setNewPassword('');
      setTimeout(() => setSettingsMessage(''), 3000);
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatName.trim()) {
      addCategory(newCatName.trim());
      setNewCatName('');
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProd.name && newProd.categoryId) {
      addProduct({
        ...newProd,
        image: newProd.image || 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=600'
      });
      setNewProd({ name: '', categoryId: '', price: 0, stock: 0, image: '', description: '' });
    }
  };

  const handleUpdateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    updateBanner(bannerForm);
    alert('Banner berhasil diperbarui!');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center font-sans p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-red-600/30">
              <Lock className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 text-center">Admin Login</h1>
            <p className="text-gray-500 text-center text-sm mt-1">Masuk untuk mengelola KOPSUDI</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {loginError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                <X className="w-4 h-4 flex-shrink-0" />
                {loginError}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 ml-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 focus:bg-white transition-colors"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 focus:bg-white transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30 flex justify-center items-center gap-2 mt-2"
            >
              Masuk ke Dashboard
            </button>
            
            <div className="text-center mt-4">
              <Link to="/" className="text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors">
                Kembali ke Toko
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col min-h-screen md:min-h-0">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <ShoppingBag className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-xl tracking-tight">AdminPanel</span>
          </div>
          
          <div className="mb-6 px-4 py-3 bg-gray-50 rounded-xl flex items-center gap-3 border border-gray-100">
            <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">
              {loggedInUser?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Masuk sebagai</p>
              <p className="text-sm font-bold text-gray-900">{loggedInUser}</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'overview' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <BarChart3 className="w-5 h-5" />
              Laporan Penjualan
            </button>
            <button
              onClick={() => setActiveTab('pesanan')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'pesanan' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5" />
                Pesanan
              </div>
              {pendingTransactions.length > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {pendingTransactions.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('banner')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'banner' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Flame className="w-5 h-5" />
              Edit Banner
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'inventory' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Package className="w-5 h-5" />
              Manajemen Stok
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'categories' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Tags className="w-5 h-5" />
              Kategori
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'settings' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Settings className="w-5 h-5" />
              Pengaturan
            </button>
          </nav>
        </div>
        
        <div className="p-4 mt-auto border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 hover:text-red-600 p-3 rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
              <p className="text-gray-500">Pantau penjualan KOPSUDI secara real-time.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Pendapatan</p>
                  <p className="text-3xl font-black text-gray-900">Rp {totalRevenue.toLocaleString('id-ID')}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Terjual</p>
                  <p className="text-3xl font-black text-gray-900">{totalItemsSold} <span className="text-lg font-medium text-gray-400">items</span></p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-lg font-bold">Riwayat Transaksi Terbaru</h3>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari transaksi..."
                    value={searchHistoryQuery}
                    onChange={(e) => setSearchHistoryQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 w-full md:w-64 text-sm"
                  />
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {(() => {
                  const filteredSales = sales.filter(sale => {
                    const product = products.find(p => p.id === sale.productId);
                    return product?.name.toLowerCase().includes(searchHistoryQuery.toLowerCase());
                  });
                  
                  if (filteredSales.length === 0) {
                    return <div className="p-8 text-center text-gray-500">Belum ada transaksi yang sesuai.</div>;
                  }

                  return [...filteredSales].reverse().map((sale) => {
                    const product = products.find(p => p.id === sale.productId);
                    return (
                      <div key={sale.id} className="p-4 px-6 flex justify-between items-center hover:bg-gray-50">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{product?.name || 'Produk Dihapus'}</span>
                          <span className="text-xs text-gray-400">{new Date(sale.timestamp).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">x{sale.qty}</span>
                          <span className="font-bold text-green-600">Rp {sale.totalPrice.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    )
                  });
                })()}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'pesanan' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Pesanan Menunggu Konfirmasi</h2>
              <p className="text-gray-500">Konfirmasi atau batalkan pesanan dari pelanggan.</p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100">
                {pendingTransactions.length === 0 ? (
                  <div className="p-8 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <Bell className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium">Belum ada pesanan baru.</p>
                  </div>
                ) : (
                  pendingTransactions.map((tx) => {
                    const product = products.find(p => p.id === tx.productId);
                    return (
                      <div key={tx.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50 transition-colors">
                        <div className="flex gap-4 items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                            <img src={product?.image} alt={product?.name} className="w-full h-full object-contain p-1" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 text-lg">{product?.name || 'Produk Dihapus'}</span>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>{new Date(tx.timestamp).toLocaleString('id-ID')}</span>
                              <span>•</span>
                              <span className="font-semibold text-gray-700">Jumlah: {tx.qty}</span>
                            </div>
                            <span className="font-black text-red-600 mt-1">Rp {tx.totalPrice.toLocaleString('id-ID')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                          <button 
                            onClick={() => resolvePendingTransaction(tx.id, false)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors font-semibold"
                          >
                            <X className="w-4 h-4" /> Tolak
                          </button>
                          <button 
                            onClick={() => resolvePendingTransaction(tx.id, true)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold shadow-sm"
                          >
                            <Check className="w-4 h-4" /> Konfirmasi
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'banner' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Banner Promosi</h2>
              <p className="text-gray-500">Sesuaikan teks dan pengaturan banner hero di halaman utama.</p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm max-w-2xl">
              <form onSubmit={handleUpdateBanner} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tag Promo (Kiri Atas)</label>
                    <input 
                      type="text" 
                      value={bannerForm.promoTagTop} 
                      onChange={e => setBannerForm({...bannerForm, promoTagTop: e.target.value})} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Judul Baris 1 (Putih)</label>
                      <input 
                        type="text" 
                        value={bannerForm.title} 
                        onChange={e => setBannerForm({...bannerForm, title: e.target.value})} 
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Judul Baris 2 (Kuning)</label>
                      <input 
                        type="text" 
                        value={bannerForm.subtitle} 
                        onChange={e => setBannerForm({...bannerForm, subtitle: e.target.value})} 
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Banner</label>
                    <div className="flex items-center gap-4">
                      {bannerForm.image && (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={bannerForm.image} alt="Banner" className="w-full h-full object-contain" />
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setBannerForm({...bannerForm, image: reader.result as string});
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                    <textarea 
                      rows={3}
                      value={bannerForm.description} 
                      onChange={e => setBannerForm({...bannerForm, description: e.target.value})} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Promo</label>
                      <input 
                        type="text" 
                        value={bannerForm.promoTagDate} 
                        onChange={e => setBannerForm({...bannerForm, promoTagDate: e.target.value})} 
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teks Harga Tombol</label>
                      <input 
                        type="text" 
                        value={bannerForm.promoTagPrice} 
                        onChange={e => setBannerForm({...bannerForm, promoTagPrice: e.target.value})} 
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teks Lingkaran Harga (Kanan Atas)</label>
                    <input 
                      type="text" 
                      value={bannerForm.circlePromoPrice} 
                      onChange={e => setBannerForm({...bannerForm, circlePromoPrice: e.target.value})} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" 
                    />
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 cursor-pointer" onClick={() => setBannerForm({...bannerForm, isBestSeller: !bannerForm.isBestSeller})}>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${bannerForm.isBestSeller ? 'bg-red-600 border-red-600' : 'bg-white border-gray-300'}`}>
                      {bannerForm.isBestSeller && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <span className="font-medium text-gray-800 select-none">Tampilkan Stiker "Best Seller"</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button type="submit" className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-sm shadow-red-600/30 flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {activeTab === 'inventory' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
             <div>
              <h2 className="text-2xl font-bold text-gray-900">Manajemen Stok & Produk</h2>
              <p className="text-gray-500">Update stok barang dan tambah produk baru.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Tambah Produk Baru</h3>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nama Produk</label>
                  <input required type="text" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Kategori</label>
                  <select required value={newProd.categoryId} onChange={e => setNewProd({...newProd, categoryId: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">Pilih Kategori...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Harga (Rp)</label>
                  <input required type="number" value={newProd.price || ''} onChange={e => setNewProd({...newProd, price: Number(e.target.value)})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Stok Awal</label>
                  <input required type="number" value={newProd.stock || ''} onChange={e => setNewProd({...newProd, stock: Number(e.target.value)})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-sm font-medium text-gray-700">Deskripsi Produk (Opsional)</label>
                  <input type="text" value={newProd.description} onChange={e => setNewProd({...newProd, description: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-sm font-medium text-gray-700">Gambar Produk</label>
                  <div className="flex items-center gap-4 mt-1">
                    {newProd.image && (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 p-1">
                        <img src={newProd.image} alt="Preview" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewProd({...newProd, image: reader.result as string});
                          };
                          reader.readAsDataURL(file);
                        }
                      }} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" 
                    />
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end mt-2">
                  <button type="submit" className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors">
                    <Plus className="w-4 h-4" /> Tambah Produk
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 font-semibold text-gray-600">Produk</th>
                    <th className="p-4 font-semibold text-gray-600">Harga</th>
                    <th className="p-4 font-semibold text-gray-600 w-48">Stok</th>
                    <th className="p-4 font-semibold text-gray-600 w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium">{product.name}</td>
                      <td className="p-4">Rp {product.price.toLocaleString('id-ID')}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            className="w-20 px-3 py-1 border border-gray-200 rounded-lg text-center focus:outline-none focus:border-red-500"
                            value={product.stock}
                            onChange={(e) => updateStock(product.id, Number(e.target.value))}
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => {
                            if(window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
                              removeProduct(product.id);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'categories' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
             <div>
              <h2 className="text-2xl font-bold text-gray-900">Manajemen Kategori</h2>
              <p className="text-gray-500">Tambah kategori baru untuk ditampilkan di halaman utama.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm max-w-xl">
              <form onSubmit={handleAddCategory} className="flex gap-4 items-end">
                <div className="flex-1 space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nama Kategori Baru</label>
                  <input 
                    type="text" 
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Contoh: Minuman Dingin"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500" 
                  />
                </div>
                <button type="submit" className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors h-10">
                  Simpan
                </button>
              </form>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden max-w-xl">
               <div className="p-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-600">
                 Kategori Aktif
               </div>
               <ul className="divide-y divide-gray-100">
                 {categories.map(cat => (
                   <li key={cat.id} className="p-4 px-6 flex justify-between items-center hover:bg-gray-50">
                     <span className="font-medium text-gray-900">{cat.name}</span>
                     <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{cat.id}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Pengaturan</h2>
              <p className="text-gray-500">Kelola akun dan pengaturan keamanan.</p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm max-w-md">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-gray-400" />
                Ubah Password
              </h3>

              <form onSubmit={handleChangePassword} className="space-y-5">
                {settingsMessage && (
                  <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm font-medium border border-green-100 flex items-center gap-2">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    {settingsMessage}
                  </div>
                )}
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Password Baru</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 focus:bg-white transition-colors"
                    placeholder="Masukkan password baru"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-sm mt-2"
                >
                  Simpan Password
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
