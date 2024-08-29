import { GridApiPro, GridInitialState } from "@mui/x-data-grid-pro";
import { useCallback, useLayoutEffect, useState } from "react";

export function useGridState(apiRef: React.MutableRefObject<GridApiPro>) {
  const [initialState] = useState<GridInitialState>(() => {
    const stateFromLocalStorage = localStorage?.getItem("dataGridState");
    return stateFromLocalStorage ? JSON.parse(stateFromLocalStorage) : {};
  });

  const saveSnapshot = useCallback(() => {
    if (apiRef?.current?.exportState && localStorage) {
      const currentState = apiRef.current.exportState();
      localStorage.setItem("dataGridState", JSON.stringify(currentState));
    }
  }, [apiRef]);

  useLayoutEffect(() => {
    window.addEventListener("beforeunload", saveSnapshot);

    return () => {
      window.removeEventListener("beforeunload", saveSnapshot);
      saveSnapshot();
    };
  }, [saveSnapshot]);

  return { initialState };
}
