// Components
import BalanceList from "./BalanceList";
import ExpensesList from "./ExpensesList";
import RefundList from "./RefundList";

// React
import { useState } from "react";

// MUI
import { Tab, Tabs, Typography, Box } from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  const style = {
    p: 0,
  };

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={style}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const MenuTabs = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} variant="fullWidth">
          <Tab icon={<ListIcon />} label="Expenses" {...a11yProps(0)} />
          <Tab
            icon={<CompareArrowsIcon />}
            label="Balances"
            {...a11yProps(1)}
          />
          <Tab
            icon={<CurrencyExchangeIcon />}
            label="Refund"
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ExpensesList />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <BalanceList />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <RefundList />
      </TabPanel>
    </Box>
  );
};

export default MenuTabs;
