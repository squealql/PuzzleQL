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
  constructor(x: number, y: number, text: string, color?: string) {
    // Width: 20 + 13 * each character in text
    const width = 20 + 12 * text.length;
    super(x, y, width, 20);
    this.type = "RawText";
    this.color = color ?? "lightgrey";
    this.text = text;
  }
}

class SmallRawText extends CodeBlockBase {
  text: string;
  constructor(x: number, y: number, text: string) {
    // Width: 20 + 13 * each character in text
    const width = 20 + 7 * text.length;
    super(x, y, width, 20);
    this.type = "RawText";
    this.color = "lightgrey";
    this.text = text;
  }
}

class InputBox extends SmallRawText{
  input: string;
  constructor(x: number, y: number, text: string) {
    // Width: 20 + 13 * each character in text
    super(x, y, text);
    this.type = "InputBox";
    this.input = "";
  }
  
}

export class Table extends InputBox{
  constructor(x: number, y: number) {
    super(x, y, "<table input>");
    this.type = "Table";
    this.color="lightgreen"
  }
}

export class IdentifierInput extends InputBox{
  constructor(x: number, y: number) {
    super(x, y, "<identifier input>");
    this.type = "IdentifierInput";
    this.color="green"
  }
}


export class ColumnReferenceBox extends SmallRawText{
  type: string;
  constructor(x: number, y: number) {
    super(x, y, "<column>");
    this.type = "ColumnReferenceBox"
    this.color="green"
  }
}

export class ColumnReference extends InputBox{
  constructor(x: number, y: number) {
    super(x, y, "<column input>");
    this.type = "ColumnReference";
    this.color="green"
  }
}

export class ExpressionBox extends SmallRawText{
  type: string;
  constructor(x: number, y: number) {
    super(x, y, "<expression>");
    this.type = "ExpressionBox"
    this.color="red"
  }
}

export class IdentifierBox extends SmallRawText{
  type: string;
  constructor(x: number, y: number) {
    super(x, y, "<identifier>");
    this.type = "IdentifierBox"
    this.color="green"
  }
}
export class SELECTBox extends SmallRawText{
  type: string;
  constructor(x: number, y: number) {
    super(x, y, "<select>");
    this.type = "SELECTBox"
    this.color="lightgrey"
  }
}

export class TableBox extends SmallRawText{
  type: string;
  constructor(x: number, y: number) {
    super(x, y, "<table>");
    this.type = "TableBox"
    this.color="lightgreen"
  }
}

export class ConditionBox extends SmallRawText{
  type: string;
  constructor(x: number, y: number) {
    super(x, y, "<condition>");
    this.type = "ConditionBox"
    this.color="lightblue"
  }
}

export class SELECT extends CodeBlockBase {
  content: (RawText | IdentifierBox)[];
  constructor(x: number, y: number) {
    // Create children first
    super(x, y, 200, 40);
    const content = [
      new RawText(this.x+10, this.y+5, "SELECT"),
      new IdentifierBox(this.x+10, this.y+5),
      new RawText(this.x+15, this.y+5, "FROM"),
      new TableBox(this.x+10, this.y+5),
      new RawText(this.x+20, this.y+5, "WHERE"),
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
    this.type = "SELECT DISTINCT";
    this.color = "lightgrey";
    this.content = content;
  }
}

export class BUTTON extends CodeBlockBase{
  text: string;
  color: string;
  constructor(x: number, y : number, color : string, text: string){
    super(x, y, 80, 40); // Larger default size
    this.color = color;
    this.text = text;
    this.w = 60 + 10 * text.length; // Wider for text
    this.h = 40; // Taller
  }
}

export class UPDATE extends CodeBlockBase {
  content: (RawText | IdentifierBox)[];
  constructor(x: number, y: number) {
    // Create children first
    super(x, y, 200, 40);
    const content = [
      new RawText(this.x+10, this.y+5, "UPDATE"),
      new TableBox(this.x+160, this.y+5),
      new RawText(this.x+200, this.y+5, "SET"),
      new ColumnReferenceBox(this.x+240, this.y+5),
      new RawText(this.x+200, this.y+5, "="),
      new ExpressionBox(this.x+240, this.y+5),
      new RawText(this.x+200, this.y+5, "WHERE"),
      new ConditionBox(this.x+240, this.y+5),
    ];
    this.type = "UPDATE";
    this.color = "lightgrey";
    this.content = content;
  }
}

export class DELETE extends CodeBlockBase {
  content: (RawText | IdentifierBox)[];
  constructor(x: number, y: number) {
    // Create children first
    super(x, y, 200, 40);
    const content = [
      new RawText(this.x+10, this.y+5, "DELETE FROM"),
      new TableBox(this.x+160, this.y+5),
      new RawText(this.x+200, this.y+5, "WHERE"),
      new ConditionBox(this.x+240, this.y+5),
    ];
    this.type = "DELETE";
    this.color = "lightgrey";
    this.content = content;
  }
}

export class DROP_TABLE extends CodeBlockBase {
  content: (RawText | IdentifierBox)[];
  constructor(x: number, y: number) {
    // Create children first
    super(x, y, 200, 40);
    const content = [
      new RawText(this.x+10, this.y+5, "DROP TABLE"),
      new TableBox(this.x+160, this.y+5),
    ];
    this.type = "DROP TABLE";
    this.color = "lightgrey";
    this.content = content;
  }
}

export class DROP_COLUMN extends CodeBlockBase {
  content: (RawText | IdentifierBox)[];
  constructor(x: number, y: number) {
    // Create children first
    super(x, y, 200, 40);
    const content = [
      new RawText(this.x+10, this.y+5, "DROP COLUMN"),
      new ColumnReferenceBox(this.x+160, this.y+5),
    ];
    this.type = "DROP COLUMN";
    this.color = "lightgrey";
    this.content = content;
  }
}

export class WILDCARD extends CodeBlockBase {
  text: string;
  constructor(x: number, y: number) {
    // Width: 20 + 13 * each character in text
    super(x, y, 5, 20);
    this.type = "WILDCARD";
    this.color = "green";
    this.text = "*";
    const width = 20 + 12 * this.text.length;
    this.w = width;
  }
}

export class DeleteBox extends CodeBlockBase {
  constructor(x: number, y: number) {
    super(x, y, 500, 60);
    this.type = "DeleteBox";
    this.color = "#ff4444";
  }
}

export class Equals extends CodeBlockBase {
  content: (RawText | IdentifierBox)[];
  constructor(x: number, y: number) {
    // Create children first
    super(x, y, 200, 40);
    const content = [
      new IdentifierBox(this.x+10, this.y+5),
      new RawText(this.x+10, this.y+5, "=", "lightblue"),
      new IdentifierBox(this.x+10, this.y+5),
    ];
    this.type = "EQUALS";
    this.color = "lightblue";
    this.content = content;
  }
}

export class LessThan extends CodeBlockBase {
  content: (RawText | IdentifierBox)[];
  constructor(x: number, y: number) {
    super(x, y, 200, 40);
    const content = [
      new ExpressionBox(this.x+10, this.y+5),
      new RawText(this.x+10, this.y+5, "<", "lightblue"),
      new ExpressionBox(this.x+10, this.y+5),
    ];
    this.type = "LESS THAN";
    this.color = "lightblue";
    this.content = content;
  }
}

export class LessEqualTo extends CodeBlockBase {
  content: (RawText | IdentifierBox)[];
  constructor(x: number, y: number) {
    super(x, y, 200, 40);
    const content = [
      new ExpressionBox(this.x+10, this.y+5),
      new RawText(this.x+10, this.y+5, "<=", "lightblue"),
      new ExpressionBox(this.x+10, this.y+5),
    ];
    this.type = "LESS EQUAL TO";
    this.color = "lightblue";
    this.content = content;
  }
}

export class GreaterThan extends CodeBlockBase {
  content: (RawText | IdentifierBox)[];
  constructor(x: number, y: number) {
    super(x, y, 200, 40);
    const content = [
      new ExpressionBox(this.x+10, this.y+5),
      new RawText(this.x+10, this.y+5, ">", "lightblue"),
      new ExpressionBox(this.x+10, this.y+5),
    ];
    this.type = "GREATER THAN";
    this.color = "lightblue";
    this.content = content;
  }
}

export class GreaterEqualTo extends CodeBlockBase {
  content: (RawText | IdentifierBox)[];
  constructor(x: number, y: number) {
    super(x, y, 200, 40);
    const content = [
      new ExpressionBox(this.x+10, this.y+5),
      new RawText(this.x+10, this.y+5, ">=", "lightblue"),
      new ExpressionBox(this.x+10, this.y+5),
    ];
    this.type = "GREATER EQUAL TO";
    this.color = "lightblue";
    this.content = content;
  }
}

export class AND extends CodeBlockBase {
  content: (RawText | IdentifierBox)[];
  constructor(x: number, y: number) {
    super(x, y, 200, 40);
    const content = [
      new ConditionBox(this.x+10, this.y+5),
      new RawText(this.x+10, this.y+5, "AND", "lightblue"),
      new ConditionBox(this.x+10, this.y+5),
    ];
    this.type = "AND";
    this.color = "lightblue";
    this.content = content;
  }
}

export class OR extends CodeBlockBase {
  content: (RawText | IdentifierBox)[];
  constructor(x: number, y: number) {
    super(x, y, 200, 40);
    const content = [
      new ConditionBox(this.x+10, this.y+5),
      new RawText(this.x+10, this.y+5, "OR", "lightblue"),
      new ConditionBox(this.x+10, this.y+5),
    ];
    this.type = "OR";
    this.color = "lightblue";
    this.content = content;
  }
}

export class LIKE extends CodeBlockBase {
  content: (RawText | IdentifierBox)[];
  constructor(x: number, y: number) {
    super(x, y, 200, 40);
    const content = [
      new ColumnReferenceBox(this.x+10, this.y+5),
      new RawText(this.x+10, this.y+5, "LIKE", "lightblue"),
      new ExpressionBox(this.x+10, this.y+5),
    ];
    this.type = "LIKE";
    this.color = "lightblue";
    this.content = content;
  }
}

export class AddIdentifierExpr extends CodeBlockBase {
  content: (RawText | IdentifierBox)[];
  constructor(x: number, y: number) {
    super(x, y, 200, 40);
    const content = [
      new IdentifierBox(this.x+10, this.y+5),
      new RawText(this.x+10, this.y+5, "+", "red"),
      new IdentifierBox(this.x+10, this.y+5),
    ];
    this.type = "ADD IDENTIFIER EXPR";
    this.color = "red";
    this.content = content;
  }
}

export class SubIdentifierExpr extends CodeBlockBase {
  content: (RawText | IdentifierBox)[];
  constructor(x: number, y: number) {
    super(x, y, 200, 40);
    const content = [
      new IdentifierBox(this.x+10, this.y+5),
      new RawText(this.x+10, this.y+5, "-", "red"),
      new IdentifierBox(this.x+10, this.y+5),
    ];
    this.type = "SUB IDENTIFIER EXPR";
    this.color = "red";
    this.content = content;
  }
}

export class MultIdentifierExpr extends CodeBlockBase {
  content: (RawText | IdentifierBox)[];
  constructor(x: number, y: number) {
    super(x, y, 200, 40);
    const content = [
      new IdentifierBox(this.x+10, this.y+5),
      new RawText(this.x+10, this.y+5, "*", "red"),
      new IdentifierBox(this.x+10, this.y+5),
    ];
    this.type = "MULT IDENTIFIER EXPR";
    this.color = "red";
    this.content = content;
  }
}

export class DivideIdentifierExpr extends CodeBlockBase {
  content: (RawText | IdentifierBox)[];
  constructor(x: number, y: number) {
    super(x, y, 200, 40);
    const content = [
      new IdentifierBox(this.x+10, this.y+5),
      new RawText(this.x+10, this.y+5, "/", "red"),
      new IdentifierBox(this.x+10, this.y+5),
    ];
    this.type = "DIVIDE IDENTIFIER EXPR";
    this.color = "red";
    this.content = content;
  }
}

export class Inner_Join extends CodeBlockBase {
  content: (RawText | IdentifierBox)[];
  constructor(x: number, y: number) {
    // Create children first
    super(x, y, 200, 40);
    const content = [
      new SELECTBox(this.x+10, this.y+5),
      new RawText(this.x+15, this.y+5, "INNER JOIN", "purple"),
      new TableBox(this.x+10, this.y+5),
      new RawText(this.x+15, this.y+5, "ON", "purple"),
      new ColumnReferenceBox(this.x+20, this.y+5),
      new RawText(this.x+15, this.y+5, "=", "purple"),
      new ColumnReferenceBox(this.x+20, this.y+5),
    ];
    this.type = "INNER JOIN";
    this.color = "purple";
    this.content = content;
  }
}

export class Left_Join extends CodeBlockBase {
  content: (RawText | IdentifierBox)[];
  constructor(x: number, y: number) {
    super(x, y, 200, 40);
    const content = [
      new SELECTBox(this.x+10, this.y+5),
      new RawText(this.x+15, this.y+5, "LEFT JOIN", "purple"),
      new TableBox(this.x+10, this.y+5),
      new RawText(this.x+15, this.y+5, "ON", "purple"),
      new ColumnReferenceBox(this.x+20, this.y+5),
      new RawText(this.x+15, this.y+5, "=", "purple"),
      new ColumnReferenceBox(this.x+20, this.y+5),
    ];
    this.type = "LEFT JOIN";
    this.color = "purple";
    this.content = content;
  }
}

export class Right_Join extends CodeBlockBase {
  content: (RawText | IdentifierBox)[];
  constructor(x: number, y: number) {
    super(x, y, 200, 40);
    const content = [
      new SELECTBox(this.x+10, this.y+5),
      new RawText(this.x+15, this.y+5, "RIGHT JOIN", "purple"),
      new TableBox(this.x+10, this.y+5),
      new RawText(this.x+15, this.y+5, "ON", "purple"),
      new ColumnReferenceBox(this.x+20, this.y+5),
      new RawText(this.x+15, this.y+5, "=", "purple"),
      new ColumnReferenceBox(this.x+20, this.y+5),
    ];
    this.type = "RIGHT JOIN";
    this.color = "purple";
    this.content = content;
  }
}

export class Full_Outer_Join extends CodeBlockBase {
  content: (RawText | IdentifierBox)[];
  constructor(x: number, y: number) {
    super(x, y, 200, 40);
    const content = [
      new SELECTBox(this.x+10, this.y+5),
      new RawText(this.x+15, this.y+5, "FULL OUTER JOIN", "purple"),
      new TableBox(this.x+10, this.y+5),
      new RawText(this.x+15, this.y+5, "ON", "purple"),
      new ColumnReferenceBox(this.x+20, this.y+5),
      new RawText(this.x+15, this.y+5, "=", "purple"),
      new ColumnReferenceBox(this.x+20, this.y+5),
    ];
    this.type = "FULL OUTER JOIN";
    this.color = "purple";
    this.content = content;
  }
}
