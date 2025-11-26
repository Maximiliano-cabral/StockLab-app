import { useState, useEffect } from 'react';
import { auth } from '../components/Data/DataFireBase';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';

const UseAuth = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsLoading(false);
        });
        
        return () => unsubscribe();
    }, []);

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return { user, isLoading, signOut };
};

export default UseAuth;