import {Center, ScrollView, Text, VStack, Skeleton, Heading, useToast} from 'native-base'
import ScreenHeader from '../components/ScreenHeader'
import { UserPhoto } from '../components/UserPhoto'
import { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from '../service/api';
import { AppError } from '../utils/AppError';
import defaultUserPhotoImg from '../assets/userPhotoDefault.png'

const PHOTO_SIZE = 33;

type formDataProps = {
  name: string
  email: string
  password: string
  old_password: string
  confirm_password: string
}

export function Profile() {

  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const profileSchema = yup.object({
    name: yup.string().required('Informe o nome.'),
    password: yup.string().min(6, 'A senha deve ter pelo menos 6 digitos.').nullable().transform((value) => !!value ? value : null),
    confirm_password: yup.string().min(6, 'A senha deve ter pelo menos 6 digitos.').nullable().transform((value) => !!value ? value : null).oneOf([yup.ref('password'), ''], 'A confirmação de senha não confere').when('password', {is: (Field: any) => Field, then: (schema) =>
			schema.nullable().required('Informe a confirmação da senha.'),})
  })

  const toast = useToast();
  const { user, updateUserProfile } = useAuth();
  const { control, handleSubmit, formState: {errors} } = useForm<formDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email
    },
    resolver: yupResolver(profileSchema) as any
  })



  async function handleProfileUpdate(data : formDataProps) {

    try {
      setIsLoading(true)

      const userUpdate = user;
      userUpdate.name = data.name;

      await api.put('/users', data)

      await updateUserProfile(userUpdate)

      toast.show({
        title: 'Perfil atualizado com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      })

    } catch(error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possivel atualizar os dados.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })

    } finally {
      setIsLoading(false)
    }

    
  }

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true)
    try {
    const photoSelected = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      aspect: [4, 4],
      allowsEditing: true
    });

    if (photoSelected.canceled) {
      return;
    }
    if(photoSelected.assets[0].uri) {
      const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri)

      if (photoInfo.exists && photoInfo.size && (photoInfo.size / 1024 / 1024) > 5) {
        return toast.show({
          title: 'Essa imagem é muito grande. (MAXIMO DE 5 MB)',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      const fileExtension = photoInfo.uri.split('.').pop()

      const photoFile = {
        name: `${user.name}.${fileExtension}`.toLowerCase(),
        uri: photoInfo.uri,
        type: `${photoSelected.assets[0].type}/${fileExtension}`
      } as any

      const userPhotoUploadForm = new FormData();
      userPhotoUploadForm.append('avatar', photoFile);

      const avatarUpdated = await api.patch('/users/avatar', userPhotoUploadForm, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      const userUpdated = user;
      userUpdated.avatar = avatarUpdated.data.avatar;
      updateUserProfile(userUpdated)

      toast.show({
        title: 'Foto atualizada com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      })

    }
  }catch(error) {
    throw error
  }finally {
    setPhotoIsLoading(false)
  }
    
  }

  return(
    <VStack flex={1}>
      <ScreenHeader title='Perfil'/>

      <ScrollView>
        <Center mt={6} px={10}>

          {photoIsLoading ? <Skeleton w={PHOTO_SIZE} h={PHOTO_SIZE} rounded={'full'} startColor={'gray.500'} endColor={'gray.400'}/> : 
          <UserPhoto source={user.avatar ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` } : defaultUserPhotoImg} alt='Foto Usuario' size={PHOTO_SIZE}/>}

          <TouchableOpacity onPress={handleUserPhotoSelect}><Text color={'green.500'} fontWeight={'bold'} fontSize={'md'} mt={2} mb={8}>Alterar foto</Text></TouchableOpacity>

        <Controller control={control} name='name' render={({ field: {value, onChange}}) => (
          <Input placeholder='Nome' bg="gray.600" value={value} onChangeText={onChange} errorMessage={errors.name?.message}/>
        )}/>
        <Controller control={control} name='email' render={({ field: {value, onChange}}) => (
          <Input placeholder='E-mail' bg="gray.600" isDisabled value={value} onChangeText={onChange}/>
        )}/>

        </Center>
        
        <VStack px={10} mt={12} mb={9}>
          <Heading color={'gray.200'} fontSize={'md'} mb={2} fontFamily={'heading'}>Alterar senha</Heading>

          <Controller control={control} name='old_password' render={({ field: {onChange}}) => (
          <Input placeholder='Senha antiga' bg="gray.600" secureTextEntry onChangeText={onChange} />
          )}/>

          <Controller control={control} name='password' render={({ field: {onChange}}) => (
          <Input placeholder='Nova senha' bg="gray.600" secureTextEntry onChangeText={onChange} errorMessage={errors.password?.message}/>
          )}/>

          <Controller control={control} name='confirm_password' render={({ field: {onChange}}) => (
          <Input placeholder='Confirme a nova senha' bg="gray.600" secureTextEntry onChangeText={onChange} errorMessage={errors.confirm_password?.message}/>
          )}/>

          <Button title='Atualizar' mb={4} onPress={handleSubmit(handleProfileUpdate)} isLoading={isLoading}/>
          
        </VStack>

      </ScrollView>
    </VStack>
  )
}