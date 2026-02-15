import React, { createContext, useContext, useState, useEffect } from 'react';
import { hashPassword, verifyPassword } from '../utils/crypto';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [importers, setImporters] = useState(() => {
        const savedImporters = localStorage.getItem('eh_importers');
        const initialImporters = savedImporters ? JSON.parse(savedImporters) : [];

        // Add demo account if not exists
        const demoEmail = 'demo@electrahub.com';
        if (!initialImporters.some(imp => imp.contactEmail === demoEmail)) {
            const demoAccount = {
                id: 'demo-123',
                companyName: 'شركة النور (تجريبي)',
                contactEmail: demoEmail,
                whatsapp: '01000000000',
                password: hashPassword('demo'), // Hash the password
                category: 'AC',
                subscription: 'plus',
                products: []
            };
            initialImporters.push(demoAccount);
            localStorage.setItem('eh_importers', JSON.stringify(initialImporters));
        }

        return initialImporters;
    });

    useEffect(() => {
        const loggedInUser = localStorage.getItem('eh_user');
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }
    }, []);

    const login = (email, password) => {
        const found = importers.find(imp => imp.contactEmail === email && verifyPassword(password, imp.password));
        if (found) {
            setUser(found);
            localStorage.setItem('eh_user', JSON.stringify(found));
            return { success: true };
        }
        return { success: false, message: 'Invalid email or password' };
    };

    const register = (userData) => {
        // Check if email already exists
        if (importers.some(imp => imp.contactEmail === userData.contactEmail)) {
            return { success: false, message: 'Email already registered' };
        }

        const newImporter = {
            ...userData,
            id: Date.now().toString(),
            products: [],
            password: hashPassword(userData.password) // Hash the password before storing
        };
        const updatedImporters = [...importers, newImporter];
        setImporters(updatedImporters);
        localStorage.setItem('eh_importers', JSON.stringify(updatedImporters));

        // Auto login after register
        setUser(newImporter);
        localStorage.setItem('eh_user', JSON.stringify(newImporter));

        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('eh_user');
    };

    const updateProfile = (updatedData) => {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem('eh_user', JSON.stringify(updatedUser));

        const updatedImporters = importers.map(imp => imp.id === user.id ? updatedUser : imp);
        setImporters(updatedImporters);
        localStorage.setItem('eh_importers', JSON.stringify(updatedImporters));
    };

    const addProduct = (product) => {
        const newProduct = { ...product, id: Date.now() };
        const updatedUser = { ...user, products: [...(user.products || []), newProduct] };

        setUser(updatedUser);
        localStorage.setItem('eh_user', JSON.stringify(updatedUser));

        const updatedImporters = importers.map(imp => imp.id === user.id ? updatedUser : imp);
        setImporters(updatedImporters);
        localStorage.setItem('eh_importers', JSON.stringify(updatedImporters));
    };

    const editProduct = (productId, updatedProduct) => {
        if (!user?.products) return;
        const updatedProducts = user.products.map(p => p.id === productId ? { ...updatedProduct, id: productId } : p);
        const updatedUser = { ...user, products: updatedProducts };

        setUser(updatedUser);
        localStorage.setItem('eh_user', JSON.stringify(updatedUser));

        const updatedImporters = importers.map(imp => imp.id === user.id ? updatedUser : imp);
        setImporters(updatedImporters);
        localStorage.setItem('eh_importers', JSON.stringify(updatedImporters));
    };

    const deleteProduct = (productId) => {
        if (!user?.products) return;
        const updatedProducts = user.products.filter(p => p.id !== productId);
        const updatedUser = { ...user, products: updatedProducts };

        setUser(updatedUser);
        localStorage.setItem('eh_user', JSON.stringify(updatedUser));

        const updatedImporters = importers.map(imp => imp.id === user.id ? updatedUser : imp);
        setImporters(updatedImporters);
        localStorage.setItem('eh_importers', JSON.stringify(updatedImporters));
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateProfile, addProduct, editProduct, deleteProduct }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
