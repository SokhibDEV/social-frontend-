import { Home, Login, Profile, Register } from "./pages";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { LeftBar, Navbar, RightBar } from "./components";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";

function App() {
  const {currentUser }= useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  
  const Layout = () => {
    return (
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <Navbar />
        <div style={{ display: "flex" }}>
          <LeftBar />
          <div style={{ flex: 6 }}>
            <Outlet />
          </div>
          <RightBar />
        </div>
      </div>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to={"/login"} />;
    }
    return children;
  };

  return (
    <div className='App'>
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
          children={[
            <Route path='/' element={<Home />} key={"home"} />,
            <Route path='/profile/:id' element={<Profile />} key={"profile"} />,
          ]}
        />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
