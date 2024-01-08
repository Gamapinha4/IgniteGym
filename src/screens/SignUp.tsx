import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from 'native-base'

import BackgrondIMG from '../assets/background.png'
import LogoSvg from '../assets/logo.svg'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { api } from '../service/api'
import axios from 'axios'
import { Alert } from 'react-native'
import { AppError } from '../utils/AppError'
import { useAuth } from '../hooks/useAuth'

type FormDataProps = {
  name: string
  email: string
  password: string
  confirm_password: string
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome'),
  email: yup.string().required('Informe o e-mail').email('E-mail inválido'),
  password: yup.string().required('Informe a senha').min(6, 'A senha deve ter pelo menos 6 digitos.'),
  confirm_password: yup.string().required('Confirme a senha').oneOf([yup.ref('password')], 'A confirmação da senha não confere')
});

type FormData = yup.InferType<typeof signUpSchema>;

export function SignUp() {

  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const {signIn} = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(signUpSchema),
  });

  function handleGoBack() {
    navigation.goBack()
  }

  async function handleSignUp({email, name, password}: FormDataProps) {
    try {
      setIsLoading(true)

     await api.post('/users', {email,name,password});
     await signIn(email, password)

    }catch(error) {
      setIsLoading(false)
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível criar a conta.'
      
      const toast = useToast();

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
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
          Crie sua conta
        </Heading>
      </Center>
      
      <Controller control={control} name='name' render={({ field: {onChange, value}}) => (
        <Input placeholder='Nome' onChangeText={onChange} value={value} errorMessage={errors.name?.message}/>
      )}/>

      <Controller control={control} name='email' render={({ field: {onChange, value}}) => (
        <Input placeholder='Email' onChangeText={onChange} value={value} errorMessage={errors.email?.message}/>
      )}/>
      
      <Controller control={control} name='password' render={({ field: {onChange, value}}) => (
        <Input placeholder='password' secureTextEntry onChangeText={onChange} value={value} errorMessage={errors.password?.message}/>
      )}/>

      <Controller control={control} name='confirm_password' render={({ field: {onChange, value}}) => (
        <Input placeholder='confirm_password' secureTextEntry onChangeText={onChange} value={value} errorMessage={errors.confirm_password?.message} onSubmitEditing={handleSubmit(handleSignUp)} returnKeyType='send'/>
      )}/>

      <Button title='Criar e acessar' onPress={handleSubmit(handleSignUp)} isLoading={isLoading}/>

      <Button title='Voltar para o login' variant={"outline"} mt={12} onPress={handleGoBack}/>

    </VStack>
    </ScrollView>
  )
}