import { createContext, useState } from "react";

interface IExpensePositionContext {
  expenseIdContext: string;
  expensePositionContext: number;
  setExpenseIdContext: (id: string) => void;
  setExpensePositionContext: (position: number) => void;
}

const ExpensePositionContext = createContext({} as IExpensePositionContext);

export function ExpensePositionContextProvider({ children }: any) {
  const [expenseIdContext, setExpenseIdContext] = useState<string>("");
  const [expensePositionContext, setExpensePositionContext] =
    useState<number>(0);

  return (
    <ExpensePositionContext.Provider
      value={{
        expenseIdContext,
        expensePositionContext,
        setExpenseIdContext,
        setExpensePositionContext,
      }}
    >
      {children}
    </ExpensePositionContext.Provider>
  );
}

export default ExpensePositionContext;
