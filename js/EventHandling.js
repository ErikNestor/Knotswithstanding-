
$(document).ready(function(){

	var mouseDown = 0;
	var mouseWasDown = 0;
	var rightMouseDown = 0;
	var multiBank = 0;
	var rate;
	var color = false;
	var playingInColor = false;
	var ferase = false;
	var timer2;
	
	//var timer;
	
	document.oncontextmenu = function() {return false;};
	
	$(document).keydown(function(e) {

		if (e.which == 32) {
			if ($('#modalMsg3').css('visibility') != 'visible') {
					$('#rotateBut').click();
					return false;
			}
		} else if ((brd.turboBuild)&&(!brd.turboBuild.dormant)) {
			var kp = 0;
			if (e.which == 39) kp = 1;      // right-east
			if (e.which == 40) kp = 2;      // down-south
			if (e.which == 37) kp = 3;      // left-west
			if (e.which == 38) kp = 4;      // up-north
			if (e.which == 8) kp = 5;       // backspace-undo
			if (kp) brd.turboBuild.move(kp);
		} else if (brd.multiSelect) {
			
			var rlo = brd.h, rhi = 0, clo = brd.w, chi = 0;
			for (var i = 0; i < brd.multiSelect.selectList.length; i++) {
				    if ((brd.multiSelect.selectList[i].row - 1) > rhi) rhi = (brd.multiSelect.selectList[i].row - 1);
					if ((brd.multiSelect.selectList[i].row - 1) < rlo) rlo = (brd.multiSelect.selectList[i].row - 1);
					if ((brd.multiSelect.selectList[i].col - 1) > chi) chi = (brd.multiSelect.selectList[i].col - 1);
					if ((brd.multiSelect.selectList[i].col - 1) < clo) clo = (brd.multiSelect.selectList[i].col - 1);
			}
			
			if (e.which == 39) {              				 // right-east
					var legit = true;
					for (i = 0; i < brd.multiSelect.selectList.length; i++) {
						if ((brd.multiSelect.selectList[i].col == brd.w) 
							|| (brd.cell[brd.multiSelect.selectList[i].row-1][brd.multiSelect.selectList[i].col].type && (!brd.multiSelect.isSelected(brd.cell[brd.multiSelect.selectList[i].row-1][brd.multiSelect.selectList[i].col])))) {
								legit = false;
							}
					}
					if (legit) {
						
						var temp;
						for (var j = (chi+1); j >= clo; j--) {
							for (i = 0; i < brd.multiSelect.selectList.length; i++) {
								if  (brd.multiSelect.selectList[i].col == j) {
										brd.cell[brd.multiSelect.selectList[i].row-1][brd.multiSelect.selectList[i].col].plot(brd.multiSelect.selectList[i].type);
										temp = brd.multiSelect.selectList[i];
										brd.multiSelect.selectList[i] = brd.cell[brd.multiSelect.selectList[i].row-1][brd.multiSelect.selectList[i].col];
										temp.plot(0);
								}
							}
						}
						brd.draw();
						brd.drawSelect();
					}
					return false;
			}
			if (e.which == 40) {						         // down-south
					var legit = true;
					for (i = 0; i < brd.multiSelect.selectList.length; i++) {
						if ((brd.multiSelect.selectList[i].row == brd.h) 
							|| (brd.cell[brd.multiSelect.selectList[i].row][brd.multiSelect.selectList[i].col-1].type && (!brd.multiSelect.isSelected(brd.cell[brd.multiSelect.selectList[i].row][brd.multiSelect.selectList[i].col -1])))) legit = false;
					}

					if (legit) {
						var temp;
						for (var j = (rhi+1); j >= rlo; j--) {
							for (i = 0; i < brd.multiSelect.selectList.length; i++) {
								if  (brd.multiSelect.selectList[i].row == j) {
										brd.cell[brd.multiSelect.selectList[i].row][brd.multiSelect.selectList[i].col-1].plot(brd.multiSelect.selectList[i].type);
										temp = brd.multiSelect.selectList[i];
										brd.multiSelect.selectList[i] = brd.cell[brd.multiSelect.selectList[i].row][brd.multiSelect.selectList[i].col-1];
										temp.plot(0);
								}
							}
						}
						brd.draw();
						brd.drawSelect();
					}
					
					return false;
			}
			if (e.which == 37) {							     // left-west
					var legit = true;
					for (i = 0; i < brd.multiSelect.selectList.length; i++) {
						if ((brd.multiSelect.selectList[i].col == 1) 
							|| (brd.cell[brd.multiSelect.selectList[i].row-1][brd.multiSelect.selectList[i].col-2].type && (!brd.multiSelect.isSelected(brd.cell[brd.multiSelect.selectList[i].row-1][brd.multiSelect.selectList[i].col -2])))) legit = false;
					}
					if (legit) {
						var temp;
						for (var j = (clo); j <= (chi+1); j++) {
							for (i = 0; i < brd.multiSelect.selectList.length; i++) {
								if  (brd.multiSelect.selectList[i].col == j) {
										brd.cell[brd.multiSelect.selectList[i].row-1][brd.multiSelect.selectList[i].col-2].plot(brd.multiSelect.selectList[i].type);
										temp = brd.multiSelect.selectList[i];
										brd.multiSelect.selectList[i] = brd.cell[brd.multiSelect.selectList[i].row-1][brd.multiSelect.selectList[i].col-2];
										temp.plot(0);
								}
							}
						}
						brd.draw();
						brd.drawSelect();
					}
					return false;
			}
			if (e.which == 38) {     							 // up-north
					var legit = true;
					for (i = 0; i < brd.multiSelect.selectList.length; i++) {
						if ((brd.multiSelect.selectList[i].row == 1) 
							|| (brd.cell[brd.multiSelect.selectList[i].row-2][brd.multiSelect.selectList[i].col-1].type && (!brd.multiSelect.isSelected(brd.cell[brd.multiSelect.selectList[i].row-2][brd.multiSelect.selectList[i].col -1])))) legit = false;
					}
					if (legit) {
						var temp;
						for (var j = (rlo); j <= (rhi+1); j++) {
							for (i = 0; i < brd.multiSelect.selectList.length; i++) {
								if  (brd.multiSelect.selectList[i].row == j) {
										brd.cell[brd.multiSelect.selectList[i].row-2][brd.multiSelect.selectList[i].col-1].plot(brd.multiSelect.selectList[i].type);
										temp = brd.multiSelect.selectList[i];
										brd.multiSelect.selectList[i] = brd.cell[brd.multiSelect.selectList[i].row-2][brd.multiSelect.selectList[i].col-1];
										temp.plot(0);
								}
							}
						}
						brd.draw();
						brd.drawSelect();
					}
					return false;
			}	
		}
	});
	

	$('canvas').click(function(e) {
		var cel = brd.hitXY(e);	
				if ((!e.ctrlKey) && (cel == brd.selected)) {
					if (mouseWasDown) mouseWasDown--;
					else cel.rotateTile();
					
				} else {
					
					if (e.ctrlKey && cel.type) {
						if (brd.selected) {
							if (!brd.multiSelect ) {
									brd.multiSelect = new SelectStruc();          // Turn MSelect on
									brd.setSelect(brd.selected);
									brd.setSelect(cel);
									brd.drawSelect();
									brd.selected = null;
							}
						} else {
							if (brd.multiSelect) {
										if (brd.multiSelect.isSelected(cel)) {
											brd.multiSelect.remove(cel);
											brd.draw();
											brd.drawSelect(brd.multiSelect.selectList[(brd.multiSelect.numSelected-1)]);
										} else {
											brd.setSelect(cel);                      // MSelect already on
											brd.drawSelect();
										}
							}
						}
					} else if (e.shiftKey && cel.type) {
	
						if (brd.selected)  {
							var hcol, hrow, lcol, lrow;
							
							if (cel.row > brd.selected.row) {hrow = cel.row; lrow = brd.selected.row;}
							if (cel.row < brd.selected.row) {lrow = cel.row; hrow = brd.selected.row;}
							if (cel.col > brd.selected.col) {hcol = cel.col; lcol = brd.selected.col;}
							if (cel.col < brd.selected.col) {lcol = cel.col; hcol = brd.selected.col;}
							
							if (lrow || lcol) {
									brd.multiSelect = new SelectStruc();          // Turn MSelect on
									brd.selected = null;
									var i, j;
									for (i = lrow; i <= hrow; i++) {
										for (j = lcol; j <= hcol; j++) {
												brd.setSelect(brd.cell[i-1][j-1]);
												brd.drawSelect();
										}
									}
									//brd.drawSelect();
							}
						}
							
					} else {
						if (brd.multiSelect) brd.multiSelect = null;
						brd.setSelect(cel);
						brd.drawSelect();
					}
				}
	
		mouseDown = 0;
	});
	

    $('canvas').mousedown(function(e){
		var cel = brd.hitXY(e);
		//var kp = 0;
		//var dist = 1;
		mouseDown = 1;

		if ( e.button == 2 ) {
			rightMouseDown = 1;
			if (brd.turboBuild && !brd.turboBuild.dormant) brd.turboBuild.move(5);
			else {
				$('canvas').addClass('eraserTip');
				cel.plot(0);
				brd.draw();
			}
		} else {
			var pickup = false;

			if (((cel.row > 1) && (brd.cell[cel.row-2][cel.col-1].type) && brd.cell[cel.row-2][cel.col-1].isAnEnd()) ||
				((cel.row < (brd.h-1)) && (brd.cell[cel.row][cel.col-1].type) && brd.cell[cel.row][cel.col-1].isAnEnd()) ||
				((cel.col > 1) && (brd.cell[cel.row-1][cel.col-2].type) && brd.cell[cel.row-1][cel.col-2].isAnEnd()) ||
				((cel.col < (brd.w-1)) && (brd.cell[cel.row-1][cel.col].type) && brd.cell[cel.row-1][cel.col].isAnEnd())) pickup = true;
			
			if (!cel.type) {
				brd.turboBuild = new TurboBuild(brd, cel); 
				if (pickup) brd.turboBuild.edgeFind(cel);
			}			
		}
		return true;
	});
	
	
	$('canvas').mousemove(function(e){
		
		if (rightMouseDown == 1) {
			var cel = brd.hitXY(e);
			$('canvas').addClass('eraserTip');
			if (cel.type) cel.plot(0);
			brd.draw();
		} else if (mouseDown) {
			var cel = brd.hitXY(e);
			var kp = 0;
			var dist = 1;
			if ( e.button == 2 ) {
				$('canvas').addClass('eraserTip');
				cel.plot(0);                                        // right button / delete cell
			} else {
				if (brd.turboBuild && (!brd.turboBuild.dormant)) {         // left button / turboBuild
				
					if (cel.row == brd.turboBuild.nextMove.row) {
						if (!(cel.col == brd.turboBuild.nextMove.col)) {
							if (cel.col > brd.turboBuild.nextMove.col) {
								kp = 1;
								dist = (cel.col - brd.turboBuild.nextMove.col);
							} else {
								kp = 3;
								dist = (brd.turboBuild.nextMove.col - cel.col);
							}
						}
					}
					if (cel.col == brd.turboBuild.nextMove.col) {
						if (!(cel.row == brd.turboBuild.nextMove.row)) {
							if (cel.row > brd.turboBuild.nextMove.row) {
								kp = 2;
								dist = (cel.row - brd.turboBuild.nextMove.row);
							} else {
								kp = 4;
								dist = (brd.turboBuild.nextMove.row - cel.row);
							}
						}
					}
					var step;
						
					
					if ((brd.ss < 30) && brd.turboBuild.lastDir && kp && (kp != brd.turboBuild.lastDir)) {
						
							var offset = 0;
							if (brd.ss == 20) offset = 5;
							if (brd.ss == 15) offset = 7;
		    
						 	if (((Math.ceil((e.pageX - $('canvas').offset().left+offset)/brd.ss) == brd.turboBuild.nextMove.col) || (Math.ceil((e.pageX - $('canvas').offset().left-offset)/brd.ss) == brd.turboBuild.nextMove.col))
									&& (cel.row == brd.turboBuild.nextMove.row)) kp = 0;
						 	else if (((Math.ceil((e.pageY - $('canvas').offset().top+offset)/brd.ss) == brd.turboBuild.nextMove.row) || (Math.ceil((e.pageY - $('canvas').offset().top-offset)/brd.ss) == brd.turboBuild.nextMove.row))
									&& (cel.col == brd.turboBuild.nextMove.col)) kp = 0;
					}
					if (kp) brd.turboBuild.move(kp);
				}
			}
			return true;
		}
	});
	
	
	$('canvas').mouseup(function(e) {
		if (e.which == 3) {
			$('canvas').removeClass('eraserTip');
			rightMouseDown = 0;
		} else {
				if (mouseDown) {
						mouseDown = 0;
						mouseWasDown = 1;
				}
				if ((brd.turboBuild != null) && (!brd.turboBuild.dormant)) {
						brd.cell[brd.turboBuild.nextMove.row-1][brd.turboBuild.nextMove.col-1].clear();
						brd.turboBuild.dormant = true;
				} 	
		}
	});
	
	
	$('#colorBut').click(function(e){
		
		if (color) {
			color = false;
			$('#colorBut').removeClass('cbSelected');
		} else if (brd.regset.playing) {
			color = true;
			$('#colorBut').addClass('cbSelected');
		} else {
			var a = new Analysis(brd);
			if (!a.isValid()) alert("Invalid knot.");
			if (a.tricolorable) {
					for(var ix in a.segments) a.segments[ix].drawColor();
					brd.disPane.add("Structure tricolored.</br></br>");
			} else brd.disPane.add("Structure not tricolorable.</br></br>");
		}
	});
	
	
	$('#invBut').click(function(e){
		for (var i = -1; ++i < brd.h;) {
			for (var j = -1; ++j < brd.w;)  if (brd.cell[i][j].type > 6) {brd.cell[i][j].rotateTile(); brd.draw(); brd.drawSelect();}
		}	
	});
	
	
	$('#shiftBut').click(function(e){
		var arrows = document.getElementById('shiftButtons');
		
		if (arrows.style.display == 'none') {
			arrows.style.display = 'block';
		} else {
			arrows.style.display = 'none';
		}
	});
	
	
	$('#rotateBut').click(function(e){
		if (brd.multiSelect == null) {
			if (brd.selected) brd.cell[brd.selected.row-1][brd.selected.col-1].rotateTile();
		} else {
			var index;
			for (index = 0; index < brd.multiSelect.numSelected; index++) {
				brd.cell[brd.multiSelect.selectList[index].row-1][brd.multiSelect.selectList[index].col-1].rotateTile();	
			}
		}
		brd.draw();
		brd.drawSelect();
	});
	
	
	$('#eraseBut').click(function(e){
		
		if (!brd.multiSelect) {
			if (brd.selected) brd.cell[brd.selected.row-1][brd.selected.col-1].plot(0);
		} else {
			var index;
			for (index = 0; index < brd.multiSelect.numSelected; index++) {
				brd.cell[brd.multiSelect.selectList[index].row-1][brd.multiSelect.selectList[index].col-1].plot(0);
			}
			brd.multiSelect=null;
			brd.draw();
			brd.drawSelect();
		}
	});
	
	
	$('#clearBut').click(function(e){
		
		$('#modalMsg').css({'visibility' : 'visible',
												'width' : '250px'});
		$('#Confirm').css('left', '150px');
		
		document.getElementById('mmtext').innerHTML = "Clear screen:<br>Are you sure?";
		
		$('div').each( function( ev) {
				if (!($( this ).is("#modalMsg"))) $(this).addClass('disabledElement');
		});
		
		$('#Confirm, #Cancel').click(function () {
			$('#modalMsg').css('visibility' , 'hidden');	
			$('#modalMsg').css('width' , '200px');
			$('#Confirm').css('left', '100px');
				
			$('div').each( function( ev) {$(this).removeClass('disabledElement');});	
			
			if (this.id == 'Confirm') {
					var i, j;
					for (i=0; i < brd.h; i++) {
						for (j=0; j < brd.w; j++) {
							brd.cell[i][j].plot(0);
						}
					}
					brd.draw();
					brd.disPane.add("Screen cleared.</br></br>");
			} 
		});	
	});
	
	
	$('#saveBut').click(function(e){
		
		var i;
		var toSave = false;
		
		for (i=0; i < brd.sequence.length; i++) {
			if (brd.sequence[i]) toSave = true;
		}
		
		if (toSave) {

				$('#modalMsg3').css('visibility' , 'visible');
				
				$('div').each( function( ev) {
						if (!($( this ).is("#modalMsg3"))) $(this).addClass('disabledElement');
				});
				
				var fn = null;
				
				// Click handler for modal confirmation window
				var f = function(event) {	
					$('#modalMsg3').css('visibility' , 'hidden');	
						
					$('div').each( function(ev) {$(this).removeClass('disabledElement');});	
			
					if (this.id == 'Confirm3') {	
							var re = new RegExp("[^a-zA-Z0-9 :]");
							var str = document.getElementById("tb").value;
							
							if (re.test(str) || (str.length > 16)) {
								alert("Filename must be 1-16 characters long\nand contain only letters, numbers, and underscores.");
								$('#saveBut').click();
							} else fn = str;	
							
							if (fn) {
									var cp = {};
									cp.size = brd.ss;
									cp.seq = brd.sequence;
						
									var st = JSON.stringify(cp);
									var blob = new Blob([st], {type: 'text/plain'});	
									
									var sBut = document.getElementById('saveBut');
									
									fn += ".txt"
									
									if (window.navigator.msSaveOrOpenBlob) {
										window.navigator.msSaveOrOpenBlob(blob, fn);
										sBut.blur();
										return;
									}
									
									var url = URL.createObjectURL(blob);
									
									var a = document.createElement('a');
									a.href = url;
									a.download = fn;
									a.textContent = '';
									document.body.appendChild(a);
									a.click();
									sBut.blur();
									a.parentNode.removeChild(a);
									
									brd.disPane.add("'" + fn + "' saved to local disk.</br></br>");
							}
					}		
				}
				
				// Assign click handler 
				$('#Confirm3, #Cancel3').click(f);
				
				// Unbind click handler because it, under certain circumstances,
				// fires multiple times mysteriously.
				$('#Confirm3, #Cancel3').unbind().click(f);	
				
		}
	});
	
	
	$('#loadBut').click(function(e){
		$('#fileOpen').click();	
	});
	
	
	$('#fileOpen').change(function(e){
		
		var file = e.target.files[0];
		var reader = new FileReader();
		
		reader.onload = (function(theFile) {

				return function(ev) {
					
					var cp =  JSON.parse(ev.target.result);
					
					brd.ss = cp.size;
					brd.sequence = cp.seq;
					
					brd.w = canvas.width/brd.ss;
					brd.h = canvas.height/brd.ss;
					cv.clearRect(0, 0, canvas.width, canvas.height);					
					
					for (i=0; i < brd.h; i++) {
							brd.cell[i] = new Array(brd.w);
							for (j=0; j < brd.w; j++) {
									brd.cell[i][j] = new Cell(brd, i, j);
							}
					}
					brd.draw();					
					
					// Set draggable tiles to new cell size
					$('.draggableTile').each( function(ev) {
							$(this).css('height', brd.ss+'px');
							$(this).css('width', brd.ss+'px');
					});
					
					// Display new cell size on size selection button
					document.getElementById('txt').innerHTML = (brd.ss + 'px');
					
					brd.regset.newSet();	
					
					
				};
	})(file);
		
		reader.readAsText(file);
	});
	
	
	$('#resTogBut').click(function(e){
		
		$('#modalMsg').css({'visibility' : 'visible',
												'width' : '310px'});
		$('#Confirm').css('left', '210px');
		
		document.getElementById('mmtext').innerHTML = "Changing cell size will erase<br>all unsaved work! Are you sure?";
		
		$('div').each( function( ev) {
				if (!($( this ).is("#modalMsg"))) $(this).addClass('disabledElement');
		});
		
		
		// Click handler for modal confirmation window
		var f = function(event) {	
			$('#modalMsg').css('visibility' , 'hidden');	
			$('#modalMsg').css('width' , '200px');
			$('#Confirm').css('left', '100px');
				
			$('div').each( function(ev) {$(this).removeClass('disabledElement');});	
	
			if (this.id == 'Confirm') {
				
				// Cycle through available resolutions
				if (brd.ss == 30) brd.ss = 20;
				else if (brd.ss == 20) brd.ss = 15;
				else if (brd.ss == 15) brd.ss = 30;
				
				for (var x=-1; ++x < 10;) brd.sequence[x] = null;
		
				cv.clearRect(0, 0, canvas.width, canvas.height);
				brd.w = canvas.width/brd.ss;
				brd.h = canvas.height/brd.ss;
				
				for (i=0; i < brd.h; i++) {
						brd.cell[i] = new Array(brd.w);
						for (j=0; j < brd.w; j++) {
								brd.cell[i][j] = new Cell(brd, i, j);
						}
				}
				brd.draw();
				
				// Set draggable tiles to new cell size
				$('.draggableTile').each( function(ev) {
						$(this).css('height', brd.ss+'px');
						$(this).css('width', brd.ss+'px');
				});
				
				brd.disPane.add("Cell size changed to " + brd.ss + "px.</br></br>");
				
				// Display new cell size on size selection button
				document.getElementById('txt').innerHTML = (brd.ss + 'px');
				
				brd.regset.reset();
			}	
		}
		
		// Assign click handler 
		$('#Confirm, #Cancel').click(f);
		
		// Unbind click handler to offset 'bound handler accumulation'
		$('#Confirm, #Cancel').unbind().click(f);	
	});
	
	
	var fch = function(event) {
		
		var d = document.getElementById(event.target.id);
		
		if (brd.regset.dowkerCheckActive  || brd.regset.playing) return false;
		
				if ((! (d.classList.contains('active') || d.classList.contains('activeFull'))) && !ferase) {      // if we are in fact switching registers	              
					
					brd.regset.switchRegister(parseInt(d.id.substring(4)));	
							
					if ( brd.sequence[brd.regset.activeBank]  && brd.sequence[brd.regset.activeBank][brd.regset.activePage]) {     // check if there's something there
								
								var i, j;
								for (i=0; i < brd.h; i++) {
									for (j=0; j < brd.w; j++) {
										brd.cell[i][j].plot(0);
									}
								}
								brd.draw();
								
								var x;
								for (x=0; x < (brd.sequence[brd.regset.activeBank][brd.regset.activePage].length); x++){
									brd.cell[brd.sequence[brd.regset.activeBank][brd.regset.activePage][x].r-1][brd.sequence[brd.regset.activeBank][brd.regset.activePage][x].c-1].plot(brd.sequence[brd.regset.activeBank][brd.regset.activePage][x].t);
								}		
					}
					
					mouseDown = 1;
				} else if (ferase) {
					// d id div object
					var ri = parseInt(d.id.substring(4));       // ri is the index
					
					
					if (brd.sequence[brd.regset.activeBank] && brd.sequence[brd.regset.activeBank][ri]) {
						
								var i, j;
								for (i=0; i < brd.h; i++) {
									for (j=0; j < brd.w; j++) {
										brd.cell[i][j].plot(0);
									}
								}
								brd.draw();
								
								var x;
								for (x=0; x < (brd.sequence[brd.regset.activeBank][ri].length); x++){
									brd.cell[brd.sequence[brd.regset.activeBank][ri][x].r-1][brd.sequence[brd.regset.activeBank][ri][x].c-1].plot(brd.sequence[brd.regset.activeBank][ri][x].t);
								}	
								
								
								
								//------------------------------------------------------------------
								
								
								$('#modalMsg').css({'visibility' : 'visible',
																		'width' : '250px'});
								$('#Confirm').css('left', '150px');
								
								document.getElementById('mmtext').innerHTML = "Erase register " + (ri + 1) + ":<br>Are you sure?";
								
								$('div').each( function( ev) {
										if (!($( this ).is("#modalMsg"))) $(this).addClass('disabledElement');
								});
								
								var fnctn = function () {
									$('#modalMsg').css('visibility' , 'hidden');
									$('#modalMsg').css('width' , '200px');
									$('#Confirm').css('left', '100px');									
										
									$('div').each( function( ev) {
											if (!($( this ).is("#modalMsg"))) $(this).removeClass('disabledElement');
									});	
									
									if (this.id == 'Confirm') {
										
										
											brd.disPane.add("Register " + (ri + 1) + " deleted.</br></br>");
											brd.msgDisplay((("Register " + (ri + 1) + " deleted.")), 1500, 30, 300);
											brd.sequence[brd.regset.activeBank][ri] = null;
											
											var otherPageOn = false;
											for (i = 0; i < 50; i++) {
												if (brd.sequence[brd.regset.activeBank][i]) otherPageOn = true;
											}
											if (!otherPageOn) {               // No other pages active in bank, turn bank off
													brd.sequence[brd.regset.activeBank] = null;	
											}	
									
											brd.regset.update();	
										
									}
									
									for (i=0; i < brd.h; i++) {
										for (j=0; j < brd.w; j++) {
											brd.cell[i][j].plot(0);
										}
									}
									brd.draw();
									
									for (x=0; x < (brd.sequence[brd.regset.activeBank][brd.regset.activePage].length); x++){
										brd.cell[brd.sequence[brd.regset.activeBank][brd.regset.activePage][x].r-1][brd.sequence[brd.regset.activeBank][brd.regset.activePage][x].c-1].plot(brd.sequence[brd.regset.activeBank][brd.regset.activePage][x].t);
									}
										
								}
								
								$('#Confirm, #Cancel').click(fnctn);
								$('#Confirm, #Cancel').unbind().click(fnctn);
								
								ferase = false;
								
								
								//-----------------------------------------------------------------------

			
					}
					
				}
	}
	
	
	var ff = function(e){
		if (e.which == 3){
			ferase = true;
			fch(e);
		}
	}
	
	
	$('.frameSel').click(fch);
	$('.frameSel').mousedown(ff);
	
	
	$('.bankSel').click(function(event) {
		
		if (brd.regset.dowkerCheckActive || brd.regset.playing) return false;
		
		var d = document.getElementById(event.target.id);	
		
		if (! (d.classList.contains('bActive') || d.classList.contains('bActiveFull'))) {            // if we are in fact changing banks
			
			if (brd.sequence[brd.regset.activeBank]  && brd.sequence[brd.regset.activeBank][brd.regset.activePage] )  {
					
					var i, j;
					for (i=0; i < brd.h; i++) {
						for (j=0; j < brd.w; j++) {
							brd.cell[i][j].plot(0);
						}
					}
					brd.draw();
					
					var x;
					for (x=0; x < (brd.sequence[brd.regset.activeBank][brd.regset.activePage].length); x++){
						brd.cell[brd.sequence[brd.regset.activeBank][brd.regset.activePage][x].r-1][brd.sequence[brd.regset.activeBank][brd.regset.activePage][x].c-1].plot(brd.sequence[brd.regset.activeBank][brd.regset.activePage][x].t);
					}	
						
			}	
						
			mouseDown = 1;
			brd.regset.switchBank(parseInt(d.id.substring(5)));
		}	
	});
	
	
	$(document).on("click", ".active,.activeFull", function(event){
		
		if (brd.regset.dowkerCheckActive) return false;
		if (brd.regset.dowkerCheckWasActive) {
			brd.regset.dowkerCheckWasActive = 0;
			return false;	
		}
		
		if (mouseDown) mouseDown = 0;
		else {
		
			var capture = new Array();
			var square = {};
			var x, y;
			
			for (x = 0; x < brd.h; x++) {                         // Attempt screen capture
				for (y = 0; y < brd.w; y++) {
					if (brd.cell[x][y].type) {
						square = {
							r: (x+1),
							c: (y+1),
							t: brd.cell[x][y].type};
						capture.push(square);
					}
				}
			}
			
			if (capture[0]) {                // if there's anything on the screen
				
				brd.disPane.add("Page saved in register " + (brd.regset.activePage + 1) + ".</br></br>");
				brd.msgDisplay(("Page saved in register " + (brd.regset.activePage + 1) + "."), 1500, 30, 300);
							
				if (!brd.sequence[brd.regset.activeBank]) {
					brd.sequence[brd.regset.activeBank] = new Array();
					for (i = 0; i < 50; i++)  brd.sequence[brd.regset.activeBank][i] = null;	
					
				}
				
				brd.sequence[brd.regset.activeBank][brd.regset.activePage] = capture;
				
			} else if ($("#div-" + brd.regset.activePage).hasClass('on')) {                                                            // ERASE!
				brd.disPane.add("Register " + (brd.regset.activePage + 1) + " deleted.</br></br>");
				brd.msgDisplay((("Register " + (brd.regset.activePage + 1) + " deleted.")), 1500, 30, 300);
				brd.sequence[brd.regset.activeBank][brd.regset.activePage] = null;
				
				var otherPageOn = false;
				for (i = 0; i < 50; i++) {
					if (brd.sequence[brd.regset.activeBank][i]) otherPageOn = true;
				}
				if (!otherPageOn) {               // No other pages active in bank, turn bank off
				
						brd.sequence[brd.regset.activeBank] = null;	
				}	
			}
			
			brd.regset.update();	
		}
	});
	
	
	$('#prevBut').click(function(e) {
		
		if (brd.sequence[brd.regset.activeBank]) {
				var i = brd.regset.activePage;
				var count = 0;
				i--;
				
				while(!brd.sequence[brd.regset.activeBank][i] && count < 51) {
						if (i < 1) {        																	 // if we are on the last register
								
								var x;
								var totalBanks = 0;
								var nextActiveBank;
								for (x = 0; x < 10; x++) if (brd.sequence[x]) totalBanks++;
								if (brd.regset.playing && (!$('#localBox').is(":checked")) && totalBanks > 1)  {                                                  //  if multibank on, and there's another bank to go to
									var y = brd.regset.activeBank - 1;                                                            // then switch to next occupied bank
									if (y == -1) y = 9;
									while (y != brd.regset.activeBank && (!brd.sequence[y])){ y--; if (y == -1) y = 9;}      // Find next occupied bank
									
									brd.regset.switchBank(y);                         // and go there
									
									i = 49;                                                                                                                       // Set local register to '0'
									count = 0;                                                                       // reset 'count', as search for a populated register will continue
									
								} else i = 49;
						} else i--;
						count++;
				}
				
				if (count < 50) {
						brd.regset.switchRegister(i);
						
								var i, j;
								for (i=0; i < brd.h; i++) {
										for (j=0; j < brd.w; j++) {
												brd.cell[i][j].plot(0);
										}
								}
								brd.draw();
											
								var x;
								for (x=0; x < (brd.sequence[brd.regset.activeBank][brd.regset.activePage].length); x++){
										brd.cell[brd.sequence[brd.regset.activeBank][brd.regset.activePage][x].r-1][brd.sequence[brd.regset.activeBank][brd.regset.activePage][x].c-1].plot(brd.sequence[brd.regset.activeBank][brd.regset.activePage][x].t);
								}	
						
						if (color) new Analysis(brd);
				}
		}	
});
	
	
	$('#nextBut').click(function(e) {
		
		if (brd.sequence[brd.regset.activeBank]) {
				var i = brd.regset.activePage;
				var count = 0;
				i++;
				
				
				while(!brd.sequence[brd.regset.activeBank][i] && count < 51) {
						if (i > 48) {        																	 // if we are on the last register
								
								var x;
								var totalBanks = 0;
								var nextActiveBank;
								for (x = 0; x < 10; x++) if (brd.sequence[x]) totalBanks++;
								if (brd.regset.playing && (!$('#localBox').is(":checked")) && totalBanks > 1)  {                                                  //  if multibank on, and there's another bank to go to
									var y = brd.regset.activeBank + 1;                                                            // then switch to next occupied bank
									if (y == 10) y = 0;
									while (y != brd.regset.activeBank && (!brd.sequence[y])){ y++; if (y == 10) y = 0;}      // Find next occupied bank
									

									brd.regset.switchBank(y);     //  .. and go there
									
									i = 0;                                                                                                                       // Set local register to '0'
									count = 0;                                                                       // reset 'count', as search for a populated register will continue
									
								} else i = 0;
						} else i++;
						count++;
				}
				
				if (count < 50) {
						
						brd.regset.switchRegister(i);
						
						var i, j;
						for (i=0; i < brd.h; i++) {
								for (j=0; j < brd.w; j++) {
										brd.cell[i][j].plot(0);
								}
						}
						brd.draw();
									
						var x;
						for (x=0; x < (brd.sequence[brd.regset.activeBank][brd.regset.activePage].length); x++){
								brd.cell[brd.sequence[brd.regset.activeBank][brd.regset.activePage][x].r-1][brd.sequence[brd.regset.activeBank][brd.regset.activePage][x].c-1].plot(brd.sequence[brd.regset.activeBank][brd.regset.activePage][x].t);
						}	
						
						if (color) new Analysis(brd);
				}
		}
	});
	
	
	$('#playBut, #rvsPlayBut').click(function(e) {
		
		if (!(((e.target.id == 'playBut') && (brd.regset.playing == 1))||((e.target.id == 'rvsPlayBut') && (brd.regset.playing == -1)))) {
			
				rate = (10000/$('#slider').val());	
				var prv = brd.regset.playing;
		
				if ((e.target.id == 'playBut') && (brd.regset.playing != 1)) {
					brd.regset.playing = 1;
					
					clearInterval(timer);
					timer = setInterval(function() {
						document.getElementById("nextBut").click();
						}, rate);	
						
					if (prv == -1) $('#rvsPlayBut').removeClass('revPlayActive');
					$('#playBut').addClass('playActive');
						
				} else if ((e.target.id == 'rvsPlayBut') && (brd.regset.playing != -1)) {
					brd.regset.playing = -1;
					
					clearInterval(timer);
					timer = setInterval(function() {
						document.getElementById("prevBut").click();
						}, rate);	
						
					if (prv == 1) $('#playBut').removeClass('playActive');
					$('#rvsPlayBut').addClass('revPlayActive');
				}
				
				multiBank = 1;
				
		}
		$('#playBut').removeClass('pHover');
	});
	
	
	$('#slider').change(function(e) {
		
		rate = (10000/$('#slider').val());
		
		if (brd.regset.playing) {
				clearInterval(timer);
				timer = setInterval(function() {
					document.getElementById('nextBut').click();
				}, rate);	
		}
		
	});
	
	
	$('#dCompare').click(function(e) {		
	
	
			var clk = 0;
			var regs = new Array();
			var dowks = new Array();
			
			var frameClick = function(event) {
								
				var d = document.getElementById(event.target.id);	
								
				if  (brd.sequence[brd.regset.activeBank][parseInt(d.id.substring(4))]) {             // if register is populated
				
							if ( clk == 0) {
									regs[0] = parseInt(d.id.substring(4));
									
									var j, k;
									for (j=0; j < brd.h; j++) {
											for (k=0; k < brd.w; k++) {
													brd.cell[j][k].plot(0);
											}
									}
												
									var x;
									for (x=0; x < (brd.sequence[brd.regset.activeBank][regs[0]].length); x++){
											brd.cell[brd.sequence[brd.regset.activeBank][regs[0]][x].r-1][brd.sequence[brd.regset.activeBank][regs[0]][x].c-1].plot(brd.sequence[brd.regset.activeBank][regs[0]][x].t);
									}	
									
									var a = new Analysis(brd);
									dowks[0] = a.extractDowkers();	
									
									for (j=0; j < brd.h; j++) {
											for (k=0; k < brd.w; k++) {
													brd.cell[j][k].plot(0);
											}
									}
												
									for (x=0; x < (brd.sequence[brd.regset.activeBank][brd.regset.activePage].length); x++){
											brd.cell[brd.sequence[brd.regset.activeBank][brd.regset.activePage][x].r-1][brd.sequence[brd.regset.activeBank][brd.regset.activePage][x].c-1].plot(brd.sequence[brd.regset.activeBank][brd.regset.activePage][x].t);
									}	
									
									brd.draw();
									
									if (brd.strucCreated) {	
											$('#div-' + regs[0]).addClass('noBlink');
											$('#div-' + regs[0]).removeClass('off');
											$('#div-' + regs[0]).addClass('on');
											clk++;
											brd.disPane.add("Register " + regs[0] + " dowker numbers:</br>");
											brd.disPane.add(dowks[0] + "</br></br>");
									} else {brd.msgDisplay("Not a valid structure.", 500, 30, 300); dowks[0]=null;}
									
							} else {
									if (parseInt(d.id.substring(4)) != regs[0]) {
											regs[1] = parseInt(d.id.substring(4));
												
											var j, k;
											for (j=0; j < brd.h; j++) {
													for (k=0; k < brd.w; k++) {
															brd.cell[j][k].plot(0);
													}
											}
													
											var x;
											for (x=0; x < (brd.sequence[brd.regset.activeBank][regs[1]].length); x++){
													brd.cell[brd.sequence[brd.regset.activeBank][regs[1]][x].r-1][brd.sequence[brd.regset.activeBank][regs[1]][x].c-1].plot(brd.sequence[brd.regset.activeBank][regs[1]][x].t);
											}	
											
											var a = new Analysis(brd);
											dowks[1] = a.extractDowkers();	
											
											for (j=0; j < brd.h; j++) {
													for (k=0; k < brd.w; k++) {
															brd.cell[j][k].plot(0);
													}
											}
														
											for (x=0; x < (brd.sequence[brd.regset.activeBank][brd.regset.activePage].length); x++){
													brd.cell[brd.sequence[brd.regset.activeBank][brd.regset.activePage][x].r-1][brd.sequence[brd.regset.activeBank][brd.regset.activePage][x].c-1].plot(brd.sequence[brd.regset.activeBank][brd.regset.activePage][x].t);
											}	
											
											brd.draw();
											
											if (brd.strucCreated) {
													dowks[1] = a.extractDowkers();	
													$('#div-' + regs[1]).addClass('noBlink');
													$('#div-' + regs[1]).removeClass('off');
													$('#div-' + regs[1]).addClass('on');
													
													clk = 0;
													clearInterval(timer2);
													document.getElementById('txt2').innerHTML = "OFF";
													$('#dCompare').css('background', 'red');
													$('.noBlink').removeClass('noBlink');
													brd.regset.update();

													brd.disPane.add("Register " + regs[1] + " dowker numbers:</br>");
													brd.disPane.add(dowks[1] + "</br></br>");													

													var match = true;
													
													if (dowks[0].length == dowks[1].length) {
															for (var x = 0; x < dowks[0]; x++) {
																if (dowks[0][x] != dowks[1][x]) match = false;
															}				
													} else match = false;
													
													var msg = "Registers " + (regs[0]+1) + " and " + (regs[1]+1) +(match? " are a" : " do not") + " match.";
													brd.msgDisplay(msg, 2000, 30, 350);
													
													$('.frameSel').unbind('click', frameClick);
													brd.regset.dowkerCheckActive = 0;	
													if (regs[1] == brd.regset.activePage) brd.regset.dowkerCheckWasActive = 1;
														
					
											} else {brd.msgDisplay("Not a valid structure.", 500, 30, 300); dowks[1] = null;}
											
											
									} else {
											$('#div-' + parseInt(d.id.substring(4))).removeClass('noBlink');
											regs[0] = null;
											clk = 0;	
									}
							}
				}		
			}
		
			if (brd.regset.dowkerCheckActive) {
					
					document.getElementById('txt2').innerHTML = "OFF";
					$('#dCompare').css('background', 'red');
					
					clearInterval(timer2);
					$('.noBlink').removeClass('noBlink');
					brd.regset.dowkerCheckActive = 0;	
					$('.frameSel').unbind('click', frameClick);
					brd.regset.update();
				
			} else {
				
						var count = 0;
						if (brd.sequence[brd.regset.activeBank]) {
								for (var x = 0; x < 50; x++) {
									if  (brd.sequence[brd.regset.activeBank][x]) count++;
								}
						}

						if ((!brd.regset.playing) && (count > 1)) {
							
							document.getElementById('txt2').innerHTML = "ON";
							$('#dCompare').css('background', '#00FF00');
							
							clearInterval(timer2);
							var i = 0;

							brd.regset.dowkerCheckActive = 1;
							
							var blinkRegs = function() {
								
								i++;
								
								if (i%2 == 1) {
									
									$('.on').addClass('off').removeClass('.on');
									$('.noBlink').removeClass('off').addClass('.on');
									$('.activeFull').addClass('off').removeClass('activeFull');
									
								
								} else {
									for (var x = 0; x < 50; x++) {
										if (brd.sequence[brd.regset.activeBank][x]) {
												$('#div-' + x).addClass('on').removeClass('off');	
										}
									}	
								}	
							}
							
							timer2 = setInterval(blinkRegs, 300);	
							
							$('.frameSel').bind('click', frameClick);
							$('.frameSel').unbind().click(frameClick);
							$('.frameSel').bind('click', fch);
							$('.frameSel').bind('mousedown', ff);
							
						}
			}
		return false;
	});
		
	
	$('#pauseBut').click(function(e) {
		clearInterval(timer);	
		$('#playBut').removeClass('playActive');
	});
	
	
	$('#stopBut').click(function(e) {
		clearInterval(timer);	
		$('#playBut').removeClass('playActive');
		$('#rvsPlayBut').removeClass('revPlayActive');
		$('#colorBut').removeClass('cbSelected');
		brd.regset.playing = 0;
		color = false;
	});
	
	
	$('.seqContButs').mouseenter(function(e) {$(e.target).addClass('pHover');}).mouseleave(function(e){$(e.target).removeClass('pHover');});
	
	
	$('canvas').mouseleave(function(e){
		
		if ((e.clientX < $('canvas').offset().left) ||
			(e.clientX > (($('canvas').offset().left) + ($('canvas').width()))) ||
			(e.clientY < $('canvas').offset().top) ||
			(e.clientY > (($('canvas').offset().top) + ($('canvas').height())))) {
				var arrows = document.getElementById('shiftButtons');
				arrows.style.display = 'none';
		
				if ((brd.turboBuild != null) && (!brd.turboBuild.dormant)) {
					brd.cell[brd.turboBuild.nextMove.row-1][brd.turboBuild.nextMove.col-1].plot(0);
					brd.turboBuild.dormant = true;
				}
		}
	});
	
	
	$(window).scroll(function(){
		$('#buttonTray').css('left', $('#buttonTray').css('left')-$(window).scrollLeft());
		$('#tileMenu').css('left', $('#tileMenu').css('left')-$(window).scrollLeft());
		$('#resTogButton').css('left', $('resTogButton').css('left')-$(window).scrollLeft());
		$('#text-pane').css('left', $('text-pane').css('left')-$(window).scrollLeft());
	});
	
	
$('#closePane').click(function(e){

		$('#text-pane').css('visibility', 'hidden');
		$('#closePane').removeClass('opened');
		$('#closePane').addClass('closed');
		brd.disPane.opened = 0;	

});


$('#openPane').click(function(e){
		$('#text-pane').css('visibility', 'visible');
		$('#closePane').addClass('opened');
		$('#closePane').removeClass('closed');
		brd.disPane.opened = 1;	
});


$('#sizePane').click(function(e) {
	brd.disPane.changeSize();
});


$('#text-pane').draggable();
/*
$('#sequencingPanel').draggable({
									helper: 'original',
									cursor: 'move',
								   cursorAt: { left: 75, top: 75 }
								   });
								   
*/

	
	$('#shiftButtons').click(function(e){
		var idx = e.target.id;
		if (!brd.multiSelect) {
			brd.shift(idx);
		} else {
			var kp = jQuery.Event("keydown");
			switch (e.target.id) {
				case "upShift"     :    kp.which = 38; break;
				case "downShift"  :    kp.which =  40; break;
				case "leftShift"     :   kp.which =  37; break;
				case "rightShift"    :   kp.which =  39;
			}
			
			$("input").trigger(kp);
			return false;
		}
	});
	
	$('.draggableTile').draggable({helper: 'clone', 
                                   opacity: 1,
								   stack: '.draggableTile'});
								   
	$('canvas').droppable({accept: '.draggableTile',
							tolerance: 'pointer',
						    drop: function(event, ui) {
										var loc = brd.hitXY(event);
										
										var d = $(ui.draggable).attr("id");
										
										if ((d == "tileCornerTopRight") ||
                                        	(d == "tile-1")) loc.plot(1);
										if (d == "tile-2") loc.plot(2);
										if (d == "tile-3") loc.plot(3);
										if (d == "tile-4") loc.plot(4);
										if ((d == "tileLineVert")||
										    (d == "tile-5")) loc.plot(5);
										if (d == "tile-6") loc.plot(6);
										if ((d == "tileCrossOver")||
    										(d == "tile-7")) loc.plot(7);
										if (d == "tile-8") loc.plot(8);
										
										brd.setSelect(loc);
										brd.drawSelect();
							}
	});						   
});

