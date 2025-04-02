import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Round1 from "./components/Round1";
import Round2 from "./components/Round2";
import Round3 from "./components/Round3";
import FinalRound from "./components/FinalRound";
import Home1 from "./components/Home1";
import Begin from "./components/Begin";
// import ViewData from "./components/ViewData";
import Timer from "./components/Timer";
import AdminCL from "./components/AdminCL";


function App() {
  return (
    <Router>
      <div className="app">
        <Timer/>
        
        <Routes>
          <Route path="/home" element={<Home1/>} />
          <Route path="/" element={<Begin/>} />
          <Route path="*" element={<Begin/>} />
          <Route path="/admin" element={<AdminCL/>} />
          <Route path="/round1" element={<Round1 />} />
          <Route path="/round2" element={<Round2 />} />
          <Route path="/round3secretroute123" element={<Round3 />} />
          <Route path="/finalroundxyz123" element={<FinalRound />} />
        </Routes>
      </div>
     
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h2>Welcome to the Treasure Hunt!</h2>
      <p>Click below to start:</p>
      <Link to="/round1"><button>Start Round 1</button></Link>
    </div>
  );
}


export default App;
