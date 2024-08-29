import { GridFilterInputValueProps } from "@mui/x-data-grid-pro";
import { DatePicker } from "antd";
import dayjs from "dayjs";

export default function GridFilterDateTimeInput(
  props: GridFilterInputValueProps,
) {
  // @ts-expect-error label
  const { item, applyValue, label } = props;

  const handleFilterChange = (newValue: unknown) => {
    applyValue({ ...item, value: newValue });
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        height: 46,
      }}
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

      <DatePicker
        showTime
        value={item.value ? dayjs(item.value) : null}
        height={29.5}
        variant="borderless"
        format={"DD/MM/YYYY HH:mm:ss"}
        placeholder={""}
        style={{
          height: 29.5,
          paddingInline: 0,
          borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
          borderRadius: 0,
          alignSelf: "end",
        }}
        onChange={handleFilterChange}
      />
    </div>
  );
}
