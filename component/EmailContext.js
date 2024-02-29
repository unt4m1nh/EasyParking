import React, {createContext, useContext, useState} from "react";

const AppContext = createContext(); 

export const AppProvider = ({ children }) => {
    const [emailContext, setEmailContext] = useState(' ');
    
    return (
        <AppContext.Provider value={{emailContext, setEmailContext}}>
            {children}
        </AppContext.Provider>
    )
}

export function useEmailState() {
    return useContext(AppContext);
}