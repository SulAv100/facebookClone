"use client";
import { createContext, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API;
  const userAuthentication = async (formData, process) => {
    console.log("Call vako xa hai ta kta ho");
    try {
      const response = await fetch(`${BASE_URL}/auth/${process}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        return console.log("Netwrok error occured");
      }
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ userAuthentication }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const useContextProvider = useContext(AuthContext);
  if (!useContextProvider) {
    console.log("Use Auth is outside the provcider");
    return;
  }

  return useContextProvider;
};
