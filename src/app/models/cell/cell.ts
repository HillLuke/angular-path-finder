export class Cell {
    public id : number;
    public state : EState;
    public x : number;
    public y : number;
    public f : number;
    public g : number;
    public h : number;
    public parent : Cell;
}

export enum EState{
    Open,
    Start,
    End,
    Wall,
    Path,
    Consider
}