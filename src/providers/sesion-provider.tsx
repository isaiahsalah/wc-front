import { SesionInterface } from "@/utils/interfaces";
import React, { createContext, JSX } from "react";

type contextProps = {
  sesion: SesionInterface | null;
  setSesion: React.Dispatch<React.SetStateAction<SesionInterface | null>>;
};

export const SesionContext = createContext<contextProps>({} as contextProps);

interface props {
  children: JSX.Element | JSX.Element[];
}

export const SesionProvider = ({ children }: props) => {
  const [sesion, setSesion] = React.useState<SesionInterface | null>(null);

  return (
    <SesionContext.Provider value={{ sesion, setSesion }}>
      {children}
    </SesionContext.Provider>
  );
};
