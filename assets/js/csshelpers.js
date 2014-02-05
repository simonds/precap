var csshelpers = {
	doLorem: function() {
		$$('.Lorem').each(function(el){
			var myLorem = new Element('p', {
				text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
				});
			myLorem.inject(el);
		});

	}
	,doColors: function() {
		$$('.Color').setStyle('background-color', 'tan');
		$$('.ColorA').setStyle('background-color', 'DodgerBlue');
		$$('.ColorB').setStyle('background-color', 'FireBrick');
		$$('.ColorC').setStyle('background-color', 'Yellow');
		$$('.ColorD').setStyle('background-color', 'gold');
	}
	,doBorders: function() {
		$$('.BorderMe').setStyle('border', '1px solid red');
		$$('.BorderDashMe').each(function(el){
			var size = el.getSize();
			el.setStyles({
				border: '4px dashed #999',
				width: size.x-8
			});
		});
	}
	,doTags: function() {
		$$('.TagLocatation').each(function(el){
			var myLocation = el.getPosition();
			var myLocationInfo = new Element('div', {
				style: 'background:#C44900;padding:2px;color:white;font-family:helvetica;font-size:9px;width:70px;text-align:center;position:absolute;top:0px;z-index:5000;',
				html: 'X/Y: '+myLocation.x+' / '+myLocation.y
				});
			myLocationInfo.inject(el, 'top');
		});
		$$('.TagSize').each(function(el){
			var mySize = el.getSize();
			el.setStyle('position', 'relative');
			var mySizeInfo = new Element('div', {
				style: 'background:#3387CC;padding:2px;color:white;font-family:helvetica;font-size:9px;width:70px;text-align:center;position:absolute;top:0px;z-index:5000;',
				html: 'size: '+mySize.x+' x '+mySize.y
				});
			mySizeInfo.inject(el, 'top');
		});
	}
	,doHide: function() {
		$$('.HideMe').setStyle('display', 'none');
	}
	,doAll: function() {
		this.doLorem();
		this.doColors();
		this.doBorders();
		this.doTags();
		this.doHide();
	}
};
