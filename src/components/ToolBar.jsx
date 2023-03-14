import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import classes from './Toolbar.module.css'
import { auth, provider } from '../config/firebase'
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
import { userDataActions } from '../store/userDataSlice'
import { authActions } from "../store/authSlice";
import { useEffect } from "react";

import { 
    ChevronDownIcon
} from '@chakra-ui/icons'

import {
    BeatLoader
} from 'react-spinners'

import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Button, 
    ButtonGroup,
    Flex,
    HStack,
    Spacer,
    Box,
    FormControl,
    FormLabel,
    Input,
    FormHelperText
  } from '@chakra-ui/react'


const ToolBar = (props, ref) => {
    const uid = 'rohit';
    const dispatch = useDispatch();
    const currentFileName = useSelector(state => state.user.currentFileName);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const authenticationData = useSelector(state => state.auth.authenticationData);

    const fileNameChangeHandler = (event) => {
        dispatch(userDataActions.changeFileName(event.target.value));
    }

    const signInWithGoogleHandler = async (event) => {
        event.preventDefault();
        try{
            const response = await setPersistence(auth, browserLocalPersistence)
            .then(() => signInWithPopup(auth, provider))

            // after successfully logging in get the access token and store in cookies/localStorage

            const credential = GoogleAuthProvider.credentialFromResult(response);
            const token = credential.accessToken
            localStorage.setItem('token', token);
        }catch(err){
            console.log('SignInError', err)
        }
    }
    
    const logoutHandler = async (event) => {
        event.preventDefault();
        try{
            await signOut(auth);
            localStorage.removeItem('token');
        }catch(err){
            console.log('LogOutError', err)
        }
    }

    // reauthorization
    useEffect(()=>{
        const reAuthorizeFromToken = async () => {
            const tokenFromLocalStorage = localStorage.getItem('token');
            if(tokenFromLocalStorage){
                const accessToken = GoogleAuthProvider.credential(null, tokenFromLocalStorage);
                try{
                    const response = await signInWithCredential(auth, accessToken);
                }catch(err){
                    console.log('ReauthorizationError: '+err)
                }
            }
        }

        reAuthorizeFromToken();

        return ()=>{
            console.log('CLEANUP from reauthorization')
        }
    },[])

    // auth state changes
    useEffect(() => {
        onAuthStateChanged(auth, (user)=>{
            if(user){
                dispatch(authActions.changeAuthStatus(true));
            }else{
                dispatch(authActions.changeAuthStatus(false));
            }
        })
      return () => {
        console.log('auth status changed CLEANUP!!!')
      }
    }, [])
    
    return (
    <>
        <div>

            <Flex minWidth='max-content' alignItems='center' gap='2'>
                <Box p='2'>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            Menu
                        </MenuButton>
                        <MenuList>
                            <MenuItem>Download</MenuItem>
                            <MenuItem>Create a Copy</MenuItem>
                            <MenuItem>Mark as Draft</MenuItem>
                            <MenuItem>Delete</MenuItem>
                            <MenuItem>Attend a Workshop</MenuItem>
                        </MenuList>
                    </Menu>
                </Box>

                <FormControl maxWidth='250px'>
                    <Flex gap='2'>

                        <Input 
                            type='text'
                            value={currentFileName}
                            onChange={fileNameChangeHandler}
                        />
                        <Button
                            isLoading={true}
                            colorScheme='blue'
                            spinner={<BeatLoader size={8} color='white' />}
                            >
                            Click me
                        </Button>
                    </Flex>
                </FormControl>

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
                                    <MenuItem onClick={logoutHandler}>Logout</MenuItem>
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