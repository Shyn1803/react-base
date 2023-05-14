import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import BlankLayout from "./layouts/blankLayout/blankLayout";
import LoadingComponent from "./components/loadingComponent";

function App() {
  const loadingStore = useSelector((state: RootState) => state.loading);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* <Route path="/login" element={<LoginPage />} /> */}
          <Route path="/*" element={<BlankLayout />} />
        </Routes>
        {loadingStore?.status ? <LoadingComponent /> : null}
      </div>
    </Router>
  );
}

export default App;
