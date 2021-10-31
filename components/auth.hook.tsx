import { User, GoogleAuthProvider } from "firebase/auth";
import { createContext, FC, useContext, useEffect, useState } from "react"
import { auth } from './firebase-app'

interface AuthContext {
  user: User | null
}

const authContext = createContext<AuthContext>({ user: null });

export const AuthProvider: FC = ({children}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() =>
    auth.onAuthStateChanged(user => {
      setUser(user);
    }),
    [],
  );

  return <authContext.Provider value={{ user }}>
    {children}
  </authContext.Provider>
};

export const useAuth = () => useContext(authContext);


