import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  getGridDateOperators,
  GRID_DATE_COL_DEF,
  GridColTypeDef,
} from "@mui/x-data-grid-pro";
import GridFilterDateInput from "./GridFilterDateInput";

const dateAdapter = new AdapterDayjs();

export const dateColumnType: GridColTypeDef<Date, string> = {
  ...GRID_DATE_COL_DEF,
  resizable: false,
  minWidth: 180,
  filterOperators: getGridDateOperators(false).map((item) => ({
    ...item,
    InputComponent: GridFilterDateInput,
  })),
  valueFormatter: (value) => {
    if (value) {
      return dateAdapter.format(value, "keyboardDate");
    }
    return "";
  },
};
