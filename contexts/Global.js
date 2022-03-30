import { useState, useEffect, createContext, useContext } from "react";
import fetchJson, { FetchError } from "lib/fetchJson";

export const GlobalContext = createContext()

export const GlobalProvider = (props) => {
    const [state, setState] = useState(false)
    
    const [user, setUser] = useState(false)
    const [loadingUser, setLoadingUser] = useState(true)

    useEffect(() => {
        async function fetchData() {
            await fetchJson("/api/user").then((res) => {
                setUser(res)
            }).catch((err) => { console.log(err) })
        }

        fetchData()
        return () => setUser(false)
    }, [setUser])

    return (
        <GlobalContext.Provider value={{
            state,
            setState,
            user,
            setUser
        }}>
            {props.children}
        </GlobalContext.Provider >
    )
}
