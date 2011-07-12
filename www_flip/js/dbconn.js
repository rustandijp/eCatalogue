
var DBCONN = null;
var dbname = 'icatalogue';
var maxsize = 1000*1024;
var version = '1.0';
var description = 'iCatalogue DB';

function openDB(){
	DBCONN = window.openDatabase(dbname,version,description,maxsize,function(tx){
	 });				
}




function DBConn(){
  this.window=null;
  this.db=DBCONN;
  this.dbName='dbname';
  this.maxSize=1000*1024;
  this.version='1.0';
  this.description='Description';
  this.scripts = Array();

  this.installDB = function(){
  var myscript = this.scripts;
  var self = this;
  console.log('Start installing DB '+this.dbName + ',ver:'+this.version + ',desc:'+this.description + ',size:'+this.maxSize);
  try{
	  if(this.db==null)
		  this.openDB(); 
	  this.db.transaction(
			function(tx){
			  try{
				  var success = 0;
						  var failed = 0;
				  for(var i=0;i<myscript.length;i++){
						console.log(myscript[i]);
						  tx.executeSql(myscript[i]+';',[],function(tx,rs){
								success++;
								console.log('SUCCESS:'+success+',FAILED:'+failed+',myscript:'+myscript.length);
								if(success==myscript.length)
										self.onSuccessInstallDB(tx,rs);
								else if(success+failed == myscript.length)
										self.onErrorInstallDB(tx,rs);
							},function(tx,rs){
								failed++;
								console.log('FAILED:'+failed+',FAILED:'+failed+',myscript:'+myscript.length);
										console.log(rs);
								if(success+failed==myscript.length)
										self.onErrorInstallDB(tx,rs);
							});
				  }
			  }catch(ex){
			  	  console.log(ex.message);
			  }
			}); 
	}catch(e){
		console.log(e.message);
	}
 
  }
  
  this.onSuccessInstallDB=function(tx,err){
  }
  this.onErrorInstallDB = function(tx,err){
	     console.log(err);
	     console.log('Error Processing SQL :'+err +',TxMessage:'+err.message);
	}
	
   
  this.openDB = function(){
	  openDB();
	  this.db = DBCONN;
	 // console.log(DBCONN);
	 /* 
	var self = this;
	try{
		if(this.db==null){
			console.log('OPENING DB');
			this.db = window.openDatabase(this.dbName,this.version,this.description,
			   this.maxSize,function(tx){
										  console.log(tx);
					self.onSuccessOpenDB();
					   });
			//console.log(this.db);
			//DBCONN = this.db;
		}
		return 1;
	 }catch(ex){
		 console.log(ex);
		 return -1;
	  }*/
	}  
	
  
  this.onSuccessOpenDB = function(){
	  console.log('OPEN DB SUCCESS');	
  }
  
  this.successDB = function(){
      console.log('Success executing query');
  }

  this.errorDB = function(tx,err){
      console.log('Error Processing SQL :'+err +' Txcode:'+err.code +',TxMessage:'+err.message);
  }
  /*
  var sqlQuery;
  this.executeQuery = function(tx){
	  tx.executeSQL(sqlQuery);
  }*/

  this.onErrorQueryDB = function(tx,err){
		console.log('Error Processing SQL :'+err +' Txcode:'+err.code +',TxMessage:'+err.message);
	}
	
  this.onSuccessQueryDB = function(results){

  	}
  this.queryDB = function(query){
	  var obj = this;
	  console.log('Query DB :'+query);
	  if(this.db==null)
		  this.openDB();
	  this.db.transaction(function(tx){
						  tx.executeSql(query,[],function(tx,results){
								obj.onSuccessQueryDB(results);
							},function(tx,err){
								obj.onErrorQueryDB(tx,err);
								//return false;
							});				  
		  },obj.onErrorQueryDB,obj.successDB);
  }

	
  /* tableName to insert, row (array): data to be inserted*/ 
  this.insertData = function(tableName,row){
	  console.log('Insert Data on table :'+tableName);
	  if(this.db==null)
		  this.openDB();
	  var params;
	  for(var i=0;i<row.length;i++){
		  params += '?,';
	  }
	  params = params.substring(0,params.length-1);
	  var query = 'insert into '+ tableName +' values('+ params +')';
	  this.db.transaction(function(tx){
		tx.executeSql(query,row,this.onSuccessInsertDB);
	  },this.onErrorInsertDB,this.successDB);	  
  }

 this.onErrorInsertDB = function(tx,err){
	this.errorDB(tx,err);
 }
 this.onSuccessInsertDB = function(tx,err){
 }
	
 this.executeQuery = function(query,params){
	 var obj = this;
	 console.log('Query :'+query);
	 if(this.db==null)
		 this.openDB();
	 this.db.transaction(function(tx){
						 tx.executeSql(query,params,function(x,err){
								console.log(err);
								obj.onSuccessExecuteQuery(x,err); 
						},function(x,err){
							obj.onErrorExecuteQuery(x,err);
							//return false;
						});
	},obj.onErrorExecuteQuery,obj.successDB);	
 }
 this.onErrorExecuteQuery = function(tx,err){
	this.errorDB(tx,err);
  }
 this.onSuccessExecuteQuery = function(tx,err){
 }
   
}

