var media = null;
function playAudio(src,infodiv){
	if(media!=null)
		media.stop();
	media = new MediaControl(src,infodiv);
	media.play();
}

function stopAudio(){
	if(media!=null)
	    media.stop();	  
}

function pauseAudio(){
	if(media!=null)
	    media.pause();
}

function stopAllMedia(){
	if(media!=null)
		media.stop();
	//objects = document.getElementsByTagName("object");
	//objects.innerHTML = '';
}


function MediaControl(src,infodiv) {

// Audio player
//
this.my_media = new Media(src, this.onSuccess, this.onError);
this.mediaTimer = null;
this.src = src;
this.infodiv = infodiv;
this.position = 0;
// Play audio
//
this.play = function() {
	
	// Play audio
	this.my_media.play();
	var self = this;
	// Update my_media position every second
	if (this.mediaTimer == null) {
		// get my_media position	
		this.mediaTimer = setInterval(function(){
			self.position++;	
			//console.log('Position:'+position);
			$("#"+self.infodiv).html('Playing:' + self.src+' 秒　'+self.position);			  
		},1000);
	}
}

// Pause audio
// 
this.pause = function() {
	if (this.my_media) {
		this.my_media.pause();
	}
}

// Stop audio
// 
this.stop = function() {
	if (this.my_media) {
		this.my_media.stop();
	}
	clearInterval(this.mediaTimer);
	this.mediaTimer = null;
	this.position = 0;
}

// onSuccess Callback
//
this.onSuccess = function(){
	console.log("playAudio():Audio Success");
}

// onError Callback 
//
this.onError = function(error) {
	alert('code: '    + error.code    + '\n' + 
		  'message: ' + error.message + '\n');
}

// Set audio position
// 
this.setAudioPosition = function(position) {
	document.getElementById('audio_position').innerHTML = position;
}

}