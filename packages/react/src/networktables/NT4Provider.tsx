import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { Nt4Provider } from "@frc-web-components/fwc/source-providers";
import { Store } from "@webbitjs/store";

interface StoreContextType {
  store: Store;
  nt4Provider: Nt4Provider;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

interface StoreProviderProps {
  children: ReactNode;
  address: string;
}

function createStore(address: string) {
  const store = new Store();
  const nt4Provider = new Nt4Provider();
  store.addSourceProvider("NetworkTables", nt4Provider);
  store.setDefaultSourceProvider("NetworkTables");
  nt4Provider.connect(address);
  return { store, nt4Provider };
}

// make it retry like in NT4Provider in fwc
export const NT4Provider: React.FC<StoreProviderProps> = ({
  children,
  address,
}) => {
  const [{ store, nt4Provider }] = useState(() =>
    createStore(address)
  );

  return (
    <StoreContext.Provider value={{ store, nt4Provider }}>{children}</StoreContext.Provider>
  );
};

export const useNt4 = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
