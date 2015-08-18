//------------------------------------------------------------------------------------------------------
//
//  Analysis Class
//  An instance of the Analysis class is instantiated by the user after constructing a knot.
//  It runs a couple checks for validity, 
//
//------------------------------------------------------------------------------------------------------


function Analysis(b){
	this.board = b;
	this.NWCorner = null;
	this.crossingNum = null;
	this.crossings = new Array(b.h * b.w);
	this.segments = new Array(b.h * b.w);
	this.tricolorable = false;
	this.unknot = false;
	
	brd.strucCreated = false;
	
	if (this.isValid()) {
		this.NWCorner = this.findFirstCorner();
		this.findCrossings();
		if (this.crossingNum){
			this.connectCells(this.board);
			this.traverse(this.NWCorner);
			brd.strucCreated = true;
			if (brd.regset.playing && this.tricolorable) for (var ix in this.segments) this.segments[ix].drawColor();
		}
	}
}

Analysis.prototype.findCrossIndex = function(c){
	
	var x = 0;
	var cr = null;
	while (x < this.crossingNum){
		if (this.crossings[x].isMe(c)) {cr = x;}
		x++;
	}
	return cr;
	
	/*
	var cr = this.crossings.indexOf(c);
	alert((cr > -1)? --cr:null);
	return (cr > -1)? --cr:null;
	*/
}

Analysis.prototype.isValid = function(){
	var valid = true;	
	for (i=0; i < this.board.h; i++) {
		for (j=0; j < this.board.w; j++) {
			if (this.board.cell[i][j].type) {
				if (this.board.cell[i][j].tile.north) {
					if ((i == 0) || (!this.board.cell[i-1][j].type)) valid = false;
					else if (this.board.cell[i-1][j].tile.south == 0)  valid = false;
				}
				if (this.board.cell[i][j].tile.east) {
					if ((j == (this.board.w - 1)) || (!this.board.cell[i][j+1].type)) valid = false;
					else if (this.board.cell[i][j+1].tile.west == 0) valid = false;
				}
				if (this.board.cell[i][j].tile.south) {
					if ((i == (this.board.h - 1)) || (!this.board.cell[i+1][j].type)) valid = false;
					else if (this.board.cell[i+1][j].tile.north == 0) valid = false;
				}
				if (this.board.cell[i][j].tile.west) {
					if ((j == 0) || (!this.board.cell[i][j-1].type)) valid = false;
					else if (this.board.cell[i][j-1].tile.east == 0) valid = false;
				}
			}
		}
	}		
	return valid;
}

Analysis.prototype.findFirstCorner = function() {
	var c = null;
	for (i = 0; (!c && (i < brd.h)); i++){
		for (j = 0; (!c && (j < brd.w)); j++) {
			if (brd.cell[i][j].type) c = brd.cell[i][j];
		}
	}
	//brd.setSelect(c);
	//brd.drawSelect();
	return c;
}

Analysis.prototype.findCrossings = function() {
	var count = 0;
	for (i = 0; i < this.board.h; i++){
		for (j = 0; j < this.board.w; j++) {
			if ((this.board.cell[i][j].type == 7) || (this.board.cell[i][j].type == 8)) {
				this.crossings[count] = new SuperCrossing(this.board.cell[i][j]);
				count++;
			}
		}
	}	
	this.crossingNum = count;
}

Analysis.prototype.connectCells = function(b) {
		for (i = 0; i < b.h; i++){
			for (j = 0; j < b.w; j++) {
					var c = b.cell[i][j];
				    var t = c.type;
					if (t == 0) {
						c.nConnect = 
						c.eConnect =
						c.wConnect = 
						c.sConnect = null;
					} else if (t < 5) {
						if (t == 1) {c.nConnect = null;
									c.eConnect = null;
									c.wConnect = b.cell[i][j-1];
									c.sConnect = b.cell[i+1][j];
						} else if (t == 2) {c.nConnect = b.cell[i-1][j];
											c.eConnect = null;
											c.wConnect = b.cell[i][j-1];
											c.sConnect = null;
						} else if (t == 3) {c.nConnect = b.cell[i-1][j];
											c.eConnect = b.cell[i][j+1];
											c.wConnect = null;
											c.sConnect = null;
						} else {c.nConnect = null;
								c.eConnect = b.cell[i][j+1];
								c.wConnect = null;
								c.sConnect = b.cell[i+1][j];} 
					} else if (t < 7) {
							if (t == 5) {c.nConnect = b.cell[i-1][j];
										c.eConnect = null;
										c.wConnect = null;
										c.sConnect = b.cell[i+1][j];}
									else if (t == 6) {c.nConnect = null;
										c.eConnect = b.cell[i][j+1];
										c.wConnect = b.cell[i][j-1];
										c.sConnect = null;}
					} else if (t < 9) {
								c.nConnect = b.cell[i-1][j];
								c.eConnect = b.cell[i][j+1];
								c.wConnect = b.cell[i][j-1];
								c.sConnect = b.cell[i+1][j];}
			}
		}
}

Analysis.prototype.extractDowkers = function() {
	var n, x = 0;
	var st = "";
	while (x < this.crossingNum) {
		n = (x*2)+1;
		for (i = 0; i <= (this.crossingNum-1); i++) {
			if (this.crossings[i].oddDowker == n) st += (this.crossings[i].evenDowker + "    ");	
		}
		x++;
	}
	return st;
}

Analysis.prototype.traverse = function(c) {
	var currentSeg = 0;
	var dowkers = 1;
	var start = null;
	var newCross;
	var lastCross;
	var current = c;
	var next = c.sConnect;
	while (!(((next.type == 7) && ((next.eConnect == current)||(next.wConnect == current))) ||
			((next.type == 8) && ((next.nConnect == current)||(next.sConnect == current))))) {

		switch (next.type) {
			case 1: if (next.wConnect == current) {current = next;
													next = current.sConnect;}
						else {current = next; next = current.wConnect;} break;
			case 2: if (next.wConnect == current) {current = next;
													next = current.nConnect;}
						else {current = next; next = current.wConnect;} break;
			case 3: if (next.nConnect == current) {current = next;
													next = current.eConnect;}
						else {current = next; next = current.nConnect;} break;
			case 4: if (next.sConnect == current) {current = next;
													next = current.eConnect;}
						else {current = next; next = current.sConnect;} break;
			case 5: if (next.sConnect == current) {current = next;
													next = current.nConnect;}
						else {current = next; next = current.sConnect;} break;
			case 6: if (next.eConnect == current) {current = next;
															  next = current.wConnect;}
						else {current = next; next = current.eConnect;} break;
			case 7:
			case 8: //alert ("hit crossing");
					if (next.eConnect == current) {current = next;
													next = current.wConnect;}
						else if (next.nConnect == current){current = next;
													next = current.sConnect;}
						else if (next.wConnect == current){current = next;
													next = current.eConnect;}
						else {current = next;
								next = current.nConnect;}
		}
	}
	var temp = current;
	current = next;
	next = temp;
	start = current;
	newCross = this.findCrossIndex(this.board.cell[start.row-1][start.col-1]);
	this.crossings[newCross].placeDowker(dowkers);
	dowkers++;
	
	this.segments[currentSeg] = new Segment(this.crossings[newCross], currentSeg);
	if ((next.wConnect == current)||(next.nConnect == current)) this.crossings[newCross].seSeg = this.segments[currentSeg];
	else this.crossings[newCross].nwSeg = this.segments[currentSeg];                            // assign '0' to first segment of super-crossing
	
	while (currentSeg < this.crossingNum) {
		
		// Add inside tiles (superlines/corners) to segment, increment 
		if (next.type < 5) {this.segments[currentSeg].insideTiles[(this.segments[currentSeg].numElements-1)] = new SuperCorner(next, currentSeg);
								//alert ("assigning to seg " + currentSeg + " insideTiles[" + (this.segments[currentSeg].numElements-1) + "]");
								this.segments[currentSeg].numElements++;}
		else if (next.type < 7) {this.segments[currentSeg].insideTiles[(this.segments[currentSeg].numElements-1)] = new SuperLine(next, currentSeg);
									//alert ("assigning to seg " + currentSeg + " insideTiles[" + (this.segments[currentSeg].numElements-1) + "]");
									this.segments[currentSeg].numElements++;}      
									
		switch (next.type) {
			case 1: if (next.wConnect == current) {current = next;
													next = current.sConnect;}
						else {current = next; next = current.wConnect;} break;
			case 2: if (next.wConnect == current) {current = next;
													next = current.nConnect;}
						else {current = next; next = current.wConnect;} break;
			case 3: if (next.nConnect == current) {current = next;
													next = current.eConnect;}
						else {current = next; next = current.nConnect;} break;
			case 4: if (next.sConnect == current) {current = next;
													next = current.eConnect;}
						else {current = next; next = current.sConnect;} break;
			case 5: if (next.sConnect == current) {current = next;
													next = current.nConnect;}
						else {current = next; next = current.sConnect;} break;
			case 6: if (next.eConnect == current) {current = next;
															  next = current.wConnect;}
						else {current = next; next = current.eConnect;} break;
			case 7: 
			case 8: { 
					lastCross = newCross;
					newCross = this.findCrossIndex(this.board.cell[next.row-1][next.col-1]);
						
					if (this.crossings[lastCross].nwSeg == currentSeg) {                  //if we got here through a n or w segment
						if (this.crossings[lastCross].type == 7) this.crossings[lastCross].westDest = this.crossings[newCross];        // if it's an overcrossing than set west
						else this.crossings[lastCross].northDest = this.crossings[newCross];                                     // if undercrossing than set north
					} else if (this.crossings[lastCross].seSeg == currentSeg) {
						if (this.crossings[lastCross].type == 7) this.crossings[lastCross].eastDest = this.crossings[newCross];       //else 
						else this.crossings[lastCross].southDest = this.crossings[newCross];
					}
						
					//this.crossings[newCross].placeDowker(dowkers);            // add dowker # to supercrossing
					//dowkers++;
						
					//segs
					if (next.eConnect == current) {	
						this.crossings[newCross].eastDest = this.crossings[lastCross];
						this.crossings[newCross].westDest = 1;
						current = next;
						next = current.wConnect;             // step thru east to west
						if (current.type == 7) {
							this.crossings[newCross].seSeg = this.segments[currentSeg];  // if overcrossing increment segment
							this.segments[currentSeg].upperBound = this.crossings[newCross];
							this.segments[currentSeg].numElements++;
							
							for (i = 0; i < (this.segments[currentSeg].numElements - 2); i++) {
								if (this.segments[currentSeg].insideTiles[i].type > 6) {
									if (this.segments[currentSeg].insideTiles[i].type == 7) {
										if (this.segments[currentSeg].insideTiles[i].northDest == this.segments[currentSeg].lowerBound) {
											this.segments[currentSeg].insideTiles[i].southDest = this.segments[currentSeg].upperBound;
										} else {
											this.segments[currentSeg].insideTiles[i].northDest = this.segments[currentSeg].upperBound;
										}
									} else {
										if (this.segments[currentSeg].insideTiles[i].eastDest == this.segments[currentSeg].lowerBound) {
											this.segments[currentSeg].insideTiles[i].westDest = this.segments[currentSeg].upperBound;
										} else {
											this.segments[currentSeg].insideTiles[i].eastDest = this.segments[currentSeg].upperBound;
										}
									}
								}
							}
																									
							////alert("ending segment (block a)");
							currentSeg++;
							if (currentSeg < this.crossingNum) {   // init undiscovered segment
								////alert("beginning segment  " + currentSeg);
								this.segments[currentSeg] = new Segment(this.crossings[newCross], currentSeg);
								this.crossings[newCross].nwSeg = this.segments[currentSeg];
							}
						} else {
							this.crossings[newCross].overSeg = this.segments[currentSeg];
							this.crossings[newCross].eastDest = this.segments[currentSeg].lowerBound;
							this.segments[currentSeg].insideTiles[(this.segments[currentSeg].numElements-1)] = this.crossings[newCross];
							this.segments[currentSeg].numElements++;
						}
					} else if (next.nConnect == current) {	
						this.crossings[newCross].northDest = this.crossings[lastCross];
						this.crossings[newCross].southDest = 1;
						current = next;               
						next = current.sConnect;            // step thru north to south
						if (current.type == 8) {
							this.crossings[newCross].nwSeg = this.segments[currentSeg];    // if undercrossing increment segment
							this.segments[currentSeg].upperBound = this.crossings[newCross];
							this.segments[currentSeg].numElements++;
							for (i = 0; i < (this.segments[currentSeg].numElements - 2); i++) {
								if (this.segments[currentSeg].insideTiles[i].type > 6) {
									if (this.segments[currentSeg].insideTiles[i].type == 7) {
										if (this.segments[currentSeg].insideTiles[i].northDest == this.segments[currentSeg].lowerBound) {
											this.segments[currentSeg].insideTiles[i].southDest = this.segments[currentSeg].upperBound;
										} else {
											this.segments[currentSeg].insideTiles[i].northDest = this.segments[currentSeg].upperBound;
										}
									} else {
										if (this.segments[currentSeg].insideTiles[i].eastDest == this.segments[currentSeg].lowerBound) {
											this.segments[currentSeg].insideTiles[i].westDest = this.segments[currentSeg].upperBound;
										} else {
											this.segments[currentSeg].insideTiles[i].eastDest = this.segments[currentSeg].upperBound;
										}
									}
								}
							}
																									
							////alert("ending segment (block b)");
							currentSeg++;
							if (currentSeg < this.crossingNum) {      // init undiscovered segment
								////alert("beginning segment  " + currentSeg);
								this.segments[currentSeg] = new Segment(this.crossings[newCross], currentSeg);
								this.crossings[newCross].seSeg = this.segments[currentSeg];
							}
						} else {
							this.crossings[newCross].overSeg = this.segments[currentSeg];
							this.crossings[newCross].northDest = this.segments[currentSeg].lowerBound;
							this.segments[currentSeg].insideTiles[(this.segments[currentSeg].numElements-1)] = this.crossings[newCross];
							this.segments[currentSeg].numElements++;
						}     
					} else if (next.wConnect == current) {	
						this.crossings[newCross].westDest = this.crossings[lastCross];
						this.crossings[newCross].eastDest = 1;
						current = next;             
						next = current.eConnect;           // step thru west to east              
						if (current.type == 7) {
							this.crossings[newCross].nwSeg = this.segments[currentSeg];    // if overcrossing increment segment
							this.segments[currentSeg].upperBound = this.crossings[newCross];
							this.segments[currentSeg].numElements++;
							for (i = 0; i < (this.segments[currentSeg].numElements - 2); i++) {
								if (this.segments[currentSeg].insideTiles[i].type > 6) {
									if (this.segments[currentSeg].insideTiles[i].type == 7) {
										if (this.segments[currentSeg].insideTiles[i].northDest == this.segments[currentSeg].lowerBound) {
											this.segments[currentSeg].insideTiles[i].southDest = this.segments[currentSeg].upperBound;
										} else {
											this.segments[currentSeg].insideTiles[i].northDest = this.segments[currentSeg].upperBound;
										}
									} else {
										if (this.segments[currentSeg].insideTiles[i].eastDest == this.segments[currentSeg].lowerBound) {
											this.segments[currentSeg].insideTiles[i].westDest = this.segments[currentSeg].upperBound;
										} else {
											this.segments[currentSeg].insideTiles[i].eastDest = this.segments[currentSeg].upperBound;
										}
									}
								}
							}
																									
							////alert("ending segment (block c)");
							currentSeg++;
							if (currentSeg < this.crossingNum) {      // init undiscovered segment
								////alert("beginning segment  " + currentSeg);
								this.segments[currentSeg] = new Segment(this.crossings[newCross], currentSeg);
								this.crossings[newCross].seSeg = this.segments[currentSeg];
							}
						} else { 
							this.crossings[newCross].overSeg = this.segments[currentSeg];
							this.crossings[newCross].westDest = this.segments[currentSeg].lowerBound;
							this.segments[currentSeg].insideTiles[(this.segments[currentSeg].numElements-1)] = this.crossings[newCross];
							this.segments[currentSeg].numElements++;
						}
					} else {
						this.crossings[newCross].southDest = this.crossings[lastCross];
						this.crossings[newCross].eastDest = 1;
						current = next;
						next = current.nConnect;                                     // step thru south to north
						if (current.type == 8) {
							this.crossings[newCross].seSeg = this.segments[currentSeg];          // if undercrossing increment segment
							this.segments[currentSeg].upperBound = this.crossings[newCross];
							this.segments[currentSeg].numElements++;
							for (i = 0; i < (this.segments[currentSeg].numElements - 2); i++) {
								if (this.segments[currentSeg].insideTiles[i].type > 6) {
									if (this.segments[currentSeg].insideTiles[i].type == 7) {
										if (this.segments[currentSeg].insideTiles[i].northDest == this.segments[currentSeg].lowerBound) {
											this.segments[currentSeg].insideTiles[i].southDest = this.segments[currentSeg].upperBound;
										} else {
											this.segments[currentSeg].insideTiles[i].northDest = this.segments[currentSeg].upperBound;
										}
									} else {
										if (this.segments[currentSeg].insideTiles[i].eastDest == this.segments[currentSeg].lowerBound) {
											this.segments[currentSeg].insideTiles[i].westDest = this.segments[currentSeg].upperBound;
										} else {
											this.segments[currentSeg].insideTiles[i].eastDest = this.segments[currentSeg].upperBound;
										}
									}
								}
							}																	
							//alert ("end of segment (block d)");
							currentSeg++;
							if (currentSeg < this.crossingNum) {                          // init undiscovered segment
								////alert("beginning segment  " + currentSeg);
								this.segments[currentSeg] = new Segment(this.crossings[newCross], currentSeg);
								this.crossings[newCross].nwSeg = this.segments[currentSeg];
							}
						} else { 
							this.crossings[newCross].overSeg = this.segments[currentSeg];
							this.crossings[newCross].southDest = this.segments[currentSeg].lowerBound;
							this.segments[currentSeg].insideTiles[(this.segments[currentSeg].numElements-1)] = this.crossings[newCross];
							this.segments[currentSeg].numElements++;
						}
					}		// overcrossing added to 'inside tiles'	
					if (currentSeg < this.crossingNum) {
						this.crossings[newCross].placeDowker(dowkers);            // add dowker # to supercrossing
						dowkers++;
					}

				}     // close case 7-8		
		}      // close main switch	
	//if (currentSeg < this.crossingNum) //alert("Entering:\n\ntype: " + next.type + "\nrow: " + next.row + "\ncol: " + next.col);
	}
	if (this.crossingNum > 0) this.tricolorable = this.isTricolorable();	
}

Analysis.prototype.isTricolorable = function() {
	var indx = 0;
		
	this.isColorable.activation = 0;
		
		// only attempt to tricolor from crossings in which segments are each unique
		while (((this.crossings[indx].overSeg == this.crossings[indx].nwSeg) ||
				(this.crossings[indx].nwSeg == this.crossings[indx].seSeg) ||
				(this.crossings[indx].overSeg == this.crossings[indx].seSeg)) && (indx < (this.crossingNum-1))) indx++;
						
				//alert("NEW ATTEMPT  - Starting at cross index " + indx);
				// set three arbitrary colors	
				this.crossings[indx].overSeg.setColor(3);    // set overSeg red
				if (!this.checkForConflicts()) {
					this.crossings[indx].nwSeg.setColor(2);    // set nwSeg green
					if (!this.checkForConflicts()) {
						this.crossings[indx].seSeg.setColor(1);   // set seSeg blue
					}
				}
				
				singCol = false;
				
				// if there was a conflict, or if there's a subsequent conflict down the line
				if (!this.checkForConflicts() && this.isColorable(this.findNextCrossing())) {
							this.tricolorable = true;   // GOT IT!  Found a working color pattern
	/*
							var ixl;     // loop var
							for (ixl = 0; ixl < this.crossingNum; ixl++) {
								this.segments[ixl].drawColor();                 // So ink it all in.
							}*/
						
							return true;
				} else { 		
					//alert("resetting everything");
					var ind;
					for (ind = 0; ind < this.crossingNum; ind++) {      // no 3-color solution from this crossing
						this.segments[ind].resetColor();            // so reset everything, we'll try making them all the same
					}
					
					this.crossings[indx].overSeg.setColor(1);    // set overSeg red
					if (!this.checkForConflicts()) {
						this.crossings[indx].nwSeg.setColor(1);    // set nwSeg green
						if (!this.checkForConflicts()) {
							this.crossings[indx].seSeg.setColor(1);   // set seSeg blue
						}
					}
					
					singCol = true;
					colsAdded = false;
					
					// if there was a conflict, or if there's a subsequent conflict down the line
					if (!this.checkForConflicts() && this.isColorable(this.findNextCrossing())) {
								// Because we began our attempt with a unicolor scheme, we must verify that the other
								// two colors were eventually introduced.
								var finalCheck = false;                                             // SImplify this now w colsAdded bool
								var initColor = 1;
								var ii;  // loop var                   
								for (ii = 0; ii < this.crossingNum; ii++) {
									if (this.segments[ii].color > 1) finalCheck = true;	
								}
								if (finalCheck) {
									//alert("got it!");
									this.tricolorable = true;   // GOT IT!  Found a working color pattern
									/*
									var ixl;     // loop var
									for (ixl = 0; ixl < this.crossingNum; ixl++) {
										this.segments[ixl].drawColor();                 // So ink it all in.
									}*/
									return true;
								} else {
									var ind;
									for (ind = 0; ind < this.crossingNum; ind++) {      // no 3-color solution from this crossing
										this.segments[ind].resetColor();            // so reset everything, we'll try making them all the same
									}
								
									this.tricolorable = false;
									return false;	
								}			
					} else { 		
						var ind;
						for (ind = 0; ind < this.crossingNum; ind++) {      // no 3-color solution from this crossing
							this.segments[ind].resetColor();            // so reset everything, we'll try making them all the same
						}
					
						this.tricolorable = false;
						return false;
					}
				}
		
}


Analysis.prototype.isColorable = function(c) {

	var temp, co = 0, xc = 0;

	if (c == null ) {
		if ((this.crossingNum > 2) && (!this.checkForConflicts())) return true;
		else return false;
	}
	
	if (c.overSeg.color) xc++;
	if (c.nwSeg.color) xc++;
	if (c.seSeg.color) xc++;
	
	if (xc == 3) return true;
	
	//alert ("crossing NOT null");

	else if (xc == 2) {    	// ** IF CROSSING HAS 2 COLORS **
	//alert ("evaluating priority crossing");
			
			if (c == null ) {
				if (!this.checkForConflicts()) return true;
				else return false;
			}
			
			//alert("about to evaluate crossing " +  + "\noverSeg color " + c.overSeg.color + "\nnwSeg color " + c.nwSeg.color + "\nseSeg color " + c.seSeg.color);
			
			if (!c.overSeg.color) {																// IF IT'S overSeg UNCOLORED
				if (c.nwSeg.color != c.seSeg.color) co = 6 - (c.nwSeg.color + c.seSeg.color);   // then if unders are different, set over to 3rd color
				else co = c.nwSeg.color;				//else set over to same color.
				//rt = c.setColor (this, co, 0);                                           // attempt set color
				//if (!rt) return rt;                                                      // if unsuccessful return col to 0
				c.overSeg.setColor(co);
				if (!this.checkForConflicts() && this.isColorable(this.findNextCrossing())) {
					return true;
				} else {
					c.overSeg.resetColor(); 				
					return false;
				}
			} else if (!c.nwSeg.color) {                                                         // IF IT'S nwSeg UNCOLORED
				if (c.overSeg.color != c.seSeg.color) co = 6 - (c.overSeg.color + c.seSeg.color);   // then if others are diff set nw to 3rd color
				else co = c.overSeg.color;                                                        //else set nw to same
				//rt = c.setColor (this, co, 1);											    	// attempt set color
				//if (!rt) return rt;                                                             // if unsuccessful return col to 0
				c.nwSeg.setColor(co);
				if (!this.checkForConflicts() && this.isColorable(this.findNextCrossing())) {
					return true;
				} else {
					c.nwSeg.resetColor();
					return false;
				}
			} else {                                                                         // IF IT'S seSeg UNCOLORED
				if (c.overSeg.color != c.nwSeg.color) co = 6 - (c.overSeg.color + c.nwSeg.color);  //then if others are diff set se to 3rd color
				else co = c.overSeg.color;															  //else set se to same
				//rt = c.setColor (this, co, 2);												// attempt set color
				//if (!rt) return rt;				// if unsuccessful return col to 0
				c.seSeg.setColor(co);
				
				
				if (!this.checkForConflicts() && this.isColorable(this.findNextCrossing())) {
					return true;
				} else {
					c.seSeg.resetColor();
					return false;
				}	
			}
	
	} else {											// ** ELSE CROSSING HAS 1 COLOR **
	
		//alert ("evaluating regular list");
			
			//alert("about to evaluate crossing at r,c " + c.row + "      " + c.col  + "\noverSeg color " + c.overSeg.color + "\nnwSeg color " + c.nwSeg.color + "\nseSeg color " + c.seSeg.color);
		
			if (c.overSeg.color) {							// overSeg only colored stub on this s.crossing
			
				if (c.seSeg == c.nwSeg)  {            // uncolored stubs belong to the same segment, only one option possible. this might never be executed. EVER.
					c.seSeg.setColor(c.overSeg.color); 
					if (this.checkForConflicts()) {
						c.seSeg.resetColor();
						return false;
					}
				}
				else {                                            // uncolored stubs belong to different segments 
					//given = 0;
					c.nwSeg.setColor((c.overSeg.color%3)+1);
					c.seSeg.setColor((c.nwSeg.color%3)+1);
					if (singCol && !colsAdded) colsAdded = true;
					
					if (!this.checkForConflicts() && this.isColorable(this.findNextCrossing())) return true;
					else {
						//c.nwSeg.resetColor();
						//c.seSeg.resetColor();                             // if the first combo no good
						temp = c.nwSeg.color;                                             // flip
						c.nwSeg.setColor(c.seSeg.color);			               //  n			         
						c.seSeg.setColor(temp);									 //  retry
						if (singCol && !colsAdded) colsAdded = true;
							
						if (!this.checkForConflicts() && this.isColorable(this.findNextCrossing())) return true;
						else {
							//c.nwSeg.resetColor();
							//c.seSeg.resetColor();                    // hey, who knows- maybe
							c.nwSeg.setColor(c.overSeg.color);       // they're all the same color.
							c.seSeg.setColor(c.overSeg.color);
							colsAdded = false;
							
							if (!this.checkForConflicts() && this.isColorable(this.findNextCrossing())) return true;
							else {
								c.nwSeg.resetColor();
								c.seSeg.resetColor();
								return false;
							}
						}
					}	
				}
			} 
			else if (c.nwSeg.color) {              		// nwSeg only colored stub on this s.crossing   
			
				if (c.overSeg == c.seSeg)  {            // uncolored stubs belong to the same segment, only one option possible
					c.seSeg.setColor(c.nwSeg.color);
					if (!this.checkForConflicts() && this.isColorable(this.findNextCrossing())) return true;
					else {
						c.seSeg.resetColor();
						return false;
					}
				}
				else {                                            // uncolored stubs belong to different segments 
			
					c.overSeg.setColor(((c.nwSeg.color%3)+1));
					c.seSeg.setColor(((c.overSeg.color%3)+1));
					if (singCol && !colsAdded) colsAdded = true;
					
					if (!this.checkForConflicts() && this.isColorable(this.findNextCrossing())) return true;
					else {
						
						temp = c.overSeg.color;                                // flip
						c.overSeg.setColor(c.seSeg.color);			    //  n	
						c.seSeg.setColor(temp);							  //  retry
						if (singCol && !colsAdded) colsAdded = true;
						
						if (!this.checkForConflicts() && this.isColorable(this.findNextCrossing())) return true;
						else {
																									// ...and another test for
							c.overSeg.setColor(c.nwSeg.color);       // unified color scheme.
							c.seSeg.setColor(c.nwSeg.color);
							colsAdded = false;
							
							if (!this.checkForConflicts() && this.isColorable(this.findNextCrossing())) return true;
							else {
								c.overSeg.resetColor();
								c.seSeg.resetColor();
								return false;
							}
						}
					}	
				}	
			} 
			else {          										// seSeg only colored stub on this s.crossing
				
				if (c.overSeg == c.nwSeg)  {            // uncolored stubs belong to the same segment, only one option possible
					c.nwSeg.setColor(c.seSeg.color);
					if (!this.checkForConflicts() && this.isColorable(this.findNextCrossing())) return true;
					else {
						c.nwSeg.resetColor();
						return false;
					}
				}
				else {                                            // uncolored stubs belong to different segments    
					
					// uncolored segs
					c.overSeg.setColor((c.seSeg.color%3)+1);
					c.nwSeg.setColor((c.overSeg.color%3)+1);
					if (singCol && !colsAdded) colsAdded = true;
					
					
					if (!this.checkForConflicts()  &&  this.isColorable(this.findNextCrossing())) return true;
					else {

						temp = c.overSeg.color;                                // flip                                   
						c.overSeg.setColor(c.nwSeg.color);	        		//    n
						c.nwSeg.setColor(temp);							//  retry
						if (singCol && !colsAdded) colsAdded = true;
		
							
						if (!this.checkForConflicts() && this.isColorable(this.findNextCrossing())) return true;
						else {
                                                                                                   // ...and YET another test for
							c.overSeg.setColor(c.seSeg.color);       // unified colors.
							c.nwSeg.setColor(c.seSeg.color);
							colsAdded = false;
							
							if (!this.checkForConflicts() && this.isColorable(this.findNextCrossing())) return true;
							else {
								c.nwSeg.resetColor();
								c.overSeg.resetColor();
								return false;
							}
						}
					}	
				}
			}
	}     // end 1 color case

}



Analysis.prototype.findNextCrossing = function() {
	var cl = null;
	var indx;
	
	if (this.crossingNum) {
		for (indx = 0; indx < this.crossingNum; indx++) {
			//alert("counting colored stubs on row " + this.crossings[indx].row + "      col " + this.crossings + "\nNum colored " + this.crossings[indx].numColored());
			
			if ((this.crossings[indx].numColored() == 1) || (this.crossings[indx].numColored() == 2)) {
				if (!singCol || colsAdded) {
					if ((cl == null) || (this.crossings[indx].numColored() > cl.numColored())) cl = this.crossings[indx];
				} else {
					if ((cl == null) || (this.crossings[indx].numColored() < cl.numColored())) cl = this.crossings[indx];
				}
			}

		}
	}
	
	// if (cl) alert (this.findCrossIndex(this.board.cell[cl.row-1][cl.col-1]) + "\nrow: " + cl.row + "\ncol: " + cl.col);
	//this.partialCrossings = regSet;
	//this.partialCount = 0;
	
	return cl;
}


Analysis.prototype.checkForConflicts = function() {
	var indx, cs;
	var conflict = false;
	
	for (indx = 0; (!conflict)&&(indx < this.crossingNum); indx++) {
		cs = this.crossings[indx];
		conflict = (((cs.overSeg.color) && (((cs.overSeg.color == cs.nwSeg.color) 
			&& ((cs.seSeg.color) && (cs.seSeg.color != cs.overSeg.color))) ||
			((cs.overSeg.color == cs.seSeg.color)
			&& ((cs.nwSeg.color) && (cs.nwSeg.color != cs.overSeg.color))))) ||
			((cs.nwSeg.color) && (cs.nwSeg.color == cs.seSeg.color) &&
			 (cs.overSeg.color) && (cs.overSeg.color != cs.nwSeg.color)));
	}
	
	return conflict;
}

/*****************************************************************************************
 *
 *
 *        SEGMENT
 *
 *
 *****************************************************************************************/
 
function Segment(c, n){
	this.lowerBound = c;
	this.insideTiles = new Array(250);
	this.upperBound = null;
	this.numElements = 1;
	this.color = 0;
	this.segNumber = n;
}

Segment.prototype.resetColor = function() {
	this.color = 0;
}

Segment.prototype.setColor = function (c) {
	this.color = c;
}

Segment.prototype.otherEnd = function(crs) {
	if (crs == this.lowerBound) return this.upperBound;
	else return this.lowerBound;
}

Segment.prototype.drawColor = function() {
	
	if ( (this.color != 0) && (this.color != 1) && (this.color != 2) && (this.color != 3)) {
		alert ("segment " + this.segNumber + " attempt to color " + this.color);
	}
	
	var l = (this.lowerBound.col - 1) * brd.ss;
	var t = (this.lowerBound.row - 1) * brd.ss;
	
	//alert("inking in segment " + this.segNumber +  "\ncolor : " + this.color);

	if (this.color) {
	
		var colr = this.color * 8;
		
		if (this.lowerBound.nwSeg == this) {
				if (this.lowerBound.type == 7) {
					cv.drawImage(brd.tilePics[7 + colr], 0, 0, 8, 30, l, t, (brd.ss*.3), brd.ss); //l -= 30;
				} // west seg
				if (this.lowerBound.type == 8) {
					cv.drawImage(brd.tilePics[8 + colr], 0, 0, 30, 8, l, t, brd.ss, (brd.ss*.3)); //t -= 30;
				} // north seg
		} else if (this.lowerBound.seSeg == this) {
				if (this.lowerBound.type == 7) {
					cv.drawImage(brd.tilePics[7 + colr], 22, 0, 8, 30, (l+(brd.ss*.7)), t, (brd.ss*.3), brd.ss); //l += 30;
				}  // east seg
				if (this.lowerBound.type == 8) {
					cv.drawImage(brd.tilePics[8 + colr], 0, 22, 30, 8, l, (t+(brd.ss*.7)), brd.ss, (brd.ss*.3)); //t += 30;
				}  // south seg
		}
		
		var index = 0;
		var sq = null;
		
		while (index < (this.numElements - 2)) {
			sq = this.insideTiles[index];
			l = (sq.col - 1) * brd.ss;
			t = (sq.row - 1) * brd.ss;
			
			if (sq.type < 7) cv.drawImage(brd.tilePics[(sq.type + colr)], 0, 0, 30, 30, l, t, brd.ss, brd.ss);
			else if (sq.type == 7) cv.drawImage(brd.tilePics[7 + colr], 8, 0, 13, 30, (l+(brd.ss*.3)), t, (brd.ss*.4), brd.ss);
			else if (sq.type == 8) cv.drawImage(brd.tilePics[8 + colr], 0, 8, 30, 13, l, (t+(brd.ss*.3)), brd.ss, (brd.ss*.4));
			
			index++;
		}
		
		l = (this.upperBound.col - 1) * brd.ss;
		t = (this.upperBound.row - 1) * brd.ss;
		
		if (this.upperBound.nwSeg == this) {
				if (this.upperBound.type == 7) {
					cv.drawImage(brd.tilePics[7 + colr], 0, 0, 8, 30, l, t, (brd.ss/4), brd.ss);
				} // west seg
				if (this.upperBound.type == 8) {
					cv.drawImage(brd.tilePics[8 + colr], 0, 0, 30, 8, l, t, brd.ss, (brd.ss/4));
				} // north seg
		} else if (this.upperBound.seSeg == this) {
				if (this.upperBound.type == 7) {
					cv.drawImage(brd.tilePics[7 + colr], 22, 0, 8, 30, (l+(brd.ss*.75)), t, (brd.ss/4), brd.ss);
				}  // east seg
				if (this.upperBound.type == 8) {
					cv.drawImage(brd.tilePics[8 + colr], 0, 22, 30, 8, l, (t+(brd.ss*.75)), brd.ss, (brd.ss/4));
				}  // south seg
		}
	}
}
 
 

/*****************************************************************************************
 *
 *
 *        SUPER-CROSSING
 *
 *
 *****************************************************************************************/
 
 function SuperCrossing(c){
	this.cell = c;
	this.row = c.row;
	this.col = c.col;
	this.type = c.type;
	this.northDest = null;
	this.eastDest = null;
	this.southDest = null;
	this.westDest = null;
	this.overSeg = null;
	this.nwSeg = null;
	this.seSeg = null;
	this.colored = 0;
	this.oddDowker = null;
	this.evenDowker = null;
}

SuperCrossing.prototype.isMe = function(c) {return (c == this.cell);}

SuperCrossing.prototype.placeDowker = function(n) {
	if (n%2 == 0) this.evenDowker = n;
	else this.oddDowker = n;
}

SuperCrossing.prototype.isColSet = function(sc){
	return ((sc.overSeg.color && sc.nwSeg.color && sc.seSeg.color) &&
		    (!((sc.overSeg.color == sc.nwSeg.color) || (sc.overSeg.color == sc.seSeg.color) 
			  || (sc.nwSeg.color == sc.seSeg.color))));
}


SuperCrossing.prototype.numColored = function() {
	var numcol = 0;
	
	if (this.overSeg.color) numcol++;
	if (this.nwSeg.color) numcol++;
	if (this.seSeg.color) numcol++;
	
	return numcol;
}

 /*****************************************************************************************
 *
 *
 *        SUPER-LINE
 *
 *
 *****************************************************************************************/
 
 
 function SuperLine(c, n){
	this.cell = c;
	this.row = c.row;
	this.col = c.col;
	this.type = c.type;
	this.northDest = null;
	this.eastDest = null;
	this.southDest = null;
	this.westDest = null;
	this.segNum = n;
}

SuperLine.prototype.isMe = function(c) {return (c == this.cell);}


 /*****************************************************************************************
 *
 *
 *        SUPER-CORNER
 *
 *
 *****************************************************************************************/
 
 
 function SuperCorner(c, n){
	this.cell = c;
	this.row = c.row;
	this.col = c.col;
	this.type = c.type;
	this.northDest = null;
	this.eastDest = null;
	this.southDest = null;
	this.westDest = null;
	this.segNum = n;               //   
}

SuperCorner.prototype.isMe = function(c) {return (c == this.cell);}