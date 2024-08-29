import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  getGridDateOperators,
  GRID_DATETIME_COL_DEF,
  GridColTypeDef,
} from "@mui/x-data-grid-pro";
import GridFilterDateTimeInput from "./GridFilterDateTimeInput";

const dateAdapter = new AdapterDayjs();

export const dateTimeColumnType: GridColTypeDef<Date, string> = {
  ...GRID_DATETIME_COL_DEF,
  resizable: false,
  minWidth: 230,
  filterOperators: [
    ...getGridDateOperators(false).map((item) => ({
      ...item,
      InputComponent: GridFilterDateTimeInput,
    })),
    {
      label: "Last 24h",
      headerLabel: "Last 24h",
      value: "last24h",
      InputComponent: GridFilterDateTimeInput,
      getApplyFilterFn() {
        return () => true;
      },
    },
  ],
  valueFormatter: (value) => {
    if (value) {
      return dateAdapter.formatByString(value, "L hh:mm:ss");
    }

    return "";
  },
};
