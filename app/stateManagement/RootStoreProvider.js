"use client"
import React, { createContext, ReactNode, useContext } from "react";
import { RootStore } from "./RootStore";

let store = undefined;

const StoreContext = createContext(undefined);

export const RootStoreProvider = ({ children }) => {
  const root = store ?? new RootStore();
  store = root; // Ensure singleton pattern

  return <StoreContext.Provider value={root}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within RootStoreProvider");
  }
  return context;
};
