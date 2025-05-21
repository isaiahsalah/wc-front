import {IPageItem} from "@/utils/const";
import React, {createContext, JSX} from "react";

type contextProps = {
  page: IPageItem;
  setPage: React.Dispatch<React.SetStateAction<IPageItem>>;
};

export const PageContext = createContext<contextProps>({} as contextProps);

interface props {
  children: JSX.Element | JSX.Element[];
}

export const PageProvider = ({children}: props) => {
  const [page, setPage] = React.useState<IPageItem>({
    id: 0,
    title: "Plasticos Carmen",
    link: "",
    label: "",
    page: () => <></>,
  });

  return <PageContext.Provider value={{page, setPage}}>{children}</PageContext.Provider>;
};
