import { ReactNode, createContext, useEffect, useState } from "react";
import { UserDTO } from "../dtos/UserDTO";
import { Use } from "react-native-svg";
import { api } from "../service/api";
import { storageUserGet, storageUserRemove, storageUserSave } from "../storage/storageUser";
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from "../storage/storageAuthToken";

export type AuthContextDataProps = {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>
  isLoadingUserData: boolean
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

type AuthContextProviderProps = {
  children: ReactNode
}

export function AuthContextProvider({ children } : AuthContextProviderProps) {

  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserData, setIsLoadingUserData] = useState(true)

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    setUser(userData)
  }

  async function storageUserAndTokenSave(userData: UserDTO, token: string, refresh_token: string) {
    setIsLoadingUserData(true)

    try {
    await storageUserSave(userData)
    await storageAuthTokenSave({token, refresh_token})  

    }catch(error) {
      throw error

    } finally {
      setIsLoadingUserData(false)
    }
    
  }

 async function signIn(email:string , password: string) {
  setIsLoadingUserData(true)

  try {
    const { data } = await api.post('/sessions', {email, password})

    if (data.user && data.token && data.refresh_token) {
      
      await storageUserAndTokenSave(data.user, data.token, data.refresh_token)
      userAndTokenUpdate(data.user, data.token)
    }
  }catch(error) {
    throw error
  } finally {
    setIsLoadingUserData(false)
  }
}

async function signOut() {
  try {
    setIsLoadingUserData(true);
    setUser({} as UserDTO)
    await storageUserRemove()
    await storageAuthTokenRemove()

  }catch(error) {
    throw error
  } finally {
    setIsLoadingUserData(false)
  }
}

async function updateUserProfile(userUpdate: UserDTO) {

  try {
    setUser(userUpdate)
    await storageUserSave(userUpdate)
  }catch(error) {
    throw error;
  }
  
}

  async function loadUserData() {
    try {

      setIsLoadingUserData(true)

      const userLogged = await storageUserGet();
      const {token} = await storageAuthTokenGet();

    if (token && userLogged) {
      userAndTokenUpdate(userLogged, token)
    }

  }catch(error) {
    throw error;
  } finally {
    setIsLoadingUserData(false)
  }
}

  useEffect(() => {
    loadUserData()
  }, [])

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut)

    return () => {
      subscribe();
    }
  }, [signOut])

  return(
  <AuthContext.Provider value={{user, signIn, signOut ,isLoadingUserData, updateUserProfile}}>
  {children}
  </AuthContext.Provider>

)}