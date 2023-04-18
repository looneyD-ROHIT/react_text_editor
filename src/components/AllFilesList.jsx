import { Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { db } from '../config/firebase';

import { doc, updateDoc } from 'firebase/firestore';

function getFormattedDate(today) {
    let week = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
    let month = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')
    let day = week[today.getDay()];
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    let hour = today.getHours();
    let minu = today.getMinutes();
    let sec = today.getSeconds();

    if (dd < 10) { dd = '0' + dd }
    if (hour < 10) { hour = '0' + hour }
    if (minu < 10) { minu = '0' + minu }
    if (sec < 10) { sec = '0' + sec }

    return day + ', ' + dd + ' ' + month[mm] + ' ' + yyyy + '\n' + hour + ':' + minu + ':' + sec;
}

const AllFilesList = (props, ref) => {
    // console.log(props.list);
    const navigate = useNavigate();
    const authenticationData = useSelector(state => state.auth.authenticationData);
    const openFileHandler = async (event) => {
        event.preventDefault();
        const docRef = doc(db, 'users', authenticationData.uid, 'files', event.target.getAttribute('id'));
        await updateDoc(docRef, {
            lastOpened: Date.now()
        })
        navigate(0);
    }
    return (
        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
            {
                props.list.map(element => {
                    let lastOpened = new Date(element.lastOpened);
                    let createdAt = new Date(element.createdAt);
                    let finalTime;
                    if (lastOpened.toLocaleString()) {
                        finalTime = lastOpened;
                    } else {
                        finalTime = createdAt;
                    }
                    return (
                        <Card key={element.createdAt}>
                            <CardHeader>
                                <Heading size='md'>{element.fileName}</Heading>
                            </CardHeader>
                            <CardBody>
                                <Text>{element.fileData ? `${element.fileData.substring(0, 50)}...` : '...'}</Text>
                            </CardBody>
                            <CardFooter>
                                <Flex>
                                    <Box>
                                        <Text>Last Opened:</Text>
                                        <Text>{getFormattedDate(finalTime)}</Text>
                                    </Box>
                                    <Button id={element.id} onClick={openFileHandler}>Open File</Button>
                                </Flex>
                            </CardFooter>
                        </Card>
                    )
                })
            }
        </SimpleGrid>
    )
}

export default AllFilesList;