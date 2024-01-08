import { IImageProps, Image } from "native-base";

type props = IImageProps & {
  size: number;
}

export function UserPhoto( {size, ...rest} : props) {

  return(
    <Image w={size} h={size} rounded={'full'} borderWidth={2} borderColor={"gray.400"} {...rest}/>
  )
}