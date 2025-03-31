
import AuthContext from "./AuthContext";



export const AuthState = ({ children }) => {
    const URL ="https://treasurehunt-3.onrender.com";



    return (
        <AuthContext.Provider value={{

            URL

        }}>
            {children}
        </AuthContext.Provider>
    );
};
