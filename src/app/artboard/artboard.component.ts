import { Component, Input, ElementRef, HostListener, OnInit, OnChanges, SimpleChanges } from '@angular/core';

interface Cell {
  row: number;
  column: number;
  filled: boolean;
  rotated: boolean;
}

@Component({
  selector: 'app-artboard',
  templateUrl: './artboard.component.html',
  styleUrls: ['./artboard.component.css']
})
export class ArtboardComponent {
  @Input() width = 650;
  @Input() height = 450;
  @Input() cornerRadius = 10;
  @Input() cellWidth = 72;
  @Input() cellHeight = 50;
  @Input() fillColor = '#854b28';
  @Input() emptyColor = '#ffffff';
  cells: Cell[][] = [];
  rightFillerCells: Cell[][] = [];
  bottomFillerCells: Cell[][] = [];
  fillPercentage = 0;
  totalFilledCells = 0;
  bagsNeeded = 0;
  rows = 0;
  columns = 0;
  private isMouseDown = false;
  private isDragging = false;
  private draggedCells: Cell[] = [];
  private meanTotsPerBag = 90;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.initializeGrid();
  }

  initializeGrid() {
    this.rows = Math.floor(this.height / this.cellHeight);
    this.columns = Math.floor(this.width / this.cellWidth);
  
    const gapX = this.width - this.columns * this.cellWidth;
    const gapY = this.height - this.rows * this.cellHeight;
  
    this.cells = [];
    for (let row = 0; row < this.rows; row++) {
      const rowCells: Cell[] = [];
      for (let column = 0; column < this.columns; column++) {
        rowCells.push({ row, column, filled: true, rotated: false });
      }
      this.cells.push(rowCells);
    }

    this.rightFillerCells = [];
    if(gapX > this.cellHeight){
      const rotatedColumns = Math.floor(gapX / this.cellHeight);
      const rotatedRows = Math.floor(this.height / this.cellWidth);
      for(let row = 0; row < rotatedRows; row++){
        const rowCells: Cell[] = [];
        for(let column = 0; column < rotatedColumns; column++){
          rowCells.push({
            row: row,
            column: column,
            filled: true,
            rotated: true,
          });
        }
        console.log(rowCells);
        this.rightFillerCells.push(rowCells);
      }
    }

    this.bottomFillerCells = [];
    if(gapY > this.cellWidth){
      const rotatedColumns = Math.floor(this.width / this.cellHeight);
      const rotatedRows = Math.floor(gapY / this.cellWidth);
      for(let row = 0; row < rotatedRows; row++){
        const rowCells: Cell[] = [];
        for(let column = 0; column < rotatedColumns; column++){
          rowCells.push({
            row: row,
            column: column,
            filled: true,
            rotated: true,
          });
        }
        console.log(rowCells);
        this.bottomFillerCells.push(rowCells);
      }
    }
    this.updateTotStats();
  }
  
  onMouseDown(event: MouseEvent) {
    this.isMouseDown = true;
    const targetCell = this.getCellFromEvent(event);
    if (targetCell) {
      this.isDragging = !targetCell.filled;
      this.updateCell(targetCell, !targetCell.filled);
      this.draggedCells = [targetCell];
    }
  }

  onMouseUp(event: MouseEvent) {
    this.isMouseDown = false;
    this.draggedCells = [];
  }

  onMouseLeave(event: MouseEvent) {
    if (this.isMouseDown) {
      this.isMouseDown = false;
      this.draggedCells = [];
    }
  }

  onMouseOver(cell: Cell) {
    if (this.isMouseDown) {
      if (!this.draggedCells.includes(cell)) {
        if (this.isDragging && !cell.filled) {
          this.updateCell(cell, true);
          this.draggedCells.push(cell);
        }
        else if (!this.isDragging && cell.filled) {
          this.updateCell(cell, false);
          this.draggedCells.push(cell);
        }
      }
    }
  }
  
  private getCellFromEvent(event: MouseEvent): Cell | null {
    const svgElement = this.elementRef.nativeElement.querySelector('svg');
    const svgRect = svgElement.getBoundingClientRect();
  
    const offsetX = event.clientX - svgRect.left - 10;
    const offsetY = event.clientY - svgRect.top - 10;
  
    const column = Math.floor(offsetX / this.cellWidth);
    const row = Math.floor(offsetY / this.cellHeight);
  
    const rows = Math.floor(this.height / this.cellHeight);
    const columns = Math.floor(this.width / this.cellWidth);
  
    // Check if the click is within the main cells area
    if (column >= 0 && row >= 0 && column < columns && row < rows) {
      return this.cells[row][column];
    }
  
    // Check if the click is within the rightFillerCells area
    const rightFillerColumn = Math.floor((offsetX - columns * this.cellWidth) / this.cellHeight);
    const rightFillerRow = Math.floor(offsetY / this.cellWidth);
    if (rightFillerRow >= 0 && rightFillerColumn >= 0 && rightFillerRow < rows && rightFillerColumn < this.rightFillerCells[0].length) {
      return this.rightFillerCells[rightFillerRow][rightFillerColumn];
    }
  
    // Check if the click is within the bottomFillerCells area
    const bottomFillerRow = Math.floor((offsetY - rows * this.cellHeight) / this.cellWidth);
    const bottomFillerColumn = Math.floor(offsetX / this.cellHeight);
    if (bottomFillerRow >= 0 && bottomFillerColumn >= 0 && bottomFillerRow < this.bottomFillerCells.length && bottomFillerColumn < columns) {
      return this.bottomFillerCells[bottomFillerRow][bottomFillerColumn];
    }
  
    return null;
  }
  
  
  
  private updateCell(cell: Cell, filled: boolean) {
    cell.filled = filled;
    this.updateTotStats();
  }

  private updateTotStats() {
    let filledCells = 0;
    for (const row of this.cells) {
      for (const cell of row) {
        if (cell.filled) {
          filledCells++;
        }
      }
    }
    for (const row of this.rightFillerCells) {
      for (const cell of row) {
        if (cell.filled) {
          filledCells++;
        }
      }
    }
    for (const row of this.bottomFillerCells) {
      for (const cell of row) {
        if (cell.filled) {
          filledCells++;
        }
      }
    }
    this.totalFilledCells = filledCells;
    this.fillPercentage = (this.cellWidth * this.cellHeight * filledCells) / (this.width * this.height) * 100;
    this.bagsNeeded = Math.ceil(this.totalFilledCells/this.meanTotsPerBag);
  }

  isDimensionValid(): boolean {
    const ratio = this.cellWidth / this.cellHeight;
    const minRatio = 0.5;
    const maxRatio = 2;
  
    const minDimension = 25;
    const maxDimension = 100;
  
    const isRatioValid = ratio >= minRatio && ratio <= maxRatio;
    const isWidthValid = this.cellWidth > minDimension && this.cellWidth < maxDimension;
    const isHeightValid = this.cellHeight > minDimension && this.cellHeight < maxDimension;
  
    return isRatioValid && isWidthValid && isHeightValid;
  }
  

  ngOnChanges(changes: SimpleChanges) {
    if ('cellWidth' in changes || 'cellHeight' in changes || 'width' in changes || 'height' in changes) {
      this.initializeGrid();
    }
  }
}
