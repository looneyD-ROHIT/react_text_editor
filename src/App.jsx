import { createBrowserRouter } from "react-router-dom"
import ErrorPage from "./pages/ErrorPage"
import ToolBar from "./components/ToolBar"
import HomePage from "./pages/HomePage"
import { RouterProvider } from "react-router-dom"
import MainPage from "./pages/MainPage"
import AboutPage from "./pages/AboutPage"


const router = createBrowserRouter([
  {
    path: '/',
    element: <ToolBar/>,
    errorElement: <ErrorPage/>,
    children: [
      {path: '', element: <HomePage/>},
      {path: 'editor', element: <MainPage/>},
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
