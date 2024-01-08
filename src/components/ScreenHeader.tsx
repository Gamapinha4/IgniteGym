import { Center, Heading, VStack } from "native-base";


type props = {
  title: string;
}

export default function ScreenHeader({title} : props) {


  return(
    <Center bg={"gray.600"} pb={6} pt={16}>
      <Heading color={"gray.100"} fontSize={"xl"} fontFamily={'heading'}>{title}</Heading>
    </Center>
  )
}