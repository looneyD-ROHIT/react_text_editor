import { useDispatch, useSelector } from 'react-redux';
import { redirect } from 'react-router-dom';
import { userDataActions } from '../store/userDataSlice';

import {
    ChevronDownIcon
} from '@chakra-ui/icons';

import {
    BeatLoader
} from 'react-spinners';

import {
    Box,
    Button,
    Flex,
    FormControl,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
} from '@chakra-ui/react';

const MainPage = (props, ref) => {
    const dispatch = useDispatch();
    const currentFileName = useSelector(state => state.user.currentFileName);
    const fileNameChangeHandler = (event) => {
        dispatch(userDataActions.changeFileName(event.target.value));
    }
    return (
        <>
            <Flex gap='4' align='center'>
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
            </Flex>
        </>
    )
}

export default MainPage;

export const loadAuthStatus = ({ request, params }) => {
    const token = localStorage.getItem('token')
    const uid = localStorage.getItem('uid')
    if (token) {
        // console.log('redirect')
        return redirect('/editor/' + uid)
    }
    return null
}