import {ISesion} from "@/utils/interfaces";
import {createContext, JSX, useState} from "react";

type contextProps = {
  sesion: ISesion | null;
  setSesion: React.Dispatch<React.SetStateAction<ISesion | null>>;
};

export const SesionContext = createContext<contextProps>({} as contextProps);

interface props {
  children: JSX.Element | JSX.Element[];
}

export const SesionProvider = ({children}: props) => {
  const [sesion, setSesion] = useState<ISesion | null>(null);

  return <SesionContext.Provider value={{sesion, setSesion}}>{children}</SesionContext.Provider>;
};
