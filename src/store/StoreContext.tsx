import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, onSnapshot, setDoc, deleteDoc, updateDoc, getDocs, writeBatch, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
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
  removeProduct: (productId: string) => void;
  updateStock: (productId: string, newStock: number) => void;
  recordSale: (productId: string, qty: number, customerName?: string) => void;
  addPendingTransaction: (productId: string, qty: number, customerName?: string) => void;
  resolvePendingTransaction: (transactionId: string, approve: boolean) => void;
  updateBanner: (bannerData: Partial<Banner>) => void;
  updateAdminPassword: (username: string, newPassword: string) => void;
  removeSale: (saleId: string) => void;
  clearAllSales: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Initial values for bootstrapping Firebase if it's empty
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
    image: '/pop-mie.png',
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([]);
  const [banner, setBanner] = useState<Banner>(initialBanner);
  const [admins, setAdmins] = useState<AdminUser[]>([]);

  useEffect(() => {
    const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      if (data.length === 0) {
        // Bootstrap
        initialCategories.forEach(cat => setDoc(doc(db, 'categories', cat.id), cat));
      } else {
        setCategories(data);
      }
    });

    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      if (data.length === 0) {
        // Bootstrap
        initialProducts.forEach(prod => setDoc(doc(db, 'products', prod.id), prod));
      } else {
        setProducts(data);
      }
    });

    const unsubSales = onSnapshot(collection(db, 'sales'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
      setSales(data);
    });

    const unsubPending = onSnapshot(collection(db, 'pendingTransactions'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PendingTransaction));
      setPendingTransactions(data);
    });

    const unsubBanner = onSnapshot(doc(db, 'banners', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setBanner(docSnap.data() as Banner);
      } else {
        setDoc(doc(db, 'banners', 'main'), initialBanner);
      }
    });

    const unsubAdmins = onSnapshot(collection(db, 'admins'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ username: doc.id, ...doc.data() } as AdminUser));
      if (data.length === 0) {
        // Bootstrap
        initialAdmins.forEach(adm => setDoc(doc(db, 'admins', adm.username), { password: adm.password }));
      } else {
        setAdmins(data);
      }
    });

    return () => {
      unsubCategories();
      unsubProducts();
      unsubSales();
      unsubPending();
      unsubBanner();
      unsubAdmins();
    };
  }, []);

  const addCategory = async (name: string) => {
    const id = `c${Date.now()}`;
    await setDoc(doc(db, 'categories', id), { name });
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    const id = `p${Date.now()}`;
    await setDoc(doc(db, 'products', id), productData);
  };

  const removeProduct = async (productId: string) => {
    await deleteDoc(doc(db, 'products', productId));
  };

  const updateStock = async (productId: string, newStock: number) => {
    await updateDoc(doc(db, 'products', productId), { stock: newStock });
  };

  const recordSale = async (productId: string, qty: number, customerName?: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock < qty) return;

    const id = `s${Date.now()}`;
    const saleData: Omit<Sale, 'id'> = {
      productId,
      qty,
      totalPrice: product.price * qty,
      timestamp: new Date().toISOString(),
      ...(customerName ? { customerName } : {}),
      createdAt: serverTimestamp(),
    };
    
    await setDoc(doc(db, 'sales', id), saleData);
    await updateDoc(doc(db, 'products', productId), { stock: product.stock - qty });
  };

  const removeSale = async (saleId: string) => {
    await deleteDoc(doc(db, 'sales', saleId));
  };

  const clearAllSales = async () => {
    const snapshot = await getDocs(collection(db, 'sales'));
    const batch = writeBatch(db);
    snapshot.docs.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();
  };

  const addPendingTransaction = async (productId: string, qty: number, customerName?: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock < qty) return;

    const id = `pt${Date.now()}`;
    const txData: Omit<PendingTransaction, 'id'> = {
      productId,
      qty,
      totalPrice: product.price * qty,
      timestamp: new Date().toISOString(),
      ...(customerName ? { customerName } : {}),
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'pendingTransactions', id), txData);
  };

  const resolvePendingTransaction = async (transactionId: string, approve: boolean) => {
    const tx = pendingTransactions.find(t => t.id === transactionId);
    if (!tx) return;

    if (approve) {
      const product = products.find(p => p.id === tx.productId);
      if (product && product.stock >= tx.qty) {
        const saleId = `s${Date.now()}`;
        const saleData: Omit<Sale, 'id'> = {
          productId: tx.productId,
          qty: tx.qty,
          totalPrice: tx.totalPrice,
          timestamp: new Date().toISOString(),
          ...(tx.customerName ? { customerName: tx.customerName } : {}),
          createdAt: serverTimestamp(),
        };
        await setDoc(doc(db, 'sales', saleId), saleData);
        await updateDoc(doc(db, 'products', tx.productId), { stock: product.stock - tx.qty });
      }
    }
    
    await deleteDoc(doc(db, 'pendingTransactions', transactionId));
  };

  const updateBanner = async (bannerData: Partial<Banner>) => {
    await updateDoc(doc(db, 'banners', 'main'), bannerData);
  };

  const updateAdminPassword = async (username: string, newPassword: string) => {
    await updateDoc(doc(db, 'admins', username), { password: newPassword });
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
      removeProduct,
      updateStock, 
      recordSale,
      removeSale,
      clearAllSales,
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
