// Context
import { AuthContextProvider } from "./context/auth.context";

// Screen
import Home from "./screen/Home";
import Login from "./screen/Login";

import SharecountEdit from "./screen/SharecountEdit";
import SharecountAdd from "./screen/SharecountAdd";
import SharecountConnect from "./screen/SharecountConnect";

import Expenses from "./components/Expenses";
import ExpensesDetails from "./components/ExpenseDetails";
import ExpenseAdd from "./screen/ExpenseAdd";
import ExpenseEdit from "./screen/ExpenseEdit";

// React
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <AuthContextProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sharecount/:sharecountID" element={<Expenses />} />
            <Route
              path="/sharecount-edit/:sharecountID"
              element={<SharecountEdit />}
            />
            <Route path="/sharecount-add" element={<SharecountAdd />} />
            <Route
              path="/sharecount-connect/:sharecountID"
              element={<SharecountConnect />}
            />
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
    </AuthContextProvider>
  );
};

export default App;
