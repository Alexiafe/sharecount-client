// Context
import { AuthContextProvider } from "./context/auth.context";
import { SharecountsContextProvider } from "./context/sharecounts.context";
import { SharecountPositionContextProvider } from "./context/sharecountposition.context";

// Screen
import Login from "./screen/Login";

import Sharecounts from "./screen/Sharecounts";
import SharecountEdit from "./screen/SharecountEdit";
import SharecountAdd from "./screen/SharecountAdd";
import SharecountConnect from "./screen/SharecountConnect";

import Expenses from "./screen/Expenses";
import ExpenseAdd from "./screen/ExpenseAdd";
import ExpenseEdit from "./screen/ExpenseEdit";

// React
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// MUI
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5A7684",
    },
    secondary: {
      main: "#DC5656",
    },
    text: {
      primary: "#4F4F4F",
      secondary: "#707070",
    },
  },
  shape: {
    borderRadius: 15,
  },
  typography: {
    allVariants: {
      color: "#4F4F4F",
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthContextProvider>
        <SharecountsContextProvider>
          <SharecountPositionContextProvider>
            <div>
              <Router>
                <Routes>
                  <Route path="/login" element={<Login />} />

                  <Route path="/" element={<Sharecounts />} />
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
                    path="/sharecount/:sharecountID"
                    element={<Expenses />}
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
          </SharecountPositionContextProvider>
        </SharecountsContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  );
};

export default App;
