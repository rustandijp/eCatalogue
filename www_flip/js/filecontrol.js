
function filecontrol(window,filename){

	this.window = window;
	this.filename = filename;
	this.file = null;
	this.filewriter = null;
	this.filesystem = null;
	
	this.write = function(text,callbackfunction){
		console.log('Write to file');
		if(this.fileWriter==null)
			this.filewriter = new FileWriter(this.filesystem.root.fullPath+'/'+this.filename);
		this.filewriter.onwrite = callbackfunction;
		this.filewriter.write(text);
	}
	
	this.read = function(callbackfunction){
		if(this.file==null){
			this.init();
			return;
		}
		console.log('File to read');
		var reader = new FileReader();
		var self = this;
		reader.onloadend = callbackfunction;
		reader.onerror= function(evt){
			console.log('Failed read data');
			console.log(evt.code);
		};
		reader.readAsText(this.file);
	}
	
	this.init = function(){
		var self = this;
		//alert(this.window);
		this.window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
						function(filesystem){
							self.filesystem = filesystem;						
						  },this.fail);
	}
	
	this.appendText = function(){
	
	}
	

	this.fail = function(error){
		console.log('FILECONTROL ERROR!!');
		console.log(error);
	}
	
	this.onAfterInit = function(){
		console.log('INITIALIZATION SUCCESS');
	}
	
	this.getLocalURI = function(){
		return this.filesystem.root.toURI();
	}
	
	
}
