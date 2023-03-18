import { createBrowserRouter } from "react-router-dom"
import ErrorPage from "./pages/ErrorPage"
import ToolBar from "./components/ToolBar"
import HomePage from "./pages/HomePage"
import { RouterProvider } from "react-router-dom"
import MainPage from "./pages/MainPage"
import { loadAuthStatus } from './pages/MainPage'
import AboutPage from "./pages/AboutPage"
import UserMainPage from "./pages/UserMainPage"
import { loadUserData } from './pages/UserMainPage'


const router = createBrowserRouter([
  {
    path: '/',
    element: <ToolBar/>,
    errorElement: <ErrorPage/>,
    children: [
      {index: true, path: '', element: <HomePage/>},
      // {path: 'editor', element: <MainPage/>, loader: loadAuthStatus },
      {path: 'editor/:uid', loader: loadUserData, element: <UserMainPage/>},
      {path: 'about', element: <AboutPage/>},
    ]
  }
])


function App() {

  return (
    <RouterProvider router={router}/>
  )
}

export default App
