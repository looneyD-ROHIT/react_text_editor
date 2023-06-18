import {
    Box,
    chakra,
    Flex,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
    SkeletonText
} from '@chakra-ui/react';

import { defer, Await, useLoaderData } from 'react-router-dom';

import { useEffect, useState, Suspense } from 'react';
import { BsFileText, BsPerson } from 'react-icons/bs';
import { GoLocation } from 'react-icons/go';

import { rtdb } from '../config/firebase';


import { get, ref } from 'firebase/database';

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
    const { loaderData } = useLoaderData();
    return (
        <Suspense fallback={
            <Box padding='6' boxShadow='lg' bg='white'>
                <SkeletonText mt='4' noOfLines={40} spacing='3' skeletonHeight='1' />
            </Box>
        }>
            <Await resolve={loaderData}>
                {
                    (loaderData) => {
                        return <>
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
                                        stat={`Words: ${loaderData["totalWords"]}+`}
                                        icon={<BsFileText size={'3em'} />}
                                    />
                                    <StatsCard
                                        title={'Users'}
                                        stat={`Registered: ${loaderData["totalUsers"]}+`}
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
                    }

                }
            </Await>
        </Suspense>

    );
}

export default AboutPage;

const loadAboutDataHelper = async ({ request, params }) => {
    try {
        const rtdbCountRef = ref(rtdb, '/totalCount');
        const res = await get(rtdbCountRef);
        return res.val();
    } catch (err) {
        console.error(err);
    }
}

export const loadAboutData = ({ request, params }) => {
    return defer({
        loaderData: loadAboutDataHelper({ request, params })
    })
}