import React, {createContext, useContext, useState} from "react";

const UserContext = createContext(); 

export const UserProvider = ({ children }) => {
    const [userContext, setUserContext] = useState('');
    
    return (
        <UserContext.Provider value={{userContext, setUserContext}}>
            {children}
        </UserContext.Provider>
    )
}

export function useUserState() {
    return useContext(UserContext);
}