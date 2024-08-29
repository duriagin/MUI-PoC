import {
  GridLogicOperator,
  GridSortModel,
  GridFilterModel,
} from "@mui/x-data-grid-pro";

export function normalizeSortModel(model: GridSortModel): string | undefined {
  const fields = model
    .map((m) => (m.sort == "asc" ? m.field : `-${m.field}`))
    .join(",");

  if (fields) return `&_sort=${fields}`;

  return undefined;
}

export function normalizeFilterModel(
  model: GridFilterModel,
): string | undefined {
  const queryParts: string[] = [];
  const operatorMap: { [key: string]: string } = {
    "=": "",
    "<": "lt",
    "<=": "lte",
    ">": "gt",
    ">=": "gte",
    "!=": "ne",
  };

  // convert individual filter items to query parts
  model.items.forEach((item) => {
    if (item.field && item.value !== undefined && item.operator) {
      const operator =
        typeof operatorMap[item.operator] == "undefined"
          ? item.operator
          : operatorMap[item.operator];

      queryParts.push(
        `${item.field}${operator ? `_${operator}` : operator}=${encodeURIComponent(item.value)}`,
      );
    }
  });

  // join the query parts with the logic operator
  let queryString = queryParts.join(
    model.logicOperator === GridLogicOperator.And ? "&" : "&",
  );

  // handle quick filter values
  if (model.quickFilterValues && model.quickFilterValues.length > 0) {
    const quickFilterQueryParts = model.quickFilterValues.map(
      (value: string | number | boolean) => {
        return `q=${encodeURIComponent(value)}`;
      },
    );

    const quickFilterQuery = quickFilterQueryParts.join(
      model.quickFilterLogicOperator === GridLogicOperator.Or ? "&" : ",",
    );

    queryString = queryString
      ? `${queryString}&${quickFilterQuery}`
      : quickFilterQuery;
  }

  return queryString ? `&${queryString}` : undefined;
}
