import { HStack, Heading, Image, VStack, Text, Icon } from "native-base"
import {Entypo} from '@expo/vector-icons'
import { TouchableOpacity, TouchableOpacityProps } from "react-native"
import { ExerciseDTO } from "../dtos/exerciseDTO"
import { api } from "../service/api"

type props = TouchableOpacityProps & {
  data: ExerciseDTO
}

export default function ExerciseCard({ data, ...rest} : props) {


  return(
    <TouchableOpacity {...rest}>
      <HStack bg={"gray.500"} alignItems={'center'} p={2} pr={4} rounded={'md'} mb={3}>
        <Image resizeMode="cover" mr={4} alt="Remada Unilateral" source={{uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`}} w={16} h={16} rounded={'md'}/>
        
        
        <VStack flex={1}>
          <Heading fontSize={'lg'} color={'white'} fontFamily={'heading'}>
            {data.name}
          </Heading>

          <Text fontSize={'sm'} color={"gray.200"} mt={1} numberOfLines={2}>
            {data.series} séries x {data.repetitions} repetições
          </Text>
        </VStack>

        <Icon as={Entypo} name="chevron-thin-right" color={"gray.300"}/>

      </HStack>
    </TouchableOpacity>
  )
}