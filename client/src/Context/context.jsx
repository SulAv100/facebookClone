"use client";
import { createContext, useContext, useEffect, useState } from "react";


// fk this shit next/router not working but this shit work make no sense 
// even after declaring this shit as a client comp
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_API;


  const router = useRouter();

  const userAuthentication = async (formData, process) => {
    console.log("Call vako xa hai ta kta ho");

    setIsLoading(true);
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
      router.push(`/home/${data._id}`);
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidUser = async () => {
    console.log("Chaleko ta xa hai ta kta hoi");
    try {
      const response = await fetch(`${BASE_URL}/auth/verifyUser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        return console.log("An error has pccured");
      }
      console.log(data);
      setUserId(data._id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ userAuthentication, isValidUser, userId }}>
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
