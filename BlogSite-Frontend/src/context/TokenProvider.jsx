import React, { useContext } from "react";
import useLocalStorage from "../Components/hooks/useLocalStorage";

const TokenContext = React.createContext();

export function useToken() {
	return useContext(TokenProvider);
}

export function TokenProvider({children}) {
	const [token, setToken] = useLocalStorage("blogsiteToken", null);

	return (
    <TokenContext.Provider value={{token, setToken}}>
      {children}
    </TokenContext.Provider>
  );
}