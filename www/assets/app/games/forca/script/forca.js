(function($)
{
	$.fn.left = function(value)
	{
		if(value != undefined)
		{
			this.css('left', value);
			return this;
		}
		else
			return parseInt(this.css('left').replace('px',''));
	};
	
	$.fn.top = function(value)
	{
		if(value != undefined)
		{
			this.css('top', value);
			return this;
		}
		else
			return parseInt(this.css('top').replace('px',''));
	};
}
(jQuery));

function ForcaGame()
{
	ForcaGame.instance = this;

	this.container = null;
	this.word = null;
	
	this.correctGlyphs = null;
	this.wrongGlyphs = null;
	
	this.allowGlyphClick = false;
	this.keyboard = null;
	
	this.content = $('<div id="forcaGame" style="position:relative; background-image:url(\'assets/background.png\'); background-size:100% 100%; border: solid 1px #666; width:100%; height:100%; overflow:hiddem;"></div>');
	
	this.logo = $('<div id="logo" style="position:absolute; background-image:url(\'assets/logo.png\');left:62px; top:39px; width:170px;height:119px;"></div>');
	$(this.content).append(this.logo);
	
	this.helpButton = $('<div id="helpButton" style="position:absolute; background-image:url(\'assets/help_button.png\');left:760px; right:4px;width:35px;height:35px;cursor:hand;"></div>');
	$(this.helpButton).mouseup(function(){ ForcaGame.instance.onHelpButtonMouseUp(); });
	$(this.content).append(this.helpButton);
	
	this.keyboardContainer = $('<div id="keyboardContainer" style="position:absolute; left:130px;top:291px;"></div>');
	$(this.content).append(this.keyboardContainer);
	
	this.feedbackDisplay = $('<div id="feedbackDisplay" style="position:absolute; left:344px; top:34px; width:158px;height:171px;"></div>');
	$(this.content).append(this.feedbackDisplay);
	
	this.wordContainer = $('<div id="wordContainer" style="position:absolute; background-image:url(\'assets/gradient.png\');left:61px; top:217px; width:732px;height:49px;"></div>');
	$(this.content).append(this.wordContainer);
	
	this.initializeUI();
	
	this.initializeKeyboard();
	
	this.setFeedbackLevel(0);
}

ForcaGame.prototype.initializeUI = function()
{
	this.ui = $('<div></div>');	
	this.spanNumMoves = $('<span id="spanNumMoves"></span>');
	this.spanRunningTime = $('<span id="spanRunningTime"></span>');
	
	$(this.ui).html('Moves: ');
	$(this.ui).append(this.spanNumMoves);
	$(this.ui).append('</br>');	
	$(this.ui).append('Running Time: ');
	$(this.ui).append(this.spanRunningTime);
}

ForcaGame.prototype.initializeKeyboard = function()
{
	var glyphs = 
	[
		'QWERTYUIOP',
		'ASDFGHJKL',
		'ZXCVBNM'
	]

	this.keyboard = new Array();
	
	for(var i = 0; i < glyphs.length; i++)
	{
		var row = glyphs[i];
		
		var leftOffset = (600 - (row.length * 60))/2;
		
		for(var j = 0; j < row.length; j++)
		{
			var glyph = row[j];
			var keyStyle = 'left:'+(leftOffset+(j*60))+'px;top:'+(i*60)+'px;';
			var key = $('<div id="keyboard-key-'+glyph+'" class="key-normal" style="'+keyStyle+'">'+glyph+'</div>');
			var self = this;
			$(key).mouseup(function(){ self.onKeyMouseUp(this); })
			$(this.keyboardContainer).append(key);
		}
	}
}

ForcaGame.prototype.setNumMoves = function(value) 
{
	if(value == undefined) 
		return this.numMoves;
	
	this.numMoves = value;
	$(this.spanNumMoves).text(value);
}

ForcaGame.prototype.setRunningTime = function(value) 
{
	if(value == undefined) 
		return this.runningTime;
	
	this.runningTime = value;
	
	var timeText = '';
	
	var millis = value % 1000;
	var seconds = Math.floor(value/1000);	
	var minutes = Math.floor(seconds/60);
	var hours = Math.floor(minutes/60);
	
	minutes -= hours * 60;
	seconds -= minutes * 60;
	
	if(hours > 0)
	{
		hours = hours + '';
		minutes = minutes + '';
		seconds = seconds + '';
		while(hours.length < 1) hours = '0'+hours;
		while(minutes.length < 2) minutes = '0'+minutes;
		while(seconds.length < 2) seconds = '0'+seconds;
		timeText = hours + ':' + minutes + ':' + seconds;
	}
	else if(minutes > 0)
	{
		minutes = minutes + '';
		seconds = seconds + '';
		millis = millis + '';
		while(minutes.length < 1) minutes = '0'+minutes;
		while(seconds.length < 2) seconds = '0'+seconds;
		while(millis.length < 1) millis = '0'+millis;
		millis = millis.substring(0,1);
		timeText = minutes + ':' + seconds + '.' + millis;
	}
	else if(seconds > 9)
	{
		seconds = seconds + '';
		millis = millis + '';
		while(seconds.length < 1) seconds = '0'+seconds;
		while(millis.length < 2) millis = '0'+millis;
		millis = millis.substring(0,2);
		timeText = seconds + '.' + millis;
	}
	else
	{
		seconds = seconds + '';
		millis = millis + '';
		while(seconds.length < 1) seconds = '0'+seconds;	
		while(millis.length < 3) millis = '0'+millis;		
		timeText = seconds + '.' + millis;
	}
	
	$(this.spanRunningTime).text(timeText);
}

ForcaGame.prototype.startTimer = function(callback, interval)
{
	var instance = ForcaGame.instance;
		
	if(interval == undefined || isNaN(interval) || interval <= 20)
		interval = 20;
		
	if(!callback)
		return;
		
	instance.isRunning = true;
		
	var lastTimerTick = new Date().getTime();
	
	_tick();
	
	function _tick()
	{
		if(!instance.isRunning)
			return;
	
		var currentTimerTick = new Date().getTime();
		
		callback.call(null, currentTimerTick - lastTimerTick);
		
		lastTimerTick = currentTimerTick;
		
		setTimeout(_tick, interval);
	}
}

ForcaGame.prototype.stopTimer = function()
{
	var instance = ForcaGame.instance;
	instance.isRunning = false;
}

ForcaGame.prototype.onTimerTick = function(delta)
{
	var instance = ForcaGame.instance;
	
	instance.runningTime += delta;	
	instance.setRunningTime(instance.runningTime);
}

ForcaGame.IsValidGlyph = function(glyph)
{
	return (glyph != '_' && glyph != '-' && glyph != '|' && glyph != '/' && glyph != '\\' && glyph != ' '
			&& glyph != ';' && glyph != ',' && glyph != '.');
}

ForcaGame.prototype.initializeWord = function(word)
{
	this.tips = null;
	this.nextTip = 0;
	$(this.helpButton).css('visibility','hidden');

	if(word instanceof Object)
	{
		this.tips = word.tips;
		this.nextTip = Math.floor(Math.random() * this.tips.length);
		word = word.value;
	}
	
	if(this.tips && this.tips.length > 0)
	{
		$(this.helpButton).css('visibility','visible');
	}
	
	word = word.toUpperCase();
	this.word = word;
	
	this.correctGlyphs = new Array();
	this.wrongGlyphs = new Array();
	
	this.wordGlyphs = {};
	for(var i = 0; i < word.length; i++)
	{
		var glyph = word.charAt(i);
		
		if(glyph == 'Ã' || glyph == 'Á' || glyph == 'Â') glyph = 'A';
		else if(glyph == 'É' || glyph == 'Ê') glyph = 'E';
		else if(glyph == 'Í' || glyph == 'Î') glyph = 'I';
		else if(glyph == 'Õ' || glyph == 'Ó' || glyph == 'Ô') glyph = 'O';
		else if(glyph == 'Ú' || glyph == 'Û') glyph = 'U';
		else if(glyph == 'Ç') glyph = 'C';
		
		if(ForcaGame.IsValidGlyph(glyph))
		{
			if(!this.wordGlyphs[glyph])
				this.wordGlyphs[glyph] = { glyph:glyph, positions:[] };
			this.wordGlyphs[glyph].positions.push(i);
		}
	}
	
	console.log('wordGlyphs -> '+JSON.stringify(this.wordGlyphs));
	
	$(this.wordContainer).empty();
	
	for(var i = 0; i < this.word.length; i++)
	{
		var glyph = this.word[i];
		if(ForcaGame.IsValidGlyph(glyph))
		{
			var glyphDisplayStyle = 'left:'+(6+(i*40))+'px;top:0px;';
			var glyphDisplay = $('<div id="glyph-display-'+i+'" class="glyph-display" style="'+glyphDisplayStyle+'"></div>');
			$(this.wordContainer).append(glyphDisplay);
		}
	}
	
	this.setNumMoves(0);
	this.setRunningTime(0);
	this.isRunning = false;
	
	this.allowGlyphClick = true;
}

ForcaGame.prototype.setFeedbackLevel = function(level) 
{
	$(this.feedbackDisplay).css('background-image','url(\'assets/feedback_'+level+'.png\')')
}

ForcaGame.prototype.onHelpButtonMouseUp= function(key) 
{
	if(!this.tips || this.tips.length == 0)
		return;

	var tip = this.tips[this.nextTip];
	this.nextTip = (this.nextTip+1) % this.tips.length;
	
	if(tip && tip.length > 0)
		alert('hint: '+tip);
}

ForcaGame.prototype.onKeyMouseUp = function(key) 
{
	if(!this.allowGlyphClick)
		return;
	
	var glyph = $(key).text();
	
	var cIndex = this.correctGlyphs.indexOf(glyph);
	var wIndex = this.wrongGlyphs.indexOf(glyph);
		
	if(cIndex > -1 || wIndex > -1)
		return;
	
	if(this.correctGlyphs.length == 0 && this.wrongGlyphs.length == 0)
	{
		if(!this.isRunning)
			this.startTimer(this.onTimerTick, 20);
	}
	
	this.numMoves += 1;
	this.setNumMoves(this.numMoves);	
	
	if(this.wordGlyphs[glyph])
	{
		this.correctGlyphs.push(glyph);
		
		var positions = this.wordGlyphs[glyph].positions;
		for(var i = 0; i < positions.length; i++)
		{
			var p = positions[i];
			var glyphDisplay = $('#glyph-display-'+p);
			$(glyphDisplay).text(this.word.charAt(p));
		}		
		
		$(key).attr('class','key-correct');
		this.verifyHit();
	}
	else
	{
		this.wrongGlyphs.push(glyph);
		$(key).attr('class','key-wrong');
		
		this.setFeedbackLevel(this.wrongGlyphs.length);
		this.verifyHit();
	}
}

ForcaGame.prototype.verifyHit = function(key) 
{
	var gameFailed = (this.wrongGlyphs.length >= this.maxErrorCount);
			
	if(gameFailed)
	{
		this.stopTimer();
		alert('GAME FAILED...');
		this.allowGlyphClick = false;
		return;
	}
	
	var gameComplete = true;
	for(var glyph in this.wordGlyphs)
	{
		if(this.correctGlyphs.indexOf(glyph) == -1)
		{
			gameComplete = false;
			break;
		}
	}
	
	if(gameComplete)
	{
		this.stopTimer();
		alert('GAME COMPLETE: WORD -> '+this.word);
		this.allowGlyphClick = false;
		return;
	}
}

