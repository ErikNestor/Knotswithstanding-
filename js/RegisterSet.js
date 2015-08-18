function RegisterSet() {
	
			this.led = new Array();
			this.ledBank = new Array();
			this.activePage = 0;
			this.activeBank = 0;
			this.playing = 0;
			this.dowkerCheckActive = 0;
			this.dowkerCheckWasActive = 0;
			this.nums = new Array();
			this.bankNums = new Array();
			
			var framButs = document.getElementById('frameButtons');
			var bankButs = document.getElementById('bankButtons');
			
			var t, l, tn, ln;
			
			for (i=0; i < 50; i++) {
				this.led[i] = document.createElement('div');
				this.nums[i] = document.createElement('p');
				this.nums[i].innerHTML += (i+1);
				this.led[i].classList.add('off');
				this.led[i].classList.add('frameSel');
				framButs.appendChild(this.led[i]);
				framButs.appendChild(this.nums[i]);
				this.led[i].id = "div-" + i;
				this.nums[i].id = "num-" + i;
				if (i < 25) {t = '27px'; tn = '0px';}
				else {t = '77px'; tn = '50px';}
				if (i < 25) l = (i*30) + 'px';
				else l = ((i-25)*30) + 'px';
				
				$("#" + this.led[i].id).css({
					"position": "absolute",
					"top": t,
					"left": l
				});
				
				$("#" + this.nums[i].id).css({
					"position": "absolute",
					"top": tn,
					"left": l
				});
				
				this.led[0].classList.add('active');
			}
			
			for (i=0; i < 10; i++) {
				this.ledBank[i] = document.createElement('div');
				this.bankNums[i] = document.createElement('p');
				this.bankNums[i].innerHTML += (i+1);
				this.ledBank[i].classList.add('bOff');
				this.ledBank[i].classList.add('bankSel');
				bankButs.appendChild(this.ledBank[i]);
				bankButs.appendChild(this.bankNums[i]);
				this.ledBank[i].id = "bdiv-" + i;
				this.bankNums[i].id = "bnum-" + i;
				t = '27px'; tn = '0px';
				l = (i*30) + 'px';
				
				$("#" + this.ledBank[i].id).css({
					"position": "absolute",
					"top": t,
					"left": l
				});
				
				$("#" + this.bankNums[i].id).css({
					"position": "absolute",
					"top": tn,
					"left": l
				});
				
				this.ledBank[0].classList.add('bActive');	
			}
	
}

RegisterSet.prototype.reset = function() {
	
			this.activeBank = 0;
			this.activePage = 0;

			
					for (x=0; x < 10; x++){				
						
						if (!x) {		
									$('#bdiv-' + x).addClass('bActive');
						} else {
									$('#bdiv-' + x).removeClass('bOn');	
									$('#bdiv-' + x).removeClass('bActive');	
									$('#bdiv-' + x).removeClass('bActiveFull');	
									$('#bdiv-' + x).addClass('bOff');
						}	
					}				
					
					
					for (x=0; x < 50; x++){				
						if (!x) {	
									$('#div-' + x).addClass('active');
						} else {
									$('#div-' + x).removeClass('on');	
									$('#div-' + x).removeClass('active');	
									$('#div-' + x).removeClass('activeFull');	
									$('#div-' + x).addClass('off');
						}
					}
	
	
	
}

RegisterSet.prototype.switchRegister = function(reg) {
	

		// restore reg led for prev register
		$("#div-" + this.activePage).removeClass('activeFull');
		$("#div-" + this.activePage).removeClass('active');
		if (brd.sequence[this.activeBank] && brd.sequence[this.activeBank][this.activePage]) $("#div-" + this.activePage).addClass('on'); 
		else {$("#div-" + this.activePage).addClass('off'); }
		
		// switch active register
		this.activePage = reg;
		
		// turn on reg led for new register
		$("#div-" + reg).removeClass('on');
		$("#div-" + reg).removeClass('off');
		if (brd.sequence[this.activeBank] && brd.sequence[this.activeBank][this.activePage]) $("#div-" + reg).addClass('activeFull'); 
		else $("#div-" + reg).addClass('active'); 
}

RegisterSet.prototype.switchBank = function(bnk) {
	
		// restore reg led for prev bank
		$("#bdiv-" + this.activeBank).removeClass('bActiveFull');
		$("#bdiv-" + this.activeBank).removeClass('bActive');
		if (brd.sequence[this.activeBank]) $("#bdiv-" + i).addClass('bOn'); 
		else $("#bdiv-" + this.activePage).addClass('bOff'); 
		
		// switch active register
		this.activeBank = bnk;
		this.activePage = 0;
		
		this.update();
}


RegisterSet.prototype.update = function() {

	var i;
	
	for (i = 0; i < brd.sequence.length; i++) {
		if (brd.sequence[i]) {                
				//turn bank on
				$("#bdiv-" + i).removeClass('bActive');
				$("#bdiv-" + i).removeClass('bOff');
				$("#bdiv-" + i).addClass('bOn'); 
				if (i == this.activeBank) $("#bdiv-" + i).addClass('bActiveFull'); 	
		} else {
				// turn bank off
				if (i == this.activeBank) $("#bdiv-" + i).addClass('bActive');
				$("#bdiv-" + i).addClass('bOff');
				$("#bdiv-" + i).removeClass('bOn'); 
				$("#bdiv-" + i).removeClass('bActiveFull'); 
		}	
	}
	
	if (brd.sequence[this.activeBank]) {
			for (i = 0; i < 50; i ++) {
						if (brd.sequence[this.activeBank][i]) {    
								//turn reg on
								$("#div-" + i).removeClass('active');                        // reg populated
								$("#div-" + i).removeClass('off');
								$("#div-" + i).addClass('on'); 
								if (i == this.activePage) $("#div-" + i).addClass('activeFull');
								else $("#div-" + i).removeClass('activeFull');
						} else {                                                          
								//turn reg off
								$("#div-" + i).removeClass('activeFull');                   // reg not populated
								$("#div-" + i).removeClass('on');
								$("#div-" + i).addClass('off'); 
								if (i == this.activePage) $("#div-" + i).addClass('active');
								else $("#div-" + i).removeClass('active');
						}
			}
	} else {                                                         // nothing in bank
			for (i = 0; i < 50; i++) {
						if (i == this.activePage) {
								//turn reg on
								$("#div-" + i).removeClass('activeFull');
								$("#div-" + i).removeClass('off');
								$("#div-" + i).removeClass('on');
								$("#div-" + i).addClass('active'); 	
						} else {
								//turn reg off
								$("#div-" + i).removeClass('activeFull');
								$("#div-" + i).removeClass('on');
								$("#div-" + i).removeClass('active'); 
								$("#div-" + i).addClass('off'); 
						}
			}	
	}
}


RegisterSet.prototype.newSet = function() {
	
					var x  = 0;
					while (!brd.sequence[x]) x++;
					
					this.activeBank = x;
					this.activePage = 0;
					
					for (x=0; x < 10; x++){				
						
						if (brd.sequence[x]) {		
									$('#bdiv-' + x).removeClass('bOff');
									$('#bdiv-' + x).addClass('bOn');
									if (x == this.activeBank) $('#bdiv-' + x).addClass('bActiveFull');
						} else {
									$('#bdiv-' + x).removeClass('bOn');	
									$('#bdiv-' + x).removeClass('bActiveFull');	
									$('#bdiv-' + x).addClass('bOff');
									if (x == this.activeBank) $('#bdiv-' + x).addClass('bActive');
									else $('#bdiv-' + x).removeClass('bActive');
						}	
					}				
					
					
					for (x=0; x < 50; x++){				
						
						if (brd.sequence[this.activeBank][x]) {		
									$('#div-' + x).removeClass('off');
									$('#div-' + x).addClass('on');
						} else {
									$('#div-' + x).removeClass('on');	
									$('#div-' + x).removeClass('active');	
									$('#div-' + x).removeClass('activeFull');	
									$('#div-' + x).addClass('off');
						}
						
					}
					
					
					if (brd.sequence[this.activeBank][this.activePage]) {
							$("#div-" + this.activePage).addClass('activeFull');
							
							var y;
							for (y=0 ; y < (brd.sequence[this.activeBank][this.activePage].length) ; y++) {
									brd.cell[brd.sequence[this.activeBank][this.activePage][y].r-1][brd.sequence[this.activeBank][this.activePage][y].c-1].plot(brd.sequence[this.activeBank][this.activePage][y].t);
							}
					} else {
							$("#div-" + this.activePage).addClass('active');
					}	
	
}