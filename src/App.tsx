// Context
import { AuthContextProvider } from "./context/auth.context";

// Screen
import Login from "./screen/Login";

import SharecountsList from "./screen/SharecountsList";
import SharecountEdit from "./screen/SharecountEdit";
import SharecountAdd from "./screen/SharecountAdd";
import SharecountConnect from "./screen/SharecountConnect";

import Expenses from "./screen/Expenses";
import ExpensesDetails from "./screen/ExpenseDetails";
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
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<SharecountsList />} />
            <Route
              path="/sharecount-edit/:sharecountID"
              element={<SharecountEdit />}
            />
            <Route path="/sharecount-add" element={<SharecountAdd />} />
            <Route
              path="/sharecount-connect/:sharecountID"
              element={<SharecountConnect />}
            />

            <Route path="/sharecount/:sharecountID" element={<Expenses />} />
            <Route
              path="/sharecount/:sharecountID/expense/:expenseID"
              element={<ExpensesDetails />}
            />
            <Route
              path="/sharecount/:sharecountID/expense-add"
              element={<ExpenseAdd />}
            />
            <Route
              path="/sharecount/:sharecountID/expense-edit/:expenseID"
              element={<ExpenseEdit />}
            />
          </Routes>
        </Router>
      </div>
    </AuthContextProvider>
  );
};

export default App;
