import { useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom'
import {
    Button,
    Flex,
    Heading,
    Image,
    Stack,
    Text,
    useBreakpointValue,
  } from '@chakra-ui/react';

import Footer from '../components/Footer'

import signInWithGoogleHandler from '../config/signin'
  
const HomePage = (props, ref) => {
    const navigate = useNavigate();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const authenticationData = useSelector(state => state.auth.authenticationData);
    return (
        <>
            <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
            <Flex p={8} flex={1} align={'center'} justify={'center'}>
            <Stack spacing={6} w={'full'} maxW={'lg'}>
                <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
                <Text
                    as={'span'}
                    position={'relative'}
                    _after={{
                    content: "''",
                    width: 'full',
                    height: useBreakpointValue({ base: '20%', md: '30%' }),
                    position: 'absolute',
                    bottom: 1,
                    left: 0,
                    bg: 'blue.400',
                    zIndex: -1,
                    }}>
                    Smart
                </Text>
                <br />{' '}
                <Text color={'blue.400'} as={'span'}>
                    Text Editor
                </Text>{' '}
                </Heading>
                <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
                    The perfect text editor, that lets use keep your notes safe and synced
                    to the cloud, giving you access anywhere from the world and providing nice
                    customizations.
                </Text>
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                    {
                        isAuthenticated
                        ?
                        <Button
                            rounded={'full'}
                            bg={'blue.400'}
                            color={'white'}
                            _hover={{
                            bg: 'blue.500',
                            }}
                            onClick={(e)=>{
                                e.preventDefault();
                                navigate('/editor/'+`${authenticationData.uid}`);
                            }}>
                            Go to Editor
                        </Button>
                        :
                        <Button
                            rounded={'full'}
                            bg={'blue.400'}
                            color={'white'}
                            _hover={{
                            bg: 'blue.500',
                            }}
                            onClick={(e)=>{
                                signInWithGoogleHandler(e);
                            }}>
                            Sign in
                        </Button>
                    }
                <Button rounded={'full'}>How It Works</Button>
                </Stack>
            </Stack>
            </Flex>
            <Flex flex={1}>
            <Image
                alt={'Login Image'}
                objectFit={'cover'}
                src={
                'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                }
            />
            </Flex>
            </Stack>
            <Footer></Footer>
        </>
      
    );
  }

  export default HomePage;