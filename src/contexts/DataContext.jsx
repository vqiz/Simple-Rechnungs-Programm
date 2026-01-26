import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [companyData, setCompanyData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load initial data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load 'Unternehmen' data
            // Note: We use window.api expecting it to be available (defined in preload.js)
            if (window.api) {
                const companyJson = await window.api.readFile("settings/unternehmen.rechnix");
                setCompanyData(companyJson ? JSON.parse(companyJson) : {});
            }
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveCompanyData = async (newData) => {
        try {
            if (window.api) {
                await window.api.writeFile("settings/unternehmen.rechnix", JSON.stringify(newData));
                setCompanyData(newData);
                return true;
            }
        } catch (error) {
            console.error("Failed to save data:", error);
            return false;
        }
    };

    const value = {
        companyData,
        loading,
        saveCompanyData,
        refreshData: loadData
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
