import { Button as NativeBaseButton, Text, IButtonProps} from 'native-base'

type props = IButtonProps & {
  title: string
  variant?: 'solid' | 'outline'
}

export function Button( { title, variant = 'solid', ...rest } : props) {

  return(
    <NativeBaseButton w={'full'} h={14} bg={ variant === 'outline' ? 'transparent' : 'green.700'} borderWidth={variant === 'outline' ? 1 : 0} borderColor={'green.500'} _pressed={{
      bg: variant === 'outline' ? 'gray.500' : 'green.500'
      }}
      {...rest}>
      <Text color={ variant === 'outline' ? 'green.500': 'white'} fontFamily={'heading'} fontSize={'sm'} rounded={'sm'}>{title}</Text>
    </NativeBaseButton>
  )
}