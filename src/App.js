import { HashRouter, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';

function App() {
    return (
        <main className="app">
            <HashRouter>
                <Routes>
                    {publicRoutes.map((item, index) => (
                        <Route key={index} path={item.path} element={<item.Component key={index} />} />
                    ))}
                </Routes>
            </HashRouter>
        </main>
    );
}

export default App;
