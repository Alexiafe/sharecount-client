import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./screen/Home";
import SharecountEdit from "./screen/SharecountEdit";
import SharecountAdd from "./screen/SharecountAdd";

import ExpensesList from "./components/ExpensesList";
import ExpensesDetails from "./components/ExpenseDetails";
import ExpenseAdd from "./screen/ExpenseAdd";
import ExpenseEdit from "./screen/ExpenseEdit";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sharecount/:sharecountID" element={<ExpensesList />} />
          <Route
            path="/sharecount-edit/:sharecountID"
            element={<SharecountEdit />}
          />
          <Route path="/sharecount-add" element={<SharecountAdd />} />
          <Route
            path="/sharecount/:sharecountID/expense/:expenseID"
            element={<ExpensesDetails />}
          />
          <Route
            path="/sharecount/:sharecountID/expense-edit/:expenseID"
            element={<ExpenseEdit />}
          />
          <Route
            path="/sharecount/:sharecountID/expense-add"
            element={<ExpenseAdd />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
