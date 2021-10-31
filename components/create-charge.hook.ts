import { useState } from "react";
import { useAuth } from "./auth.hook"
import { addDoc, collection } from 'firebase/firestore'
import { db } from "./firebase-app";
import { useCharges } from "./charges.hook";

export const useCreateCharge = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { refresh } = useCharges();

  const createCharge = () => {
    if (!user) return;

    setLoading(true);

    addDoc(collection(db, 'docs', user.uid, 'changes'), {
      name: '',
      createdAt: new Date(),
    })
      .then(() => {
        refresh();
      })
      .finally(() => {
        setLoading(false);
      })
  }

  return {
    loading,
    createCharge,
  }
}

