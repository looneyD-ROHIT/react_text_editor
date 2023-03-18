import { useSelector, useDispatch } from 'react-redux';
import { collection, getDoc, getDocs, doc, updateDoc, addDoc } from "firebase/firestore"; 
import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useLoaderData, useNavigate, redirect, useNavigation, json, defer, Await, Form } from 'react-router-dom';
import _ from 'lodash'

import { 
    ChevronDownIcon
} from '@chakra-ui/icons'

import {
    BeatLoader
} from 'react-spinners'

import {
    Box,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    FormControl,
    Flex,
    Input,
    Button,
    Skeleton,
    SkeletonText,
    useToast,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
} from '@chakra-ui/react';

import MainTextArea from '../components/MainTextArea'
import AllFilesList from '../components/AllFilesList'
import { auth } from '../config/firebase'
import { db } from '../config/firebase';
import { userDataActions } from '../store/userDataSlice';
import { authActions } from '../store/authSlice';
import Footer from '../components/Footer'

const MainPage = (props, ref) => {
    const toast = useToast();
    const toastIDRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure()
    // const submitFileName = useSubmit();
    const authenticationData = useSelector(state => state.auth.authenticationData);
    const lastOpenedFileName = useSelector(state => state.auth.authenticationData.lastOpenedFile.data.fileName);
    const [savedFileName, setSavedFileName] = useState(lastOpenedFileName);
    const [allFilesLoading, setAllFilesLoading] = useState(false);
    const [allFilesList, setAllFilesList] = useState([]);

    const fileNameChangeHandler = (event) => {
        // dispatch(userDataActions.changeFileName(event.target.value));
        setSavedFileName(event.target.value);
    }

    const fileNameChangeSaveHandler = async (event) => {
        event.preventDefault();

        if(savedFileName === lastOpenedFileName){
            // console.log('Old File Name same as New File Name');
            toastIDRef.current = toast({
                title: 'File not saved.',
                description: "File Name same as current",
                status: 'warning',
                duration: 3000,
                isClosable: true,
            })
            return;
        }

        event.target.setAttribute('disabled', true);
        event.target.innerHTML = `<div class="chakra-button__spinner chakra-button__spinner--start css-1aamklj"><span style="display: inherit;"><span style="display: inline-block; background-color: white; width: 8px; height: 8px; margin: 2px; border-radius: 100%; animation: 0.7s linear 0s infinite normal both running react-spinners-BeatLoader-beat;"></span><span style="display: inline-block; background-color: white; width: 8px; height: 8px; margin: 2px; border-radius: 100%; animation: 0.7s linear 0.35s infinite normal both running react-spinners-BeatLoader-beat;"></span><span style="display: inline-block; background-color: white; width: 8px; height: 8px; margin: 2px; border-radius: 100%; animation: 0.7s linear 0s infinite normal both running react-spinners-BeatLoader-beat;"></span></span></div>`

        dispatch(authActions.changeAuthData({
            lastOpenedFile:{
                data: {
                    fileName: savedFileName,
                }
            }
        }));

        // do a post request to db to update the file name
        // if name already exists reject
        // if doesn't update the file name
        // const res = submitFileName({fileName: savedFileName, id: authenticationData.lastOpenedFile.id}, {method:'PATCH'});
        // console.log(res)

        const collRef = collection(db, 'users', authenticationData.uid, 'files');
        const res = await getDocs(collRef)
        const id = authenticationData.lastOpenedFile.id;
        const fileNames = new Set();
        let previousSaved = '';
        res.forEach(file => {
            if(file.id === id){
                previousSaved = file.data().fileName;
            }
            fileNames.add(file.data().fileName);
        })

        const newFileName = savedFileName
        if(fileNames.has(newFileName)){
            // unsuccessful
            // change name back to previousSaved
            event.target.innerHTML = `Save FileName`
            event.target.removeAttribute('disabled')
            toastIDRef.current = toast({
                title: 'File not saved.',
                description: "File Name collision",
                status: 'error',
                duration: 800,
                isClosable: true,
            })
            return dispatch(authActions.changeAuthData({ lastOpenedFile: { data: { fileName: previousSaved } }}));
        }

        const docRef = doc(db, 'users', authenticationData.uid, 'files', id)

        await updateDoc(docRef, {
            fileName: newFileName
        })

        event.target.innerHTML = `Save FileName`
        event.target.removeAttribute('disabled')

        toastIDRef.current = toast({
            title: 'File saved.',
            description: "File Name changed successfully",
            status: 'success',
            duration: 800,
            isClosable: true,
        })

    }

    const newFileHandler = async (event) => {
        event.preventDefault();
        const collRef = collection(db, 'users', authenticationData.uid, 'files');
        const t = Date.now();
        const resp = await getDocs(collRef);
        const list = [];
        resp.forEach(e => {
            list.push(e.id);
        })
        const len = list.length;
        const newNum = len + 1;
        const res = await addDoc(collRef, {
            'createdAt': t,
            'lastOpened': t,
            'fileName': `Untitled-${newNum}.txt`,
            'fileData': ''
        })
        navigate(0)
    }

    const showAllFilesHandler = async (event) => {
        event.preventDefault();
        onOpen();
        setAllFilesLoading(true);
        const collRef = collection(db, 'users', authenticationData.uid, 'files');
        const response = await getDocs(collRef);
        const allFiles = [];
        response.forEach(file => {
            const obj = {
                uid: authenticationData.uid,
                id: file.id,
                ...file.data()
            };
            allFiles.push(obj);
        })
        setAllFilesList(allFiles);
        setAllFilesLoading(false);
    }

    const { loaderData } = useLoaderData();
    const uid = authenticationData.uid;


    // dispatching the auth data when loader ends
    useEffect(()=>{
        loaderData.then(ld => {
            dispatch(authActions.changeAuthData({
                uid,
                lastOpenedFile: ld.lastOpenedFile
            }))
        })
    }, [])

    // changing the file name when auth data loads
    useEffect(()=>{
        setSavedFileName(lastOpenedFileName);
    }, [authenticationData])


    const navigation = useNavigation();

    return (
        <>
        <header>
            <Flex gap='4' align='center'>
                <Box p='2'>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            Menu
                        </MenuButton>
                        <MenuList>
                            <MenuItem>Download</MenuItem>
                            <MenuItem>Delete</MenuItem>
                            <MenuItem onClick={newFileHandler}>New File</MenuItem>
                            <MenuItem onClick={showAllFilesHandler}>All Files</MenuItem>
                        </MenuList>
                    </Menu>
                </Box>

                <FormControl maxWidth='250px'>
                    <Form>
                        <Flex gap='2'>

                            <Input 
                                type='text'
                                htmlFor='fileName'
                                name='fileName'
                                value={savedFileName ? savedFileName : ''}
                                onChange={fileNameChangeHandler}
                                />
                            <Button
                                type='submit'
                                w='300px'
                                // isLoading={lastOpenedFileName === savedFileName}
                                colorScheme='blue'
                                onClick={fileNameChangeSaveHandler}
                                isDisabled={lastOpenedFileName == savedFileName}
                                >
                                Save FileName
                            </Button>
                        </Flex>
                    </Form>
                </FormControl>
            </Flex>
        </header>
        <Modal isCentered isOpen={isOpen} onClose={onClose} scrollBehavior='inside'>
            <ModalOverlay
            bg='none'
            backdropFilter='auto'
            backdropInvert='80%'
            backdropBlur='2px'
            />
            <ModalContent maxW="60vw" minW='800px' minH='500px' maxH='600px'>
            <ModalHeader>All Files</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Box>

                    {
                        allFilesLoading
                        ?
                        <Skeleton>
                            <div>Something to put in here!!!</div>
                            <div>Something to put in here!!!</div>
                            <div>Something to put in here!!!</div>
                            <div>Something to put in here!!!</div>
                            <div>Something to put in here!!!</div>
                            <div>Something to put in here!!!</div>
                            <div>Something to put in here!!!</div>
                            <div>Something to put in here!!!</div>
                            <div>Something to put in here!!!</div>
                            <div>Something to put in here!!!</div>
                            <div>Something to put in here!!!</div>
                            <div>Something to put in here!!!</div>
                            <div>Something to put in here!!!</div>
                            <div>Something to put in here!!!</div>
                            <div>Something to put in here!!!</div>
                            <div>Something to put in here!!!</div>
                        </Skeleton>
                        :
                        <AllFilesList list={allFilesList} />
                    }
                </Box>
            </ModalBody>
            <ModalFooter>
                <Button onClick={onClose}>Close</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        <main>
            {
                 <Suspense fallback={
                    <Box padding='6' boxShadow='lg' bg='white'>
                        <SkeletonText mt='4' noOfLines={20} spacing='3' skeletonHeight='1' />
                    </Box>
                 }>
                    <Await resolve={loaderData}>
                        {
                            (loaderData) => {
                                return <MainTextArea loaderData={loaderData} />
                            }
                        }
                    </Await>
                </Suspense>
            }
        </main>
        <Box w='100vw' h='200px'>
            
        </Box>
        <Footer></Footer>
        </>
    )
}

export default MainPage;

const loadUserDataHelper = async ({request, params}) => {

    const filesRef = collection(db, 'users', params.uid, 'files')

    const response = await getDocs(filesRef)

    let list = []
    response.forEach((doc)=>{
        list.push ({
            id: doc.id,
            data: {
                fileName: doc.data().fileName,
                fileData: doc.data().fileData,
                createdAt: doc.data().createdAt,
                lastOpened: doc.data().lastOpened,
            }
        })
    })

    const val = list.sort((a, b)=> b.data.lastOpened - a.data.lastOpened)[0]

    return {lastOpenedFile: val};
}

export const loadUserData = ({request, params}) => {
    return defer({
        loaderData: loadUserDataHelper({request, params})
    })
}

// export const action = async ({request, params}) => {
//     console.log('inside action')
//     const data = await request.formData();

//     const collRef = collection(db, 'users', params.uid, 'files');
//     const res = await getDocs(collRef)
//     const id = data.get('id');
//     const fileNames = new Set();
//     let previousSaved = '';
//     res.forEach(file => {
//         if(file.id === id){
//             previousSaved = file.data().fileName;
//         }
//         fileNames.add(file.data().fileName);
//     })

//     const newFileName = data.get('fileName');
//     console.log(fileNames)
//     if(fileNames.has(newFileName)){
//         return new Response(
//             {
//                 success: false,
//                 message: 'unsuccessful',
//                 oldName: previousSaved
//             },
//             {
//                 status: 500
//             }
//         ) 
//     }

//     const docRef = doc(db, 'users', params.uid, 'files', id)

//     const response = await updateDoc(docRef, {
//         fileName: newFileName
//     })
//     console.log(response)
//     return new Response(
//         {
//             success: true,
//             message: 'successful'
//         },
//         {
//             status: 200
//         } 
//     )
// }