import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { AuthRoutes } from "./auth.routes";

import { useTheme, Box } from "native-base";
import { useAuth } from "../hooks/useAuth";
import { AppRoutes } from "./app.routes";
import { Loading } from "../components/Loading";

export function Routes() {

  const { user, isLoadingUserData } = useAuth()

  const { colors } = useTheme();
  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700]

  if (isLoadingUserData) {
    return <Loading/>
  }

  return(
    <Box flex={1} bg={"gray.700"}>
      <NavigationContainer theme={theme}>
        {user.id ? <AppRoutes/> : <AuthRoutes/>}
      </NavigationContainer>
    </Box>
  )
}