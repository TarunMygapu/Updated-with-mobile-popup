import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Screen1 from './components/Screen1';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <Router>
      <div className='app-container'>
        <Sidebar />
        <div className='main-container'>
          <Header />
          <div className='body-container'>
            <Routes>
              <Route path='/screen1' element={<Screen1 />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;