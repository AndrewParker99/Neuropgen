"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { cmsSeed } from "@/lib/cms-seed";
import { loadCmsSite, saveCmsSite } from "@/lib/cms-store";
import { CmsSite } from "@/types/cms";

type CmsContextValue = {
  site: CmsSite;
  loading: boolean;
  setSite: (site: CmsSite) => Promise<void>;
};

const CmsContext = createContext<CmsContextValue>({
  site: cmsSeed,
  loading: true,
  setSite: async () => {}
});

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [site, setSiteState] = useState<CmsSite>(cmsSeed);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCmsSite().then((loaded) => {
      setSiteState(loaded);
      setLoading(false);
    });
  }, []);

  const setSite = useCallback(async (next: CmsSite) => {
    setSiteState(next);
    await saveCmsSite(next);
  }, []);

  return <CmsContext.Provider value={{ site, loading, setSite }}>{children}</CmsContext.Provider>;
}

export function useCms() {
  return useContext(CmsContext);
}
