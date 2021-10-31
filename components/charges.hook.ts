import { createContext, createElement, FC, useContext, useEffect, useState } from "react"
import { useAuth } from "./auth.hook";
import { getDocs, collection, DocumentData, DocumentSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from "./firebase-app";

const hook = () => {
  const [countLoaded, setCountLoaded] = useState(0);
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState<DocumentSnapshot<DocumentData>[]>([]);
  const { user } = useAuth()

  useEffect(() => {
    if (user && countLoaded > 0) {
      setLoading(true);
      getDocs(
        query(
          collection(db, `docs`, user.uid, 'changes'),
          orderBy('createdAt', 'desc'),
        ),
      )
        .then(res => {
          setDocs(res.docs);
        })
        .finally(() => {
          setLoading(false);
        })
    }
  }, [user, countLoaded]);

  const refresh = () => {
    setCountLoaded(countLoaded + 1);
  }

  return {
    loading,
    docs,
    refresh,
    pull: refresh,
  }
}

const changesContext = createContext<ReturnType<typeof hook>>({ loading: false, docs: [], refresh: () => { }, pull: () => { } });

export const ChangesProvider: FC = ({ children }) => createElement(changesContext.Provider, { value: hook() }, children);

export const useCharges = () => {
  return useContext(changesContext);
}