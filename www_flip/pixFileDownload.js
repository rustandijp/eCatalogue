//
//  pixFileDownload.js
//  FileDownLoadApp
//
//  Created by Aaron saunders on 9/8/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//


var progressDiv="#download_progress";
var fileCount = 0;
var downloadedCount = 0;

function FileInfo(filepath, filename){
	this.filename = filename;
	this.filepath = filepath;
}

function PixFileDownload() {
	this.fileList = new Array();
}

PixFileDownload.prototype.startDownload = function(){
	$(""+progressDiv).html("ダウンロード \r" + url);	
	fileCount = this.fileList.length;
	if(fileCount<=0)
		catalog.notifDownloadComplete(1);
	for(var i=0;i<this.fileList.length;i++){
		var url = this.fileList[i].filepath;
		var destFileName = this.fileList[i].filename;
		PhoneGap.exec("PixFileDownload.downloadFile", url,destFileName);
	}
	this.fileList = null;
}

PixFileDownload.prototype.downloadFile = function(url,destFileName) {
	this.fileList.push(new FileInfo(url,destFileName));
};

PixFileDownload.prototype.endDownload = function() {
	this.fileList = new Array();
	fileCount = 0;
	downloadedCount = 0;
};

PhoneGap.addConstructor(function() {
						window.fileDownloadMgr = new PixFileDownload();
						});

function  pixFileDownloadComplete( filePath ) {
	console.log( "ダウンロード成功 \r" + filePath );
	downloadedCount++;
	catalog.updateProgressbar(55/fileCount);
	$(""+progressDiv).html("ダウンロード成功 \r" + filePath);
	if(downloadedCount == fileCount)
		catalog.notifDownloadComplete(1);
}

function  pixFileDownloadCompleteWithError( message ) {
    console.log( "ダウンロード失敗 \r" + message );
	downloadedCount++;
	$(""+progressDiv).html("ダウンロード失敗 \r" + message);
	if(downloadedCount == fileCount)
		catalog.notifDownloadComplete(1);	
}
