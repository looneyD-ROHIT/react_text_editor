import { useEffect, useState } from 'react';

import { Wrap, Textarea, Alert, AlertIcon, useToast } from "@chakra-ui/react";

import { doc, updateDoc, getDoc } from 'firebase/firestore';

import { useDispatch, useSelector } from 'react-redux';

import { useRef } from 'react';

import { db, rtdb } from '../config/firebase';

import {ref as dbRef, get, set, ref} from 'firebase/database';

import { authActions } from '../store/authSlice'

import {
    BtnBold,
    BtnBulletList,
    BtnClearFormatting,
    BtnItalic,
    BtnLink,
    BtnNumberedList,
    BtnRedo,
    BtnStrikeThrough,
    BtnStyles,
    BtnUnderline,
    BtnUndo,
    HtmlButton,
    Separator,
    Toolbar,
    EditorProvider,
    Editor,
    createButton
} from 'react-simple-wysiwyg';

const BtnAlignCenter = createButton('Align center', '≡', 'justifyCenter');


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

    // listen for changes to databases, for sync on different tabs/devices
    useEffect(() => {
        const fetchId = setInterval(async () => {
            const docRef = doc(db, 'users', uid, 'files', id);
            const response = await getDoc(docRef);
            // console.log('only fetched')
            setFetchedData(response.data().fileData);
            if (response.data().fileData != newData) {
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
        }, 6000)

        return () => {
            clearInterval(fetchId);
            // console.log('CLEANUP!!! fetching data')
        }
    }, [newData])

    // update initialRun whenever new file is opened
    useEffect(() => {
        setInitialRun(true);
    }, [id])

    // save file, when updated
    useEffect(() => {
        // if initial run prevent useEffect call
        if (initialRun) {
            setInitialRun(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            // console.log('save: ',newData)
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

            const resp = await getDoc(docRef);
            console.log();
            const newFileData = resp.data().fileData;

            const rtdbRef = dbRef(rtdb, '/totalCount/');
            const snapshot = await get(rtdbRef);
            console.log(snapshot.val());
            // console.log(snapshot.val());
            // character count
            const cleanCharacters = newFileData.replace(/<(?:.|\n)*?>/gm, '').replace(/(\r\n|\n|\r)/gm, "").replace('&nbsp;', '');
            const num1 = cleanCharacters.trim().length;
            // word count
            const cleanWords = newFileData.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
            const num2 = cleanWords.trim().split(/\s+/).length;

            if (props.prevTotalCount.totalCharacters != num1 || props.prevTotalCount.totalCharacters != num1) {
                // characters
                console.log(num1);
                console.log(props.prevTotalCount.totalCharacters);
                const diff = num1 - props.prevTotalCount.totalCharacters;
                console.log(diff);
                const newTotalCharacters = (snapshot.val().totalCharacters + diff) >= 0 ? snapshot.val().totalCharacters + diff : 0;
                console.log(newTotalCharacters);
                props.setPrevTotalCount(prev => {
                    return {
                        ...prev,
                        totalCharacters: num1
                    }
                })


                // words
                console.log(num2);
                console.log(props.prevTotalCount.totalWords);
                const diff2 = num2 - props.prevTotalCount.totalWords;
                console.log(diff2);
                const newTotalWords = (snapshot.val().totalWords + diff2) >= 0 ? snapshot.val().totalWords + diff2 : 0;
                console.log(newTotalWords);
                props.setPrevTotalCount(prev => {
                    return {
                        ...prev,
                        totalWords: num2
                    }
                })


                await set(rtdbRef, {
                    totalUsers: snapshot.val().totalUsers,
                    totalWords: newTotalWords,
                    totalCharacters: newTotalCharacters
                });
            }


        }, 3000)


        // clear function
        return () => {
            clearTimeout(timeoutId);
            // console.log('CLEANUP!!! from file update timeout')
        }
    }, [newData])

    // const [value, setValue] = useState('simple text');

    // function onChange(e) {
    //     setValue(e.target.value);

    // }

    return (
        <Wrap p='2'>
            <EditorProvider>
                <Editor
                    placeholder='Enter your text here'
                    value={newData}
                    onChange={changeDataHandler}
                    containerProps={
                        {
                            style: {
                                width: '100%',
                                height: '80vh',
                                resize: 'none',
                                overflowY: 'scroll'
                            }
                        }
                    }
                >
                    <Toolbar>
                        <BtnUndo />
                        <BtnRedo />
                        <Separator />
                        <BtnBold />
                        <BtnItalic />
                        <BtnUnderline />
                        <BtnStrikeThrough />
                        <Separator />
                        <BtnLink />
                        <BtnClearFormatting />
                        <Separator />
                    </Toolbar>
                </Editor>
            </EditorProvider>
        </Wrap>
    )
}

export default MainTextArea;