

var elem = document.getElementById('canvas');
var cv = elem.getContext('2d');
var i, j;
var singCol, colsAdded;
var timer;

//------------------------------------------------------------------------------------------------------
//
//   Board class
//
//------------------------------------------------------------------------------------------------------

function Board(ss) {
	
	this.ss = ss;
	this.w = canvas.width/this.ss;
	this.h = canvas.height/this.ss;
	this.cell = new Array(this.h);
	this.tilePics = new Array();
	this.selected = null;
	this.multiSelect = null;
	this.turboBuild = null;
	this.turboNext = null;
	this.strucCreated = false;
	this.sequence = new Array();
	
	for (i=1; i < 10; i++) this.sequence[i] = null;
	
	this.regset = new RegisterSet();
	this.disPane = new DisplayPane();
	
	// Store tile .png filenames in array
	var names = [" ", "tileCornerTopRight", "tileCornerBotRight", "tileCornerBotLeft", 
               "tileCornerTopLeft", "tileLineVert", "tileLineHoz", "tileCrossOver", "tileCrossUnder"];
			   
	// Load tile images
	for (var indv = 1; indv < 33; indv++) {
		this.tilePics[indv] = new Image();
		if (indv > 24) this.tilePics[indv] = document.getElementById(names[indv-24] + "Blue");
		else if (indv > 16) this.tilePics[indv]	= document.getElementById(names[indv-16] + "Green");
		else if (indv > 8) this.tilePics[indv] = document.getElementById(names[indv-8] + "Red");
		else this.tilePics[indv] = document.getElementById(names[indv]); 
	}
	
	// Init board cells
	for (i=0; i < this.h; i++) {
		this.cell[i] = new Array(this.w);
		for (j=0; j < this.w; j++) {
			this.cell[i][j] = new Cell(this, i, j);
		}
	}
	
	// Draw everything
	this.draw();	
	
	// Print startup blurb to text pane
	this.disPane.add("Knotswithstanding!</br>");
	this.disPane.add("by Erik S. Nestor</br>");
	this.disPane.add("Rhode Island College</br>");
	this.disPane.add("Computer Science and Mathematics Dept.</br></br>");	
}




Board.prototype.draw = function () {
	
	var i, j;
	
	cv.strokeStyle = "#E6E6E6";
	cv.lineWidth = 1.0;
	cv.beginPath();
	for (i = 1; i < this.w; i++) {
		cv.moveTo(((i*this.ss)-0.5), 0);
		cv.lineTo(((i*this.ss)-0.5), canvas.height);
		cv.closePath();
		//cv.stroke();
	}
	
	for (i = 1; i < this.h; i++) {
		cv.moveTo(0, ((i*this.ss)-0.5));
		cv.lineTo(canvas.width, ((i*this.ss)-0.5));
		cv.closePath();
		//cv.stroke();
	}
	cv.stroke();
	cv.lineWidth = 1.0;
	cv.strokeStyle = "#000000";
	//alert("grid generated");
	
	var vert, hoz;
	for (vert = 0; vert < this.h; vert++){
		for (hoz = 0; hoz < this.w; hoz++) {
			if (this.cell[vert][hoz].type) {                         // if square is occupied
				this.cell[vert][hoz].clear();                                // clear
				//if (this.cell[vert][hoz].type > 6) alert(this.cell[vert][hoz].type);
				//alert("hi");
				this.cell[vert][hoz].tile.draw(this.cell[vert][hoz]);                 // and redraw
				//alert("there");
				//if (this.cell[vert][hoz].type > 6) alert(this.cell[vert][hoz].type);
			}
		}
	}

	if ((this.turboBuild) && (this.turboBuild.dormant == false)) {
		this.turboBuild.markNext(this.turboNext);
		//this.cell[this.turboBuild.tempTile.row][this.turboBuild.tempTile.col].
	}
};

Board.prototype.hitXY = function(e) {
 	var xPos = Math.ceil((e.pageX - $('canvas').offset().left)/this.ss);
	var yPos = Math.ceil((e.pageY - $('canvas').offset().top)/this.ss);
	
	var returnCell = this.cell[yPos-1][xPos-1];
	return returnCell;
}

Board.prototype.setSelect = function(c) {
	if (c.type) {
		if (this.multiSelect) {
			if ((c.type) && (!this.multiSelect.isSelected(c))) this.multiSelect.selectList[this.multiSelect.numSelected++] = c;
		} else {
			this.selected = c;
		}
	}
}


Board.prototype.drawSelect = function() {

			this.draw();
			var l, t;
			
			if (this.multiSelect) {
				var index;
				for (index = 0; index < this.multiSelect.numSelected; index++) {
					if (this.multiSelect.selectList[index].type) {
						l = ((this.multiSelect.selectList[index].col - 1) * this.ss);
						t = ((this.multiSelect.selectList[index].row - 1) * this.ss);
						this.multiSelect.selectList[index].clear();
						cv.drawImage(this.tilePics[this.multiSelect.selectList[index].type + 8], l, t, this.ss, this.ss);
					} else {
						this.multiSelect.selectList[index] = null;
					}
				}
				if (this.multiSelect.selectList.length == 0) this.multiSelect = null;
			} else if (this.selected) {
				if (this.selected.type) {
					l = ((this.selected.col - 1) * this.ss);
					t = ((this.selected.row - 1) * this.ss);
					this.selected.clear();
					cv.drawImage(this.tilePics[this.selected.type + 8],l,t, this.ss, this.ss);
				} else this.selected = null;
			}	

}

Board.prototype.shift = function(dir) {
    
	var valid = true;
	var changed = false;
	var sel = null;
	var i, j;
	
	switch (dir) {
	  case "upShift":
	     for (i = 0; i < this.w; i++)
		    if (this.cell[0][i].type) valid = false; break;
	  case "rightShift":
	     for (i = 0; i < this.h; i++)
		    if (this.cell[i][this.w-1].type) valid = false; break;
	  case "downShift":
	     for (i = 0; i < this.w; i++)
		    if (this.cell[this.h-1][i].type) valid = false; break;
	  case "leftShift":
	     for (i = 0; i < this.h; i++)
		    if (this.cell[i][0].type) valid = false;
	}
	
	if (valid) {
		switch (dir) {
			case "upShift": {
				for (i = 0; i < this.h-1; i++) {
					for (j = 0; j < this.w; j++) {
						this.cell[i][j].plot(this.cell[i+1][j].type);
					}
				}
				if (brd.selected) sel = this.cell[brd.selected.row-2][brd.selected.col-1];
				for (i = 0; i < this.w; i++) if (this.cell[this.h-1][i].type) this.cell[this.h-1][i].plot(0); break; }
			case "rightShift": {
				for (i = (this.w-1); i > 0; i--) {
					for (j = 0; j < this.h; j++) {
						this.cell[j][i].plot(this.cell[j][i-1].type);
					}
				} 
				if (brd.selected) sel = this.cell[brd.selected.row-1][brd.selected.col];
				for (i = 0; i < this.h; i++) if (this.cell[i][0].type != 0) this.cell[i][0].plot(0); break; }
			case "downShift": {
				for (i = (this.h-1); i > 0; i--) {
					for (var j = 0; j < this.w; j++) {
						this.cell[i][j].plot(this.cell[i-1][j].type);
					}
				}
				if (brd.selected) sel = this.cell[brd.selected.row][brd.selected.col-1];
				for (i = 0; i < this.w; i++) if (this.cell[0][i].type) this.cell[0][i].plot(0); break; }
			case "leftShift": {
				for (i = 0; i < (this.w-1); i++) {
					for (j = 0; j < this.h; j++) {
						this.cell[j][i].plot(this.cell[j][i+1].type);
					}
				}
				if (brd.selected) sel = this.cell[brd.selected.row-1][brd.selected.col-2];
				for (i = 0; i < this.h; i++) if (this.cell[i][this.w-1].type) this.cell[i][this.w-1].plot(0);}
		}
	}
    this.draw();
	brd.setSelect(sel);
	brd.drawSelect();
}


Board.prototype.msgDisplay = function(msg, t, h, w) {
	
	var box = document.createElement('div');
	box.classList.add('msgBox');
	box.id  = "mb";
	document.body.appendChild(box);
	var m = document.createElement('p');
	m.id = "mg";
	
	$('#mb').css({'height' : h+'px', 'width' : w + 'px'});
	
	document.getElementById('mb').appendChild(m);
	
	m.innerHTML = msg;
	
	$('#mg').css('margin', '3px');
	
	timer = setTimeout(function() {	
		document.body.removeChild(document.getElementById('mb'));
	}, t);
}



//------------------------------------------------------------------------------------------------------
//
//  Cell class   - translate
//
//------------------------------------------------------------------------------------------------------

function Cell(p, r, c) {
	this.col = (c+1);
	this.row = (r+1);
	this.type = 0;
	this.parent = p;
	this.tile = new Empty();
	this.nConnect =
	this.eConnect =
	this.wConnect =
	this.sConnect = null;
}

Cell.prototype.clear = function(){
	cv.clearRect(((this.col - 1)*brd.ss), ((this.row - 1)*brd.ss), brd.ss, brd.ss);
}

Cell.prototype.plot = function(t){
	this.type = t;
	if (t == 0) {
		this.tile = new Empty(this.row, this.col);
		this.nConnect = 
		this.eConnect =
		this.wConnect = 
		this.sConnect = null;
	} else if (t < 5) {
		this.tile = new Corner(this.row, this.col);
		for (i=0; i < (t-1); i++) this.tile.rotate();

    } else if (t < 7) {
		this.tile = new Line(this.row, this.col);
		for (i=0; i < (t-5); i++) this.tile.rotate();

	} else if (t < 9) {
		this.tile = new Crossing(this.row, this.col);
		for (i=0; i < (t-7); i++) this.tile.rotate(); 

	}
	
	this.tile.draw();
}

Cell.prototype.highlight = function(){
		cv.fillStyle = "#FFFF00";
		cv.strokeStyle = "#FFFF00";
		cv.fillRect(((this.col - 1) * brd.ss), ((this.row - 1) * brd.ss), brd.ss, brd.ss);
		cv.fillStyle = "#000000";
		cv.strokeStyle = "#000000";
}

Cell.prototype.rotateTile = function(){
	this.tile.rotate();
	if ((this.type > 0) && (this.type < 9)) {
		if (this.type == 4) this.type = 1;
		else if (this.type == 6) this.type = 5;
		else if (this.type == 8) this.type = 7;
		else this.type++;
	}
}

Cell.prototype.isAnEnd = function() {
	return ((this.tile.north && (this.row > 1) && (!brd.cell[this.row - 2][this.col-1].type))
	             || (this.tile.south && (this.row < (brd.h - 1)) && (!brd.cell[this.row][this.col-1].type))
				 || (this.tile.east && (this.col < (brd.w - 1)) && (!brd.cell[this.row-1][this.col].type))
				 || (this.tile.west && (this.col > 1) && (!brd.cell[this.row -1][this.col-2].type)))
}


//------------------------------------------------------------------------------------------------------
//
//  Empty class
//
//------------------------------------------------------------------------------------------------------

function Empty(r, c) {
	this.col = c;
	this.row = r;
	this.rotation = 0;
	this.north = 0;
	this.east = 0;
	this.south = 0;
	this.west = 0;
}


Empty.prototype.draw = function(){
	cv.clearRect((((this.col - 1)*brd.ss)), (((this.row - 1)*brd.ss)), (brd.ss-1), (brd.ss-1));
	brd.cell[this.row-1][this.col-1].clear();
}
   
Empty.prototype.rotate = function(){}

//------------------------------------------------------------------------------------------------------
//
//  Corner class
//
//------------------------------------------------------------------------------------------------------

function Corner(r, c) {
	this.col = c;
	this.row = r;
	this.rotation = 0;
	this.north = 0;
	this.east = 0;
	this.south = 1;
	this.west = 1;
}

Corner.prototype.draw = function(){
	var l = ((this.col - 1) * brd.ss);
	var t = ((this.row - 1) * brd.ss);
	
	cv.clearRect(l, t, (brd.ss-1), (brd.ss-1));
	cv.drawImage(brd.tilePics[1+this.rotation], l, t, brd.ss, brd.ss);
	
}
   
Corner.prototype.rotate = function(){
	var temp;
	this.rotation = (this.rotation+1)%4;
	
	temp = this.north;
	this.north = this.west;
	this.west = this.south;
	this.south = this.east;
	this.east = temp;
	
	this.draw();
}


//------------------------------------------------------------------------------------------------------
//
//  Line class
//
//------------------------------------------------------------------------------------------------------

function Line(r, c) {
	this.col = c;
	this.row = r;
	this.rotation = 0;
	this.north = 1;
	this.east = 0;
	this.south = 1;
	this.west = 0;
}

Line.prototype.draw = function() {
	var l = ((this.col - 1) * brd.ss);
	var t = ((this.row - 1) * brd.ss);
	
	cv.clearRect(l, t, (brd.ss-1), (brd.ss-1));	
	cv.drawImage(brd.tilePics[5+this.rotation], l, t, brd.ss, brd.ss);
}
	
Line.prototype.rotate = function() {
	this.north = !this.north;
	this.east = !this.east;
	this.south = !this.south;
	this.west = !this.west;
	if (this.rotation) this.rotation = 0;
	else this.rotation = 1;
	this.draw();
}

//------------------------------------------------------------------------------------------------------
//
//  Crossing Class
//
//------------------------------------------------------------------------------------------------------

function Crossing(r, c) {
	this.col = c;
	this.row = r;
	this.rotation = 0;
	this.north = 1;
	this.east = 1;
	this.south = 1;
	this.west = 1;
}

Crossing.prototype.draw = function() {
	var l = ((this.col - 1) * brd.ss);
	var t = ((this.row - 1) * brd.ss);
	
	cv.clearRect(l, t, (brd.ss-1), (brd.ss-1));
	cv.drawImage(brd.tilePics[7+this.rotation],l,t, brd.ss, brd.ss);
}
	
	
Crossing.prototype.rotate = function() {
	if (this.rotation == 1) this.rotation = 0;
	else this.rotation = 1;
}

//------------------------------------------------------------------------------------------------------
//
//  TurboBuild class
//
//------------------------------------------------------------------------------------------------------

function TurboBuild(b, c) {
	this.b = brd;
	this.startCell = c;              	// reference to the first cell
	this.north = 0;                  	//
	this.east = 0;                   	//    bool indicating legality of a move in
	this.south = 0;                  	//    each direction from current position
	this.west = 0;                   	//
	this.nextMove = c;               	// Type Cell, square in which target appears, not plotted yet
	this.thisMove = null;            	// Type Move, last square actually plotted w/ environment
	this.lastDir = 0;                	// Type int, direction travelled to enter current cell
	this.numMoves = 0;               	// # moves in history
	this.moves = new Array();        	// MOVE HISTORY - Array stack, all elements type Move
	this.tempTile = null;
	this.tempOn = false;
	this.dormant = false;
	
	this.markNext(c);					// {place arrow marks on start square}
	brd.turboNext = this.nextMove;
}


// TurboBuild.markNext() takes a reference to a Cell
// and draws arrow marks indicating available (valid) moves
TurboBuild.prototype.markNext = function(c) {
	
	if (c == null) return;       // if argument null get out
	
	if (!c.type || (c.type == 5) || (c.type == 6)) {          
		
		var t = (c.row-1)*brd.ss;        // canvas coordinates of top left tile corner
		var l = (c.col-1)*brd.ss;
	
		cv.strokeStyle = '#FF9900';        // set color yellow
		cv.fillStyle = '#FF9900';
		cv.globalAlpha = 0.4;
		
		// if north move is ok- north cell [exists] and [is empty or hoz line]
		if ((c.row > 1) && ((brd.cell[c.row-2][c.col-1].type == 0) || (brd.cell[c.row-2][c.col-1].type == 6))) {
			var canCross = false;
			for (i = (c.row - 2); i > -1; i--) {
				if (brd.cell[i][c.col-1].type == 0) canCross = true;
				if ((brd.cell[i][c.col-1].type < 5) && (!canCross)) i = -1;
			}
			if (canCross) {
				cv.beginPath();
				cv.moveTo(l+(brd.ss/2), t+(brd.ss*.1));
				cv.lineTo(l+(brd.ss*.35), t+(brd.ss*.3));
				cv.lineTo(l+(brd.ss*.65), t+(brd.ss*.3));
				cv.closePath();
				cv.fill();
				this.north = 1;
			}
		} else this.north = 0;
		// if north cell is start cell
		if (c.row > 1) {
			if ((this.numMoves > 1) && (brd.cell[c.row-2][c.col-1] != this.thisMove.cell)
				&& (brd.cell[c.row-2][c.col-1].tile.south) && (!c.type)) {      // !!
				cv.strokeStyle = '#FF3300';        // set color red
				cv.fillStyle = '#FF3300';
				cv.globalAlpha = 1;
				cv.beginPath();
				cv.moveTo(l+(brd.ss/2), t+(brd.ss*.1));
				cv.lineTo(l+(brd.ss*.35), t+(brd.ss*.3));
				cv.lineTo(l+(brd.ss*.65), t+(brd.ss*.3));
				cv.closePath();
				cv.fill();
				this.north = 1;	
				cv.strokeStyle = '#FF9900';        // set color yellow
				cv.fillStyle = '#FF9900';
				cv.globalAlpha = 0.4;
			}
		}
		// if east move is ok- east cell exists and is empty or vert line
		if ((c.col < brd.w) && ((brd.cell[c.row-1][c.col].type == 0) || (brd.cell[c.row-1][c.col].type == 5))) {
			var canCross = false;
			for (i = (c.col); i < brd.w; i++) {
				if (brd.cell[c.row-1][i].type == 0) canCross = true;
				if ((brd.cell[c.row-1][i].type < 5) && (!canCross)) i = brd.w;
			}
			if (canCross) {
				cv.beginPath();
				cv.moveTo(l+(brd.ss*.9), t+(brd.ss/2));      //  2          10
				cv.lineTo(l+(brd.ss*.7), t+(brd.ss*.65));      // 14     13
				cv.lineTo(l+(brd.ss*.7), t+(brd.ss*.35));         //    14         7
				cv.closePath();
				cv.fill();
				this.east = 1;
			}
		} else this.east = 0;
		// if east cell is start cell
		if (c.col < brd.w) {
			if ((this.numMoves > 1) && (brd.cell[c.row-1][c.col] != this.thisMove.cell)
				&& (brd.cell[c.row-1][c.col].tile.west) && (!c.type)) {
				cv.strokeStyle = '#FF3300';        // set color red
				cv.fillStyle = '#FF3300';
				cv.globalAlpha = 1;
				cv.beginPath();
				cv.moveTo(l+(brd.ss*.9), t+(brd.ss/2));
				cv.lineTo(l+(brd.ss*.7), t+(brd.ss*.65));
				cv.lineTo(l+(brd.ss*.7), t+(brd.ss*.35));
				cv.closePath();
				cv.fill();
				this.east = 1;
				cv.strokeStyle = '#FF9900';        // set color yellow
				cv.fillStyle = '#FF9900';
				cv.globalAlpha = 0.4;
			}
		}
		// if south move is ok- south cell [exists] and [is empty or hoz line]
		if ((c.row < brd.h) && ((brd.cell[c.row][c.col-1].type == 0) || (this.b.cell[c.row][c.col-1].type == 6))) {
			var canCross = false;
			for (i = (c.row); i < brd.h; i++) {
				if (brd.cell[i][c.col-1].type == 0) canCross = true;
				if ((brd.cell[i][c.col-1].type < 5) && (!canCross)) i = brd.h;
			}
			if (canCross) {
				cv.beginPath();
				cv.moveTo(l+(brd.ss/2), t+(brd.ss*.9));
				cv.lineTo(l+(brd.ss*.65), t+(brd.ss*.7));
				cv.lineTo(l+(brd.ss*.35), t+(brd.ss*.7));
				cv.closePath();
				cv.fill();
				this.south = 1;
			}
		} else this.south = 0;
		// if south cell is start cell
		if (c.row < brd.h) {
			if ((this.numMoves > 1) && (brd.cell[c.row][c.col-1] != this.thisMove.cell)
				&& (brd.cell[c.row][c.col-1].tile.north) && (!c.type)) {
				cv.strokeStyle = '#FF3300';        // set color red
				cv.fillStyle = '#FF3300';
				cv.globalAlpha = 1;
				cv.beginPath();
				cv.moveTo(l+(brd.ss/2), t+(brd.ss*.9));
				cv.lineTo(l+(brd.ss*.65), t+(brd.ss*.7));
				cv.lineTo(l+(brd.ss*.35), t+(brd.ss*.7));
				cv.closePath();
				cv.fill();
				this.south = 1;
				cv.strokeStyle = '#FF9900';        // set color yellow
				cv.fillStyle = '#FF9900';
				cv.globalAlpha = 0.4;
			}
		}
		// if west move is ok- west cell [exists] and [is empty or vert line]
		if ((c.col > 1) && ((this.b.cell[c.row-1][c.col-2].type == 0) || (this.b.cell[c.row-1][c.col-2].type == 5))) {
			var canCross = false;
			for (i = (c.col-2); i > -1; i--) {
				if (brd.cell[c.row-1][i].type == 0) canCross = true;
				if ((brd.cell[c.row-1][i].type < 5) && (!canCross)) i = -1;
			}
			if (canCross) {
				cv.beginPath();
				cv.moveTo(l+(brd.ss*.1), t+(brd.ss/2));
				cv.lineTo(l+(brd.ss*.3), t+(brd.ss*.35));
				cv.lineTo(l+(brd.ss*.3), t+(brd.ss*.65));
				cv.closePath();
				cv.fill();
				this.west = 1;
			}
		} else this.west = 0;
		// if west cell is start cell
		if (c.col > 1) {
			if ((this.numMoves > 1) && (brd.cell[c.row-1][c.col-2] != this.thisMove.cell)
			&& (brd.cell[c.row-1][c.col-2].tile.east) && (!c.type)) {
				cv.strokeStyle = '#FF3300';        // set color red
				cv.fillStyle = '#FF3300';
				cv.globalAlpha = 1;
				cv.beginPath();
				cv.moveTo(l+(brd.ss*.1), t+(brd.ss/2));
				cv.lineTo(l+(brd.ss*.3), t+(brd.ss*.35));
				cv.lineTo(l+(brd.ss*.3), t+(brd.ss*.65));
				cv.closePath();
				cv.fill();
				this.west = 1;
				cv.strokeStyle = '#FF9900';        // set color yellow
				cv.fillStyle = '#FF9900';
				cv.globalAlpha = 0.4;
			}
		}
		cv.strokeStyle = '#000000';
		cv.fillStyle = '#000000';
		cv.globalAlpha = 1;
		
		// TRAPPED! No possible moves, must backtrack
		if (!(this.north + this.east + this.south + this.west)) {
			var delay;
			cv.strokeStyle = '#FF3300';        // set color red
			cv.fillStyle = '#FF3300';
			cv.globalAlpha = .5;
			cv.fillRect(l+1, t+1, (brd.ss-2), (brd.ss-2));     // flash red TRAPPED! cell
			cv.fillStyle = "#000000";
			cv.strokeStyle = "#000000";
		}
	}
}

// TurboBuild.move(direction) takes a numeric direction argument
// (1 - east, 2 - south, 3 - west, 4 - north, 5 - backspace) and executes a move in that direction,
// including placement of the appropriate tile, updating
// the TurboBuild.moves[] move history stack, and calling TurboBuild.markNext()
// to reposition TurboBuild cursor.
TurboBuild.prototype.move = function(dir) {
	var tp;                    // holds tile-piece type
	var complete = false;     
	var nm = this.nextMove;    // this is the Cell that will be "placed" 
	var valid = false;         
	
	if (dir < 5) {								// IF MOVE IS A FORWARD MOVE			
		if (!this.lastDir) this.lastDir = dir;	       // if this is the first move, set TurboBuild.lastDir
		this.thisMove = new Move(this.nextMove);       // create new Move object
	}
	
	
	// Manage individual direction cases
	switch (dir) {
		
		case 0: break;
		// case east
		case 1: {
		
			if (this.east) {         // check if valid
				valid = true;
				// an east move will be either a hoz line, swCorner, or nwCorner depending on last dir
				if (this.lastDir == 1) tp = 6;    // set hoz line    
				if (this.lastDir == 2) tp = 3;    // set swCorner       
				if (this.lastDir == 4) tp = 4;    // set nwCorner
				// set TurboBuild.nextMove for one cell to the east
				this.nextMove = brd.cell[this.thisMove.cell.row-1][this.thisMove.cell.col];
				// if there was already a tile here, it must be a vert line, so place undercrossing
				if (this.thisMove.cell.type) tp = 8;
				// recognize circuit complete
				if ( (this.nextMove.tile.west) ) complete = true;
			}
			break;
		}
		// case south
		case 2: {
			if (this.south) {
				valid = true;
				// a south east move will be either a vert line, neCorner, or nwCorner depending on last dir
				if (this.lastDir == 2) tp = 5;    // set vert line
				if (this.lastDir == 1) tp = 1;    // set neCorner
				if (this.lastDir == 3) tp = 4;    // set nwCorner
				// set TurboBuild.nextMove for one cell to the south
				this.nextMove = this.b.cell[this.thisMove.cell.row][this.thisMove.cell.col-1];
				// if there was already a tile here, it must be a hoz line, so place overcrossing
				if (this.thisMove.cell.type) tp = 7;
				// recognize circuit complete
				if ((this.nextMove.tile.north)) complete = true;
			}
			break;
		}
		// case west
		case 3: {
			if (this.west) {
				valid = true;
				// a west move will be either a hoz line, seCorner, or neCorner depending on last dir
				if (this.lastDir == 3) tp = 6;    // set hoz line
				if (this.lastDir == 2) tp = 2;    // set seCorner
				if (this.lastDir == 4) tp = 1;    // set neCorner
				// set TurboBuild.nextMove for one cell to the west
				this.nextMove = this.b.cell[this.thisMove.cell.row-1][this.thisMove.cell.col-2];
				// if there was already a tile here, it must be a vert line, so place undercrossing
				if (this.thisMove.cell.type) tp = 8;
				// recognize circuit complete
				if ((this.nextMove.tile.east)) complete = true;
			}
			break;
		}
		// case north
		case 4: {
			if (this.north) {
				valid = true;
				// a north move will be either a vert line, seCorner, or swCorner depending on last dir
				if (this.lastDir == 4) tp = 5;    // set vert line
				if (this.lastDir == 1) tp = 2;    // set seCorner
				if (this.lastDir == 3) tp = 3;    // set swCorner
				// set TurboBuild.nextMove for one cell to the north
				this.nextMove = this.b.cell[this.thisMove.cell.row-2][this.thisMove.cell.col-1];
				// if there was already a tile here, it must be a hoz line, so place overcrossing
				if (this.thisMove.cell.type) tp = 7;
				// recognize circuit complete
				if ((this.nextMove.tile.south)) complete = true;
			}
			break;
		}
		// case backspace
		case 5: {
			// IF there are moves in history to be undone
			if (this.numMoves > 0) {
				if (!this.nextMove.type) this.nextMove.clear();      // erase square containing previous cursor (if otherwise onoccupied)
				var pop = this.moves.pop();           // var pop gets last move, popped from stack               
				this.nextMove = pop.cell;    //.nextMove is a Cell object
				this.numMoves--;        // decrement moves counter
				
				this.north = this.thisMove.north;         
				this.east = this.thisMove.east;
				this.south = this.thisMove.south;
				this.west = this.thisMove.west;
				
				if (this.numMoves > 0) {				// !!!
					this.thisMove = this.moves[this.numMoves-1];    //.thisMove is a Move object
					this.lastDir = pop.lastDir;
				}
				
				if (this.nextMove.type > 6) {
					if ((this.lastDir == 1) || (this.lastDir == 3)) this.nextMove.plot(5);
					else if ((this.lastDir == 2) || (this.lastDir == 4)) this.nextMove.plot(6);
				} else this.nextMove.plot(0);
				
				brd.turboNext = this.nextMove;
				//brd.draw();
				
				if (this.numMoves == 0) {
					this.lastDir = 0;
					//this.nextMove = this.startCell;
					this.thisMove = null;
					brd.draw();
				} else {
					brd.setSelect(this.thisMove.cell);
					brd.drawSelect();
				}
			}
		}
	}
	
	if (valid) {
		this.numMoves++;
		this.thisMove.cell.plot(tp);
		this.thisMove.north = this.north;
		this.thisMove.east = this.east;
		this.thisMove.south = this.south;
		this.thisMove.west = this.west;
		this.thisMove.nextMove = this.nextMove;
		this.thisMove.thisMove = this.thisMove;
		this.thisMove.lastDir = this.lastDir;
		this.moves.push(this.thisMove);
		this.lastDir = dir;
		if (complete) this.completeCircuit(this.thisMove.cell);
		else {
			brd.setSelect(this.thisMove.cell);
			brd.drawSelect();
			this.markNext(this.nextMove);
			brd.turboNext = this.nextMove;
		}
	}
}

TurboBuild.prototype.edgeFind = function(c) {
	
	
	var count = 0;
	var tiles = new Array();	
	var tileNum = 0;
	var temp, index;
	var dir = 0;
	var ce;
	
	
	// Count adjoining occupied squares
	// 'ce' will be set to the last one counted
	if ((c.row > 1) && brd.cell[c.row-2][c.col-1].type) {
		ce = brd.cell[c.row-2][c.col-1];
		count++;
	}
	if ((c.row < (brd.h-1)) && brd.cell[c.row][c.col-1].type) {
		ce = brd.cell[c.row][c.col-1];
		count++;
	}
	if ((c.col > 1) && brd.cell[c.row-1][c.col-2].type) {
		ce = brd.cell[c.row-1][c.col-2];
		count++;
	}
	if ((c.col < (brd.w-1)) && brd.cell[c.row-1][c.col].type) {
		ce = brd.cell[c.row-1][c.col];
		count++;
	}
	
	if ((count < 2) && ce) this.tryPickup(c, ce);    // no ambiguity, we'll try to pick up on it
	
	count = 0;
	
	if ((c.row > 1)  && brd.cell[c.row-2][c.col-1]) {
		ce = brd.cell[c.row-2][c.col-1];
		if ((ce.type)  && (ce.tile.south)) {
			temp = brd.cell[c.row-2][c.col-1]; 
			count++;
			dir = 4;
		}
	}
	if ((c.row < (brd.h-1)) && brd.cell[c.row][c.col-1]) {
		ce = brd.cell[c.row][c.col-1];
		if ((ce.type) && (ce.tile.north)) {
			temp = brd.cell[c.row][c.col-1]; 
			count++;
			dir = 2;
		}
	}
	if ((c.col > 1) && brd.cell[c.row-1][c.col-2]) {
		ce = brd.cell[c.row-1][c.col-2];
		if ((ce.type) && (ce.tile.east)) {
			temp = brd.cell[c.row-1][c.col-2];
			count++;
			dir = 3;
		}
	}
	if ((c.col < (brd.w-1)) && brd.cell[c.row-1][c.col]) {
		ce = brd.cell[c.row-1][c.col];
		if ((ce.type) && (ce.tile.west)) {
			temp = brd.cell[c.row-1][c.col];
			count++;
			dir = 1;
		}
	}
	
	if (count == 1) {
		
		while (temp && temp.type) {
				
			
				tiles[tileNum] = new Move(temp);
				tiles[tileNum].lastDir = dir;
				tiles[tileNum].thisMove =  temp;
			
				switch (temp.type) {
			
					case 1 :  
								if (dir == 1) {
									if (tiles[tileNum].cell.row < (canvas.height/brd.ss)) {
										if (brd.cell[tiles[tileNum].cell.row][tiles[tileNum].cell.col-1].type) {
												temp = brd.cell[tiles[tileNum].cell.row][tiles[tileNum].cell.col-1];
												dir = 2;
										} else temp = null;
									} else temp = null;
								} else if (dir == 4) {
									if (tiles[tileNum].cell.col > 1) {
										if (brd.cell[tiles[tileNum].cell.row-1][tiles[tileNum].cell.col-2].type) {
												temp = brd.cell[tiles[tileNum].cell.row-1][tiles[tileNum].cell.col-2];
												dir = 3;
										} else temp = null;
									} else temp = null;
								 } else temp = null;
								 break;
								 
					case 2 :
								if (dir == 1) {
									if (tiles[tileNum].cell.row > 1) {
										if (brd.cell[tiles[tileNum].cell.row-2][tiles[tileNum].cell.col-1].type) {
												temp = brd.cell[tiles[tileNum].cell.row-2][tiles[tileNum].cell.col-1];
												dir = 4;
										} else temp = null;
									} else temp = null;
								} else if (dir == 2) {
									if (tiles[tileNum].cell.col > 1) {
										if (brd.cell[tiles[tileNum].cell.row-1][tiles[tileNum].cell.col-2].type) {
												temp = brd.cell[tiles[tileNum].cell.row-1][tiles[tileNum].cell.col-2];
												dir = 3;
										} else temp = null;
									} else temp = null;
								 } else temp = null;
								 break;
								 
					case 3 :
								if (dir == 2) {
									if (tiles[tileNum].cell.col < (canvas.width/brd.ss)) {
										if (brd.cell[tiles[tileNum].cell.row-1][tiles[tileNum].cell.col].type) {
												temp = brd.cell[tiles[tileNum].cell.row-1][tiles[tileNum].cell.col];
												dir = 1;
										} else temp = null;
									} else temp = null;
								} else if (dir == 3) {
									if (tiles[tileNum].cell.row > 1) {
										if (brd.cell[tiles[tileNum].cell.row-2][tiles[tileNum].cell.col-1].type) {
												temp = brd.cell[tiles[tileNum].cell.row-2][tiles[tileNum].cell.col-1];
												dir = 4;
										} else temp = null;
									} else temp = null;
								 } else temp = null;
								 break;

					case 4 :
								if (dir == 3) {
									if (tiles[tileNum].cell.row < (canvas.height/brd.ss)) {
										if (brd.cell[tiles[tileNum].cell.row][tiles[tileNum].cell.col-1].type) {
												temp = brd.cell[tiles[tileNum].cell.row][tiles[tileNum].cell.col-1];
												dir = 2;
										} else temp = null;
									} else temp = null;
								} else if (dir == 4) {
									if (tiles[tileNum].cell.col < (canvas.width/brd.ss)) {
										if (brd.cell[tiles[tileNum].cell.row-1][tiles[tileNum].cell.col].type) {
												temp = brd.cell[tiles[tileNum].cell.row-1][tiles[tileNum].cell.col];
												dir = 1;
										} else temp = null;
									}  else temp = null;
								 } else temp = null;
								 break;
								 
					case 5 :
								if (dir == 2) {
									if (tiles[tileNum].cell.row < (canvas.height/brd.ss)) {
										if (brd.cell[tiles[tileNum].cell.row][tiles[tileNum].cell.col-1].type) {
												temp = brd.cell[tiles[tileNum].cell.row][tiles[tileNum].cell.col-1];
										} else temp = null;
									} else temp = null;
								} else if (dir == 4) {
									if (tiles[tileNum].cell.row > 1) {
										if (brd.cell[tiles[tileNum].cell.row-2][tiles[tileNum].cell.col-1].type) {
												temp = brd.cell[tiles[tileNum].cell.row-2][tiles[tileNum].cell.col-1];
										} else temp = null;
									} else temp = null;
								 } else temp = null;
								 break; 
					
					case 6 :
								if (dir == 1) {
									if (tiles[tileNum].cell.col < (canvas.width/brd.ss)) {
										if (brd.cell[tiles[tileNum].cell.row-1][tiles[tileNum].cell.col].type) {
												temp = brd.cell[tiles[tileNum].cell.row-1][tiles[tileNum].cell.col];
										} else temp = null;
									} else temp = null;
								} else if (dir == 3) {
									if (tiles[tileNum].cell.col > 1) {
										if (brd.cell[tiles[tileNum].cell.row-1][tiles[tileNum].cell.col-2].type) {
												temp = brd.cell[tiles[tileNum].cell.row-1][tiles[tileNum].cell.col-2];
										} else temp = null;
									} else temp = null;
								 } else temp = null;
								 break; 
					case 7 :
					case 8 :
								if (dir == 1) {
									if (tiles[tileNum].cell.col < (canvas.width/brd.ss)) {
										if (brd.cell[tiles[tileNum].cell.row-1][tiles[tileNum].cell.col].type) {
												temp = brd.cell[tiles[tileNum].cell.row-1][tiles[tileNum].cell.col];
										} else temp = null;
									} else temp = null;
								}
								
								if (dir == 2) {
									if (tiles[tileNum].cell.row < (canvas.height/brd.ss)) {
										if (brd.cell[tiles[tileNum].cell.row][tiles[tileNum].cell.col-1].type) {
												temp = brd.cell[tiles[tileNum].cell.row][tiles[tileNum].cell.col-1];
										} else temp = null;
									} else temp = null;
								}
								if (dir == 3) {
									if (tiles[tileNum].cell.col > 1) {
										if (brd.cell[tiles[tileNum].cell.row-1][tiles[tileNum].cell.col-2].type) {
												temp = brd.cell[tiles[tileNum].cell.row-1][tiles[tileNum].cell.col-2];
										} else temp = null;
									} else temp = null;
								 }
								if (dir == 4) {
									if (tiles[tileNum].cell.row > 1) {
										if (brd.cell[tiles[tileNum].cell.row-2][tiles[tileNum].cell.col-1].type) {
												temp = brd.cell[tiles[tileNum].cell.row-2][tiles[tileNum].cell.col-1];
										} else temp = null;
									} else temp = null;
								 }
								 break; 	
				}
				
		tiles[tileNum].nextMove = temp;
		tileNum++;		
		}
		
		tiles.reverse();                                          // reverse array
		this.moves = tiles;
		this.numMoves = this.moves.length;
		this.startCell = this.moves[0].cell;                          // set startCell to first element
		this.nextMove = c;   												// set nextMove to current cell
		this.moveAdded = false;
		brd.turboNext = this.nextMove;                                   // set next move on board object
		this.thisMove = this.moves[(this.numMoves-1)];            	// Type Move, last square actually plotted w/ environment
		for (index = 0; index < this.numMoves; index++) {
			this.moves[index].lastDir = ((this.moves[index].lastDir+2)%4);
			if(!this.moves[index].lastDir) this.moves[index].lastDir = 4;
			if (index < (this.numMoves - 1)) this.moves[index].nextMove = this.moves[index+1].cell;  
		}
		this.lastDir =  this.moves[this.numMoves-1].lastDir;
		
		brd.setSelect(this.thisMove.cell);
		brd.drawSelect();
		this.markNext(c);
		this.dormant = false;	
	} else if ((count == 2) || (count == 4)) {
		brd.cell[c.row-1][c.col-1].plot(this.autoFill(c));
		var a = new Analysis(brd);
		if (a.isValid()) {
			if (brd.strucCreated) {
					var str = "No.";
					if (a.tricolorable) str = "Yes.";
					
					brd.disPane.add("Valid structure created.</br></br>");
					brd.disPane.add("Number of crossings: " + a.crossingNum + "</br>");
					brd.disPane.add("Tricolorable: " + str + "</br></br>");
					brd.disPane.add("Dowker notation:</br>" + a.extractDowkers() + "</br></br>");
			} else brd.disPane.add("Unknot created.</br></br>");
		}
	} else if (count == 3) brd.cell[c.row-1][c.col-1].plot(this.autoFill(c));
}


TurboBuild.prototype.tryPickup = function(c, ce) {   // c = where we are, ce = cell we are trying to grab
	
			var ret = ce.type;
			var index;
			var dist = c.row - ce.row;
			
			// WE ARE IN THE SAME COLUMN ABOVE OR BELOW AN END SQUARE
			if ((Math.abs(dist) == 1) && (c.col == ce.col)) {            
				
				if (dist == -1) {
					if ((ce.col > 1) && (ce.col < brd.w-1) && (brd.cell[ce.row-1][ce.col-2].tile.east) && (!brd.cell[ce.row-1][ce.col].type)) {               // we are above
						//this.tempTile = brd.tilePics[2];
						ret = 2;
						//ce.plot(ret);
					} else if ((ce.col > 1) && (ce.col < brd.w-1) && (brd.cell[ce.row-1][ce.col].tile.west) && (!brd.cell[ce.row-1][ce.col-2].type)) {
						//this.tempTile = brd.tilePics[3];
						ret = 3;
						//ce.plot(ret);
					}  else if ((ce.row > 1) && (ce.row < brd.h-1) && (brd.cell[ce.row][ce.col-1].tile.north) && (brd.cell[ce.row-2][ce.col-1] == c)) {
						//this.tempTile = brd.tilePics[5];
						ret = 5;
					}
					this.lastDir = 4;
				} else {                                                   // we are below
					if ((ce.col > 1) && (ce.col < brd.w-1) && (brd.cell[ce.row-1][ce.col-2].tile.east) && (!brd.cell[ce.row-1][ce.col].type)) {
						//this.tempTile = brd.tilePics[1];
						ret = 1;
						//ce.plot(ret);
					} else if ((ce.col > 1) && (ce.col < brd.w-1) && (brd.cell[ce.row-1][ce.col].tile.west) && (!brd.cell[ce.row-1][ce.col-2].type)) {
						//this.tempTile = brd.tilePics[4];
						ret = 4;
						//ce.plot(ret);
					}  else if ((ce.row > 1) && (ce.row < brd.h-1) && (brd.cell[ce.row-2][ce.col-1].tile.south) && (brd.cell[ce.row][ce.col-1] == c)) {
						//this.tempTile = brd.tilePics[5];
						ret = 5;
						//ce.plot(ret);
					}
					this.lastDir = 2;
				}

			} else {
				
				dist = (c.col - ce.col);      
			
				if ((Math.abs(dist) == 1) && (c.row == ce.row)) {   //////////////////    WE ARE IN THE SAME ROW TO THE LEFT OR RIGHT OF AN END SQUARE

						if (dist == -1) {                                      // we are to the left
							if ((ce.row > 1) && (ce.row < brd.h-1) && (brd.cell[ce.row-2][ce.col-1].tile.south) && (!brd.cell[ce.row][ce.col-1].type)) {    // last dir = 2
								//this.tempTile = brd.tilePics[2];
								ret = 2;
								//ce.plot(ret);
							} else if ((ce.row > 1) && (ce.row < brd.h-1) && (brd.cell[ce.row][ce.col-1].tile.north) && (!brd.cell[ce.row-2][ce.col-1].type))  {   // last dir = 4
								//this.tempTile = brd.tilePics[1];
								ret = 1;
								//ce.plot(ret);
							} else if ((ce.col > 1) && (ce.col < brd.w-1) && (brd.cell[ce.row-1][ce.col].tile.west) && (brd.cell[ce.row-1][ce.col-2] == c)) {    // last dir = 3
								//this.tempTile = brd.tilePics[6];
								ret = 6;
								//ce.plot(ret);
							}
							this.lastDir = 3;
						} else {                                              // we are to the right
							if ((ce.row > 1) && (ce.row < brd.h-1) && (brd.cell[ce.row][ce.col-1].tile.north) && (!brd.cell[ce.row-2][ce.col-1].type)) {       // last dir = 4
								//this.tempTile = brd.tilePics[4];
								ret  = 4;
								//ce.plot(ret);
							} else if ((ce.row > 1) && (ce.row < brd.h-1) && (brd.cell[ce.row-2][ce.col-1].tile.south) && (!brd.cell[ce.row][ce.col-1].type))  {        // last dir = 2
								//this.tempTile = brd.tilePics[3];
								ret = 3;
								//ce.plot(ret);
							} else if ((ce.col > 1) && (ce.col < brd.w-1) && (brd.cell[ce.row-1][ce.col-2].tile.east) && (brd.cell[ce.row-1][ce.col] == c)) {    // last dir = 1
								//this.tempTile = brd.tilePics[6];
								ret = 6;
								//ce.plot(ret);
							}
							this.lastDir = 1;
						}			
					
				} 
			}

			if (ce.type < 7) ce.plot(ret);
			brd.draw();
			return ret;
}




TurboBuild.prototype.completeCircuit = function (c){
	
	
	brd.turboNext = null;
	brd.setSelect(c);
	brd.drawSelect();
	this.dormant = true;
	
	var a = new Analysis(brd);
	
	if (a.isValid()) {
			if (brd.strucCreated) {
					
					var str = "No.";
					if (a.tricolorable) str = "Yes.";
							
					brd.disPane.add("Valid structure created.</br></br>");
					brd.disPane.add("Number of crossings: " + a.crossingNum + "</br>");
					brd.disPane.add("Tricolorable: " + str + "</br></br>");
					brd.disPane.add("Dowker notation:</br>" + a.extractDowkers() + "</br></br>");
			} else brd.disPane.add("Unknot created.</br></br>");
	}
}

TurboBuild.prototype.autoFill = function (c) {
	
	var n,s,e,w;
	n = s = e = w = false;
	var count = 0;
	var type;
	
	if (!c.type) {

		if ((c.row > 1) && brd.cell[c.row-2][c.col-1].type && brd.cell[c.row-2][c.col-1].tile.south) {
			n = true;
			count++;
		}
		if((c.row < ((canvas.height/brd.ss)-1)) && brd.cell[c.row][c.col-1].type && brd.cell[c.row][c.col-1].tile.north) {
			s = true;
			count++;
		}
		if ((c.col > 1) && brd.cell[c.row-1][c.col-2].type && brd.cell[c.row-1][c.col-2].tile.east) {
			w = true;
			count++;
		}
		if((c.col < ((canvas.width/brd.ss) - 1)) && brd.cell[c.row-1][c.col].type && brd.cell[c.row-1][c.col].tile.west) {
			e = true;
			count++;
		}
		
		if (n && e && s && w) type = 7;
		else if (count == 3) {
			if (n && s) type = 5;
			else if (e && w) type = 6;	
		} else {
			if (n && e) type = 3;
			if (n && s) type = 5;
			if (n && w) type = 2;
			if (e && s) type = 4;
			if (e && w) type = 6;
			if (s && w) type = 1;
		}
		
		return type;	
	}	
}


//-----------------------------------------------------------------------------------------------------
//
//     	Move class
//
//      Represents the environment in each cell during TurboBuild
//
//-----------------------------------------------------------------------------------------------------

function Move (cell) {
	
	this.cell = cell;         
	this.north = 0;       //
	this.east = 0;        //     Legality (bool) of a move in each direction
	this.south = 0;       //
	this.west = 0;        //
	this.nextMove = null;
	this.thisMove = null;
	this.lastDir = 0;     //      Direction travelled to enter current cell
	
}

//------------------------------------------------------------------------------------------------------



//------------------------------------------------------------------------------------------------------

function BoardCapture(b) {
	this.numCells = 0;
	this.cells = new Array(b.w * b.h);	
	
	var x, y;
	for (x = 0; x < b.h; x++) {
		for (y = 0; y < b.w; y++) {
			if (b.cell[x][y].type) {
				this.cells[this.numCells] = new SquareSave((y+1),(x+1),b.cell[x][y].type);
				this.numCells++;
			}
		}
	}
}

function SquareSave(r, c, t) {
	this.row = r;
	this.col = c;
	this.type = t;
}

//------------------------------------------------------------------------------------------------------

function SelectStruc() {
	this.selectList = new Array();
	this.numSelected = 0;
}

SelectStruc.prototype.isSelected = function(cel){
	var tf = false;
	var index;
	for (index = 0; (index < this.numSelected) && (!tf); index++) {
		if (this.selectList[index] == cel) tf = true;
	}
	return tf;	
}

SelectStruc.prototype.remove = function(cel){
	var newList = new Array();
	var newIndex = 0;
	var index;
	for (index = 0; index < this.numSelected; index++) {
		if (!(this.selectList[index] == cel)) {
			newList[newIndex++] = this.selectList[index];	
		} else {
			var subIndex;
			for (subIndex = (index + 1); subIndex < this.numSelected; subIndex++) {
				newList[newIndex++] = this.selectList[subIndex];
			}
			index = this.numSelected--;
			this.selectList = newList;
		}			
	}
}


function XOR(a,b) {
  return ( a || b ) && !( a && b );
}

var brd = new Board(30);







