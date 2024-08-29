import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  ToolbarProps,
} from "@mui/material";
import { GridToolbar, useGridApiContext } from "@mui/x-data-grid-pro";
import { DEFAULT_PRESET, PRESET_ONE } from "./constants";
import { useEffect, useState } from "react";

enum Preset {
  Default,
  One,
  Two,
}

export default function CustomToolbar(props: ToolbarProps) {
  const apiRef = useGridApiContext();
  const [currentPreset, setPreset] = useState<Preset>(() => {
    const preset = localStorage.getItem("GridPreset");
    return preset ? Number(preset) : Preset.Default;
  });

  useEffect(() => {
    localStorage.setItem("GridPreset", String(currentPreset));
  }, [currentPreset]);

  return (
    <div style={{ display: "flex" }}>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="preset-label">Preset</InputLabel>
        <MuiSelect
          labelId="preset-label"
          label="Preset"
          value={currentPreset}
          onChange={(e) => {
            setPreset(e.target.value as unknown as Preset);

            switch (e.target.value as unknown as Preset) {
              case Preset.Default:
                apiRef.current.restoreState(DEFAULT_PRESET);
                break;
              case Preset.One:
                apiRef.current.restoreState(PRESET_ONE);
                break;
            }

            // MUI Bug. Grid is not scrollable until I execute autoresize
            apiRef.current.autosizeColumns({
              includeHeaders: true,
              includeOutliers: true,
            });
          }}
        >
          <MenuItem value={Preset.Default}>Default</MenuItem>
          <MenuItem value={Preset.One}>Custom</MenuItem>
        </MuiSelect>
      </FormControl>

      <GridToolbar {...props}></GridToolbar>
    </div>
  );
}
