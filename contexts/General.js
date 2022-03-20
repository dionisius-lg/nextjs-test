import { useState, useEffect, createContext, useContext } from "react";
import fetchJson, { FetchError } from "lib/fetchJson";

export const GeneralContext = createContext()

export const GeneralProvider = (props) => {
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
        <GeneralContext.Provider value={{
            state,
            setState,
            user,
            setUser
        }}>
            {props.children}
        </GeneralContext.Provider >
    )
}
