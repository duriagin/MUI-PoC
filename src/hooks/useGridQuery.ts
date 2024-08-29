import {
  GridFilterModel,
  GridInitialState,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid-pro";
import {
  GetNextPageParamFunction,
  QueryFunction,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { normalizeFilterModel, normalizeSortModel } from "../utils";

export function useGridQuery(initialState: GridInitialState) {
  const [rowCount, setRowCount] = useState<number>(-1);
  const [sortModel, setSortModel] = useState<GridSortModel>(
    initialState.sorting?.sortModel ?? [],
  );

  const [filterModel, setFilterModel] = useState<GridFilterModel>(
    initialState.filter?.filterModel ?? {
      items: [],
    },
  );
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 12,
  });

  const sortQuery = useMemo(() => normalizeSortModel(sortModel), [sortModel]);
  const filterQuery = useMemo(
    () => normalizeFilterModel(filterModel),
    [filterModel],
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchTournaments = useCallback<QueryFunction<any, any, any>>(
    async ({ pageParam }) => {
      const response = await fetch(
        `http://localhost:3000/tournaments?_page=${pageParam}&_per_page=${paginationModel.pageSize}${sortQuery ?? ""}${filterQuery ?? ""}`,
      );
      const data = await response.json();
      return data;
    },
    [filterQuery, paginationModel.pageSize, sortQuery],
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getNextPageParam = useCallback<GetNextPageParamFunction<any, any>>(
    (lastPage, allPages) => {
      return !lastPage.next ? null : allPages.length + 1;
    },
    [],
  );

  const {
    data,
    isFetching,
    isFetchedAfterMount,
    fetchNextPage,
    hasNextPage,
    fetchPreviousPage,
    error,
  } = useInfiniteQuery({
    // the query will be refetched on every key change
    queryKey: ["tournaments", { sort: sortQuery, filter: filterQuery }],

    queryFn: fetchTournaments,
    initialPageParam: 1,
    getNextPageParam,
  });

  const pageData = data?.pages.at(paginationModel.page) ?? data?.pages.at(-1);
  const rows = pageData?.data ?? [];

  // change filters
  const onFilterModelChange = useCallback((model: GridFilterModel) => {
    setFilterModel(model);

    // go to the first page after ordering and filtering
    console.log("go to the first page");
    setPaginationModel((m) => ({ ...m, page: 0 }));
  }, []);

  // change order
  const onSortModelChange = useCallback((model: GridSortModel) => {
    setSortModel(model);

    // go to the first page after ordering and filtering
    console.log("go to the first page");
    setPaginationModel((m) => ({ ...m, page: 0 }));
  }, []);

  // update row count
  useEffect(() => {
    if (!isFetching) {
      console.log("!isFetching -> setRowCount");
      setRowCount(!hasNextPage ? data?.pages.at(-1).items : -1);
    }
  }, [data?.pages, hasNextPage, isFetching]);

  // change page
  const onPaginationModelChange = useCallback(
    (model: GridPaginationModel) => {
      if (paginationModel.page < model.page) fetchNextPage();
      else fetchPreviousPage();

      setPaginationModel(model);
    },
    [fetchNextPage, fetchPreviousPage, paginationModel.page],
  );

  return {
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
  };
}
