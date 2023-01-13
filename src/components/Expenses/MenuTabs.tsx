// Components
import BalanceList from "./BalanceList";
import ExpensesList from "./ExpensesList";
import RefundList from "./RefundList";

// React
import { useState } from "react";

// MUI
import { Tab, Tabs, Typography, Box } from "@mui/material";
import { ISharecountContext } from "../../interfaces/interfaces";

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

interface IPropsMenuTabs {
  sharecount?: ISharecountContext;
}

const MenuTabs = (props: IPropsMenuTabs) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="flex flex-1 h-full">
      <Box
        className="fixed bg-white w-full z-10"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab label="Expenses" {...a11yProps(0)} />
          <Tab label="Balances" {...a11yProps(1)} />
          <Tab label="Refund" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <div className="w-full mt-12">
        <TabPanel value={value} index={0}>
          <ExpensesList sharecount={props.sharecount} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <BalanceList sharecount={props.sharecount} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <RefundList sharecount={props.sharecount} />
        </TabPanel>
      </div>
    </div>
  );
};

export default MenuTabs;
