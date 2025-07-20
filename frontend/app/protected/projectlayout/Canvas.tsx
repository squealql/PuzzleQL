"use client";
import React, { useRef, useEffect, useState } from "react";
import * as Blocks from "./blocks";

interface CanvasProps {
  shapes?: Blocks.CodeBlockBase[];
  width?: number;
  height?: number;
}

var currentButton = "CRUD";
const buttonMap : {[key : string] : any[]} = {
  "CRUD"  : [new Blocks.SELECT(5,50), new Blocks.SELECT_DISTINCT(5,110), new Blocks.UPDATE(5,170), new Blocks.DELETE(5,230), new Blocks.DROP_TABLE(5,290), new Blocks.DROP_COLUMN(5,350)],
  "Identifier"  : [new Blocks.WILDCARD(5,50), new Blocks.IdentifierInput(5,110), new Blocks.Table(5,170), new Blocks.ColumnReference(5,250)]
}

// where these blocks would appear int
const magnetMap: { [key: string]: string[] } = {
  "IdentifierInput" : ["SELECT", "SELECT DISTINCT"],
  "WILDCARD" : ["SELECT", "SELECT DISTINCT"],
  "ColumnReference" : ["UPDATE", "DROP COLUMN", "LIKE"],
  "Table" : ["SELECT", "SELECT DISTINCT", "UPDATE", "DELETE", "DROP TABLE"],
};

// which boxes these things can replac
const replaceMap: { [key: string]: string } = {
  "IdentifierInput" : "IdentifierBox",
  "WILDCARD" : "IdentifierBox",
  "Table" : "TableBox",
  "ColumnReference" : "ColumnReferenceBox",
};


const buttons = [
  new Blocks.BUTTON(10,10,"grey","CRUD"),
  new Blocks.BUTTON(50,10,"green","Identifier"),
  new Blocks.BUTTON(115,10,"lightblue","Conditions"),
  new Blocks.BUTTON(180,10,"red","Operators"),
  new Blocks.BUTTON(240,10,"purple","Joins"),
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
  if (block.type == "RawText") {
    ctx.fillStyle = block.color || "black";
    ctx.fillRect(block.x, block.y, block.w, block.h);
    ctx.fillStyle = "black";
    ctx.font = "18px Arial";
    ctx.fillText(block.text, block.x, block.y);
  }else if (block.type == "IdentifierBox") {
    ctx.fillStyle = block.color || "black";
    ctx.fillRect(block.x, block.y, block.w, block.h);
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText(block.text, block.x+2, block.y+15);
  }else if (block.type == "ColumnReferenceBox") {
    ctx.fillStyle = block.color || "black";
    ctx.fillRect(block.x, block.y, block.w, block.h);
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText(block.text, block.x+2, block.y+15);
  }else if (block.type == "ExpresionBox") {
    ctx.fillStyle = block.color || "black";
    ctx.fillRect(block.x, block.y, block.w, block.h);
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText(block.text, block.x+2, block.y+15);
  }else if (block.type == "TableBox") {
    ctx.fillStyle = block.color || "black";
    ctx.fillRect(block.x, block.y, block.w, block.h);
    ctx.fillStyle = "black";
    ctx.font = "18px Arial";
    ctx.fillText(block.text, block.x+2, block.y+15);
  }else if (block.type == "ConditionBox") {
    ctx.fillStyle = block.color || "black";
    ctx.fillRect(block.x, block.y, block.w, block.h);
    ctx.fillStyle = "black";
    ctx.font = "18px Arial";
    ctx.fillText(block.text, block.x+2, block.y+15);
  }else if (block.type == "WILDCARD") {
    ctx.fillStyle = block.color || "black";
    ctx.fillRect(block.x, block.y, block.w, block.h);
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText(block.text, block.x+10, block.y + 20);
  }else if (block.type == "Table") {
    ctx.fillStyle = block.color || "black";
    ctx.fillRect(block.x, block.y, block.w, block.h);
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    if(block.input != ""){
      ctx.fillText(block.input, block.x+5, block.y + 18);
    }else{
      ctx.fillText(block.text, block.x+5, block.y + 18);
    }
  }else if (block.type == "IdentifierInput") {
    ctx.fillStyle = block.color || "black";
    ctx.fillRect(block.x, block.y, block.w, block.h);
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    if(block.input != ""){
      ctx.fillText(block.input, block.x+5, block.y + 18);
    }else{
      ctx.fillText(block.text, block.x+5, block.y + 18);
    }
  }else if (block.type == "ColumnReference") {
    ctx.fillStyle = block.color || "black";
    ctx.fillRect(block.x, block.y, block.w, block.h);
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    if(block.input != ""){
      ctx.fillText(block.input, block.x+5, block.y + 18);
    }else{
      ctx.fillText(block.text, block.x+5, block.y + 18);
    }
  }else if (compoundItems.includes(block.type)) {
    ctx.fillStyle = block.color || "black";
    ctx.fillRect(block.x, block.y, block.w, block.h);
    // Render content items
    if (block.content) {
      blockUpdate(block);
      block.content.forEach((item: any) => {
        displayBlock(ctx, item);
      });
    }
  } else {
    ctx.fillStyle = block.color || "black";
    ctx.fillRect(block.x, block.y, block.w, block.h);
  }
}

// Deep clone utility for blocks
function deepCloneBlock(block: any): any {
  // If blocks have methods, consider implementing a .clone() method per class
  // For now, this works for plain objects and arrays
  return JSON.parse(JSON.stringify(block));
}

export default function Canvas({ shapes = [], width = 0, height = 0 }: CanvasProps) {
  const [blocks, setBlocks] = useState(shapes);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 }); // <-- useRef instead of useState
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Create a delete box that's always present
  const deleteBox = new Blocks.DeleteBox(width - 120, height - 80);

  useEffect(() => {
    for (let b = 0; b < blocks.length; b++)
    blockUpdate(blocks[b]);
    // grab a context
    displayTag();
  }, [])

  const updateAll = () =>{
    console.log("IT GOES OFF");
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
    // draw the options
    displayTag();
    // draw a giant line
    ctx.fillStyle = "grey";
    ctx.fillRect(650,0,5,width);
    
    // Draw the delete box
    ctx.fillStyle = deleteBox.color;
    ctx.fillRect(deleteBox.x, deleteBox.y, deleteBox.w, deleteBox.h);
    
    // Add a border to make it more visible
    ctx.strokeStyle = "#cc0000";
    ctx.lineWidth = 2;
    ctx.strokeRect(deleteBox.x, deleteBox.y, deleteBox.w, deleteBox.h);
    
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText("DELETE", deleteBox.x + 25, deleteBox.y + 35);
    
    blocks.forEach((block) => {
        displayBlock(ctx, block);
    });
    console.log(blocks)

  };

  useEffect(() => {
    // Update delete box position when canvas dimensions change
    deleteBox.x = width - 620;
    deleteBox.y = height - 80;
    updateAll();
  }, [blocks, width, height, currentButton]);

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

  const isBlockInDeleteBox = (block: any): boolean => {
    const blockCenterX = block.x + block.w / 2;
    const blockCenterY = block.y + block.h / 2;
    
    return blockCenterX >= deleteBox.x && 
           blockCenterX <= deleteBox.x + deleteBox.w &&
           blockCenterY >= deleteBox.y && 
           blockCenterY <= deleteBox.y + deleteBox.h;
  };

  const displayTag = () => {
    const ctx = canvasRef.current?.getContext("2d");
    console.log(currentButton);
    var items = buttonMap[currentButton];
    for (let i = 0; i < items.length; i++){
        displayBlock(ctx ,items[i]);
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
      currentButton = buttons[button].text;
      updateAll();
    } else {
      // No button was clicked

      // check if a toolbox item was clicked
      var toolbox = buttonMap[currentButton];
      for (let i = 0; i < toolbox.length; i++){
        const toolboxItem = toolbox[i];
        if (x >= toolboxItem.x && x <= toolboxItem.x + toolboxItem.w &&
            y >= toolboxItem.y && y <= toolboxItem.y + toolboxItem.h) {
          // Clone the toolbox item and add it to blocks
          const clonedItem = deepCloneBlock(toolboxItem);
          clonedItem.x = x - clonedItem.w / 2; // Center the clone on mouse position
          clonedItem.y = y - clonedItem.h / 2;
          setBlocks(prev => {
            const newBlocks = [...prev, clonedItem];
            setDraggedIndex(newBlocks.length - 1); // Set to drag the newly added block
            return newBlocks;
          });
          dragOffset.current = { x: clonedItem.w / 2, y: clonedItem.h / 2 };
          return; // Exit early since we found a toolbox item
        }
      }

      // check if a code item was clicked
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
    
    const newX = x - dragOffset.current.x;
    const newY = y - dragOffset.current.y;
    
    setBlocks((prev) =>
      prev.map((block, i) =>
        i === draggedIndex
          ? { ...block, x: newX, y: newY }
          : block
      )
    );
    
    // Update delete box appearance when dragging over it
    const draggedBlock = blocks[draggedIndex];
    if (draggedBlock) {
      const tempBlock = { ...draggedBlock, x: newX, y: newY };
      if (isBlockInDeleteBox(tempBlock)) {
        deleteBox.color = "#ff0000"; // Brighter red when hovering
      } else {
        deleteBox.color = "#ff4444"; // Normal red
      }
    }
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
    // Check if the dragged block is in the delete box
    if (draggedIndex !== null) {
      const draggedBlock = blocks[draggedIndex];
      if (isBlockInDeleteBox(draggedBlock)) {
        // Remove the block from the blocks list
        setBlocks(prev => prev.filter((_, idx) => idx !== draggedIndex));
        setDraggedIndex(null);
        return;
      }
    }
    
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
