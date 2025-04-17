import React, { createContext, JSX } from "react";

type contextProps = {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const TitleContext = createContext<contextProps>({} as contextProps);

interface props {
  children: JSX.Element | JSX.Element[];
}

export const TitleProvider = ({ children }: props) => {
  const [title, setTitle] = React.useState<string>("Plásticos Carmen");

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};
