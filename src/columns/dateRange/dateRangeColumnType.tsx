import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  getGridDateOperators,
  GRID_DATE_COL_DEF,
  GridColTypeDef,
} from "@mui/x-data-grid-pro";
import GridFilterDateInput from "./GridFilterDateInput";

const dateAdapter = new AdapterDayjs();
const operators = getGridDateOperators(false);

export const dateRangeColumnType: GridColTypeDef<Date, string> = {
  ...GRID_DATE_COL_DEF,
  resizable: false,
  minWidth: 280,
  filterOperators: [
    {
      ...operators[0],
      label: "In Range",
      headerLabel: "In Range",
      InputComponent: GridFilterDateInput,
    },
  ],
  valueFormatter: (value) => {
    if (value) {
      return dateAdapter.formatByString(value, "DD/MM/YYYY");
    }
    return "";
  },
};
