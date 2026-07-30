import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, Product, Sale, PendingTransaction, Banner, AdminUser } from '../types';

interface StoreContextType {
  categories: Category[];
  products: Product[];
  sales: Sale[];
  pendingTransactions: PendingTransaction[];
  banner: Banner;
  admins: AdminUser[];
  addCategory: (name: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateStock: (productId: string, newStock: number) => void;
  recordSale: (productId: string, qty: number) => void;
  addPendingTransaction: (productId: string, qty: number) => void;
  resolvePendingTransaction: (transactionId: string, approve: boolean) => void;
  updateBanner: (bannerData: Partial<Banner>) => void;
  updateAdminPassword: (username: string, newPassword: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const initialCategories: Category[] = [
  { id: 'c1', name: 'Promo Spesial' },
];

const initialProducts: Product[] = [
  {
    id: 'p1',
    name: 'Pop Mie Tori Miso',
    categoryId: 'c1',
    price: 7000,
    stock: 50,
    image: '/pop-mie.png', // The real product image provided by user
    description: 'Kuah Kaldu Rasa Miso, Mi Lebih Kenyal, Topping Lengkap.',
  }
];

const initialBanner: Banner = {
  title: 'POP MIE',
  subtitle: 'TORI MISO',
  description: 'Kuah Kaldu Rasa Miso, Mi Lebih Kenyal, Topping Lengkap. Siap memanjakan lidah dalam 3 menit!',
  image: '/pop-mie.png',
  promoTagTop: 'FIRST ITEM LAUNCHING DAY',
  promoTagDate: '30-31 Juli 2026',
  promoTagPrice: 'Promo Rp 7.000',
  circlePromoPrice: 'Rp7k',
  isBestSeller: true,
};

const initialAdmins: AdminUser[] = [
  { username: 'Suhand', password: '1234' },
  { username: 'Dendy', password: '4321' }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load from localStorage, otherwise use initial
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('kopsudi_categories_v4');
    return saved ? JSON.parse(saved) : initialCategories;
  });
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kopsudi_products_v4');
    return saved ? JSON.parse(saved) : initialProducts;
  });
  
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('kopsudi_sales_v4');
    return saved ? JSON.parse(saved) : [];
  });

  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>(() => {
    const saved = localStorage.getItem('kopsudi_pending_v4');
    return saved ? JSON.parse(saved) : [];
  });

  const [banner, setBanner] = useState<Banner>(() => {
    const saved = localStorage.getItem('kopsudi_banner_v4');
    return saved ? JSON.parse(saved) : initialBanner;
  });

  const [admins, setAdmins] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('kopsudi_admins_v4');
    return saved ? JSON.parse(saved) : initialAdmins;
  });

  useEffect(() => {
    localStorage.setItem('kopsudi_categories_v4', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('kopsudi_products_v4', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kopsudi_sales_v4', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('kopsudi_pending_v4', JSON.stringify(pendingTransactions));
  }, [pendingTransactions]);

  useEffect(() => {
    localStorage.setItem('kopsudi_banner_v4', JSON.stringify(banner));
  }, [banner]);

  useEffect(() => {
    localStorage.setItem('kopsudi_admins_v4', JSON.stringify(admins));
  }, [admins]);

  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: `c${Date.now()}`,
      name,
    };
    setCategories([...categories, newCategory]);
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `p${Date.now()}`,
    };
    setProducts([...products, newProduct]);
  };

  const updateStock = (productId: string, newStock: number) => {
    setProducts(products.map(p => p.id === productId ? { ...p, stock: newStock } : p));
  };

  const recordSale = (productId: string, qty: number) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock < qty) return; // Prevent sale if not enough stock

    const newSale: Sale = {
      id: `s${Date.now()}`,
      productId,
      qty,
      totalPrice: product.price * qty,
      timestamp: new Date().toISOString(),
    };

    setSales([...sales, newSale]);
    updateStock(productId, product.stock - qty);
  };

  const addPendingTransaction = (productId: string, qty: number) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock < qty) return;

    const newTx: PendingTransaction = {
      id: `pt${Date.now()}`,
      productId,
      qty,
      totalPrice: product.price * qty,
      timestamp: new Date().toISOString(),
    };

    setPendingTransactions([...pendingTransactions, newTx]);
  };

  const resolvePendingTransaction = (transactionId: string, approve: boolean) => {
    const tx = pendingTransactions.find(t => t.id === transactionId);
    if (!tx) return;

    if (approve) {
      recordSale(tx.productId, tx.qty);
    }
    
    setPendingTransactions(pendingTransactions.filter(t => t.id !== transactionId));
  };

  const updateBanner = (bannerData: Partial<Banner>) => {
    setBanner(prev => ({ ...prev, ...bannerData }));
  };

  const updateAdminPassword = (username: string, newPassword: string) => {
    setAdmins(admins.map(admin => admin.username === username ? { ...admin, password: newPassword } : admin));
  };

  return (
    <StoreContext.Provider value={{ 
      categories, 
      products, 
      sales, 
      pendingTransactions,
      banner,
      admins,
      addCategory, 
      addProduct, 
      updateStock, 
      recordSale,
      addPendingTransaction,
      resolvePendingTransaction,
      updateBanner,
      updateAdminPassword
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

