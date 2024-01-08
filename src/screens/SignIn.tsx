import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from 'native-base'

import BackgrondIMG from '../assets/background.png'
import LogoSvg from '../assets/logo.svg'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '../routes/auth.routes'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { AppError } from '../utils/AppError'

export function SignIn() {

  const { signIn } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleNewAccount() {
    navigation.navigate('signUp')
  }


  async function handleSubmit() {
    try {
      setIsLoading(true)
      await signIn(email, password)
    }catch(error) {
      const isAppError = error instanceof AppError;
      setIsLoading(false)

      const title = isAppError ? error.message : "Não foi possivel entrar tente mais tarde"
      toast.show({title, placement: 'top', bg: 'red.500'})
    }
  }
    


  return(
    <ScrollView contentContainerStyle={{flexGrow: 1}} showsHorizontalScrollIndicator={false}>
    <VStack flex={1} bg={'gray.700'} px={10} pb={16}>
      <Image source={BackgrondIMG} alt='Pessoas treinando' resizeMode='contain' position={'absolute'} defaultSource={BackgrondIMG}/>

      <Center my={24}>
        <LogoSvg/>
        <Text color={'gray.100'} fontSize={'sm'}>Treine sua mente e o seu corpo</Text>
      </Center>

      <Center>
        <Heading color={'gray.100'} fontSize={'xl'} mb={6} fontFamily={'heading'}>
          Acesse sua conta
        </Heading>
      </Center>
      
      <Input placeholder='Email' keyboardType='email-address' autoCapitalize='none' onChangeText={setEmail}/>
      <Input placeholder='Senha' secureTextEntry onChangeText={setPassword}/>

      <Button title='Acessar' onPress={handleSubmit} isLoading={isLoading}/>

      <Center mt={24}>
        <Text color={'gray.100'} fontSize={'sm'} fontFamily={'body'} mb={3}>Ainda não tem acesso?</Text>
        <Button title='Criar conta' variant={"outline"} onPress={handleNewAccount}/>
      </Center>

    </VStack>
    </ScrollView>
  )
}