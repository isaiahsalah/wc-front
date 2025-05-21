import {ISector} from "@/utils/interfaces";
import React, {createContext, JSX} from "react";

type contextProps = {
  sector: ISector | null;
  setSector: React.Dispatch<React.SetStateAction<ISector | null>>;
};

export const SectorContext = createContext<contextProps>({} as contextProps);

interface props {
  children: JSX.Element | JSX.Element[];
}

export const SectorProvider = ({children}: props) => {
  const [sector, setSector] = React.useState<ISector | null>(null);

  return <SectorContext.Provider value={{sector, setSector}}>{children}</SectorContext.Provider>;
};
