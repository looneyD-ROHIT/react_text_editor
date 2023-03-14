import { useSelector } from "react-redux";

const HomePage = (props, ref) => {
    const currentFileName = useSelector(state => state.user.currentFileName)
    const currentFileContent = useSelector(state => state.user.currentFileContent)
    return <h1>This is the HomePage, {currentFileName}</h1>
}

export default HomePage;