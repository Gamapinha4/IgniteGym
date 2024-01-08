import { HStack, Heading, Text, VStack, Icon } from "native-base";
import { UserPhoto } from "./UserPhoto";
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native";
import { useAuth } from "../hooks/useAuth";

import defaultUserPhotoImg from '../assets/userPhotoDefault.png'
import { api } from "../service/api";

export default function HomeHeader() {
  
  const { user, signOut } = useAuth()

  return(
  <HStack bg={"gray.600"} pt={16} pb={5} px={8} alignItems={'center'}>
    <UserPhoto source={user.avatar ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` } : defaultUserPhotoImg} size={16} alt="Imagem do usuario" mr={4}/>
    <VStack flex={1}>
      <Text color={"gray.100"} fontSize={"md"}>Olá,</Text>

      <Heading color={"gray.100"} fontFamily={'heading'}>
        {user.name}
      </Heading>

    </VStack>
    <TouchableOpacity><Icon as={MaterialIcons} name="logout" color="gray.200" size={7} onPress={signOut}/></TouchableOpacity>
  </HStack>
  )
}