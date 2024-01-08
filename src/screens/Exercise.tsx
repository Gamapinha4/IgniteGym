import {Box, Center, HStack, Heading, Icon, Image, ScrollView, Text, VStack, useToast} from 'native-base'
import { TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'

import BodySvg from '../assets/body.svg'
import Series from '../assets/series.svg'
import Repetition from '../assets/repetitions.svg'
import { Button } from '../components/Button'
import { AppError } from '../utils/AppError'
import { api } from '../service/api'
import { useEffect, useState } from 'react'
import { ExerciseDTO } from '../dtos/exerciseDTO'
import { Loading } from '../components/Loading'
import { AppNavigatorRoutesProps } from '../routes/app.routes'

type RouteParams = {
  exerciseId: string;
}

export function Exercise() {

  const [sendRegister, setSendingRegister] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const toast = useToast()


  const { exerciseId } = route.params as RouteParams;

  function handleGoBack() {
    navigation.goBack()
  }

  async function handleExerciseHistoryRegister() {
    try {
      
      setSendingRegister(true);
      await api.post('/history', { exercise_id: exerciseId });

      navigation.navigate('history');

      toast.show({
        title: 'Parabéns! Exercício registrado no seu histórico.',
        placement: 'top',
        bgColor: 'green.500'
      });

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível registrar exercício.';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setSendingRegister(false);
      
    }
  }

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true)
      const response = await api.get(`/exercises/${exerciseId}`)
      setExercise(response.data)

    }catch(error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possivel carregar os detalhes do exercício."
      const toast = useToast();
      toast.show({
        title,
        placement: 'top',
        bgColor:'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchExerciseDetails()
  }, [exerciseId])

  return(
    <VStack flex={1}>
        <VStack px={8} bg={'gray.600'} pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name='arrow-left' color={'green.500'} size={6}></Icon>
        </TouchableOpacity>

        <HStack justifyContent={'space-between'} mt={4} mb={8} alignItems={'center'}>
          <Heading color={'gray.100'} fontSize={'lg'} flexShrink={1} fontFamily={'heading'}>
            {exercise.name}
          </Heading>

          <HStack alignItems={'center'}>
            <BodySvg/>
            <Text color={'gray.200'} ml={1} textTransform={'capitalize'}>{exercise.group}</Text>
          </HStack>
        </HStack>
        </VStack>
        <ScrollView>
        <VStack p={8}>
          {isLoading ? <Loading/> : 
          <Box rounded={"lg"} mb={3} overflow={'hidden'}>
          <Image w={'full'} h={80} source={{uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`}} alt='Nome exercicio' mb={3} resizeMode='cover' rounded={'lg'} overflow={'hidden'}/>
          </Box>}
          <Box bg={'gray.600'} rounded={'md'} pb={4} px={4}>
          <HStack alignItems={'center'} justifyContent={'space-around'} mb={6} mt={5}>
            <HStack>
              <Series/>
              <Text color={'gray.200'} ml={'2'}>{exercise.series} séries</Text>
            </HStack>

            <HStack>
              <Series/>
              <Text color={'gray.200'} ml={'2'}>{exercise.repetitions} repetições</Text>
            </HStack>
          </HStack>

          <Button title='Marcar como realizado' isLoading={sendRegister} onPress={handleExerciseHistoryRegister}/>
        </Box>

        </VStack>
      </ScrollView>
    </VStack>
  )
}