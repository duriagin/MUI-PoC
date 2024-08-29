import { GridApiPro } from "@mui/x-data-grid-pro";
import { useEffect, useState } from "react";

export function useAutosize({
  isFetchedAfterMount,
  apiRef,
}: {
  isFetchedAfterMount: boolean;
  apiRef: React.MutableRefObject<GridApiPro>;
}) {
  const [isAutosized, setAutosized] = useState(false);

  useEffect(() => {
    // autosize columns only once
    if (isFetchedAfterMount && !isAutosized) {
      return apiRef.current.subscribeEvent("renderedRowsIntervalChange", () => {
        console.log("autosizeColumns");

        apiRef.current.autosizeColumns({
          includeHeaders: true,
          includeOutliers: true,
        });

        setAutosized(true);
      });
    }
  }, [apiRef, isAutosized, isFetchedAfterMount]);
}
