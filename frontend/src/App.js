import{ BrowserRouter ,Route,Routes} from 'react-router-dom';

import Home from './pages/Home';
import Api from './pages/Api';
import Demo2 from './pages/demo2/Demo2.js';
import Main from './pages/main/Main.js';
import DataTable from './pages/main/DataTable.js';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/api" element={<Api />} />
          <Route path="/home" element={<Home />} /> 
           <Route path="/table" element={<DataTable />} />
           <Route path="/demo" element={<Demo2 />} />
           <Route path="/" element={<Main />} />

        </Routes>
      </BrowserRouter>

    </div>

  );
}

export default App;
