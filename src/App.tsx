import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./screen/Home";
import Header from "./components/Header";

import SharecountEdit from "./screen/SharecountEdit";
import SharecountAdd from "./screen/SharecountAdd";

import ExpensesList from "./components/ExpensesList";
import ExpensesDetails from "./components/ExpenseDetails";
import ExpenseAdd from "./screen/ExpenseAdd";
import ExpenseEdit from "./screen/ExpenseEdit";

function App() {
  return (
    <div>
      <Header></Header>

      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sharecount/:id" element={<ExpensesList />} />
          <Route path="/sharecount-edit/:id" element={<SharecountEdit />} />
          <Route path="/sharecount-add" element={<SharecountAdd />} />
          <Route
            path="/sharecount/:id/expense/:id"
            element={<ExpensesDetails />}
          />
          <Route path="/sharecount/:id/expense-edit/:id" element={<ExpenseEdit />} />
          <Route path="/sharecount/:id/expense-add" element={<ExpenseAdd />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
