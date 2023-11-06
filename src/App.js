import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.js';
import DatasetsPage from './pages/DatasetsPage.js';
import SpreadsheetPage from './pages/SpreadsheetPage.js';
import SessionsPage from './pages/SessionsPage.js';

function App() {

  const [dataContent, setDataContent] = useState("");

  const handleFileUploadApp = (newDataContent) => {
    setDataContent(newDataContent);
  };

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path='/:id'
            element={<Landing dataContent={dataContent} />} />
          <Route
            path='/datasets'
            element={<DatasetsPage onFileUploadNotifyApp={handleFileUploadApp} />} />
          <Route
            path='/spreadsheet'
            element={<SpreadsheetPage />} />
          <Route
            path='/sessions'
            element={<SessionsPage />} />
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