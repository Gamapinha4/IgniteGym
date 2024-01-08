import { Text, Pressable, IPressableProps } from "native-base";

type props = IPressableProps & {
  name: string;
  isActivity: boolean
}

export default function Group({ name, isActivity, ...rest }: props ) {

  return(
    <Pressable mr={3} w={24} h={10} bg={'gray.600'} rounded={'md'} justifyContent={'center'} alignItems={'center'} overflow={'hidden'} isPressed={isActivity} _pressed={{ borderColor: 'green.500', borderWidth: 1}} {...rest}>
      <Text color={isActivity ? 'green.500' : 'gray.200'} textTransform={'uppercase'} fontSize={'xs'} fontWeight={'bold'}>{name}</Text>
    </Pressable>
  )
}