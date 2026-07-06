import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { fetchConfig } from '../api';
import { SiteConfig } from '../types';

interface SiteConfigContextType {
  config: SiteConfig | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextType>({
  config: null,
  loading: true,
  refresh: async () => {},
});

export const SiteConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetchConfig();
      setConfig(res.data);
    } catch (err) {
      console.error('Failed to load site configuration', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <SiteConfigContext.Provider value={{ config, loading, refresh }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => useContext(SiteConfigContext);
