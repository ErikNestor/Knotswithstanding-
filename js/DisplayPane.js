function DisplayPane() {
	this.opened = 1;
	this.size = 1;
	this.pane = document.getElementById('text-pane');
	this.content = "";
}


DisplayPane.prototype.reset = function() {
	$('#text-pane').empty();
}

DisplayPane.prototype.add = function(st) {
	document.getElementById('text').innerHTML += st;
	//$('#text').text(st);
}

DisplayPane.prototype.changeSize = function() {
	this.size = this.size%3 + 1;
	
	switch (this.size) {
		case 1:
			$('#text-pane').css('height',  '255px');
			$('#text-pane').css('width', '160px');
			$('#closePane').css('left', '130px');
			$('#sizePane').css('left', '102px');
			$('#text').css('height', '220px');
			$('#text').css('width', '150px');
			break;
		case 2:
			$('#text-pane').css('height',  '600px');
			$('#text-pane').css('width', '350px');
			$('#closePane').css('left', '320px');
			$('#sizePane').css('left', '292px');
			$('#text').css('height', '565px');
			$('#text').css('width', '340px');
			break;
		case 3:
			$('#text-pane').css('height',  '200px');
			$('#text-pane').css('width', '950px');
			$('#closePane').css('left', '920px');
			$('#sizePane').css('left', '892px');
			$('#text').css('height', '165px');
			$('#text').css('width', '940px');	
	}	
}

$('#closePane').click(function(e){
	//alert("1");
	if (brd.disPane.opened) {
		//alert("2");
		$('#text-pane').css('visibility', 'hidden');
		$('#closePane').removeClass('opened');
		$('#closePane').addClass('closed');
		brd.disPane.opened = 0;	
	} else {
		$('#text-pane').css('visibility', 'visible');
		$('#closePane').addClass('opened');
		$('#closePane').removeClass('closed');
		brd.disPane.opened = 1;		
	}	
});
