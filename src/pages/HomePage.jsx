import { useSelector } from "react-redux";
import { Link } from 'react-router-dom'
import { Button } from '@chakra-ui/react'

const HomePage = (props, ref) => {
    const currentFileName = useSelector(state => state.user.currentFileName)
    const currentFileContent = useSelector(state => state.user.currentFileContent)
    return (
        <>
            <h1>This is the HomePage, {currentFileName}</h1>
        </>
    )
}

export default HomePage;