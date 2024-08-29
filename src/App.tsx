import { createTheme, styled, ThemeProvider } from "@mui/material";
import { DataGridPro, useGridApiRef } from "@mui/x-data-grid-pro";
import { theme as antTheme, Drawer, Layout } from "antd";
import { capitalCase } from "change-case";
import { columns } from "./columns";
import { useAutosize } from "./hooks/useAutosize";
import { useDrawer } from "./hooks/useDrawer";
import { useErrorMessage } from "./hooks/useErrorMessage";
import { useGridQuery } from "./hooks/useGridQuery";
import { useGridState } from "./hooks/useGridState";
import "./styles.css";
import CustomToolbar from "./toolbar/CustomToolbar";

const { Content } = Layout;

// styles

const StyledDataGrid = styled(DataGridPro)(() => ({
  fontSize: 14,
  fontFamily: [
    '"IBM Plex Sans"',
    "-apple-system",
    '"Segoe UI"',
    "BlinkMacSystemFont",
    "Roboto",
    '"Helvetica Neue"',
    "sans-serif",
  ].join(","),
  color: "rgb(24, 29, 31)",

  "& .MuiInputLabel-formControl": {
    fontSize: 14,
  },
}));

const theme = createTheme({
  palette: {
    primary: {
      main: "#1677ff",
    },
  },
  typography: {
    // table uses rem. this will make font size 14
    htmlFontSize: 18,
  },
});

export default function App() {
  // -- Table
  const apiRef = useGridApiRef();

  // -- Grid state
  const { initialState } = useGridState(apiRef);

  // -- Query
  const {
    onPaginationModelChange,
    onSortModelChange,
    onFilterModelChange,
    isFetchedAfterMount,
    error,
    rows,
    rowCount,
    isFetching,
    sortModel,
    paginationModel,
  } = useGridQuery(initialState);

  // -- Visual
  const { contextHolder } = useErrorMessage(error);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = antTheme.useToken();

  useAutosize({ apiRef, isFetchedAfterMount });

  const { details, onCellClick, drawerStyles, onDrawerClose } =
    useDrawer(apiRef);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {contextHolder}

      <Content
        style={{
          padding: 24,
          margin: 0,
          marginRight: details ? 378 : 0,
          transition: "all 0.3s",
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          position: "relative",
        }}
      >
        <ThemeProvider theme={theme}>
          <Drawer
            onClose={onDrawerClose}
            title="Details"
            placement="right"
            open={Boolean(details)}
            styles={drawerStyles}
            autoFocus={false}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {Object.keys(details ?? {}).map((key) => (
                <div style={{ marginBottom: 10 }} key={key}>
                  <div style={{ fontWeight: 600 }}>{capitalCase(key)}</div>
                  {
                    // @ts-expect-error any
                    details?.[key]
                  }
                </div>
              ))}
            </div>
          </Drawer>
          <StyledDataGrid
            slots={{
              toolbar: CustomToolbar,
            }}
            apiRef={apiRef}
            columns={columns}
            rows={error ? [] : rows}
            headerFilters
            loading={isFetching}
            // autosizeColumns will not work properly for columns outside of viewport
            disableVirtualization
            initialState={{
              pagination: { rowCount: -1 },
              pinnedColumns: {
                // left: ["tournamentId"],
                right: ["actions"],
              },

              ...initialState,
            }}
            // pagination
            rowCount={rowCount}
            pagination
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationModelChange}
            // pageSizeOptions={[paginationModel.pageSize]}
            autoPageSize
            // order
            sortingMode="server"
            sortModel={sortModel}
            onSortModelChange={onSortModelChange}
            // filters
            filterMode="server"
            onFilterModelChange={onFilterModelChange}
            filterDebounceMs={300}
            // styles
            rowHeight={47}
            columnHeaderHeight={47}
            // standard way to show details
            // getDetailPanelContent={({ row }) => (
            //   <div
            //     style={{
            //       display: "flex",
            //       flexDirection: "column",
            //       padding: 20,
            //     }}
            //   >
            //     {Object.keys(row).map((key) => (
            //       <div style={{ marginBottom: 5 }}>
            //         <span style={{ fontWeight: 500 }}>{capitalCase(key)}</span>:{" "}
            //         {row[key]}
            //       </div>
            //     ))}
            //   </div>
            // )}
            // getDetailPanelHeight={() => "auto"}
            onCellClick={onCellClick}
          />
        </ThemeProvider>
      </Content>
    </Layout>
  );
}
