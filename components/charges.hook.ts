import { createContext, createElement, FC, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useAuth } from "./auth.hook";
import { getDocs, collection, DocumentData, DocumentSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from "./firebase-app";

const Hook = () => {
  const [countLoaded, setCountLoaded] = useState(0);
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState<DocumentSnapshot<DocumentData>[]>([]);
  const { user } = useAuth()

  useEffect(() => {
    if (user && countLoaded > 0) {
      setLoading(true);
      getDocs(
        query(
          collection(db, `docs`, user.uid, 'charges'),
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

  const refresh = useCallback(() => {
    setCountLoaded(countLoaded + 1);
  }, [countLoaded]);

  return {
    loading,
    docs,
    refresh,
    pull: refresh,
  }
}

type Charges = ReturnType<typeof Hook>;

const changesContext = createContext<Charges | null>(null);

export const ChangesProvider: FC = ({ children }) => createElement(changesContext.Provider, { value: Hook() }, children);

export const useCharges = () => useContext(changesContext)!;

export const useInitializePullCharges = () => {
  const charges = useCharges()

  useEffect(() => {
    charges.pull();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
