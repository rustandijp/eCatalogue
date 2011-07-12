
function page(pageN,pageCnt,product){
  	this.pageNo =pageN;
	this.pageCount = pageCnt;
	this.product=product;
	this.pagecontent ='';
}

function setting(url,userid,password,shopname){
    this.URL = url;
	this.USERID = userid;
	this.PASSWORD = password;
	this.SHOPNAME = shopname;
}

function shop_user(db){
	this.id = '0';
	this.name = '';
	this.password = '';
	this.dbconn = dbconn;
	console.log('Shop User Class');
	
	this.selectAll=function(){
		var self = this;
		self.dbconn.onSuccessQueryDB=function(rs){
			var len = rs.rows.length;
			var resultArr = Array();
			for(var i=0;i<len;i++){
				var temp = new shop_user(null);
				temp.id = rs.rows.item(i).id;
				temp.name = rs.rows.item(i).name;
				temp.password = rs.rows.item(i).password;
				//console.log("Name:"+temp.name);
				resultArr.push(temp);			    
			}
			self.onCompleteSelect(resultArr);				
		};
		this.dbconn.queryDB('select * from shop_user');
	}
	
	this.login=function(name,password){
		var self = this;
		self.dbconn.onSuccessQueryDB=function(rs){
			var len = rs.rows.length;
			for(var i=0;i<len;i++){
				var temp = new shop_user(null);
				temp.id = rs.rows.item(i).id;
				temp.name = rs.rows.item(i).name;
				temp.password = rs.rows.item(i).password;
				if(name == temp.id){
					if(temp.password == password){
						self.onComplete(temp);
						return;
					}
					self.onComplete(-1);
				}
			}
			self.onComplete(0);
		};
		self.dbconn.queryDB('select * from shop_user');
	}
	
	this.getUserById=function(id){
		var self = this;
		this.dbconn.onSuccessQueryDB=function(rs){
			if(rs.rows.length<1)
				return null;
			self.id = rs.rows.item(0).id;
			self.name = rs.rows.item(0).name;
			self.password = rs.rows.item(0).password;
			self.onComplete(null);
		};
		this.dbconn.queryDB('select * from shop_user where id = '+id);
	}
	
	this.insert = function(){
		var self = this;
		this.dbconn.onSuccessExecuteQuery=function(tx,rs){
			self.onCompleteInsert(rs.insertId,rs.rowsAffected);
		};
		var params = Array();
		params[0] = this.id;
		params[1] = this.name;
		params[2] = this.password;
		this.dbconn.executeQuery('insert into shop_user(id,name,password) values(?,?,?)',params);
	}
	
	this.update = function(){
		var self = this;
		this.dbconn.onSuccessExecuteQuery=function(tx,rs){
			self.onCompleteUpdate(rs.updateId,rs.rowsAffected);
		};
		var params = Array();
		params[0] = this.id;
		params[1] = this.name;
		params[2] = this.password;
		params[3] = this.id;
		this.dbconn.executeQuery('update shop_user set id=?,name=?,password=? where id=?',params);		
	}
	
	this.onComplete=function(val){
		
	}
	this.onCompleteSelect = function(rs){
	}
	this.onCompleteInsert = function(insertedId,rowsAffected){
	}
	this.onCompleteUpdate = function(updatedId,rowsAffected){
	}
}


function sys_info(db){
	this.sv_url=null;
	this.catalogue_ver=null;
	this.download_date=null;
	this.dbconn = dbconn;
	
	this.selectAll=function(){
		//console.log(this.dbconn);
		var self = this;
		this.dbconn.db.transaction(
								   function(tx){
										tx.executeSql('select * from sys_info',[],function(tx,rs){
									    var len = rs.rows.length;
										var resultArr = Array();
										for(var i=0;i<len;i++){
											 var temp = new sys_info(null);
											 temp.sv_url = rs.rows.item(i).sv_url;
											 temp.catalogue_ver = rs.rows.item(i).catalogue_ver;
											 temp.download_date = rs.rows.item(i).download_date;
											 resultArr.push(temp);			    
										}
										self.onCompleteSelect(resultArr);
										},function(tx,err){
											 self.onError(err);
										});
								   });
	}
	

	
	this.insert = function(){
		var self = this;
		this.dbconn.onSuccessExecuteQuery=function(tx,rs){
			self.onCompleteInsert(rs.insertId,rs.rowsAffected);
		};
		var params = Array();
		params.push(this.sv_url);
		params.push(this.catalogue_ver);
		params.push(this.download_date);
		console.log('insert into sys_info(sv_url,catalogue_ver,download_date) values(?,?,?)');
		this.dbconn.executeQuery('insert into sys_info(sv_url,catalogue_ver,download_date) values(?,?,?)',params);
	}
	
	this.update = function(){
		var self = this;
		this.dbconn.onSuccessExecuteQuery=function(tx,rs){
			self.onCompleteUpdate(rs.updateId,rs.rowsAffected);
		};
		var params = Array();
		params[0] = this.sv_url;
		params[1] = this.catalogue_ver;
		params[2] = this.download_date;
		params[3] = this.sv_url;
		this.dbconn.executeQuery('update shop_user set sv_url=?,catalogue_ver=?,download_date=? where sv_url=?',params);		
	}
	
	this.onComplete=function(val){
		
	}
	this.onError = function(errorcode){
	
	}
	this.onCompleteInsert = function(insertedId,rowsAffected){
	}
	this.onCompleteSelect = function(rs){
	}
	this.onCompleteUpdate = function(updatedId,rowsAffected){
	}
}



function products(db){
	this.dbconn = dbconn;
    this.product_id='';
    this.product_name='';
	this.category_id = '';
	this.category_name = '';
	this.rank = '';
	this.status = ''; //2 = display, 1 = hidden
	this.product_flag = '';
	this.product_code = '';
	this.main_list_image = '';
	this.main_image = '';
	this.main_large_image = '';
	this.sub_image1 = '';
	this.sub_image2 = '';
	this.sub_image3 = '';
	this.sub_image4 = '';
	this.sub_image5 = '';
	this.sub_large_image1 = '';
	this.sub_large_image2 = '';
	this.sub_large_image3 = '';
	this.sub_large_image4 = '';
	this.sub_large_image5 = '';
	this.point_rate = '';
	this.class_category_name = '';
	this.price01 = '';
	this.price02 = '';
	this.pgcount = '';
	this.file1 = '';
	this.file2 = '';
	this.file3 = '';
	this.file4 = '';
	this.file5 = '';
	this.file6 = '';
	this.page1 = '';
	this.page2 = '';
	this.page3 = '';
	this.page4 = '';
	this.page5 = '';
	this.page6 = '';
	this.time='';
	
	this.load = function(){
		var self = this;
		DBCONN.db.transaction(function(tx){
			tx.executeSql("select * from products where product_id="+self.product_id,[],function(tx,rs){
				var len = rs.rows.length;
				for(var i=0;i<len;i++){
					self.product_id = rs.rows.item(i).product_id;
					self.product_name = rs.rows.item(i).product_name;
					self.category_id = rs.rows.item(i).category_id;
					self.category_name = rs.rows.item(i).category_name;
					self.rank = rs.rows.item(i).rank;
					self.status = rs.rows.item(i).status;
					self.product_flag = rs.rows.item(i).product_flag;
					self.product_code = rs.rows.item(i).product_code;
					self.main_list_image = rs.rows.item(i).main_list_image;
					self.main_image = rs.rows.item(i).main_image;
					self.main_large_image = rs.rows.item(i).main_large_image;
					self.sub_image1 = rs.rows.item(i).sub_image1;
					self.sub_image2 = rs.rows.item(i).sub_image2;
					self.sub_image3 = rs.rows.item(i).sub_image3;
					self.sub_image4 = rs.rows.item(i).sub_image4;
					self.sub_image5 = rs.rows.item(i).sub_image5;
					self.sub_large_image1 = rs.rows.item(i).sub_large_image1;
					self.sub_large_image2 = rs.rows.item(i).sub_large_image2;
					self.sub_large_image3 = rs.rows.item(i).sub_large_image3;
					self.sub_large_image4 = rs.rows.item(i).sub_large_image4;
					self.sub_large_image5 = rs.rows.item(i).sub_large_image5;
					self.point_rate = rs.rows.item(i).point_rate;
					self.class_category_name = rs.rows.item(i).class_category_name;
					self.price01 = rs.rows.item(i).price01;
					self.price02 = rs.rows.item(i).price02;
					self.pgcount = rs.rows.item(i).pgcount;
					self.file1 = rs.rows.item(i).file1;
					self.file2 = rs.rows.item(i).file2;
					self.file3 = rs.rows.item(i).file3;
					self.file4 = rs.rows.item(i).file4;
					self.file5 = rs.rows.item(i).file5;
					self.page1 = rs.rows.item(i).page1;
					self.page2 = rs.rows.item(i).page2;
					self.page3 = rs.rows.item(i).page3;
					self.page4 = rs.rows.item(i).page4;
					self.page5 = rs.rows.item(i).page5;
					self.page6 = rs.rows.item(i).page6;
					self.time = rs.rows.item(i).time;
				}
				self.onComplete(len);				
			});
		});
		
	}
	
	this.getCount = function(){
		var self = this;
		DBCONN.transaction(function(tx){
			tx.executeSql("select * from products where product_id="+self.product_id,[],function(tx,rs){
				var len = rs.rows.length;
				self.onCompleteGetCount(len);				
			});
		});
	}
	
	this.onCompleteGetCount = function(){
		
	}
	
	this.selectAll=function(){
		var self = this;
		DBCONN.transaction(function(tx){
			tx.executeSql("select * from products",[],function(tx,rs){
				var len = rs.rows.length;
				var resultArr = Array();
				for(var i=0;i<len;i++){
					var temp = new products(null);
					temp.product_id = rs.rows.item(i).product_id;
					temp.product_name = rs.rows.item(i).product_name;
					temp.category_id = rs.rows.item(i).category_id;
					temp.category_name = rs.rows.item(i).category_name;
					temp.rank = rs.rows.item(i).rank;
					temp.status = rs.rows.item(i).status;
					temp.product_flag = rs.rows.item(i).product_flag;
					temp.product_code = rs.rows.item(i).product_code;
					temp.main_list_image = rs.rows.item(i).main_list_image;
					temp.main_image = rs.rows.item(i).main_image;
					temp.main_large_image = rs.rows.item(i).main_large_image;
					temp.sub_image1 = rs.rows.item(i).sub_image1;
					temp.sub_image2 = rs.rows.item(i).sub_image2;
					temp.sub_image3 = rs.rows.item(i).sub_image3;
					temp.sub_image4 = rs.rows.item(i).sub_image4;
					temp.sub_image5 = rs.rows.item(i).sub_image5;
					temp.sub_large_image1 = rs.rows.item(i).sub_large_image1;
					temp.sub_large_image2 = rs.rows.item(i).sub_large_image2;
					temp.sub_large_image3 = rs.rows.item(i).sub_large_image3;
					temp.sub_large_image4 = rs.rows.item(i).sub_large_image4;
					temp.sub_large_image5 = rs.rows.item(i).sub_large_image5;
					temp.point_rate = rs.rows.item(i).point_rate;
					temp.class_category_name = rs.rows.item(i).class_category_name;
					temp.price01 = rs.rows.item(i).price01;
					temp.price02 = rs.rows.item(i).price02;
					temp.pgcount = rs.rows.item(i).pgcount;
					temp.file1 = rs.rows.item(i).file1;
					temp.file2 = rs.rows.item(i).file2;
					temp.file3 = rs.rows.item(i).file3;
					temp.file4 = rs.rows.item(i).file4;
					temp.file5 = rs.rows.item(i).file5;
					temp.page1 = rs.rows.item(i).page1;
					temp.page2 = rs.rows.item(i).page2;
					temp.page3 = rs.rows.item(i).page3;
					temp.page4 = rs.rows.item(i).page4;
					temp.page5 = rs.rows.item(i).page5;
					temp.page6 = rs.rows.item(i).page6;
					temp.time = rs.rows.item(i).time;
					resultArr.push(temp);			    
				}
				self.onCompleteSelect(resultArr);				
			});
		});
	}
	
	this.select=function(){
		var self = this;
		console.log('SELECT PRODUCTS');
		DBCONN.transaction(function(tx){
			tx.executeSql("select * from products where status=2 order by category_name asc,product_id asc",[],function(tx,rs){
				//console.log('RS RESULT:'+rs);
				var len = rs.rows.length;
				var resultArr = Array();
				for(var i=0;i<len;i++){
					var temp = new products(null);
					temp.product_id = rs.rows.item(i).product_id;
					temp.product_name = rs.rows.item(i).product_name;
					temp.category_id = rs.rows.item(i).category_id;
					temp.category_name = rs.rows.item(i).category_name;
					temp.rank = rs.rows.item(i).rank;
					temp.status = rs.rows.item(i).status;
					temp.product_flag = rs.rows.item(i).product_flag;
					temp.product_code = rs.rows.item(i).product_code;
					temp.main_list_image = rs.rows.item(i).main_list_image;
					temp.main_image = rs.rows.item(i).main_image;
					temp.main_large_image = rs.rows.item(i).main_large_image;
					temp.sub_image1 = rs.rows.item(i).sub_image1;
					temp.sub_image2 = rs.rows.item(i).sub_image2;
					temp.sub_image3 = rs.rows.item(i).sub_image3;
					temp.sub_image4 = rs.rows.item(i).sub_image4;
					temp.sub_image5 = rs.rows.item(i).sub_image5;
					temp.sub_large_image1 = rs.rows.item(i).sub_large_image1;
					temp.sub_large_image2 = rs.rows.item(i).sub_large_image2;
					temp.sub_large_image3 = rs.rows.item(i).sub_large_image3;
					temp.sub_large_image4 = rs.rows.item(i).sub_large_image4;
					temp.sub_large_image5 = rs.rows.item(i).sub_large_image5;
					temp.point_rate = rs.rows.item(i).point_rate;
					temp.class_category_name = rs.rows.item(i).class_category_name;
					temp.price01 = rs.rows.item(i).price01;
					temp.price02 = rs.rows.item(i).price02;
					temp.pgcount = rs.rows.item(i).pgcount;
					temp.file1 = rs.rows.item(i).file1;
					temp.file2 = rs.rows.item(i).file2;
					temp.file3 = rs.rows.item(i).file3;
					temp.file4 = rs.rows.item(i).file4;
					temp.file5 = rs.rows.item(i).file5;
					temp.page1 = rs.rows.item(i).page1;
					temp.page2 = rs.rows.item(i).page2;
					temp.page3 = rs.rows.item(i).page3;
					temp.page4 = rs.rows.item(i).page4;
					temp.page5 = rs.rows.item(i).page5;
					temp.page6 = rs.rows.item(i).page6;
					temp.time = rs.rows.item(i).time;
					resultArr.push(temp);			    
				}
				self.onCompleteSelect(resultArr);				
						  },function(tx,rs){
						  console.log(rs);
						  self.onError(rs);
						  });
		});
	}	
	
	
	this.insert = function(){
		var self = this;
		var params = Array();
		params.push(this.product_id);
		params.push(this.product_name);
		params.push(this.category_id);
		params.push(this.category_name);
		params.push(this.rank);
		params.push(this.status);
		params.push(this.product_flag);
		params.push(this.product_code);
		params.push(this.main_list_image);
		params.push(this.main_image);
		params.push(this.main_large_image);
		params.push(this.sub_image1);
		params.push(this.sub_image2);
		params.push(this.sub_image3);
		params.push(this.sub_image4);
		params.push(this.sub_image5);
		params.push(this.sub_large_image1);
		params.push(this.sub_large_image2);
		params.push(this.sub_large_image3);
		params.push(this.sub_large_image4);
		params.push(this.sub_large_image5);
		params.push(this.point_rate);
		params.push(this.class_category_name);
		params.push(this.price01);
		params.push(this.price02);
		params.push(this.pgcount);
		params.push(this.file1);
		params.push(this.file2);
		params.push(this.file3);
		params.push(this.file4);
		params.push(this.file5);
		params.push(this.page1);
		params.push(this.page2);
		params.push(this.page3);
		params.push(this.page4);
		params.push(this.page5);
		params.push(this.page6);
		params.push(this.time);
		DBCONN.transaction(function(tx){
				tx.executeSql('insert into products(product_id,product_name,category_id,category_name,rank,'+
				'status,product_flag,product_code,main_list_image,main_image,main_large_image,'+
				'sub_image1,sub_image2,sub_image3,sub_image4,sub_image5,sub_large_image1,sub_large_image2,'+
				'sub_large_image3,sub_large_image4,sub_large_image5,point_rate,class_category_name,'+
				'price01,price02,pgcount,file1,file2,file3,file4,file5,page1,page2,page3,page4,page5,page6,time)'+
				' values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',params,
				function(tx,rs){
					  self.onCompleteInsert(rs.insertId,rs.rowsAffected);
				},function(tx,err){
							  console.log('ERROR on insert products.msg:'+err.message);
					  //console.log(err);		  
				});
		});					   
	}
	
	this.update = function(){
		var self = this;
		var params = Array();
		params.push(this.product_name);
		params.push(this.category_id);
		params.push(this.category_name);
		params.push(this.rank);
		params.push(this.status);
		params.push(this.product_flag);
		params.push(this.product_code);
		params.push(this.main_list_image);
		params.push(this.main_image);
		params.push(this.main_large_image);
		params.push(this.sub_image1);
		params.push(this.sub_image2);
		params.push(this.sub_image3);
		params.push(this.sub_image4);
		params.push(this.sub_image5);
		params.push(this.sub_large_image1);
		params.push(this.sub_large_image2);
		params.push(this.sub_large_image3);
		params.push(this.sub_large_image4);
		params.push(this.sub_large_image5);
		params.push(this.point_rate);
		params.push(this.class_category_name);
		params.push(this.price01);
		params.push(this.price02);
		params.push(this.pgcount);
		params.push(this.file1);
		params.push(this.file2);
		params.push(this.file3);
		params.push(this.file4);
		params.push(this.file5);
		params.push(this.page1);
		params.push(this.page2);
		params.push(this.page3);
		params.push(this.page4);
		params.push(this.page5);
		params.push(this.page6);
		params.push(this.time);
		params.push(this.product_id);
		//console.log(this);
		DBCONN.transaction(function(tx){
			tx.executeSql('update products set product_name=?,category_id=?,category_name=?,rank=?,'+
								 'status=?,product_flag=?,product_code=?,main_list_image=?,main_image=?,main_large_image=?,'+
								 'sub_image1=?,sub_image2=?,sub_image3=?,sub_image4=?,sub_image5=?,sub_large_image1=?,sub_large_image2=?,'+
								 'sub_large_image3=?,sub_large_image4=?,sub_large_image5=?,point_rate=?,class_category_name=?,'+
								 'price01=?,price02=?,pgcount=?,file1=?,file2=?,file3=?,file4=?,file5=?,page1=?,page2=?,page3=?,page4=?,page5=?,page6=?,time=? where product_id=?',params,
			function(tx,rs){
				//		  console.log(self);
				//		  console.log(rs);
				  self.onCompleteUpdate(1);
			 },function(tx,err){
				  console.log('ERROR on insert products.msg:'+err.message);
			  //console.log(err);		  
			 });
		});					   
	}
	
	this.onComplete=function(val){
		
	}
	this.onError = function(err){
		
	}
	
	this.onCompleteInsert = function(insertedId,rowsAffected){
	}
	this.onCompleteUpdate = function(updatedId,rowsAffected){
	}
	this.onCompleteSelect = function(rs){
		
	}
	
	this.searchProduct=function(name){
	
	}
	
	this.getProduct=function(id){
		
	}
	
}

function sales_info(db){
    this.info_id='';
	this.time='';
	this.title='';
	this.is_shop='';
	this.content='';
	this.limit_date='';
    this.dbconn = dbconn;
	
	
	this.load = function(){
		var self = this;
		DBCONN.transaction(function(tx){
			tx.executeSql("select * from sales_info where info_id="+self.info_id,[],function(tx,rs){
				var len = rs.rows.length;
				for(var i=0;i<len;i++){
				    self.info_id='';
				    self.time='';
				    self.title='';
				    self.is_shop='';
				    self.content='';
				    self.limit_date='';
				}
				self.onComplete(len);				
			});
		});
		
	}
	
	this.getCount = function(){
		var self = this;
		DBCONN.transaction(function(tx){
			tx.executeSql("select * from sales_info where info_id="+self.info_id ,[],function(tx,rs){
				var len = rs.rows.length;
				self.onCompleteGetCount(len);				
			});
		});
	}
	
	this.onCompleteGetCount = function(){
		
	}
	
	this.selectAll=function(){
		var self = this;
		DBCONN.transaction(function(tx){
			tx.executeSql("select * from sales_info",[],function(tx,rs){
				var len = rs.rows.length;
				var resultArr = Array();
				for(var i=0;i<len;i++){
					var temp = new sales_info(null);
					temp.info_id=rs.rows.item(i).info_id;
					temp.time=rs.rows.item(i).time;
					temp.title=rs.rows.item(i).title;
					temp.is_shop=rs.rows.item(i).is_shop;
					temp.content=rs.rows.item(i).content;
					temp.limit_date=rs.rows.item(i).limit_date;
					
					resultArr.push(temp);			    
				}
				self.onCompleteSelect(resultArr);				
			});
		});
	}
	
	this.select=function(){
		var self = this;
		var params = new Array();
		params.push(self.is_shop);
		DBCONN.transaction(function(tx){
			tx.executeSql("select * from sales_info where is_shop=?",params,function(tx,rs){
			try{
				var len = rs.rows.length;
				var resultArr = new Array();
				for(var i=0;i<len;i++){
					var temp = new sales_info(null);
					temp.info_id=rs.rows.item(i).info_id;
					temp.time=rs.rows.item(i).time;
					temp.title=rs.rows.item(i).title;
					temp.is_shop=rs.rows.item(i).is_shop;
					temp.content=rs.rows.item(i).content;
					temp.limit_date=rs.rows.item(i).limit_date;
					resultArr.push(temp);			    
				}
				self.onCompleteSelect(resultArr);
						  }catch(el){
						  console.log(el);
						  }
			},function(tx,rs){
						  console.log("ERRRORR");
						  console.log(rs);
						  });
		});
	}	
	
	
	this.insert = function(){
		var self = this;
		dbconn.onSuccessExecuteQuery=function(tx,rs){
			self.onCompleteInsert(rs.insertId,rs.rowsAffected);
		};
		var params = Array();
		params.push(this.info_id);
		params.push(this.time);
		params.push(this.title);
		params.push(this.is_shop);
		params.push(this.content);
		params.push(this.limit_date);
		DBCONN.transaction(function(tx){
				tx.executeSql('insert into sales_info(info_id,time,title,is_shop,content,limit_date)'+
							  ' values(?,?,?,?,?,?)',params,function(tx,rs){
								self.onCompleteInsert(rs.insertId,rs.rowsAffected);
							  },function(tx,rs){
								console.log('ERROR INSERT SALES INFO');
							  });
						   });
	}
	
	this.update = function(){
		var self = this;		
		var params = Array();
		params.push(this.time);
		params.push(this.title);
		params.push(this.is_shop);
		params.push(this.content);
		params.push(this.limit_date);
		DBCONN.transaction(function(tx){
						   tx.executeSql("update sales_info set time=?,title=?,is_shop=?,content=?,limit_date=? where info_id='"+this.info_id +"'",params,
							function(tx,rs){
										 self.onCompleteUpdate(rs.rowsAffected);			
							},function(tx,rs){
										 console.log('ERROR UPDATE SALES INFO');	 
							});
						   });
	}
	
	this.onComplete=function(val){
		
	}
	this.onError = function(err){
		
	}
	
	this.onCompleteInsert = function(insertedId,rowsAffected){
	}
	this.onCompleteUpdate = function(rowsAffected){
	}
	this.onCompleteSelect = function(rs){
		
	}
	
}

function applications(){
    this.app_id='';
	this.time='';
	this.app_name='';
	this.display='';
	
	this.selectAll=function(){
		
	}
	
	this.searchApp=function(appName){
		
	}
	
	this.getApplications=function(appid){
		
	}
	
	this.insert = function(){
		
	}
	
	this.update = function(){
	}
	
}

