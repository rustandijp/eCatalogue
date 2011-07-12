
var CUSTOMER_TYPE = 0;
var SHOP_TYPE = 1;
var IDXPRODUCTCOUNT = 15;
var FILENAME = 'CATALOG.TXT';
var SITENAME = "icatalogue";
var GET_LIST_PRODUCT = "/icatalogue/index.php?option=com_icatalogue&task=get_list_product&format=raw";
var PRODUCT_URL = "/icatalogue/index.php?option=com_icatalogue&task=get_catalogue&format=raw";
var NEWS_URL = "/icatalogue/index.php?option=com_icatalogue&task=get_info&format=raw";
var SHOPLOGIN_URL = "/icatalogue/index.php?option=com_icatalogue&task=shop_login&format=raw";
var DEFAULT_URL = 'bond.sakura.ne.jp';
var DEFAULT_USERNAME = 'shop1';
var DEFAULT_PASSWORD = 'shop1';
var DEFAULT_SHOPNAME = 'BOND';

var productmodel = null;
var newsmodel = null;
var filesystem = null;

function icatalog(window){
	  this.indexpage = 1;	
	  this.indexpagecount = 1;
	  this.page =0; //start from cover
	  this.mydb = null;
	  this.products = '';
	  this.currentProduct=null;
	  this.pagesArr = new Array();
	  this.pageCount = 0;
	  this.cover = "";
	  this.openbookHtml = "";
	  this.closebookHtml = "";
	  this.animleftHtml = "";
	  this.animrightHtml = "";
	  this.news = new Array();
	  this.cart= new Array();
	  this.settingpage = new setting(DEFAULT_URL,DEFAULT_USERNAME,DEFAULT_PASSWORD,DEFAULT_SHOPNAME);
	  this.window = window;
	  this.currentDiv=null;	
	  this.sysmodel = null;
	  
  	  //read and write file
	  this.filecontrol = null;
		

	
	this.prev = function() {
		if(this.page>0){ 
		    this.contentDispr(this.page-1);
			this.page--;
	    }
		$("#pageno").html(this.page);	
	}
	
	this.next = function() {
		if(this.page<this.pageCount){
			this.contentDisp(this.page+1);
			this.page++;
		}
		$("#pageno").html(this.page);
	}
	
	
	this.nextproduct = function(){
		var pg2go = 1;
		for(var j=0;j<this.pagesArr.length;j++){
			console.log(this.pagesArr);
			var pgStart = this.pagesArr[j].pageNo;
			var pgEnd = pgStart+this.pagesArr[j].pageCount;
			console.log('Page:'+this.page +';PageStart:'+pgStart +';PageEnd:'+pgEnd);
			if(pgStart<=this.page&&pgEnd>this.page){
				if(j<this.pagesArr.length-1){
					pg2go = this.pagesArr[j+1].pageNo;
					console.log('Page2Go:'+pg2go);
					this.gotoPage(pg2go);
					break;
				}else
					navigator.notification.alert('これは最後の商品です',function(button){},'情報','OK');
			}
		}
		$("#pageno").html(this.page);
	}
	this.prevproduct = function(){
		var pg2go = 1;
		for(var i=0;i<this.pagesArr.length;i++){
			var pgStart = this.pagesArr[i].pageNo;
			var pgEnd =  pgStart+this.pagesArr[i].pageCount;
			//console.log('Page:'+this.page +';PageStart:'+pgStart +';PageEnd:'+pgEnd);
			if(pgStart<=this.page&&pgEnd>this.page){
				if(i>0){
					pg2go = this.pagesArr[i-1].pageNo;
					this.gotoPage(pg2go);
					break;
				}else
					navigator.notification.alert('これは最初の商品です',function(button){},'情報','OK');
			}
		}
		$("#pageno").html(this.page);		
	}
	
	this.nextindex = function(){
		var init = (this.indexpage-1)*IDXPRODUCTCOUNT;
		if(this.indexpage<this.indexpagecount){
			for(var i=init;i<init+IDXPRODUCTCOUNT;i++){
				$("#row_"+i).hide();
			}
			this.indexpage++;
			init = (this.indexpage-1)*IDXPRODUCTCOUNT;
			for(var i=init;i<init+IDXPRODUCTCOUNT;i++){
				$("#row_"+i).show();
			}
		}else{
			
		}
	}
	this.previndex = function(){
		var init = (this.indexpage-1)*IDXPRODUCTCOUNT;
		if(this.indexpage>1){
			for(var i=init;i<init+IDXPRODUCTCOUNT;i++){
				$("#row_"+i).hide();
			}
			this.indexpage--;
			init = (this.indexpage-1)*IDXPRODUCTCOUNT;
			for(var i=init;i<init+IDXPRODUCTCOUNT;i++){
				$("#row_"+i).show();
			}
		}else{
			
		}
	}
	
	  
	this.gotoPage = function(page2go){
		if(this.currentDiv!='ipad')
		    this.showDiv("ipad");
		if(this.page<page2go){
			this.page = page2go - 1;
			this.contentDisp(page2go);
			
		}else if(this.page>page2go){
			this.page = page2go + 1;
			this.contentDispr(page2go);
		}
		this.page = page2go;
		$("#pageno").html(this.page);	
	}
	
	this.shoplogin = function(passwd){
		if(passwd==this.settingpage.PASSWORD)
			return true;
		return false;
	}
	

	this.init = function(db){
		//this.mydb = db;
		console.log('INITIALIZING...');
		var self = this;

		var userid = this.window.localStorage.getItem('userid');
		if(userid!=null){
		   var serverurl = this.window.localStorage.getItem('serverurl');
		   var password = this.window.localStorage.getItem('password');
		   var shopname = this.window.localStorage.getItem('shopname');
		   this.settingpage=new setting(serverurl,userid,password,shopname);
		}
		
		
		$.ajax({
		url : 'pages/cover.html',
		async:false,
		error : function(request,data){
			   console.log('Error Downloading cover.html. Error status:'+data); 
			},
		success : function (data) {
				self.cover = data;
			}
		});
		
		$.ajax({
		url : 'openbook.html',
		async:false,
		error : function(request,data){
			 console.log('Error Downloading openbook.html. Error status:'+data);
			},
		success : function (data) {
				self.openbookHtml = data;
			}
		});

		$.ajax({
		url : 'closebook.html',
		async:false,
		error : function(request,data){
			   console.log('Error Downloading closebook.html. Error status:'+data);
			},
		success : function (data) {
				self.closebookHtml = data;
			}
		});
		
		$.ajax({
		url : 'animleft.html',
		async:false,
		error : function(request,data){
		   console.log('Error Downloading animleft.html. Error status:'+data);
		},
		success : function (data) {
				self.animleftHtml = data;
			}
		});
		
		$.ajax({
		url : 'animright.html',
		async:false,
		error : function(request,data){
		  console.log('Error Downloading animright.html. Error status:'+data);
		},
		success : function (data) {
			   self.animrightHtml = data;
		}
		});
		
		productmodel = new products(db);
		newsmodel = new sales_info(db);
		this.sysmodel = new sys_info(db);
		self.sysmodel.onError = function(error){ //DB IS NOT CREATED
			self.mydb.onSuccessInstallDB = function(tx,rs){
				console.log('SUCCESS INSTALL DB');
				self.loadCatalog(false);
				self.downloadNews();
			};
			self.mydb.onErrorInstallDB = function(tx,err){
				//console.log(err); 
				navigator.notification.alert('インストールできませんでした',function(button){},'情報','OK');
			};
			self.mydb.installDB();
		}
		self.sysmodel.onCompleteSelect = function(rs){
			self.loadCatalog(false);
			self.downloadNews();
		}
		self.sysmodel.selectAll();
		
	}
	
	this.insertToCart = function(){
	  	if(this.cart==null)
			this.cart = new Array();
		this.cart.push(this.currentProduct);
		var tableCart = document.getElementById('okonomiList');
		var row = tableCart.insertRow(1);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(2);
		var cell4 = row.insertCell(3);
		cell3.style.textAlign='right';
		cell1.innerHTML = this.currentProduct.product_code;
		cell2.innerHTML = this.currentProduct.product_name;
		cell3.innerHTML = addCommas(this.currentProduct.price02) +'円';
		cell4.innerHTML = "<a href='#' onclick='removeFromCart("+ (this.cart.length) +")'><img src='images/del.png'/></a>";
		navigator.notification.alert('カートへ入れました',function(button){},'情報','OK');
	}
	
	
	this.removeCart = function(index){
		var idx = index;
		var self = this;
	    navigator.notification.confirm('削除してよろしいですか?',function(del){
											if(del==1){
												self.cart.splice(idx);
												var tableCart = document.getElementById('okonomiList');
												tableCart.deleteRow(idx);
											}
									   }
				,'確認','はい,いいえ');
	}
	
	
	/*
	 * RETRIEVE PRODUCT INFO FROM DB
	 */
	this.loadCatalog = function(isAll){
		console.log('Load Catalog');
		var self = this;
		var p = new products(null);;
		p.onCompleteSelect = function(rs){
			self.products = rs;
			self.refresh();
		}
		if(isAll==true)
			p.selectAll();
		else
		    p.select();
	}
	
	/*
	 * RETRIEVE NEWS FROM DB
	 */
	this.loadNews = function(type){
		var self = this;
		var n = new sales_info(self.mydb);
		n.is_shop = type;
		n.onCompleteSelect = function(rs){
			if(rs.length>0){
				var news = "<p><b>"+rs[0].title +"</b> : "+rs[0].content +"</p>";
				$(".newsFlash").html(news);
			}
		}
		n.select();
	}
	
	this.setSettingData = function(userid,password,shopname,serverurl){
		var self = this;
		console.log("SHOPLOGIN..http://"+ serverurl +"/icatalogue/index.php?option=com_icatalogue&task=shop_login&format=raw&userid="+userid +"&password="+password + "&shopname="+shopname);
		$.ajax({
			url : "http://"+ serverurl +"/icatalogue/index.php?option=com_icatalogue&task=shop_login&format=raw&userid="+userid +"&password="+password + "&shopname="+shopname,
			async:false,
			timeout:3000,
			error : function(jqxhr,msg){
			   navigator.notification.alert('アドレスに接続できません',function(button){},'情報','OK');
			   return;
			},
			success : function (data) {			   
			   var result = eval("("+data +")");
			   if(result==null){
			     //navigator.notification.alert();
			      navigator.notification.alert('アドレスに接続できません',function(button){},'情報','OK');
			      return;
			   }
				   
			   if(result.login==-1){
			       navigator.notification.alert('ユーザ名またはパスワードが間違っています',function(button){},'情報','OK');
			       return;			   
			   }
			   			   
			   self.settingpage = new setting(serverurl,userid,password,shopname);
			   self.window.localStorage.setItem('password',password);
			   self.window.localStorage.setItem('userid',userid);
			   self.window.localStorage.setItem('shopname',shopname);
			   self.window.localStorage.setItem('serverurl',serverurl);
			   navigator.notification.alert('店の設定情報を保存されました',function(button){},'情報','OK');
				
			}
		});
	}
	

	
	this.isFirstTime  = function(){
		console.log('IsFirstTime method');
		var userid = this.window.localStorage.getItem('userid');
		if(userid!=null){
			var password = this.window.localStorage.getItem('password');
			var shopname = this.window.localStorage.getItem('shopname');
			var serverurl = this.window.localStorage.getItem('serverurl');
			this.settingpage = new setting(serverurl,userid,password,shopname);
			return 0;
		}
		return 1;
	
	}
	
	
	this.reset = function(){
		document.location = 'index.html';
		
	}
	
	this.refresh = function(){
		var self = this;
		var pgcount =1;
		self.pagesArr.length = 0;
		self.cart.length = 0;
		//console.log(self.products);
		if(!self.products||self.products.length<1){
			reloadProductSetting();
			return;
		}
		for(var i=0;i<self.products.length;i++){
			var product = self.products[i];
			if(self.products[i].status==0)
				continue;
			var cnt =product.pgcount;				
			self.pagesArr.push(new page(pgcount,cnt,self.products[i]));//first product
			pgcount +=cnt;
		}
		self.pageCount = pgcount-1;	
		var htmlIndex="";
		var category ="";
		var rowcount = 0;
		for(var j=0;j<self.pagesArr.length;j++){
			var product = self.pagesArr[j].product;
			if(category!=product.category_name){
				if(category!='')
					htmlIndex = htmlIndex + '</li></ul>';
				category = product.category_name;
				htmlIndex += "<li><a href='#'>"+ product.category_name +"</a><ul>";
			}
			htmlIndex += "<li id='row_"+rowcount+"'><A HREF='#' onclick='gotoPage("+self.pagesArr[j].pageNo +")'>"+ product.product_name +"</a></li>";
			rowcount++;
		}
		if(rowcount<IDXPRODUCTCOUNT){
			$("#indexnavi").hide();
		}else
			$("#indexnavi").show();

		
		if(category!='')
			htmlIndex += '</ul>';
		//console.log(htmlIndex);
		$("#category").html(htmlIndex);
		$("#pagetotal").html(this.pageCount);
		
		this.indexpagecount = parseInt(rowcount / IDXPRODUCTCOUNT);
		if(rowcount%IDXPRODUCTCOUNT!=0)
			this.indexpagecount++;
		var initidx = (this.indexpage-1)*IDXPRODUCTCOUNT;
		for(var i=0;i<rowcount;i++){
			if(i>=initidx && i<initidx+IDXPRODUCTCOUNT)
				$("#row_"+i).show();
			else
				$("#row_"+i).hide();
		}
		reloadProductSetting();
	}
	
	
	function fail(evt) {
		console.log(evt.target.error.code);
	}
	
	this.writeToFile = function(content,fileName){
       if(fileName==null)
		  fileName=FILENAME;
	}
	
	this.downloadNews = function(){
		console.log('DOWNLOADING NEWS ON '+ this.settingpage.URL + NEWS_URL);
		var urlnews = 'http://'+ this.settingpage.URL+  NEWS_URL;
		var self = this;
		$.ajax({
		url : urlnews,
		async: false,
		timeout: 5000,
		error : function(request,status){
			console.log('Cannot retrieve news');
		},
		success : function (data) {
			   self.news = new Array();
				var newscontent = eval('('+data +')');
				for(var i=0;i<newscontent.length;i++){
					//self.news.push("<p><b>"+newscontent[i].title +"</b> : "+newscontent[i].content +"</p>");
					self.insertNews(newscontent[i]);
			   //console.log(newscontent[i]);
			   }
			}
		});
	}

	this.downloadCatalog = function(){
		var self = this;
		var contents = null;
		console.log('Downloading PRODUCT DATA from '+this.settingpage.URL + PRODUCT_URL);
		$('#product_setting_submit').hide();
		//$('#download_progress').html("<em>ダウンロード中..</em> <img src='images/ajax-loader.gif'>");
		$('#progressbar').progressbar('enable');
		$('#progressbar').progressbar({value:5});
		$.ajax({
			   url : 'http://'+this.settingpage.URL + PRODUCT_URL,
			   async:true,
			   timeout:5000,
			   error : function(request,status){
				navigator.notification.alert('接続失敗。タイムアウトです',function(button){},'情報','OK');
			   },
			   success : function (data) {
			   contents = eval('('+data +')');
			   for(var i=0;i<contents.products.length;i++){
			   self.updateProgressbar(40/contents.products.length);
			   var item = contents.products[i];
			   //$('#download_progress').html("ダウンロード中 "+ (i+1) + " 合計 "+contents.products.length);	
			   
			   for(var j=0;j<item.pgcount;j++){
			   $.ajax({
					  url : "http://"+ self.settingpage.URL +"/"+ SITENAME +"/"+ item.downloadpath +"/page"+(j+1)+".html",
					  async : false,
					  error : function(request,status){
						$('#download_progress').html("ダウンロード no "+ (i+1) + " 失敗. エラーは:"+status);	
					    console.log('FAILED ACCESSING FILE.'+item.downloadpath +"/page"+(j+1)+".html");
					  },
					  success : function(data2){
					  
						switch(j){
						case 0:
							item.page1 = self.replaceToLocalPath(data2);
							break;
						case 1:
							item.page2 = self.replaceToLocalPath(data2);
							break;
						case 2:
							item.page3 = self.replaceToLocalPath(data2);
							break;
						case 3:
							item.page4 = self.replaceToLocalPath(data2);
							break;
						case 4:
							item.page5 = self.replaceToLocalPath(data2);
							break;
						case 5:
							item.page6 = self.replaceToLocalPath(data2);
							break;
					 }
					}
			   });
			   
			   }
			   self.insertProduct(item);
			   
			   //DOWNLOAD IMAGES
			    var URLPATH = "http://"+ self.settingpage.URL +"/"+ SITENAME +"/"+item.downloadpath +"/images/";
				if(item.main_list_image){
					fileDownloadMgr.downloadFile(URLPATH+item.main_list_image,item.main_list_image);
				}			   
				if(item.main_image)
					fileDownloadMgr.downloadFile(URLPATH+item.main_image,item.main_image);
				if(item.main_large_image)
					fileDownloadMgr.downloadFile(URLPATH+item.main_large_image,item.main_large_image);
				if(item.sub_image1)
					fileDownloadMgr.downloadFile(URLPATH+item.sub_image1,item.sub_image1);
				if(item.sub_image2)
					fileDownloadMgr.downloadFile(URLPATH+item.sub_image2,item.sub_image2);
				if(item.sub_image3)
					fileDownloadMgr.downloadFile(URLPATH+item.sub_image3,item.sub_image3);
				if(item.sub_image4)
					fileDownloadMgr.downloadFile(URLPATH+item.sub_image4,item.sub_image4);
				if(item.sub_image5)
					fileDownloadMgr.downloadFile(URLPATH+item.sub_image5,item.sub_image5);
				if(item.sub_large_image1)
					fileDownloadMgr.downloadFile(URLPATH+item.sub_large_image1,item.sub_large_image1);
				if(item.sub_large_image2)
					fileDownloadMgr.downloadFile(URLPATH+item.sub_large_image2,item.sub_large_image2);
				if(item.sub_large_image3)
					fileDownloadMgr.downloadFile(URLPATH+item.sub_large_image3,item.sub_large_image3);
				if(item.sub_large_image4)
					fileDownloadMgr.downloadFile(URLPATH+item.sub_large_image4,item.sub_large_image4);
				if(item.sub_large_image5)
					fileDownloadMgr.downloadFile(URLPATH+item.sub_large_image5,item.sub_large_image5);
			   
			    
			    var URLPATH = "http://"+ self.settingpage.URL +"/"+ SITENAME +"/"+item.downloadpath +"/media/";
			    if(item.file1){
			        fileDownloadMgr.downloadFile(URLPATH+item.file1,item.file1);
				}
			    if(item.file2){
					fileDownloadMgr.downloadFile(URLPATH+item.file2,item.file2);
			    }
			    if(item.file3){
					fileDownloadMgr.downloadFile(URLPATH+item.file3,item.file3);
				}
				if(item.file4){
					fileDownloadMgr.downloadFile(URLPATH+item.file4,item.file4);
				}
				if(item.file5){
					fileDownloadMgr.downloadFile(URLPATH+item.file5,item.file5);
				}
				if(item.file6){
					fileDownloadMgr.downloadFile(URLPATH+item.file6,item.file6);
				}
			   
			   }
			   fileDownloadMgr.startDownload();
			   //self.notifDownloadComplete(1);
			   }
			   });
	}
	
	this.updateProgressbar = function(addition){
		var val = $('#progressbar').progressbar('value')+addition;
		$('#progressbar').progressbar({value:val});
	}
	
	this.notifDownloadComplete = function(ret){
		$('#product_setting_submit').show();
		$('#progressbar').progressbar('disable');
		$('#download_progress').html("<em>ファイルに書き込む中 </em> <img src='images/ajax-loader.gif'>");
		this.loadCatalog(false);
		$('#download_progress').html("");
		$('#progressbar').progressbar({value:0});
		navigator.notification.alert('ダウンロード処理完了です',function(button){},'情報','OK');
		//reloadProductSetting();	
		fileDownloadMgr.endDownload();
	}
	
	this.replaceToLocalPath = function(content){
		while(content.indexOf('pages/save_image')>0){
			try{
			content = content.replace('pages/save_image',filesystem.root.toURI());
			//console.log('Content :'+content);
			}catch(e){
				console.log(e);
				break;
			}
		}
		return content;
	}


	/**
	 * 
	 */	
	this.saveContent = function(){
	  for(var i=0;i<this.products.length;i++){
		  console.log('SAVE CONTENT PRODUCT:');
		  this.insertProduct(this.products[i]);
	  }	
	}
	
	this.showDiv = function(divid){
		var allDivs = Array("login","setting","product_setting","index","catalogue","cover","okonomi",
							"userreg","userlogin","confirmation","loading");
		//for(var i=0;i<allDivs.length;i++)
		//	$("#"+allDivs[i]).removeClass("current");
		var anim = 'slide';
		if(divid=='setting'){
			this.showSetting();  
		}else if(divid=='okonomi'){			
			this.showOkonomi();
		}else if(divid=='login'){
			anim='slideup';
			this.showLogin();
		}else if(divid=='index'){
			this.showIndex();			
			anim = 'flip';
		}else if(divid=='product_setting'){
			this.showProductSetting();
		}
		this.currentDiv = divid;
		//console.log(jQT);
		jQT.goTo('#'+divid,anim);
	}
	
	this.showLogin = function(){
		$('#login_password').val('');
	}
	
	this.showSetting = function(){
		//stopAudio();
		this.loadNews(SHOP_TYPE);
		$('#shop_userid').val(this.settingpage.USERID);
		$('#shop_shopname').val(this.settingpage.SHOPNAME);
		$('#shop_serverurl').val(this.settingpage.URL);
		$('#shop_password').val(this.settingpage.PASSWORD);
	}
	
	this.showIndex = function(){
		this.loadNews(CUSTOMER_TYPE);
		var html = disableScript($("#animleft").html(),"object");
		$("#animleft").html(html);
		//console.log($("#animleft").html());
	}
	
	this.showCatalogue = function(){
	
	}
	
	this.showCover = function(){
	
	}
	
	this.showProductSetting = function(){
		this.loadNews(SHOP_TYPE);
		this.loadCatalog(true);
	}
	
	this.showOkonomi = function(){
		var html = disableScript($("#animleft").html(),"object");
		$("#animleft").html(html);
		var image = document.getElementById('qrcode_image');
		var link = document.getElementById('buy_link');
		var href = "http://"+this.settingpage.URL +"/"+ SITENAME +"/index.php?option=com_icatalogue&task=buy_product&pt=2&shop="+this.settingpage.USERID +"&favorite="; 
		var src = "http://qrcode.kaywa.com/img.php?s=4&d=http%3A%2F%2F"+ this.settingpage.URL +"%2Ficatalogue%2Findex.php%3Foption%3Dcom_icatalogue%26task%3Dbuy_product%26pt%3D1%26shop%3D"+ this.settingpage.USERID +"%26favorite%3D";
		for(var i=0;i<this.cart.length;i++){
			src += this.cart[i].product_id;
			href += this.cart[i].product_id;
			if(i<this.cart.length-1){
				src += "%3B";
				href += ";";
			}
		}
		image.src = src;
		link.href = href;
		//console.log(image.src);
	}
	
	this.showConfirmation = function(){
	
	}
	
	

	this.contentDisp = function(page2disp)
	{	
		//console.log('Page2Display:'+page2disp);
		var data="";
		if(page2disp==1){
			data = this.replaceContent(this.openbookHtml,0);
		}
		else {
			data = this.replaceContent(this.animleftHtml,0);
		}
		$("#animleft").html(data);
	}
	
	this.contentDispr = function(page2disp)
	{  
		//console.log('Page2Display:'+page2disp + ';page:'+page);
		var data="";
		if(page2disp==0){
			data = this.replaceContent(this.closebookHtml,1);
		}
		else {
			data = this.replaceContent(this.animrightHtml,1);
		}
		$("#animleft").html(data);
	}
	
	
	
	this.replaceContent=function(data,direction){
		while(data.match(/###PAGES/gi)){
			var start = data.indexOf("###PAGES")+8;
			var end = data.indexOf(".HTML");
			var pageNumber = parseInt(data.substring(start,end));
			var dispPage = 1;
			if(direction==1)
			   dispPage = pageNumber==1? this.page-1 : this.page;
			else
			   dispPage = pageNumber==1? this.page : this.page+1;
			//console.log('PageNumber:'+pageNumber +';page:'+this.page +';dispPage:'+dispPage);
			var content = this.loadPage(dispPage);
			//console.log(content);
			if(direction==1){ //right to left
				if(pageNumber==2){
				  content = disableScript(content,"script");
				  content = disableScript(content,"object");
				}
			}else{ //left to right
				if(pageNumber==1){
				  content = disableScript(content,"script");
				  content = disableScript(content,"object");
				}
			}
			data = data.replace("###PAGES"+ (pageNumber)+".HTML###",content);
		}
		return data;
	}

	
	
	this.loadPage = function(pageNumber){
		if(pageNumber==0)
			return this.cover;
		var productIdx = 0; //product index
		var tplNo = 0; //page no relative with product number
		//console.log('Displaying page :'+pageNumber);
		var pageCnt = 0;
		var product = null;
		for(var i=0;i<this.pagesArr.length;i++){
			pageCnt = this.pagesArr[i].pageCount;
			product = this.pagesArr[i].product;	
			//console.log('Product Name:'+product._product_name + '; Page No :'+this.pagesArr[i].pageNo + '; Page Count :'+this.pagesArr[i].pageCount);
			if(pageNumber==this.pagesArr[i].pageNo){ //jump from index
				tplNo = pageCnt>1? 1 : 0; //  or tpl_single
				break;
			}
			if(i<this.pagesArr.length-1&&pageNumber>this.pagesArr[i].pageNo&&pageNumber<this.pagesArr[i+1].pageNo){
				tplNo = pageNumber - this.pagesArr[i].pageNo + 1;
				break;
			}
			if(i==this.pagesArr.length-1){
				tplNo = pageNumber - this.pagesArr[i].pageNo + 1;
				break;
			}
		}
		if(this.products==null)
			return null;
		var result = null;
		switch(tplNo){
			case 0:
				result = product.page1;
				break;
			case 1:
				result = product.page1;
				break;
			case 2:
				result = product.page2;
				break;				
			case 3:
				result = product.page3;
				break;				
			case 4:
				result = product.page4;
				break;				
			case 5:
				result = product.page5;
				break;				
			default:
				result = product.page6;
				break;				
			}
		this.currentProduct =  product;
		$('#title').html(product.product_name);
		return result;	
	}
	
	this.stopAnim = function(idx){
		var animArr = new Array("img_zoom","img_rotate","img_zoomnskew","img_opaque","img_wipe","img_peak");
		var animatedEls = document.getElementsByClassName(animArr[idx]);
		//console.log(animArr[idx] + ' is stopped');	
		for (var i = animatedEls.length - 1; i >= 0; i--){
			animatedEls[i].style.webkitAnimationPlayState = "paused";	
		};
		
	}
	
	/*
	 * INSERT OR UPDATE NEW PRODUCT
	 */
	this.insertProduct = function(item){
		var p = new products(null);
	    p.product_id=item.product_id;
	    p.product_name = item.product_name;
    	p.category_id = item.category_id;
    	p.category_name = item.category_name;
    	p.rank = item.rank;
    	p.status = item.status; //2 = display, 1 = hidden
    	p.product_flag = item.product_flag;
    	p.product_code = item.product_code;
    	p.main_list_image = item.main_list_image;
    	p.main_image = item.main_image;
    	p.main_large_image = item.main_large_image;
    	p.sub_image1 = item.sub_image1;
    	p.sub_image2 = item.sub_image2;
    	p.sub_image3 = item.sub_image3;
    	p.sub_image4 = item.sub_image4;
    	p.sub_image5 = item.sub_image5;
    	p.sub_large_image1 = item.sub_large_image1;
    	p.sub_large_image2 = item.sub_large_image2;
    	p.sub_large_image3 = item.sub_large_image3;
    	p.sub_large_image4 = item.sub_large_image4;
    	p.sub_large_image5 = item.sub_large_image5;
    	p.point_rate = item.point_rate;
    	p.class_category_name = item.class_category_name;
    	p.price01 = item.price01;
    	p.price02 = item.price02;
    	p.pgcount = item.pgcount;
    	p.file1 = item.file1;
    	p.file2 = item.file2;
    	p.file3 = item.file3;
    	p.file4 = item.file4;
    	p.file5 = item.file5;
    	p.file6 = item.file6;
    	p.page1 = item.page1;
    	p.page2 = item.page2;
    	p.page3 = item.page3;                           
    	p.page4 = item.page4;
    	p.page5 = item.page5;
    	p.page6 = item.page6;	    
	    p.onCompleteGetCount = function(len){
	    	p.time=new Date();	
	    	if(!len){
	    		p.onCompleteInsert = function(insertid,rowInserted){
	    			console.log('New Product Inserted. insertid:'+insertid +',rowInserted:'+rowInserted);
	    		}
	    		p.insert();
	    	}else{
	    		p.onCompleteUpdate = function(rowInserted){
	    			console.log('Product Updated. rowUpdated:'+rowInserted);
	    		}
	    		p.update();
	    	}
	    }
	    p.getCount();
	}
	
	this.insertNews = function(item){
		var p = new sales_info(null);
	    p.info_id=item.id;
	    p.time = item.date_time;
    	p.title = item.title;
    	p.is_shop = item.type;
    	p.content = item.content;
    	p.limit_date = item.end_date;
	    p.onCompleteGetCount = function(len){
	    	if(!len){
	    		p.onCompleteInsert = function(insertid,rowInserted){
	    			console.log('New Info Inserted. insertid:'+insertid +',rowInserted:'+rowInserted);
	    		}
	    		p.insert();
	    	}else{
	    		p.onCompleteUpdate = function(insertid,rowInserted){
	    			console.log('Info Updated. rowUpdated:'+rowInserted);
	    		}
	    		p.update();
	    	}
	    }
	    p.getCount();
	}
	
	this.loadDBScript = function(){
	    console.log('Load DB Script');
		var scripts = Array();
		$.ajax({
			url : 'dbscript.txt',
			async:false,
			success : function (data) {
				var pointer = 0;
			   while(data.indexOf(';',pointer)>0){
					var end = data.indexOf(';',pointer);
					var content = data.substring(pointer,end);
					scripts.push(content);
					pointer =  end+1;
				}
			}
		});
		return scripts;
	}
}

function disableScript(htmlValue,script){
  var start = htmlValue.indexOf("<"+script);
  var end = htmlValue.indexOf("</"+script +">");
	if(start>=0&&end>start){
		var content = htmlValue.substring(start,end+9);
		//console.log('Disabled Content :'+content);
		return htmlValue.replace(content,'');
	}
	return htmlValue;
}



function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}