"use client";

import { InteractiveMapEditor } from "@/components/admin/InteractiveMapEditor";
import { useState } from "react";

const sampleLayout = [
  {
    "row": "A",
    "slots": [
      {
        "ids": ["A1", "A2"],
        "gap": false
      },
      {
        "ids": [],
        "gap": true
      },
      {
        "ids": ["A3", "A4", "A5"],
        "gap": false
      }
    ]
  },
  {
    "row": "B",
    "slots": [
      {
        "ids": ["B1", "B2", "B3"],
        "gap": false
      },
      {
        "ids": [],
        "gap": true
      },
      {
        "ids": ["B4", "B5", "B6"],
        "gap": false
      }
    ]
  }
];

export default function TestInteractiveEditor() {
  const [layout, setLayout] = useState(sampleLayout);

  const handleLayoutChange = (newLayout: any[]) => {
    console.log("Layout changed:", newLayout);
    setLayout(newLayout);
  };

  const handleSave = (layout: any[]) => {
    console.log("Saving layout:", layout);
    alert("Layout guardado exitosamente!");
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Editor de Mapa Interactivo - Demo</h1>
      <InteractiveMapEditor
        initialLayout={layout}
        onLayoutChange={handleLayoutChange}
        onSave={handleSave}
      />
    </div>
  );
}