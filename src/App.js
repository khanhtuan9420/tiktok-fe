import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';
import DefaultLayout from './layouts';
import { Fragment, useContext } from 'react';
import PersistLogin from './components/PersistLogin';
import * as uploadService from './services/uploadService'
import EditProfile from './components/EditProfile';
import Context from './store/Context';
import Login from './components/Login';
function App() {
    const { showLogin, setShowLogin } = useContext(Context).login
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route element={<PersistLogin />}>
                        {publicRoutes.map((route, index) => {
                            const Page = route.component;
                            const Layout = route.layout || DefaultLayout;
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <>
                                            {
                                                showLogin &&
                                                <Login setShowLoginState={setShowLogin} />
                                            }
                                            <Layout>
                                                <Page />
                                            </Layout>
                                        </>
                                    }
                                />
                            );
                        })}
                    </Route>
                </Routes>
            </div>
        </Router>
    );
}


export default App;
