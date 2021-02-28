import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cell, EState } from '../models/cell/cell';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {

  @Input() cell : Cell;
  @Output() oMouseDown = new EventEmitter<Cell>();
  @Output() oMouseEnter = new EventEmitter<Cell>();

  public stateStart = EState.Start;
  public stateEnd = EState.End;
  public stateWall = EState.Wall;
  public statePath = EState.Path;
  public stateConsider = EState.Consider;

  constructor() { }

  ngOnInit(): void {
  }

  mouseDown(){
    this.oMouseDown.emit(this.cell);
  }

  mouseEnter(){
    this.oMouseEnter.emit(this.cell);
  }  
}
