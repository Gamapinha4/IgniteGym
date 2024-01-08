import {Center, HStack, Text, VStack, FlatList, Heading, useToast} from 'native-base'
import HomeHeader from '../components/HomeHeader'
import Group from '../components/Group'
import { useCallback, useEffect, useState } from 'react'
import { Exercise } from './Exercise';
import ExerciseCard from '../components/ExerciseCard';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '../routes/app.routes';
import { AppError } from '../utils/AppError';
import { api } from '../service/api';
import { ExerciseDTO } from '../dtos/exerciseDTO';
import { Loading } from '../components/Loading';

export function Home() {

  const [isLoading, setIsLoading] = useState(true)
  const [groups, setGroups] = useState<string[]>([]);
  const [exercise, setExercise] = useState<ExerciseDTO[]>([]);
  const [groupSelected, setGroupSelected] = useState('antebraço');

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleOpenExercise(exerciseId: string) {
    navigation.navigate('exercise', { exerciseId })
  }

  async function fetchGroups() {
    try {
      const response = await api.get('/groups')
      setGroups(response.data)

    }catch(error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possivel carregar os grupos"
      const toast = useToast();
      toast.show({
        title,
        placement: 'top',
        bgColor:'red.500'
      })
    }
  }
  async function fetchExerciseByGroup() {
    try {

      setIsLoading(true)

      const response = await api.get(`/exercises/bygroup/${groupSelected}`)
      setExercise(response.data)
      

    }catch(error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possivel carregar os exercicios"
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
    fetchGroups()
  }, [])

  useFocusEffect(useCallback(() => {
    fetchExerciseByGroup()
  }, [groupSelected]))

  return(
    <VStack flex={1}>
      <HomeHeader/>

      <FlatList
      data={groups}
      keyExtractor={(item) => item}
      renderItem={({item}) => (
        <Group name={item} isActivity={groupSelected === item} onPress={() => setGroupSelected(item)}/>
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      _contentContainerStyle={{ px: 8}}
      my={10}
      maxH={10}
      minH={10}
      />
      { isLoading ? <Loading/> :
        <VStack px={8} flex={1}>
        <HStack justifyContent={'space-between'} mb={5}>
          <Heading color={'gray.200'} fontSize={'md'} fontFamily={'heading'}>Exercícios</Heading>

          <Text color={'gray.200'} fontSize={'sm'}>{exercise.length}</Text>

        </HStack>

        <FlatList
        data={exercise}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ExerciseCard onPress={() => handleOpenExercise(item.id)} data={item}/>
        )}
        showsVerticalScrollIndicator={false}
        _contentContainerStyle={{ paddingBottom: 20}}
        />
        </VStack>
      }
    </VStack>
  )
}