import { useState } from "react";
import { useAuth } from "./auth.hook";
import { DocumentSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from "./firebase-app";
import { useCharges } from "./charges.hook";


export const useDeleteCharge = (docElm: DocumentSnapshot) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const { refresh } = useCharges();

  const deleteCharge = () => {
    if (!user)
      return;

    setLoading(true);

    deleteDoc(doc(db, 'docs', user.uid, 'changes', docElm.id))
      .then(() => {
        refresh();
        setDeleted(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    loading,
    deleted,
    deleteCharge,
  };
};
