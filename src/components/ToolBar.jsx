import { Link, Outlet, redirect, useNavigate } from "react-router-dom";
import classes from './Toolbar.module.css'
import { auth, provider } from '../config/firebase'
import { collection, setDoc, addDoc, doc } from "firebase/firestore"; 
import { db, rtdb } from '../config/firebase';
import { ref, set, get, child } from 'firebase/database';
import { 
    setPersistence,
    onAuthStateChanged,
    signInWithPopup,
    signInWithCredential,
    signOut,
    GoogleAuthProvider,
    browserLocalPersistence
} from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/authSlice";
import { useEffect, useRef } from "react";

import {
    Flex,
    Button,
    Spacer,
    Box,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuGroup,
    MenuDivider,
  } from '@chakra-ui/react'


const ToolBar = (props) => {
    const logoutRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const authenticationData = useSelector(state => state.auth.authenticationData);

    const signInWithGoogleHandler = async (event) => {
        event.preventDefault();
        try{
            const response = await setPersistence(auth, browserLocalPersistence)
            .then(() => signInWithPopup(auth, provider))
            // console.log(response)
            // console.log(response.user.uid)

            const createdAt = response.user.metadata.createdAt;
            const lastLoginAt = response.user.metadata.lastLoginAt;
            // console.log(createdAt)
            // console.log(lastLoginAt)


            // console.log(ref)
            const rtdbRef = ref(rtdb, '/users/' + `${response.user.uid}`);
            const snapshot = await get(rtdbRef);
            if(snapshot.exists()){
                console.log('Old user, rtdb')
                // console.log(snapshot.val());
            }else{
                console.log('New user, rtdb')
                // add user existence to rtdb
                set(ref(rtdb, 'users/' + `${response.user.uid}`), {
                    name: response.user.displayName,
                    email: response.user.email,
                    profile_picture : response.user.photoURL
                });

                // add initial file for user in firestore
                const collRef = collection(db, 'users', response.user.uid, 'files');
                const t = Date.now();
                const res = await addDoc(collRef, {
                    'createdAt': t,
                    'lastOpened': t,
                    'fileName': 'Untitled-1.txt',
                    'fileData': ''
                })
                // console.log(res);
            }
            
            const credential = GoogleAuthProvider.credentialFromResult(response);
            const token = credential.accessToken
            localStorage.setItem('token', token);
            localStorage.setItem('uid', response.user.uid);

            navigate('/editor/' + response.user.uid)
        }catch(err){
            console.log('SignInError', err)
        }
    }
    
    const logoutHandler = async (event) => {
        if(event){
            event.preventDefault();
        }
        try{
            await signOut(auth);
            localStorage.removeItem('token');
            localStorage.removeItem('uid');
            dispatch(authActions.changeAuthStatus(false));
            navigate('/')
        }catch(err){
            console.log('LogOutError', err)
        }
    }

    // reauthorization
    // useEffect(()=>{
    //     const reAuthorizeFromToken = async () => {
    //         const tokenFromLocalStorage = localStorage.getItem('token');
    //         if(tokenFromLocalStorage && !isAuthenticated){
    //             const accessToken = GoogleAuthProvider.credential(null, tokenFromLocalStorage);
    //             try{
    //                 const response = await signInWithCredential(auth, accessToken);
    //             }catch(err){
    //                 console.log('ReauthorizationError: '+err);
    //                 logoutHandler();
    //             }
    //         }
    //     }

    //     reAuthorizeFromToken();

    //     return ()=>{
    //         console.log('CLEANUP!!! from reauthorization')
    //     }
    // },[isAuthenticated])

    // auth state changes
    useEffect(() => {
        onAuthStateChanged(auth, (user)=>{
            if(user){
                const uid = user.uid
                if(!isAuthenticated){
                    dispatch(authActions.changeAuthStatus(true));
                }
                if(!(authenticationData.uid)){
                    dispatch(authActions.changeAuthData({'uid': uid}))
                }
            }else{
                if(isAuthenticated){
                    dispatch(authActions.changeAuthStatus(false));
                }
                if((authenticationData.uid)){
                    dispatch(authActions.changeAuthData({'uid': ''}))
                }
            }
        })
      return () => {
        console.log('CLEANUP!!! from auth status changed')
      }
    }, [])
    
    return (
    <>
        <div>
            <Flex minWidth='max-content' alignItems='center' gap='2'>

                <Button ml='2'>
                    <Link to='/'>Home</Link>
                </Button>


                {
                    isAuthenticated
                    &&
                    <Button>
                            <Link to={'/editor/' + `${authenticationData['uid']}`}>Editor</Link>
                    </Button>
                }

                <Button>
                    <Link to='/about'>About</Link>
                </Button>

                <Spacer />

                <Box p='2'>
                    {
                        isAuthenticated ?
                        <Menu>
                            <MenuButton as={Button} colorScheme='gray'>
                                Profile
                            </MenuButton>
                            <MenuList>
                                <MenuGroup title='Profile'>
                                    <MenuItem>My Account</MenuItem>
                                    <MenuItem ref={logoutRef} onClick={logoutHandler}>Logout</MenuItem>
                                </MenuGroup>
                                <MenuDivider />
                                <MenuGroup title='Help'>
                                    <MenuItem>Support</MenuItem>
                                </MenuGroup>
                            </MenuList>
                        </Menu>
                        :
                        <Button onClick={signInWithGoogleHandler} as={Button} colorScheme='gray'>
                            Sign In
                        </Button>
                    }
                </Box>
            </Flex>
        </div>
        <div>
            <Outlet/>
        </div>
    </>
    )
}

export default ToolBar;