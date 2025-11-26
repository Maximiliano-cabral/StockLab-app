import { useState, useEffect } from 'react';
import { db } from '../components/Data/DataFireBase'; 
import { doc, onSnapshot } from 'firebase/firestore';

export const useBarriles = () => {
    const [metal, setMetal] = useState(0);
    const [plastico, setPlastico] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubMetal = onSnapshot(doc(db, 'barriles_vacios', 'metal'), (doc) => {
            if (doc.exists()) setMetal(doc.data().cantidad);
        });

        const unsubPlastico = onSnapshot(doc(db, 'barriles_vacios', 'plastico'), (doc) => {
            if (doc.exists()) setPlastico(doc.data().cantidad);
            setLoading(false); 
        });

        return () => {
            unsubMetal();
            unsubPlastico();
        };
    }, []);

    return { metal, plastico, loading };
};