import {
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { auth } from '../config/firebase';
import { authActions } from "../store/authSlice";

import {
    Box,
    Button,
    Flex,
    Menu,
    MenuButton,
    MenuDivider,
    MenuGroup,
    MenuItem,
    MenuList,
    Spacer,
} from '@chakra-ui/react';

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
            console.log('LogOutError', err)
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