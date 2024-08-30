import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  ToolbarProps,
  Tooltip,
} from "@mui/material";
import { GridToolbar, useGridApiContext } from "@mui/x-data-grid-pro";
import { DEFAULT_PRESET, PRESET_ONE } from "./constants";
import { useCallback, useEffect, useState } from "react";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

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

  const changePreset = useCallback(
    (preset: Preset) => {
      setPreset(preset);

      switch (preset) {
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
    },
    [apiRef],
  );

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
          onChange={(e) => changePreset(e.target.value as unknown as Preset)}
        >
          <MenuItem value={Preset.Default}>Default</MenuItem>
          <MenuItem value={Preset.One}>Custom</MenuItem>
        </MuiSelect>
      </FormControl>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingTop: 4,
          marginRight: 4,
        }}
      >
        <Tooltip title="Reset grid">
          <Button
            size="small"
            startIcon={<RestartAltIcon />}
            onClick={() => changePreset(Preset.Default)}
          >
            Reset
          </Button>
        </Tooltip>
      </div>

      <GridToolbar {...props}></GridToolbar>
    </div>
  );
}
