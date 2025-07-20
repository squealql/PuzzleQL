'use client'
import { redirect } from "next/navigation";
import { CodeBlockBase, SELECTBlock, Identifier } from "./blocks";
import Canvas from "./Canvas";

export default function BlockCanvas() {
  const blockslist = [];
  blockslist.push(new SELECTBlock(20, 20));
  blockslist.push(new Identifier(80, 80));

  return (
    <div className="w-fit h-fit m-2 rounded-sm flex-col flex">
      <Canvas
        shapes={blockslist}
        width={1100}
        height={700}
      />
    </div>
  );
}
