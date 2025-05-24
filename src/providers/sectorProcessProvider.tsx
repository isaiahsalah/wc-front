import {ISectorProcess} from "@/utils/interfaces";
import React, {createContext, JSX} from "react";

type contextProps = {
  sectorProcess: ISectorProcess | null;
  setSectorProcess: React.Dispatch<React.SetStateAction<ISectorProcess | null>>;
};

export const SectorProcessContext = createContext<contextProps>({} as contextProps);

interface props {
  children: JSX.Element | JSX.Element[];
}

export const SectorProcessProvider = ({children}: props) => {
  const [sectorProcess, setSectorProcess] = React.useState<ISectorProcess | null>(null);

  return (
    <SectorProcessContext.Provider value={{sectorProcess, setSectorProcess}}>
      {children}
    </SectorProcessContext.Provider>
  );
};
