import {IProcess} from "@/utils/interfaces";
import React, {createContext, JSX} from "react";

type contextProps = {
  process: IProcess | null;
  setProcess: React.Dispatch<React.SetStateAction<IProcess | null>>;
};

export const ProcessContext = createContext<contextProps>({} as contextProps);

interface props {
  children: JSX.Element | JSX.Element[];
}

export const ProcessProvider = ({children}: props) => {
  const [process, setProcess] = React.useState<IProcess | null>(null);

  return (
    <ProcessContext.Provider value={{process, setProcess}}>{children}</ProcessContext.Provider>
  );
};
