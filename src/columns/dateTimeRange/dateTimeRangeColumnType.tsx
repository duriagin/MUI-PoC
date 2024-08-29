import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  getGridDateOperators,
  GRID_DATETIME_COL_DEF,
  GridColTypeDef,
} from "@mui/x-data-grid-pro";
import GridFilterDateInput from "./GridFilterDateTimeInput";

const dateAdapter = new AdapterDayjs();
const operators = getGridDateOperators(false);

export const dateTimeRangeColumnType: GridColTypeDef<Date, string> = {
  ...GRID_DATETIME_COL_DEF,
  resizable: false,
  minWidth: 400,
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
      return dateAdapter.formatByString(value, "L hh:mm:ss");
    }
    return "";
  },
};
