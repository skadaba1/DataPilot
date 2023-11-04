import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.js';
import DatabasePage from './pages/DatabasePage.js';
import SpreadsheetPage from './pages/SpreadsheetPage.js';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' exact element={<Landing />} />
          <Route path='/databases' element={<DatabasePage />} />
          <Route path='/spreadsheet' element={<SpreadsheetPage />} />
        </Routes>
      </Router>
    </>
  );
  // return <DatabasePage />
  // return (
  //   <Router>
  //     <div>
  //       {/* Your common UI, e.g., header, navigation, etc. */}

  //       {/* The Switch component renders the first matching route */}
  //       <Switch>
  //         <Route path="/" exact component={DatabasePage} />
  //         <Route path="/about" component={About} />
  //         <Route path="/contact" component={Contact} />
  //         {/* The Route without a path prop will always be rendered if none of the other routes match */}
  //         <Route component={NotFound} />
  //       </Switch>

  //       {/* Your common UI, e.g., footer, etc. */}
  //     </div>
  //   </Router>
}

export default App;
