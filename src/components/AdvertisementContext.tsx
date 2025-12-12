import { createContext, useContext, useState, useEffect } from "react";

const AdvertisementContext = createContext<any>(null);

export function AdvertisementProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentAdvertisementID, setCurrentAdvertisementID] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedID = localStorage.getItem("globalAdvertisementID");
      if (storedID) setCurrentAdvertisementID(storedID);
    }
  }, []);

  return (
    <AdvertisementContext.Provider
      value={{ currentAdvertisementID, setCurrentAdvertisementID }}
    >
      {children}
    </AdvertisementContext.Provider>
  );
}

export function useAdvertisement() {
  return useContext(AdvertisementContext);
}
