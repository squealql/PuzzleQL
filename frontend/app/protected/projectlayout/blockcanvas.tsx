'use client'
import { redirect } from "next/navigation";
import { CodeBlockBase, SELECT, IdentifierInput } from "./blocks";
import Canvas from "./Canvas";
import React, { useRef } from "react";

export default function BlockCanvas() {
  const blockslist: any[] = [];
  const blocksRef = useRef<any[]>(blockslist);
  const toSQLRef = useRef<((block: any) => string) | null>(null);
  //blockslist.push(new SELECT(20, 20));
  //blockslist.push(new IdentifierInput(80, 80));

  return (
    <div className="w-fit h-fit m-2 rounded-sm flex-col flex">
      <Canvas
        shapes={blockslist}
        width={1400}
        height={700}
        blocksRef={blocksRef}
        toSQLRef={toSQLRef}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded m-2"
        onClick={() => {
          if (blocksRef.current && blocksRef.current.length > 0 && toSQLRef.current) {
            console.log(toSQLRef.current(blocksRef.current[0]));
          } else {
            console.log("No blocks or toSQL function not available");
          }
        }}
      >
        Log SQL for First Block
      </button>
      <div className="flex flex-row">
        <div className="bg-purple-500 w-[50%] h-[50%] m-2 rounded-sm">
          Hello
        </div>
        <div className="bg-purple-500 w-[50%] h-[50%] m-2 rounded-sm">
          Hello
        </div>
      </div>
    </div>
  );
}
