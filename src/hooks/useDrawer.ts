import {
  GridApiPro,
  GridEventListener,
  GridRowParams,
} from "@mui/x-data-grid-pro";
import { DrawerStyles } from "antd/es/drawer/DrawerPanel";
import { useCallback, useState } from "react";

const drawerStyles: DrawerStyles = {
  mask: {
    display: "none",
  },
};

export function useDrawer(apiRef: React.MutableRefObject<GridApiPro>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [details, setDetails] = useState<GridRowParams<any>>();
  const onCellClick = useCallback<GridEventListener<"cellClick">>(
    (params, event) => {
      if (params.field == "actions") return;

      setDetails(
        Object.keys(params.row).reduce((accum, key) => {
          const colDef = apiRef.current.getColumn(key);
          if (!colDef) return accum;

          return {
            ...accum,
            [key]: apiRef.current.getRowFormattedValue(params.row, colDef),
          };
        }, {} as GridRowParams<never>),
      );

      // animation (0.3s) should go first
      setTimeout(
        () => {
          const colIndex =
            // @ts-expect-error ariaColIndex
            event.target.ariaColIndex ?? event.target.parentNode.ariaColIndex;
          apiRef.current.scrollToIndexes({
            colIndex,
          });
        },
        details ? 0 : 300,
      );
    },
    [apiRef, details],
  );
  const onDrawerClose = useCallback(() => {
    setDetails(undefined);
  }, []);

  return { onCellClick, drawerStyles, onDrawerClose, details };
}
