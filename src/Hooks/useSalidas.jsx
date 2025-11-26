import { useState, useEffect } from 'react';
import { db, auth } from '../components/Data/DataFireBase';
import { 
    collection, 
    onSnapshot, 
    addDoc, 
    deleteDoc, 
    doc, 
    query, 
    where 
} from 'firebase/firestore';
import { message } from 'antd';

export const useSalidas = () => {
    const [salidasPedidos, setSalidasPedidos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    useEffect(() => {

        const unsubscribeAuth = auth.onAuthStateChanged(user => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
                setSalidasPedidos([]);
                setIsLoading(false);
            }
        });
        
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        let unsubscribeFirestore = () => {};

        if (userId) {
            const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            const collectionPath = `artifacts/${appId}/users/${userId}/salidas`;
            const salidasCollection = collection(db, collectionPath);
            
            unsubscribeFirestore = onSnapshot(salidasCollection, (snapshot) => {
                const fetchedSalidas = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setSalidasPedidos(fetchedSalidas);
                setIsLoading(false);
            }, (error) => {
                console.error("Error al obtener salidas de Firestore:", error);
                message.error("Error al cargar la lista de salidas.");
                setIsLoading(false);
            });
        }


        return () => unsubscribeFirestore();
    }, [userId]);



    const addSalida = async (salidaData) => {
        if (!userId) {
            message.error("Debe iniciar sesión para agregar salidas.");
            return;
        }
        try {
            const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            const collectionPath = `artifacts/${appId}/users/${userId}/salidas`;
            await addDoc(collection(db, collectionPath), salidaData);
        } catch (e) {
            console.error("Error adding document: ", e);
            throw e; 
        }
    };


    const deleteSalida = async (id) => {
        if (!userId) {
            message.error("Debe iniciar sesión para eliminar salidas.");
            return;
        }
        try {
            const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            const docPath = `artifacts/${appId}/users/${userId}/salidas/${id}`;
            await deleteDoc(doc(db, docPath));
        } catch (e) {
            console.error("Error deleting document: ", e);
            throw e; 
        }
    };

    return { salidasPedidos, isLoading, addSalida, deleteSalida };
};