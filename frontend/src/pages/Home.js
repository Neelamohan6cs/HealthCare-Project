
import Body from './Body';


import './Header.css';


function Home   () {
  return (
    <div className='content'>

      <header className="header">
        
        <div className="header-left">
          <h1 className="title">Health Care</h1>
        </div>

        <div class="header-right">
          <button class="header-btn chart-btn">Charts</button>
          <button class="header-btn analytics-btn">Analytics</button>
        </div>
      </header>
      <Body/>

    
    </div>

  );
}

export default Home;
