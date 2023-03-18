import { useEffect, useState } from 'react';

import { Wrap, Textarea, Alert, AlertIcon, useToast } from "@chakra-ui/react";

import { doc, updateDoc, getDoc } from 'firebase/firestore';

import { useDispatch, useSelector } from 'react-redux';

import { useRef } from 'react';

import { db } from '../config/firebase';

import { authActions } from '../store/authSlice'

const MainTextArea = (props, ref) => {
    const toast = useToast();
    const toastIDRef = useRef();
    const dispatch = useDispatch();
    const authenticationData = useSelector(state => state.auth.authenticationData);
    const uid = authenticationData.uid;
    const id = authenticationData.lastOpenedFile.id;
    const textAreaData = props.loaderData.lastOpenedFile.data.fileData;
    const [newData, setNewData] = useState(textAreaData);
    const [fetchedData, setFetchedData] = useState(textAreaData);
    const [initialRun, setInitialRun] = useState(true);
    
    const changeDataHandler = (event) => {
        setNewData(event.target.value);
    }

    useEffect(()=>{
        const fetchId = setInterval(async ()=>{
            const docRef = doc(db, 'users', uid, 'files', id);
            const response = await getDoc(docRef);
            // console.log('only fetched')
            setFetchedData(response.data().fileData);
            if(response.data().fileData!=newData){
                // console.log('updated text area')
                // console.log(response.data().fileData)
                // console.log(newData)
                setNewData(response.data().fileData);
                dispatch(authActions.changeAuthData({
                    lastOpenedFile: {
                        data: {
                            fileData: response.data().fileData
                        }
                    }
                }))
            }
        }, 4000)

        return () => {
            clearInterval(fetchId);
            console.log('CLEANUP!!! fetching data')
        }
    }, [newData])

    // update initialRun whenever new file is opened
    useEffect(()=>{
        setInitialRun(true);
    }, [id])

    useEffect(()=>{
        // if initial run prevent useEffect call
        if(initialRun){
            setInitialRun(false);
            return;
        }

        const timeoutId = setTimeout(async ()=>{
            console.log('save: ',newData)
            const docRef = doc(db, 'users', uid, 'files', id);
            const response = await updateDoc(docRef, {
                fileData: newData,
                lastOpened: Date.now()
            })
            // console.log(response)
            toastIDRef.current = toast({
                title: `Data saved successfully`,
                status: 'success',
                variant: 'subtle',
                duration: 500,
            })
        }, 2000)


        // clear function
        return () => {
            clearTimeout(timeoutId);
            console.log('CLEANUP!!! from file update timeout')
        }
    }, [newData])
    return (
        <Wrap p='2'>

            <Textarea
            placeholder='Enter your text here'
            size='sm'
            resize={'none'}
            value={newData}
            h='55vh'
            onChange={changeDataHandler}
            />
        </Wrap>
        )
    }

export default MainTextArea;