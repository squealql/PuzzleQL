export class CodeBlockBase {
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;

  constructor(x: number, y: number, w: number, h: number) {
    this.type = "";
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = "red";
  }
}

class RawText extends CodeBlockBase {
  text: string;
  constructor(x: number, y: number, text: string) {
    // Width: 20 + 13 * each character in text
    const width = 20 + 13 * text.length;
    super(x, y, width, 20);
    this.type = "RawText";
    this.text = text;
  }
}

export class Identifier extends CodeBlockBase{
  type: string;
  x: number;
  y: number;
  constructor(x: number, y: number) {
    super(x, y, 80, 30);
    this.type = "Identifier"
    this.x = x;
    this.y = y;
    this.color="green"
  }
}

export class IdentifierBox extends CodeBlockBase{
  type: string;
  x: number;
  y: number;
  constructor(x: number, y: number) {
    super(x, y, 40, 20);
    this.type = "IdentifierBox"
    this.x = x;
    this.y = y;
    this.color="green"
  }
}

export class TableBox extends CodeBlockBase{
  type: string;
  x: number;
  y: number;
  constructor(x: number, y: number) {
    super(x, y, 40, 20);
    this.type = "TableBox"
    this.x = x;
    this.y = y;
    this.color="lightgreen"
  }
}

export class ConditionBox extends CodeBlockBase{
  type: string;
  x: number;
  y: number;
  constructor(x: number, y: number) {
    super(x, y, 40, 20);
    this.type = "TableBox"
    this.x = x;
    this.y = y;
    this.color="lightblue"
  }
}


export class SELECTBlock extends CodeBlockBase {
  content: (RawText | IdentifierBox)[];
  constructor(x: number, y: number) {
    // Create children first
    super(x, y, 200, 40);
    const content = [
      new RawText(this.x+10, this.y+5, "SELECT"),
      new IdentifierBox(this.x+70, this.y+5),
      new RawText(this.x+115, this.y+5, "FROM"),
      new TableBox(this.x+160, this.y+5),
      new RawText(this.x+200, this.y+5, "WHERE"),
      new ConditionBox(this.x+240, this.y+5),
    ];
    this.type = "SELECT";
    this.color = "lightgrey";
    this.content = content;
  }
}

export class SELECT_DISTINCT extends CodeBlockBase {
  content: (RawText | IdentifierBox)[];
  constructor(x: number, y: number) {
    // Create children first
    super(x, y, 200, 40);
    const content = [
      new RawText(this.x+10, this.y+5, "SELECT DISTINCT"),
      new IdentifierBox(this.x+70, this.y+5),
      new RawText(this.x+115, this.y+5, "FROM"),
      new TableBox(this.x+160, this.y+5),
      new RawText(this.x+200, this.y+5, "WHERE"),
      new ConditionBox(this.x+240, this.y+5),
    ];
    this.type = "SELECT";
    this.color = "lightgrey";
    this.content = content;
  }
}