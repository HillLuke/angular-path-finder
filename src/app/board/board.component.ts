import { Component, OnInit } from '@angular/core';
import { Cell, EState } from '../models/cell/cell';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
//var count = (h*this.width)+w;
  public height = 40;
  public width = 70;
  public board : Cell[][];
  public log : string[] = [];
  public currentState = EState.Start;

  public startCell : Cell;
  public endCell : Cell;

  public stateStart = EState.Start;
  public stateEnd = EState.End;
  public stateWall = EState.Wall;

  public isResetting = false;

  private isMouseDown = false;

  constructor() {
    this.board = [];
    for (let h = 0; h < this.height; h++) {
      this.board[h] = [];
      for (let w = 0; w < this.width; w++) {        
        this.board[h][w] = new Cell();
        this.board[h][w].state = EState.Open
        this.board[h][w].id = (h*this.width)+w;
        this.board[h][w].x = w;
        this.board[h][w].y = h;
      }
    }
   }

  ngOnInit(): void {}

  setCurrentState(eState:EState){
    this.currentState = eState;
  }

  setCellState(cell:Cell){
    if(this.currentState == EState.Start){
      if(this.startCell){
        this.startCell.state = EState.Open
      }
      this.startCell = cell;
      this.clearPath();
    }

    if(this.currentState == EState.End){
      if(this.endCell){
        this.endCell.state = EState.Open
      }
      this.endCell = cell;
      this.clearPath();
    }

    if(this.currentState == EState.Wall){
      if(this.endCell == cell){
        this.endCell.state = EState.Open
        this.endCell = undefined;
      }
      if(this.startCell == cell){
        this.startCell.state = EState.Open
        this.startCell = undefined;
      }

      if(cell.state == EState.Wall){
        cell.state = EState.Open;
        return;
      }
    }

    cell.state = this.currentState;
  }

  cellDown(cell:Cell){
    this.isMouseDown = true;
    this.setCellState(cell)
  }

  cellEnter(cell:Cell){
    if(this.isMouseDown){
      this.setCellState(cell)
    }
  }

  mouseLeave(){
    this.isMouseDown = false;
  }

  mouseUp(){
    this.isMouseDown = false;
  }

  reset(){  
    this.currentState = EState.Open;
    this.endCell = undefined;
    this.startCell = undefined;
    for (let h = 0; h < this.height; h++) {
      for (let w = 0; w < this.width; w++) {          
        this.board[h][w] = new Cell();
        this.board[h][w].state = EState.Open
        this.board[h][w].id = (h*this.width)+w;
        this.board[h][w].x = w;
        this.board[h][w].y = h;
      }
    }   
  }

  clearPath(){
    for (let h = 0; h < this.height; h++) {
      for (let w = 0; w < this.width; w++) {  
        if(this.board[h][w].state == EState.Path || this.board[h][w].state == EState.Consider)
          this.board[h][w].state = EState.Open
      }
    }   
  }
  
  begin(){
    this.clearPath();
    this.AStar();
  }

  async AStar(){
    var openList : Cell[] = [];
    var closeList : Cell[] = [];
    var destinationReached = false;

    this.startCell.f = this.startCell.h = this.startCell.g = 0;
    openList.push(this.startCell);

    while(!destinationReached){
      //get lowest estimate cost
      var lowestCostCell : Cell = openList[0];
      openList.forEach(cell => {
        if(cell.f < lowestCostCell.f){
          lowestCostCell = cell;
        }
      });

      var index = openList.indexOf(lowestCostCell);
      openList.splice(index,1)[0];
      closeList.push(lowestCostCell);

      this.getChildren(lowestCostCell).forEach(child => {
        if(child.state != EState.Wall){
          if(child == this.endCell){
            destinationReached = true;
            this.log.push("Path found");
            this.endCell.parent = closeList[closeList.length-1];
            closeList.push(child);
            return;
          }

          if(!closeList.includes(child)){
            child.g = lowestCostCell.g + this.guessDistance(lowestCostCell,child);
            child.h = this.guessDistance(child,this.endCell);
            child.f = child.g + child.h;
            child.parent = lowestCostCell;
   
            var add = true;    
            if(openList.includes(child)){       
              openList.forEach(element => {
                if(child.g > element.g){
                 add = false;
                }
              });   
            }         
            if(add){
              openList.push(child);
            }  
          }
        }
      });

      closeList.forEach(cell => {
        if(cell.state != EState.Start && cell.state != EState.End){
          cell.state = EState.Consider;    
        }
      })

      await this.wait(10);
    }
    
    this.walkBack(this.endCell);
  }

  wait(ms: number)  {
    return new Promise((resolve)=> {
      setTimeout(resolve, ms);
    });
  }

  walkBack(cell : Cell){
    if(cell.state != EState.Start && cell.state != EState.End){
      cell.state = EState.Path;
    }
    if(cell.parent != undefined){
      setTimeout(() => {
        this.walkBack(cell.parent);
      }, 20);
    }
  }

  getChildren(cell:Cell){
    var yLimit = this.board.length-1;
    var xLimit = this.board[0].length-1;
    var children : Cell[] = [];

    for (let y = cell.y-1; y < cell.y+2; y++) {
      for (let x = cell.x-1; x < cell.x+2; x++) {
        if(x <= xLimit && x >= 0 && y <= yLimit && y >= 0){
          children.push(this.board[y][x]);
        }          
      }      
    }     
    
    return children;
  }

  guessDistance(from:Cell, to:Cell){
    return Math.abs(from.y - to.y) + Math.abs(from.x - to.x);
  }

  generateMaze(x,y){

  }
}
