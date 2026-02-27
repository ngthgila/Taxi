import { useState, useEffect } from 'react';
import { Record } from '../types';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export function useRecords() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [ledgerId, setLedgerIdState] = useState<string | null>(() => localStorage.getItem('taxi_ledger_id'));

  const setLedgerId = (id: string | null) => {
    if (id) {
      localStorage.setItem('taxi_ledger_id', id);
    } else {
      localStorage.removeItem('taxi_ledger_id');
    }
    setLedgerIdState(id);
  };

  // Sync with Firestore based on Ledger ID
  useEffect(() => {
    if (!ledgerId || !db) {
      // eslint-disable-next-line
      setRecords([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Use a shared collection "ledgers" with the custom ID
    const q = query(collection(db, `ledgers/${ledgerId}/records`), orderBy('date', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedRecords: Record[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as unknown as Record));
      
      setRecords(fetchedRecords);
      setLoading(false);
    }, (error) => {
      console.error("Firestore sync error:", error);
      // If permission denied, it might be due to rules. 
      // We can't fix rules from here, but we can stop loading.
      setLoading(false);
    });

    return () => unsubscribe();
  }, [ledgerId]);

  const saveRecord = async (recordData: Partial<Record>) => {
    if (!ledgerId || !db) return;

    try {
      if (recordData.id && typeof recordData.id === 'string') {
        const docRef = doc(db, `ledgers/${ledgerId}/records`, recordData.id);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...data } = recordData;
        await updateDoc(docRef, data);
      } else {
        const newRecord = {
          ...recordData,
          created_at: new Date().toISOString()
        };
        if ('id' in newRecord) delete newRecord.id;
        
        await addDoc(collection(db, `ledgers/${ledgerId}/records`), newRecord);
      }
    } catch (e) {
      console.error("Error saving to Firestore", e);
      alert("Lỗi khi lưu. Hãy kiểm tra kết nối hoặc quyền truy cập.");
    }
  };

  const deleteRecord = async (id: number | string) => {
    if (!ledgerId || !db) return;

    try {
      await deleteDoc(doc(db, `ledgers/${ledgerId}/records`, String(id)));
    } catch (e) {
      console.error("Error deleting from Firestore", e);
    }
  };

  return { records, loading, saveRecord, deleteRecord, ledgerId, setLedgerId };
}
