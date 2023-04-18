import {
    Box,
    chakra,
    Container,
    Link,
    Stack,
    Text,
    useColorModeValue,
    VisuallyHidden,
} from '@chakra-ui/react';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { useSelector } from 'react-redux';


const Logo = (props) => {
    return (
        <Text as='b' fontSize='2xl'>Smart Text Editor</Text>
    );
};

const SocialButton = ({
    children,
    label,
    href,
}) => {
    return (
        <chakra.button
            bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
            rounded={'full'}
            w={8}
            h={8}
            cursor={'pointer'}
            as={'a'}
            href={href}
            display={'inline-flex'}
            alignItems={'center'}
            justifyContent={'center'}
            transition={'background 0.3s ease'}
            _hover={{
                bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
            }}>
            <VisuallyHidden>{label}</VisuallyHidden>
            {children}
        </chakra.button>
    );
};

const Footer = (props, ref) => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    return (
        <Box
            pt='50px'
            bg={useColorModeValue('gray.50', 'gray.900')}
            color={useColorModeValue('gray.700', 'gray.200')}>
            <Container
                as={Stack}
                maxW={'6xl'}
                py={4}
                spacing={4}
                justify={'center'}
                align={'center'}>
                <Logo />
                <Stack direction={'row'} spacing={6}>
                    <Link href={'/'}>Home</Link>
                    <Link href={'/about'}>About</Link>
                    <Link href={'#'}>Contact</Link>
                </Stack>
            </Container>

            <Box
                borderTopWidth={1}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <Container
                    as={Stack}
                    maxW={'6xl'}
                    py={4}
                    direction={{ base: 'column', md: 'row' }}
                    spacing={4}
                    justify={{ base: 'center', md: 'space-between' }}
                    align={{ base: 'center', md: 'center' }}>
                    <Text>© 2023 <a href='https://github.com/looneyD-ROHIT' target='_blank'>looneyd_noob</a>. All rights reserved</Text>
                    <Stack direction={'row'} spacing={6}>
                        <SocialButton label={'Twitter'} href='https://www.twitter.com'>
                            <FaTwitter />
                        </SocialButton>
                        <SocialButton label={'YouTube'} href={'https://www.youtube.com'}>
                            <FaYoutube />
                        </SocialButton>
                        <SocialButton label={'Instagram'} href={'https://www.instagram.com'}>
                            <FaInstagram />
                        </SocialButton>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}

export default Footer;