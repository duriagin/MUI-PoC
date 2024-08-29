import { GridColTypeDef } from "@mui/x-data-grid-pro";
import GridFilterUsernameAutocompleteInput from "./GridFilterUsernameAutocompleteInput";

const operators = [
  {
    label: "Is",
    headerLabel: "Is",
    value: "is",
    InputComponent: GridFilterUsernameAutocompleteInput,
    getApplyFilterFn() {
      return () => false;
    },
  },
];

export const usernameAutocompleteColumnType: GridColTypeDef<Date, string> = {
  resizable: false,
  minWidth: 200,
  filterOperators: operators,
};
