import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  tiktok?: string;
  instagram?: string;
  status: 'pending' | 'approved' | 'published';
  views?: string;
  ctr?: string;
  spyInsight?: string;
  optimizerScore?: number;
  agent?: string;
}

export interface SquadContextType {
  products: Product[];
  approvedItems: Product[];
  fetchData: () => Promise<void>;
  approveProduct: (id: string) => Promise<void>;
  publishProduct: (id: string) => Promise<void>;
  scoutProducts: (niche: string) => Promise<Product[]>;
  generateStrategy: (product: Product) => Promise<any>;
  generateCreative: (product: Product, strategy: any) => Promise<any>;
}

const SquadContext = createContext<SquadContextType | undefined>(undefined);

const API_URL = 'http://localhost:3001/api';

export const SquadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [approvedItems, setApprovedItems] = useState<Product[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/data`);
      const data = await res.json();
      setProducts(data.products || []);
      setApprovedItems(data.approvedItems || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approveProduct = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    product.status = 'approved';
    const newProducts = products.filter(p => p.id !== id);
    const newApproved = [...approvedItems, product];
    
    setProducts(newProducts);
    setApprovedItems(newApproved);

    // Save to backend
    await fetch(`${API_URL}/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: newProducts, approvedItems: newApproved })
    });
  };

  const publishProduct = async (id: string) => {
    const product = approvedItems.find(p => p.id === id);
    if (!product) return;
    
    product.status = 'published';
    const newApproved = approvedItems.map(p => p.id === id ? product : p);
    
    setApprovedItems(newApproved);

    await fetch(`${API_URL}/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products, approvedItems: newApproved })
    });
  };

  const scoutProducts = async (niche: string) => {
    const res = await fetch(`${API_URL}/agents/scout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ niche })
    });
    const newProducts = await res.json();
    
    // Append to existing
    const updatedProducts = [...products, ...newProducts];
    setProducts(updatedProducts);
    
    await fetch(`${API_URL}/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: updatedProducts, approvedItems })
    });

    return newProducts;
  };

  const generateStrategy = async (product: Product) => {
    const res = await fetch(`${API_URL}/agents/strategist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product })
    });
    return await res.json();
  };

  const generateCreative = async (product: Product, strategy: any) => {
    const res = await fetch(`${API_URL}/agents/creative`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, strategy })
    });
    return await res.json();
  };

  return (
    <SquadContext.Provider value={{
      products,
      approvedItems,
      fetchData,
      approveProduct,
      publishProduct,
      scoutProducts,
      generateStrategy,
      generateCreative
    }}>
      {children}
    </SquadContext.Provider>
  );
};

export const useSquad = () => {
  const context = useContext(SquadContext);
  if (!context) throw new Error("useSquad must be used within SquadProvider");
  return context;
};
