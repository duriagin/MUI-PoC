import { debounce } from "@mui/material";
import { GridFilterInputValueProps } from "@mui/x-data-grid-pro";
import { Select, SelectProps, Spin } from "antd";
import { useCallback, useMemo, useRef, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

function DebounceSelect<
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = any,
>({
  fetchOptions,
  debounceTimeout = 300,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      filterOption={false}
      showSearch
      allowClear
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
      variant="borderless"
      style={{
        width: "160px",
        paddingInline: 0,
        borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
        borderRadius: 0,
        alignSelf: "end",
      }}
    />
  );
}

// Usage of DebounceSelect
interface UserValue {
  label: string;
  value: string;
}

async function fetchUserList(username: string): Promise<UserValue[]> {
  console.log("fetching user", username);

  return fetch("https://randomuser.me/api/?results=5")
    .then((response) => response.json())
    .then((body) =>
      body.results.map(
        (user: {
          name: { first: string; last: string };
          login: { username: string };
        }) => ({
          label: user.login.username,
          value: user.login.username,
        }),
      ),
    );
}

export default function GridFilterUsernameAutocompleteInput(
  props: GridFilterInputValueProps,
) {
  // @ts-expect-error label
  const { item, applyValue, label } = props;

  const handleFilterChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (newValue: any) => {
      applyValue({ ...item, value: newValue });
    },
    [applyValue, item],
  );

  const handleFilterClear = useCallback(() => {
    applyValue({ ...item, value: null });
  }, [applyValue, item]);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        minHeight: 46,
        width: "100%",
      }}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div
        style={{
          fontSize: "11px",
          fontFamily: `"Roboto","Helvetica","Arial",sans-serif`,
          top: 0,
          color: "rgba(0, 0, 0, 0.6)",
          lineHeight: "11px",
          position: "absolute",
        }}
      >
        {label}
      </div>
      <DebounceSelect
        value={item.value}
        fetchOptions={fetchUserList}
        onSelect={handleFilterChange}
        onClear={handleFilterClear}
      />
    </div>
  );
}
