"use client"

import React, { createContext, useContext, useState } from "react";

interface NavbarTitleContextType {
  title: string;
  setTitle: (title: string) => void;
}

const NavbarTitleContext = createContext<NavbarTitleContextType>({
  title: "",
  setTitle: () => { },
});

export const useNavbarTitle = () => useContext(NavbarTitleContext);

export const NavbarTitleProvider = ({ children }: { children: React.ReactNode }) => {
  const [title, setTitle] = useState("");
  return (
    <NavbarTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </NavbarTitleContext.Provider>
  );
}; 