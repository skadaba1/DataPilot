import React, { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.js';
import DatasetsPage from './pages/DatasetsPage.js';
import SpreadsheetPage from './pages/SpreadsheetPage.js';
import SessionsPage from './pages/SessionsPage.js';

function App() {
  const [datasets, setDatasets] = useState([]);
  const [id, setId] = useState(0);
  console.log("setting datasets in app.js:", datasets);

  const handleFileUploadApp = (newDatasetName, newDatasetContent) => {
    setDatasets([...datasets, [newDatasetName, newDatasetContent]]);
  };

  const handleSetId = (newId) => {
    setId(newId);
    console.log("ID IN APP = " + id);
  }

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path='/:id?'
            element={<Landing datasets={datasets} setDatasets = {setDatasets} onSetId={handleSetId}/>} />
          <Route
            path='/datasets'
            element={<DatasetsPage onFileUploadNotifyApp={handleFileUploadApp} id={id}/>} />
          <Route
            path='/spreadsheet'
            element={<SpreadsheetPage />} />
          <Route
            path='/sessions'
            element={<SessionsPage onSetId={handleSetId}/>} />
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