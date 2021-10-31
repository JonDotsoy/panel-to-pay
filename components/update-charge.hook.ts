import { useEffect, useState } from "react";
import { useAuth } from "./auth.hook";
import { DocumentSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from "./firebase-app";
import { useCharges } from "./charges.hook";
import * as timer from 'timers'
import { promisify } from 'util'

const setTimeout = promisify(timer.setTimeout);

export const useUpdateCharge = (docElm: DocumentSnapshot) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);
  const { refresh } = useCharges();

  useEffect(() => {
    // Reset states
    setUpdated(false);
  }, [docElm])

  const updateCharge = (data: any) => {
    if (!user)
      return;

    setLoading(true);

    updateDoc(doc(db, 'docs', user.uid, 'changes', docElm.id), {
      ...data,
      updatedAt: new Date(),
    })
      .then(async () => {
        refresh();
        setUpdated(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    loading,
    updated,
    updateCharge,
  };
};
