import { RouterProvider, createBrowserRouter } from "react-router-dom"
import ToolBar from "./components/ToolBar"
import AboutPage, { loadAboutData } from "./pages/AboutPage"
import ErrorPage from "./pages/ErrorPage"
import HomePage from "./pages/HomePage"
import UserMainPage, { loadUserData } from "./pages/UserMainPage"


const router = createBrowserRouter([
  {
    path: '/',
    element: <ToolBar />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, path: '', element: <HomePage /> },
      { path: 'editor/:uid', loader: loadUserData, element: <UserMainPage /> },
      { path: 'about', element: <AboutPage />, loader: loadAboutData },
    ]
  }
])


function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
