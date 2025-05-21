import {ISesion} from "@/utils/interfaces";
import React, {createContext, JSX} from "react";

type contextProps = {
  sesion: ISesion | null;
  setSesion: React.Dispatch<React.SetStateAction<ISesion | null>>;
};

export const SesionContext = createContext<contextProps>({} as contextProps);

interface props {
  children: JSX.Element | JSX.Element[];
}

export const SesionProvider = ({children}: props) => {
  const [sesion, setSesion] = React.useState<ISesion | null>(null);

  return <SesionContext.Provider value={{sesion, setSesion}}>{children}</SesionContext.Provider>;
};
