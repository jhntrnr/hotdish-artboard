import { Component } from '@angular/core';

@Component({
  selector: 'app-artboard-container',
  templateUrl: './artboard-container.component.html',
  styleUrls: ['./artboard-container.component.css']
})
export class ArtboardContainerComponent {
  width = 650;
  height = 450;
  cellWidth = 72;
  cellHeight = 50;

  updateDimensions(newWidth: number, newHeight: number) {
    this.width = newWidth;
    this.height = newHeight;
  }  

  widthChanged(event: any) {
    const newWidth = Number(event.target.value);
    this.updateDimensions(newWidth, this.height);
  }
  
  heightChanged(event: any) {
    const newHeight = Number(event.target.value);
    this.updateDimensions(this.width, newHeight);
  }

  cellWidthChanged(event: any) {
    this.cellWidth = Number(event.target.value);
  }
  
  cellHeightChanged(event: any) {
    this.cellHeight = Number(event.target.value);
  }

  pixelsToInches(pixels: number): number {
    return pixels / 50;
  }
}
