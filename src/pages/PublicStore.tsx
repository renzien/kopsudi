import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Flame, Clock, Star, Search, ChevronDown, AlertCircle, Plus, Minus, X } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { Link } from 'react-router-dom';
import { Product } from '../types';

const PublicStore: React.FC = () => {
  const { categories, products, addPendingTransaction, banner } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [lastPurchased, setLastPurchased] = useState<string | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [checkoutQuantity, setCheckoutQuantity] = useState(1);

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === '' || p.categoryId === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBuyClick = (product: Product) => {
    setCheckoutProduct(product);
    setCheckoutQuantity(1);
  };

  const confirmCheckout = () => {
    if (checkoutProduct) {
      addPendingTransaction(checkoutProduct.id, checkoutQuantity);
      setCartPulse(true);
      setLastPurchased(checkoutProduct.name);
      setTimeout(() => setCartPulse(false), 300);
      setTimeout(() => setLastPurchased(null), 3000);
      setCheckoutProduct(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-red-500 selection:text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center transform rotate-3">
                <Flame className="text-white w-6 h-6" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-red-600">KOPSUDI</span>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.div 
                animate={cartPulse ? { scale: [1, 1.2, 1] } : {}}
                className="relative p-2 bg-orange-100 text-orange-600 rounded-full"
              >
                <ShoppingCart className="w-5 h-5" />
              </motion.div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Banner - Inspired by the poster */}
      <div className="relative bg-red-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
        
        {/* Sunburst background effect */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="w-[150vw] h-[150vw] md:w-[1500px] md:h-[1500px] bg-[conic-gradient(from_0deg,transparent_0_15deg,#ffeb3b_15deg_30deg,transparent_30deg_45deg,#ffeb3b_45deg_60deg,transparent_60deg_75deg,#ffeb3b_75deg_90deg,transparent_90deg_105deg,#ffeb3b_105deg_120deg,transparent_120deg_135deg,#ffeb3b_135deg_150deg,transparent_150deg_165deg,#ffeb3b_165deg_180deg,transparent_180deg_195deg,#ffeb3b_195deg_210deg,transparent_210deg_225deg,#ffeb3b_225deg_240deg,transparent_240deg_255deg,#ffeb3b_255deg_270deg,transparent_270deg_285deg,#ffeb3b_285deg_300deg,transparent_300deg_315deg,#ffeb3b_315deg_330deg,transparent_330deg_345deg,#ffeb3b_345deg_360deg)] animate-[spin_60s_linear_infinite] origin-center"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="text-center md:text-left md:w-1/2"
          >
            <div className="inline-block bg-yellow-400 text-red-700 font-black px-4 py-1.5 rounded-full mb-6 transform -rotate-2 border-2 border-red-700 shadow-[4px_4px_0_0_#b91c1c] text-sm md:text-base">
              {banner.promoTagTop}
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 drop-shadow-[4px_4px_0_rgba(185,28,28,1)] uppercase">
              {banner.title} <br/>
              <span className="text-yellow-400">{banner.subtitle}</span>
            </h1>
            <p className="text-white text-lg md:text-xl font-medium mb-8 max-w-lg mx-auto md:mx-0 drop-shadow-md leading-relaxed">
              {banner.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <div className="bg-white text-red-700 font-bold px-6 py-3.5 rounded-xl shadow-xl flex items-center gap-2 w-full sm:w-auto justify-center">
                <Clock className="w-5 h-5" />
                {banner.promoTagDate}
              </div>
              <div className="bg-yellow-400 text-red-800 font-black px-6 py-3.5 rounded-xl shadow-xl border-2 border-red-700 flex items-center gap-2 transform rotate-2 w-full sm:w-auto justify-center">
                {banner.promoTagPrice}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
            className="md:w-1/2 flex justify-center relative mt-8 md:mt-0"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-50 rounded-full animate-pulse"></div>
              <img 
                src={banner.image} 
                alt="Pop Mie Tori Miso" 
                className="relative z-10 w-72 h-72 md:w-96 md:h-96 object-contain drop-shadow-[0_0_40px_rgba(250,204,21,0.6)]"
              />
              
              {/* Custom BEST SELLER Sticker exactly like PNG */}
              {banner.isBestSeller && (
                <div className="absolute -bottom-8 -left-8 md:-left-12 z-20 transform -rotate-[15deg] scale-90 md:scale-100 drop-shadow-2xl">
                  <div className="relative">
                    {/* Decorative sprinkles behind */}
                    <div className="absolute -top-4 -left-2 w-3.5 h-3.5 bg-yellow-400 rounded-full"></div>
                    <div className="absolute top-1/2 -right-8 w-10 h-1.5 bg-orange-500 rounded-full transform -rotate-12"></div>
                    <div className="absolute -bottom-4 right-6 w-5 h-5 bg-gray-700 rounded-full"></div>
                    <div className="absolute -left-8 bottom-6 w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="absolute -bottom-2 -left-4 w-8 h-1 bg-yellow-400 rounded-full transform rotate-12"></div>

                    {/* BEST Pill */}
                    <div className="bg-[#ffc107] rounded-full px-8 py-2 transform rotate-[8deg] translate-x-6 translate-y-3 border-4 border-white relative z-10 w-max shadow-sm">
                      <span className="text-4xl md:text-5xl font-black text-white italic tracking-wider drop-shadow-sm">BEST</span>
                    </div>
                    
                    {/* SELLER Pill */}
                    <div className="bg-[#ff5722] rounded-full px-10 py-1.5 transform -rotate-[2deg] -translate-y-2 border-4 border-white relative z-20 w-max shadow-sm">
                      <span className="text-[2.75rem] md:text-[3.25rem] font-black text-white italic tracking-wider drop-shadow-sm leading-none">SELLER</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Promo tag */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute -top-8 -right-6 md:-right-10 bg-yellow-400 border-[5px] border-red-600 text-red-700 font-black rounded-full w-28 h-28 md:w-36 md:h-36 flex flex-col items-center justify-center shadow-xl transform rotate-12 z-30"
              >
                <span className="text-xs md:text-sm">SPECIAL</span>
                <span className="text-2xl md:text-4xl leading-none">{banner.circlePromoPrice}</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filter Section */}
        <div className="mb-10 flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative w-full md:w-96 flex-shrink-0">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari varian rasa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-500 text-sm font-medium transition-shadow outline-none"
            />
          </div>

          <div className="relative w-full md:w-64">
            <button 
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-700 truncate">
                {activeCategory === '' 
                  ? 'Semua Kategori' 
                  : categories.find(c => c.id === activeCategory)?.name || 'Semua Kategori'}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showCategoryDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 z-30 mt-2 w-full min-w-max bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                >
                  <button
                    onClick={() => { setActiveCategory(''); setShowCategoryDropdown(false); }}
                    className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-red-50 transition-colors ${activeCategory === '' ? 'text-red-600 bg-red-50/50' : 'text-gray-700'}`}
                  >
                    Semua Kategori
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setActiveCategory(cat.id); setShowCategoryDropdown(false); }}
                      className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-red-50 transition-colors ${activeCategory === cat.id ? 'text-red-600 bg-red-50/50' : 'text-gray-700'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory + searchQuery}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-gray-50 flex justify-center items-center p-6">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    src={product.image} 
                    alt={product.name}
                    className="w-32 h-32 object-cover rounded-xl shadow-md z-10 relative"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100/50"></div>
                  
                  {/* Stock Badges */}
                  {product.stock <= 10 && product.stock > 0 && (
                    <div className="absolute top-3 left-3 bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-md border border-red-100 z-20 flex items-center gap-1 shadow-sm">
                      <AlertCircle className="w-3 h-3" />
                      Sisa {product.stock}
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute top-3 left-3 bg-gray-900 text-white text-xs font-bold px-2.5 py-1 rounded-md z-20 shadow-sm">
                      HABIS TERJUAL
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <div className="mb-3">
                    <div className="text-xs text-red-500 font-semibold mb-1 uppercase tracking-wider">
                      {categories.find(c => c.id === product.categoryId)?.name}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-6 flex-grow line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div>
                      <div className="text-xs text-gray-400 line-through">Rp {(product.price + 2000).toLocaleString('id-ID')}</div>
                      <div className="text-xl font-black text-red-600">Rp {product.price.toLocaleString('id-ID')}</div>
                    </div>
                    
                    <button
                      onClick={() => handleBuyClick(product)}
                      disabled={product.stock === 0}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        product.stock > 0 
                          ? 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20 active:scale-95' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm mt-8">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Produk tidak ditemukan</h3>
            <p className="text-gray-500 text-sm">Coba ubah kata kunci pencarian atau kategori filter.</p>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {lastPurchased && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 z-50 border-2 border-green-600"
          >
            <div className="bg-white/20 p-2 rounded-full">
              <ShoppingCart className="w-5 h-5" />
            </div>
            Silahkan di ambil ke meja Admin ya
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {checkoutProduct && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCheckoutProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Konfirmasi Pesanan</h2>
                <button 
                  onClick={() => setCheckoutProduct(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex gap-4 mb-8">
                  <div className="w-24 h-24 bg-gray-50 rounded-2xl flex-shrink-0 flex items-center justify-center p-2 border border-gray-100">
                    <img src={checkoutProduct.image} alt={checkoutProduct.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1 leading-tight">{checkoutProduct.name}</h3>
                    <p className="text-red-600 font-black text-xl mb-2">Rp {checkoutProduct.price.toLocaleString('id-ID')}</p>
                    <p className="text-xs font-semibold text-gray-500">Stok tersedia: {checkoutProduct.stock}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-gray-700">Jumlah</span>
                    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                      <button 
                        onClick={() => setCheckoutQuantity(Math.max(1, checkoutQuantity - 1))}
                        disabled={checkoutQuantity <= 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-lg w-8 text-center">{checkoutQuantity}</span>
                      <button 
                        onClick={() => setCheckoutQuantity(Math.min(checkoutProduct.stock, checkoutQuantity + 1))}
                        disabled={checkoutQuantity >= checkoutProduct.stock}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="h-px bg-gray-200 w-full my-4"></div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total Harga</span>
                    <span className="font-black text-2xl text-red-600">Rp {(checkoutProduct.price * checkoutQuantity).toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <button
                  onClick={confirmCheckout}
                  className="w-full bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-600/30 hover:bg-red-700 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Selesaikan Pesanan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PublicStore;
