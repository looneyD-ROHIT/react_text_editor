import { Link, Outlet, redirect, useNavigate } from "react-router-dom";
import classes from './Toolbar.module.css'
import { auth, provider } from '../config/firebase'
import { collection, setDoc, addDoc, doc } from "firebase/firestore";
import { db, rtdb } from '../config/firebase';
import { ref, set, get, child } from 'firebase/database';
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut,
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

import signInWithGoogleHandler from '../config/signin';

const ToolBar = (props) => {
    const logoutRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const authenticationData = useSelector(state => state.auth.authenticationData);

    const signInHandler = async (event) => {
        event.preventDefault();
        signInWithGoogleHandler(event);
        // navigate('/editor/' + response.user.uid)
    }

    const logoutHandler = async (event) => {
        if (event) {
            event.preventDefault();
        }
        try {
            await signOut(auth);
            localStorage.removeItem('token');
            localStorage.removeItem('uid');
            dispatch(authActions.changeAuthStatus(false));
            navigate('/')
        } catch (err) {
            // console.log('LogOutError', err)
        }
    }

    // auth state changes
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid
                if (!isAuthenticated) {
                    dispatch(authActions.changeAuthStatus(true));
                }
                if (!(authenticationData.uid)) {
                    dispatch(authActions.changeAuthData({ 'uid': uid }))
                }
            } else {
                if (isAuthenticated) {
                    dispatch(authActions.changeAuthStatus(false));
                }
                if ((authenticationData.uid)) {
                    dispatch(authActions.changeAuthData({ 'uid': '' }))
                }
            }
        })
        return () => {
            // console.log('CLEANUP!!! from auth status changed')
        }
    }, [])

    return (
        <>
            <div>
                <Flex minWidth='max-content' alignItems='center' gap='2'>

                    <Button ml='2'>
                        <Link to='/'>Home</Link>
                    </Button>


                    {/* {
                    isAuthenticated
                    &&
                    <Button>
                            <Link to={'/editor/' + `${authenticationData['uid']}`}>Editor</Link>
                    </Button>
                } */}

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
                <Outlet />
            </div>
        </>
    )
}

export default ToolBar;