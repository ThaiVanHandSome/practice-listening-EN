import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';

function App() {
    return (
        <main className="app">
            <BrowserRouter>
                <Routes>
                    {publicRoutes.map((item, index) => (
                        <Route key={index} path={item.path} element={<item.Component />} />
                    ))}
                </Routes>
            </BrowserRouter>
        </main>
    );
}

export default App;
