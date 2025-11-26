import { useState, useEffect } from 'react';
// 1. IMPORTAMOS LAS FUNCIONES DE MODIFICACIÓN DE FIREBASE
import { 
    collection, 
    onSnapshot, 
    query, 
    doc, 
    addDoc, 
    updateDoc, 
    deleteDoc 
} from 'firebase/firestore';
import { db } from '../components/Data/DataFireBase'; 

export const useProducts = () => {
    const [productos, setProductos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const productosRef = collection(db, 'productos');
        const q = query(productosRef);

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const productosData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                console.log('✅ Productos cargados:', productosData.length);
                setProductos(productosData);
                setIsLoading(false);
            },
            (err) => {
                console.error('❌ Error al cargar productos:', err);
                setError(err);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);


    const addProduct = async (newProduct) => {
        try {
            await addDoc(collection(db, 'productos'), newProduct);
        } catch (err) {
            console.error("Error al agregar:", err);
            throw err;
        }
    };

    const updateProduct = async (id, updatedData) => {
        try {
            const productRef = doc(db, 'productos', id);
            await updateDoc(productRef, updatedData);
        } catch (err) {
            console.error("Error al editar:", err);
            throw err;
        }
    };


    const deleteProduct = async (id) => {
        try {
            const productRef = doc(db, 'productos', id);
            await deleteDoc(productRef);
        } catch (err) {
            console.error("Error al eliminar:", err);
            throw err;
        }
    };


    return { 
        productos, 
        isLoading, 
        error, 
        addProduct,     
        updateProduct,  
        deleteProduct   
    };
};