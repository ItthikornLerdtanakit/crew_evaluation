import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// นำเข้า css ทั้งหมด
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './css/style.css';
import './css/progressbar.css';

// ทั้งหมด1234
import Index from './page/index';
import Menu from './page/menu';
import Home from './page/home';
import Crew from './page/crew';
import Evaluates from './page/evaluates';
import Evaluatelist from './page/evaluatelist';
import Result from './page/result';

const Main = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Index />}></Route>
                <Route path='/home' element={<Home />}></Route>
                <Route path='/menu' element={<Menu />}></Route>
                <Route path='/crew' element={<Crew />}></Route>
                <Route path='/evaluates' element={<Evaluates />}></Route>
                <Route path='/evaluatelist' element={<Evaluatelist />}></Route>
                <Route path='/result' element={<Result />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

createRoot(document.getElementById('root')).render(<Main />);