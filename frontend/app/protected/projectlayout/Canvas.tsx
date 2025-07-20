"use client";
import React, { useRef, useEffect, useState } from "react";
import { BUTTON, CodeBlockBase } from "./blocks";

interface CanvasProps {
  shapes?: CodeBlockBase[];
  width?: number;
  height?: number;
}

const magnetMap: { [key: string]: string[] } = {
  "Identifier" : ["SELECT", "SELECT DISTINCT"]
};
const replaceMap: { [key: string]: string } = {
  "Identifier" : "IdentifierBox"
};

const buttons = [
  new BUTTON(10,10,"grey","CRUD"),
  new BUTTON(50,10,"green","Identifier"),
  new BUTTON(115,10,"lightblue","Conditions"),
  new BUTTON(180,10,"red","Operators"),
  new BUTTON(240,10,"purple","Joins"),
]

const compoundItems = ["SELECT", "SELECT DISTINCT", "UPDATE", "DELETE", "DROP TABLE", "DROP COLUMN", "EQUALS", "LESS THAN", "LESS EQUAL TO", "GREATER THAN", "GREATER EQUAL TO", "AND", "OR", "LIKE", "ADD", "SUB", "MUL", "DIV", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"]

const blockUpdate = (block : any) => {
      var max_y = block.y + block.h;
      if (compoundItems.includes(block.type)){
        var currentwidth = block.x;
        for (let i = 0; i < block.content.length; i++){
          var item = block.content[i]
          if (item.type == "RawText"){
            item.y = block.y + 30           
          } 
          else{
            item.y = block.y + 10
          }
          if (item.y + item.h > max_y) max_y = item.y +item.h;
          item.x = currentwidth;
          currentwidth+=item.w;
        }
        block.w = currentwidth - block.x;
        block.h = max_y - block.y;
      }
};

function displayBlock(ctx: any, block: any) {
  switch (block.type) {
    case "RawText":
      ctx.fillStyle = "black";
      ctx.font = "24px Arial";
      ctx.fillText(block.text, block.x, block.y);
      break;

    case "IdentifierBox":
      ctx.fillStyle = block.color || "black";
      ctx.fillRect(block.x, block.y, block.w, block.h);
      break;

    case "SELECT":
      ctx.fillStyle = block.color || "black";
      ctx.fillRect(block.x, block.y, block.w, block.h);
      // Render content items
      if (block.content) {
        blockUpdate(block);
        block.content.forEach((item: any) => {
          displayBlock(ctx, item);
        });
      }
      break;
    default:
      ctx.fillStyle = block.color || "black";
      ctx.fillRect(block.x, block.y, block.w, block.h);
      break;
  }
}

export default function Canvas({ shapes = [], width = 0, height = 0 }: CanvasProps) {
  const [blocks, setBlocks] = useState(shapes);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 }); // <-- useRef instead of useState
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    for (let b = 0; b < blocks.length; b++)
    blockUpdate(blocks[b]);
  }, [])

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    // draw all the buttons
    for (let i = 0; i < buttons.length; i++){
      ctx.fillStyle = buttons[i].color;
      ctx.fillRect(buttons[i].x, buttons[i].y, buttons[i].w, buttons[i].h);
      ctx.fillStyle = "black";
      ctx.font = "12px Arial";
      ctx.fillText(buttons[i].text, buttons[i].x, buttons[i].y+12);
    }
    ctx.fillStyle = "grey";
    ctx.fillRect(350,0,5,width);
    blocks.forEach((block) => {
        displayBlock(ctx, block);
    });
    console.log(blocks)
  }, [blocks, width, height]);
  const getBlockAt = (x: number, y: number) => {
    return blocks.findIndex(
      (block) =>
        x >= block.x  &&
        x <= block.x + block.w &&
        y >= block.y &&
        y <= block.y + block.h
    );
  };
  const getButtonsAt = (x: number, y: number) => {
    return buttons.findIndex(
      (block) =>
        x >= block.x  &&
        x <= block.x + block.w &&
        y >= block.y &&
        y <= block.y + block.h
    );
  };

  const getDistance = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };

  const displayTag = (tagname : string) => {
    switch(tagname){
      case ("CRUD"):
        console.log("CRUD");
        break;
      case ("Identifier"):
        console.log("Identifier");
        break;
      case ("Conditions"):
        console.log("Conditions");
        break;
      case ("Operators"):
        console.log("Operators");
        break;
      case ("Joins"):
        console.log("Join");
        break;
      default:
        break;
    }
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // check if a button is clicked
    const button = getButtonsAt(x,y);
    if (button !== -1) {
      // A button was clicked
      console.log("Button clicked:", buttons[button]);
      console.log(buttons[button].text);
      displayTag(buttons[button].text);
    } else {
      // No button was clicked
      console.log("No button at these coordinates");
      const idx = getBlockAt(x, y);
      if (idx !== -1) {
        setDraggedIndex(idx);
        dragOffset.current = { x: x - blocks[idx].x, y: y - blocks[idx].y }; // <-- update ref directly
      }
    }
    
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedIndex === null) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setBlocks((prev) =>
      prev.map((block, i) =>
        i === draggedIndex
          ? { ...block, x: x - dragOffset.current.x, y: y - dragOffset.current.y }
          : block
      )
    );
  };


  function updateMagnets(){
    for (let b = 0; b < blocks.length; b++) {
      const block: any = blocks[b];
      const magnetoptions = magnetMap[block.type];
      if (magnetoptions && magnetoptions.length > 0) {
        for (let ob = 0; ob < blocks.length; ob++) {
          const otherBlock: any = blocks[ob];
          if (magnetoptions.includes(otherBlock.type)) {
            console.log("HOOOOOOOOOOO");
            if (otherBlock.content) {
              for (let i = 0; i < otherBlock.content.length; i++) {
                const item = otherBlock.content[i];
                if (item.type == replaceMap[block.type]) {
                    var eucdist = getDistance(item.x , item.y , block.x, block.y);
                    if (-50 < eucdist && eucdist < 50){
                        console.log("EYYYYYYY");
                        block.x = otherBlock.x + block.w/2+10;
                        block.y = otherBlock.y - block.h/2;
                        otherBlock.content[i] = block;
                        // Remove the block from the blocks list
                        setBlocks(prev => prev.filter((_, idx) => idx !== b));
                        // Break all loops early
                        return;
                    }
                }
              }
            }
          }
        }
      }
    }

  }


  const handleMouseUp = () => {
    setDraggedIndex(null);
    // check if there is a identifier block that can be merged
    updateMagnets();
    // update the widths and height of things
    for (let b = 0; b < blocks.length; b++) {
      const block: any = blocks[b];
      blockUpdate(block);
    }
    

    
    };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ border: "1px solid #333", background: "#eee" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
}
