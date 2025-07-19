"use client"
import { BlocklyWorkspace } from "react-blockly";
import { useState } from "react";

export default function BlockCanvas() {
  const [xml, setXml] = useState();

  const toolboxCategories = {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Logic",
        colour: "#5C81A6",
        contents: [
          {
            kind: "block",
            type: "controls_if",
          },
          {
            kind: "block",
            type: "logic_compare",
          },
        ],
      },
      {
        kind: "category",
        name: "Math",
        colour: "#5CA65C",
        contents: [
          {
            kind: "block",
            type: "math_round",
          },
          {
            kind: "block",
            type: "math_number",
          },
        ],
      },
      {
        kind: "category",
        name: "Custom",
        colour: "#5CA699",
        contents: [
          {
            kind: "block",
            type: "new_boundary_function",
          },
          {
            kind: "block",
            type: "return",
          },
        ],
      },
    ],
  };

  return (
      <div className="bg-green-500 w-[50%] h-full m-2 rounded-sm">
      <BlocklyWorkspace
            className="width-100" // you can use whatever classes are appropriate for your app's CSS
            toolboxConfiguration={toolboxCategories} // this must be a JSON toolbox definition
            initialXml={xml}
            onXmlChange={setXml}
          />

      </div>
  );
}