"use client";

import React, { useState } from "react";
import { Chrome } from "@uiw/react-color";

export default function ColorPicker() {
  const [hex, setHex] = useState("#fff");

  return (
    <div style={{ padding: 20 }}>
      <Chrome
        color={hex}
        onChange={(color) => {
          setHex(color.hex);
        }}
      />
      <div style={{ marginTop: 10 }}>
        Selected Color: <strong>{hex}</strong>
      </div>
    </div>
  );
}
