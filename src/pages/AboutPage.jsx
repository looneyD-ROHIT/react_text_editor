// import { Box } from '@chakra-ui/react';
// import Footer from '../components/Footer';

// const AboutPage = (props, ref) => {
//     return (
//         <>
//             <Box>
//                 About US
//             </Box>
//             <Box>
//                 Lorem ipsum dolor sit, amet consectetur adipisicing elit. Modi doloremque et deleniti! Possimus dignissimos ipsum iusto delectus blanditiis similique amet. Odio cupiditate culpa enim doloremque molestias. Expedita ullam numquam dolorem sequi veniam illo adipisci consequatur eos molestiae, nulla voluptates eligendi tempore commodi vitae, necessitatibus cumque! Fugit nesciunt velit, quod atque nisi omnis. Neque asperiores reiciendis veritatis, labore nulla exercitationem, corporis quasi molestiae enim suscipit quod, magni quo sit ipsum?
//                 Lorem ipsum dolor sit, amet consectetur adipisicing elit. Modi doloremque et deleniti! Possimus dignissimos ipsum iusto delectus blanditiis similique amet. Odio cupiditate culpa enim doloremque molestias. Expedita ullam numquam dolorem sequi veniam illo adipisci consequatur eos molestiae, nulla voluptates eligendi tempore commodi vitae, necessitatibus cumque! Fugit nesciunt velit, quod atque nisi omnis. Neque asperiores reiciendis veritatis, labore nulla exercitationem, corporis quasi molestiae enim suscipit quod, magni quo sit ipsum?
//                 Lorem ipsum dolor sit, amet consectetur adipisicing elit. Modi doloremque et deleniti! Possimus dignissimos ipsum iusto delectus blanditiis similique amet. Odio cupiditate culpa enim doloremque molestias. Expedita ullam numquam dolorem sequi veniam illo adipisci consequatur eos molestiae, nulla voluptates eligendi tempore commodi vitae, necessitatibus cumque! Fugit nesciunt velit, quod atque nisi omnis. Neque asperiores reiciendis veritatis, labore nulla exercitationem, corporis quasi molestiae enim suscipit quod, magni quo sit ipsum?
//                 Lorem ipsum dolor sit, amet consectetur adipisicing elit. Modi doloremque et deleniti! Possimus dignissimos ipsum iusto delectus blanditiis similique amet. Odio cupiditate culpa enim doloremque molestias. Expedita ullam numquam dolorem sequi veniam illo adipisci consequatur eos molestiae, nulla voluptates eligendi tempore commodi vitae, necessitatibus cumque! Fugit nesciunt velit, quod atque nisi omnis. Neque asperiores reiciendis veritatis, labore nulla exercitationem, corporis quasi molestiae enim suscipit quod, magni quo sit ipsum?
//             </Box>
//             <Box w='100vw' h='200px'>

//             </Box>
//             <Footer></Footer>
//         </>
//     )
// }

// export default AboutPage;



import {
    Box,
    chakra,
    Flex,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
} from '@chakra-ui/react';

import { ReactNode, useState, useEffect } from 'react';
import { BsPerson, BsFileText } from 'react-icons/bs';
import { GoLocation } from 'react-icons/go';

import { db, rtdb } from '../config/firebase';

import { doc, collection, getDocs, getDoc } from 'firebase/firestore';

import { ref, get } from 'firebase/database';

import Footer from '../components/Footer';
function StatsCard(props) {
    const { title, stat, icon } = props;
    return (
        <Stat
            px={{ base: 2, md: 4 }}
            py={'5'}
            shadow={'xl'}
            border={'1px solid'}
            borderColor={useColorModeValue('gray.800', 'gray.500')}
            rounded={'lg'}>
            <Flex justifyContent={'space-between'}>
                <Box pl={{ base: 2, md: 4 }}>
                    <StatLabel fontWeight={'medium'} isTruncated>
                        {title}
                    </StatLabel>
                    <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
                        {stat}
                    </StatNumber>
                </Box>
                <Box
                    my={'auto'}
                    color={useColorModeValue('gray.800', 'gray.200')}
                    alignContent={'center'}>
                    {icon}
                </Box>
            </Flex>
        </Stat>
    );
}

const AboutPage = () => {
    const [totalCharacters, setTotalCharacters] = useState(0);
    const [totalWords, setTotalWords] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [users, setUsers] = useState({});
    useEffect(() => {
        const timerId = setTimeout(async () => {
            try {
                let wordCount = 0;
                const rtdbRef = ref(rtdb, '/users/');
                const snapshot = await get(rtdbRef);
                // console.log(snapshot.val());
                const users = {}
                setTotalUsers(Object.keys(snapshot.val()).length);
                Object.keys(snapshot.val()).forEach(async (userId) => {
                    console.log(userId);
                    const fileRef = collection(db, 'users', userId, 'files');
                    const filesResponse = await getDocs(fileRef);
                    const files = {}
                    filesResponse.forEach(async (file) => {
                        // files[file.id] = ""
                        const fileDataRef = doc(db, 'users', userId, 'files', file.id);
                        let fileData = await getDoc(fileDataRef);
                        fileData = fileData.data().fileData;
                        files[file.id] = `${fileData}`

                        // character count
                        const cleanCharacters = fileData.replace(/<(?:.|\n)*?>/gm, '').replace(/(\r\n|\n|\r)/gm, "").replace('&nbsp;', '');
                        const num1 = cleanCharacters.trim().length;
                        setTotalCharacters(prev => {
                            return prev + num1
                        });

                        // word count
                        const cleanWords = fileData.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
                        const num2 = cleanWords.trim().split(/\s+/).length;
                        setTotalWords(prev => {
                            return prev + num2
                        });
                    })
                    console.log(files);
                    users[userId] = files;
                })
                console.log(users);
                setUsers(users);
            } catch (error) {
                console.error('error while fetching records: ', error);
            }
        }, 300);
        return () => {
            console.log('CLEANUP!!! from about page')
            clearTimeout(timerId);
        }
    }, [])
    return (
        <>
            <Flex mb={'300px'} mt={'80px'} direction={'column'} justify='center' maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
                <chakra.h1
                    textAlign={'center'}
                    fontSize={'4xl'}
                    py={10}
                    fontWeight={'bold'}
                    h={'250px'}
                >
                    We make text editing, EASY, proof is below.
                </chakra.h1>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
                    <StatsCard
                        title={'Our Library'}
                        stat={`Words: ${totalWords}`}
                        icon={<BsFileText size={'3em'} />}
                    />
                    <StatsCard
                        title={'Users'}
                        stat={`Registered: ${totalUsers}+`}
                        icon={<BsPerson size={'3em'} />}
                    />
                    <StatsCard
                        title={'Available Anywhere'}
                        stat={'Countries: 190+'}
                        icon={<GoLocation size={'3em'} />}
                    />
                </SimpleGrid>
            </Flex>
            <Footer></Footer>
        </>
    );
}

export default AboutPage;