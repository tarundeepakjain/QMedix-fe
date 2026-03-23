import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/apiWrapper";
import Loading from "../components/Loader";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api("get", "auth/me");
      // Merge the profile AND the role into one object
      if (res.data && res.data.user) {
        setUser({
          ...res.data.user.profile,
          role: res.data.user.role
        });
      }
    } catch(error) {
      setUser(null);
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if(loading) return <Loading />
  
  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);