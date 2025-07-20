"use client";
import React, { useRef, useEffect, useState } from "react";
import * as Blocks from "./blocks";

// Add this at the top of the file, after imports
// @ts-ignore
declare global {
  interface Window {
    allblocks?: any;
    toSQL?: (block: any) => string;
  }
}

interface CanvasProps {
  shapes?: Blocks.CodeBlockBase[];
  width?: number;
  height?: number;
  blocksRef?: React.RefObject<any[]>;
  toSQLRef?: React.RefObject<((block: any) => string) | null>;
}

const toSQL = (block : any) => {
  let returnstring = ""
  if (block.content){
    for (let i = 0; i < block.content.length; i++){
      if (block.content[i].input){
        returnstring += block.content[i].inpu;
      }
      else{
        if (compoundItems.includes(block.content[i].type)){
          returnstring += toSQL(block.content[i]);
        }else{
          returnstring += block.content[i].text;
        }
      }
      returnstring += " ";
    }
  }
  return returnstring;
};


var currentButton = "CRUD";
const buttonMap : {[key : string] : any[]} = {
  "CRUD"  : [new Blocks.SELECT(5,50), new Blocks.SELECT_DISTINCT(5,110), new Blocks.UPDATE(5,170), new Blocks.DELETE(5,230), new Blocks.DROP_TABLE(5,290), new Blocks.DROP_COLUMN(5,350)],
  "Identifier"  : [new Blocks.WILDCARD(5,50), new Blocks.IdentifierInput(5,110), new Blocks.Table(5,170), new Blocks.ColumnReference(5,250)],
  "Conditions"  : [new Blocks.Equals(5,50), new Blocks.LessThan(5,110), new Blocks.LessEqualTo(5, 170), new Blocks.GreaterThan(5,230), new Blocks.GreaterEqualTo(5,290), new Blocks.AND(5,350), new Blocks.OR(5,410), new Blocks.LIKE(5,470)],
  "Operators"  : [
    new Blocks.AddIdentifierExpr(5,50),
    new Blocks.SubIdentifierExpr(5,110),
    new Blocks.MultIdentifierExpr(5,170),
    new Blocks.DivideIdentifierExpr(5,230)
  ],
  "Joins"  : [
    new Blocks.Inner_Join(5,50),
    new Blocks.Left_Join(5,110),
    new Blocks.Right_Join(5,170),
    new Blocks.Full_Outer_Join(5,230)
  ]
}

// where these blocks would appear int
const magnetMap: { [key: string]: string[] } = {
  "SELECT" : ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
  "IdentifierInput" : ["SELECT", "SELECT DISTINCT", "EQUALS", "ADD IDENTIFIER EXPR"],
  "WILDCARD" : ["SELECT", "SELECT DISTINCT", "EQUALS", "ADD IDENTIFIER EXPR"],
  "ColumnReference" : ["UPDATE", "DROP COLUMN", "LIKE", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
  "Table" : ["SELECT", "SELECT DISTINCT", "UPDATE", "DELETE", "DROP TABLE", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
  "EQUALS" : ["SELECT", "SELECT DISTINCT", "UPDATE", "AND"],
  "LESS THAN": ["SELECT", "SELECT DISTINCT", "UPDATE", "AND"],
  "LESS EQUAL TO": ["SELECT", "SELECT DISTINCT", "UPDATE", "AND"],
  "GREATER THAN": ["SELECT", "SELECT DISTINCT", "UPDATE", "AND", "OR", "LIKE"],
  "GREATER EQUAL TO": ["SELECT", "SELECT DISTINCT", "UPDATE", "AND", "OR", "LIKE"],
  "AND": ["SELECT", "SELECT DISTINCT", "UPDATE", "AND", "OR", "LIKE"],
  "OR": ["SELECT", "SELECT DISTINCT", "UPDATE", "AND", "OR", "LIKE"],
  "LIKE": ["SELECT", "SELECT DISTINCT", "UPDATE", "AND", "OR"],
  "ADD IDENTIFIER EXPR" : ["UPDATE", "LESS THAN", "LESS EQUAL TO", "GREATER THAN", "GREATER EQUAL TO", "LIKE"],
  "SUB IDENTIFIER EXPR" : ["UPDATE", "LESS THAN", "LESS EQUAL TO", "GREATER THAN", "GREATER EQUAL TO", "LIKE"],
  "MULT IDENTIFIER EXPR" : ["UPDATE", "LESS THAN", "LESS EQUAL TO", "GREATER THAN", "GREATER EQUAL TO", "LIKE"],
  "DIVIDE IDENTIFIER EXPR" : ["UPDATE", "LESS THAN", "LESS EQUAL TO", "GREATER THAN", "GREATER EQUAL TO", "LIKE"]
};


// which boxes these things can replac
const replaceMap: { [key: string]: string } = {
  "IdentifierInput" : "IdentifierBox",
  "WILDCARD" : "IdentifierBox",
  "Table" : "TableBox",
  "ColumnReference" : "ColumnReferenceBox",
  "EQUALS" : "ConditionBox",
  "LESS THAN": "ConditionBox",
  "LESS EQUAL TO": "ConditionBox",
  "GREATER THAN": "ConditionBox",
  "GREATER EQUAL TO": "ConditionBox",
  "AND": "ConditionBox",
  "OR": "ConditionBox",
  "LIKE": "ConditionBox",
  "ADD IDENTIFIER EXPR" : "ExpressionBox",
  "SUB IDENTIFIER EXPR" : "ExpressionBox",
  "MULT IDENTIFIER EXPR" : "ExpressionBox",
  "DIVIDE IDENTIFIER EXPR" : "ExpressionBox",
  "SELECT" : "SELECTBox",
  "SELECT DISTINCT" : "SELECTBox",
};


const buttonSpacing = 10;
const buttonWidth = 120; // match new BUTTON width
const buttonHeight = 50; // match new BUTTON height
const buttons = [
  new Blocks.BUTTON(5, 5, "grey", "CRUD"),
  new Blocks.BUTTON(105, 5, "green", "Identifier"),
  new Blocks.BUTTON(245, 5, "lightblue", "Conditions"),
  new Blocks.BUTTON(395, 5, "red", "Operators"),
  new Blocks.BUTTON(535, 5, "purple", "Joins"),
];

const compoundItems = [
  "SELECT", "SELECT DISTINCT", "UPDATE", "DELETE", "DROP TABLE", "DROP COLUMN",
  "EQUALS", "LESS THAN", "LESS EQUAL TO", "GREATER THAN", "GREATER EQUAL TO",
  "AND", "OR", "LIKE", "ADD IDENTIFIER EXPR","ADD", "SUB", "MUL", "DIV",
  "SUB IDENTIFIER EXPR", "MULT IDENTIFIER EXPR", "DIVIDE IDENTIFIER EXPR",
  "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"
];

const blockUpdate = (block : any) => {
      var max_y = block.y + block.h;
      if (compoundItems.includes(block.type)){
        var currentwidth = block.x;
        for (let i = 0; i < block.content.length; i++){
          var item = block.content[i]
          item.y = block.y;
          if (item.type == "RawText"){
            item.y = block.y + 10           
          } 
          else{
            if (!compoundItems.includes(item.type)){
              item.y = block.y + 10
            }
          }
          if (item.y + item.h > max_y) max_y = item.y +item.h;
          item.x = currentwidth;
          currentwidth+=item.w;
        }
        block.w = currentwidth - block.x;
        block.h = max_y - block.y;
      }
};

function drawRoundedRect(ctx: any, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function displayBlock(ctx: any, block: any) {
  // Set shadow for all blocks
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.10)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  const borderRadius = 12;
  // Draw with rounded corners
  if (block.type === "RawText" || block.type === "BUTTON" || block.type === "IdentifierBox" || block.type === "ColumnReferenceBox" || block.type === "ExpressionBox" || block.type === "TableBox" || block.type === "ConditionBox" || block.type === "WILDCARD" || block.type === "Table" || block.type === "IdentifierInput" || block.type === "ColumnReference") {
    ctx.fillStyle = block.color || "black";
    drawRoundedRect(ctx, block.x, block.y, block.w, block.h, borderRadius);
    ctx.fill();
    ctx.shadowColor = 'rgba(0,0,0,0)'; // Remove shadow for border
    if (block.type !== "RawText") {
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#222';
      ctx.stroke();
    }
    ctx.font = block.type === "BUTTON" ? "20px Arial" : "18px Arial";
    ctx.fillStyle = block.type === "BUTTON" ? "black" : (block.type === "RawText" ? "black" : "white");
    // Center text
    const text = block.input && block.input !== undefined ? block.input : block.text;
    const textMetrics = ctx.measureText(text);
    const textX = block.x + (block.w - textMetrics.width) / 2;
    const textY = block.y + (block.h + (block.type === "BUTTON" ? 20 : 18)) / 2 - 4;
    ctx.fillText(text, textX, textY);
    ctx.restore();
    return;
  }
  // Compound items
  if (compoundItems.includes(block.type)) {
    ctx.fillStyle = block.color || "black";
    drawRoundedRect(ctx, block.x, block.y, block.w, block.h, borderRadius);
    ctx.fill();
    ctx.shadowColor = 'rgba(0,0,0,0)';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#222';
    ctx.stroke();
    ctx.restore();
    // Render content items
    if (block.content) {
      blockUpdate(block);
      block.content.forEach((item: any) => {
        displayBlock(ctx, item);
      });
    }
    return;
  }
  // Default fallback
  ctx.fillStyle = block.color || "black";
  drawRoundedRect(ctx, block.x, block.y, block.w, block.h, borderRadius);
  ctx.fill();
  ctx.shadowColor = 'rgba(0,0,0,0)';
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#222';
  ctx.stroke();
  ctx.restore();
}

// Deep clone utility for blocks
function deepCloneBlock(block: any): any {
  // If blocks have methods, consider implementing a .clone() method per class
  // For now, this works for plain objects and arrays
  return JSON.parse(JSON.stringify(block));
}

export default function Canvas({ shapes = [], width = 0, height = 0, blocksRef, toSQLRef }: CanvasProps) {
  var allblocks = [];
  const [blocks, setBlocks] = useState(shapes);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // <-- new state
  const dragOffset = useRef({ x: 0, y: 0 }); // <-- useRef instead of useState
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Create a delete box that's always present
  const deleteBox = new Blocks.DeleteBox(width - 620, height - 80);

  useEffect(() => {
    for (let b = 0; b < blocks.length; b++)
    blockUpdate(blocks[b]);
    // grab a context
    displayTag();
  }, [])

  // Keep blocksRef updated with the latest blocks
  useEffect(() => {
    if (blocksRef) {
      blocksRef.current = blocks;
    }
  }, [blocks, blocksRef]);

  // Keep toSQLRef updated with the latest toSQL function
  useEffect(() => {
    if (toSQLRef) {
      toSQLRef.current = toSQL;
    }
  }, [toSQLRef]);

  const updateAll = () =>{
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    // draw all the buttons
    for (let i = 0; i < buttons.length; i++){
      ctx.fillStyle = buttons[i].color;
      ctx.fillRect(buttons[i].x, buttons[i].y, buttons[i].w, buttons[i].h);
      ctx.fillStyle = "black";
      ctx.font = "20px Arial";
      // Center the text vertically and horizontally
      const textMetrics = ctx.measureText(buttons[i].text);
      const textX = buttons[i].x + (buttons[i].w - textMetrics.width) / 2;
      const textY = buttons[i].y + (buttons[i].h + 20) / 2 - 4;
      ctx.fillText(buttons[i].text, textX, textY);
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
    allblocks = blocks;
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
        blockUpdate(items[i]);
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
      setEditingIndex(null); // Remove editing state if switching buttons
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
            setEditingIndex(null); // Remove editing state if adding new block
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
        // If block is editable, set editingIndex
        const editableTypes = ["IdentifierInput", "Table", "ColumnReference"];
        if (editableTypes.includes(blocks[idx].type)) {
          setEditingIndex(idx);
          // Focus the canvas for key events
          canvasRef.current?.focus();
        } else {
          setEditingIndex(null);
        }
      } else {
        setEditingIndex(null);
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
          // Prevent merging a block into itself
          if (b === ob) continue;
          if (magnetoptions.includes(otherBlock.type)) {
            if (otherBlock.content) {
              for (let i = 0; i < otherBlock.content.length; i++) {
                const item = otherBlock.content[i];
                if (item.type == replaceMap[block.type]) {
                    var eucdist = getDistance(item.x , item.y , block.x, block.y);
                    if (-50 < eucdist && eucdist < 50){
                        block.x = otherBlock.x + block.w/2+10;
                        block.y = otherBlock.y; // Align y with parent, not replacement
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

  // Handle key presses for editing blocks
  const handleKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (editingIndex === null) return;
    setBlocks(prev => {
      const newBlocks = [...prev];
      const block = { ...newBlocks[editingIndex] };
      // Only update input for editable types
      const editableTypes = ["IdentifierInput", "Table", "ColumnReference"];
      if (editableTypes.includes(block.type)) {
        // Type assertion for editable block
        const editableBlock = block as typeof block & { input: string };
        if (typeof editableBlock.input !== 'string') editableBlock.input = "";
        if (e.key === "Backspace") {
          editableBlock.input = editableBlock.input.slice(0, -1);
        } else if (e.key.length === 1) {
          editableBlock.input += e.key;
        } else if (e.key === "Enter") {
          setEditingIndex(null);
          newBlocks[editingIndex] = editableBlock;
          return newBlocks;
        }
        newBlocks[editingIndex] = editableBlock;
      }
      return newBlocks;
    });
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ border: "1px solid #333", background: "#eee" }}
      tabIndex={0} // Make canvas focusable
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onKeyDown={handleKeyDown} // Listen for key events
    />
  );
}
