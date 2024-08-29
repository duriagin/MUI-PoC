import { Edit } from "@mui/icons-material";
import {
  GridActionsCellItem,
  GridColDef,
  GridColTypeDef,
  GridDeleteIcon,
} from "@mui/x-data-grid-pro";
import { dateColumnType } from "./columns/date/dateColumnType";
import { dateRangeColumnType } from "./columns/dateRange/dateRangeColumnType";
import { dateTimeColumnType } from "./columns/dateTime/dateTimeColumnType";
import { dateTimeRangeColumnType } from "./columns/dateTimeRange/dateTimeRangeColumnType";
import { usernameAutocompleteColumnType } from "./columns/usernameAutocomplete/usernameAutocompleteColumnType";
import { Button } from "antd";
import RandomFlag from "./RandomFlag";

const usDollarFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const usdPrice: GridColTypeDef = {
  type: "number",
  valueFormatter: (value) => usDollarFormatter.format(Number(value)),
  minWidth: 200,
};
const percent: GridColTypeDef = {
  type: "number",
  valueGetter: (value) => {
    if (!value) {
      return value;
    }

    return value * 100;
  },
  valueFormatter: (value) => `${Number(value).toFixed(1)}%`,
  minWidth: 200,
};

export const columns: GridColDef[] = [
  {
    field: "tournamentId",
    headerName: "Tournament Id",
    type: "number",
    valueFormatter: (value) => value,
  },
  {
    field: "tournamentName",
    headerName: "Tournamend Name",
  },
  {
    field: "b2bUsername",
    headerName: "B2B Username",
    ...usernameAutocompleteColumnType,
  },
  { field: "operatorUsername", headerName: "Operator Username" },
  { field: "partnerName", headerName: "Partner Name" },
  {
    field: "status",
    headerName: "Status",
    type: "singleSelect",
    valueOptions: ["joined", "table"],
    minWidth: 200,
  },
  {
    field: "internalReferenceNo",
    headerName: "Internal Reference No",
    type: "string",
  },
  {
    field: "playerRank",
    headerName: "Player Rank",
    type: "number",
    minWidth: 200,
  },
  {
    field: "winnerPercentage",
    headerName: "Winner Percentage",
    ...percent,
    renderCell(params) {
      const value = Number(params.value).toFixed(1);
      return (
        <div
          style={{
            background: params.value >= 70 ? "#ffe7ba" : undefined,
          }}
        >
          {value}
        </div>
      );
    },
  },
  { field: "prizeValue", headerName: "Prize Value", ...usdPrice },
  {
    field: "openingTOTBalance",
    headerName: "Opening TOT Balance",
    ...usdPrice,
  },
  {
    field: "closingTOTBalance",
    headerName: "Closing TOT Balance",
    ...usdPrice,
  },
  {
    field: "registeredDate",
    headerName: "Registered Date",
    type: "date",
    ...dateColumnType,
  },
  {
    field: "dateRange",
    headerName: "Date Range",
    type: "date",
    minWidth: 400,
    ...dateRangeColumnType,
  },
  {
    field: "time",
    headerName: "Date Time",
    type: "dateTime",
    ...dateTimeColumnType,
  },
  {
    field: "timeRange",
    headerName: "Date Time Range",
    type: "dateTime",
    ...dateTimeRangeColumnType,
  },
  {
    field: "coinName",
    headerName: "Coin Name",
    type: "singleSelect",
    valueOptions: ["Cash", "Bitcoin", "USDT"],
    minWidth: 200,
  },
  {
    field: "ticketStatusStr",
    headerName: "Ticket Status Str",
    type: "boolean",
    minWidth: 200,
  },
  {
    field: "botId",
    headerName: "Bot Id",
    type: "number",
    minWidth: 200,
    valueFormatter: (value) => value,
  },
  {
    field: "button",
    headerName: "Button",
    type: "custom",
    filterable: false,
    sortable: false,
    minWidth: 80,
    renderCell() {
      return (
        <Button size="small" onClick={(e) => e.stopPropagation()}>
          Button
        </Button>
      );
    },
  },
  {
    field: "flag",
    headerName: "Flag",
    type: "custom",
    filterable: false,
    sortable: false,
    minWidth: 60,
    renderCell() {
      return <RandomFlag />;
    },
  },
  {
    field: "actions",
    type: "actions",
    getActions: () => [
      <GridActionsCellItem showInMenu icon={<Edit />} label="Edit" />,
      <GridActionsCellItem
        showInMenu
        icon={<GridDeleteIcon />}
        label="Delete"
      />,
    ],
  },
];
