var express = require('express');
var app = express();

const fs = require('fs');

var snmp = require ("net-snmp");

var session = snmp.createSession ("200.137.87.181", "d3s4f10");

var oids = ["1.3.6.1.2.1.1.1.0", "1.3.6.1.2.1.2.2.1.8.1001", "1.3.6.1.2.1.2.2.1.8.1002"];

var oids_2 = 	[
			{	
			nome:"nome1",
			name_oid:	["1.3.6.1.2.1.1.1.0"],
			ports:  { porta1:["1.3.6.1.2.1.2.2.1.8.1001"],
				  porta2:["1.3.6.1.2.1.2.2.1.8.1002"]
				}
			}
		]

		
//console.log(oids_2.lenght)
//for (x in oids_2) {
//console.log(x)
//console.log(oids_2[x].ports);
//console.log(oids_2[x].name_oid);
	//for (p in oids_2[x].ports)
	//	console.log(oids_2[x].ports[p]);
//	var teste = Object.keys(oids_2[x].ports);
//	console.log(teste.length);
//}

//console.log(oids_2.sys[0]['name_oid']);

function getdadossnmp(res,solicitacao) {

var resposta_json = 	{
				//acess:"date",
				//sysname:[],
				//estado:[]
			};
if(!(solicitacao == '/' || solicitacao == '/nome' || /\/porta*/.test(solicitacao))) {
	res.send("Nao encontrado");
}else {
	for (x in oids_2) {
	var datetime = new Date();
	resposta_json['acess'] = datetime;

 	if(solicitacao == '/' || solicitacao == '/nome') {
	session.get(oids_2[x].name_oid, function(error, varbinds) {
		if (error) {
		        console.error (error);
		    } else {
		        for (var i = 0; i < varbinds.length; i++)
		        	if (snmp.isVarbindError (varbinds[i]))
                			console.error (snmp.varbindError (varbinds[i]))
            			else
					resposta_json['sysname'] = (varbinds[i].value + "");
			}
		if (solicitacao == '/nome') {
		res.json(resposta_json);
		fs.writeFile('./datalog.txt', JSON.stringify(resposta_json),{ flag: 'a+' }, (err) => {
  		if (err) {
		    console.error(err)
		  }
  //file written successfully
  		});
		}	
	//console.log(resposta_json);
	});
	}
	 if(solicitacao == '/') {
	 for (p in oids_2[x].ports) {
	var temp = oids_2[x].ports[p];
//	console.log(p);	
	var count = Object.keys(oids_2[x].ports);
	var z = 0; 
	session.get (temp, function(error, varbinds) {
		 if (error) {
        		console.error (error);
		 } else {
	        for (var i = 0; i < varbinds.length; i++)
        	    if (snmp.isVarbindError (varbinds[i]))
                	console.error (snmp.varbindError (varbinds[i]))
            		else
			if (varbinds[i].value == 1)
				resposta_json[Object.keys(oids_2[x].ports)[z]] = "=UP(1)";

			else if (varbinds[i].value == 2)
				resposta_json[Object.keys(oids_2[x].ports)[z]] = "=DOWN(2)";
		}
	z++;
		if ( z == count.length){
		fs.writeFile('./datalog.txt', JSON.stringify(resposta_json), { flag: 'a+' }, (err) => {
  		if (err) {
		    console.error(err)
		  }
  //file written successfully
  		});
			res.json(resposta_json);
			//return resposta_json;
		}
        	});
	}
	} else if(!(solicitacao == "/nome")) {
	//console.log("teste");
	solicitacao = solicitacao.replace(/\//g,"");
	//console.log(typeof solicitacao);
		var temp = oids_2[x].ports[solicitacao];
		//console.log(temp);
		//console.log(Object.keys(oids_2[x].ports)[z]);
		if(!(temp == undefined)) {
			session.get (temp, function(error, varbinds) {
		 	if (error) {
        			console.error (error);
			 } else {
		        for (var i = 0; i < varbinds.length; i++)
        		    if (snmp.isVarbindError (varbinds[i]))
                		console.error (snmp.varbindError (varbinds[i]))
	            		else
				if (varbinds[i].value == 1)
					resposta_json[solicitacao] = "=UP(1)";

				else if (varbinds[i].value == 2)
					resposta_json[solicitacao] = "=DOWN(2)";			
			}
		fs.writeFile('./datalog.txt', JSON.stringify(resposta_json), { flag: 'a+' } ,(err) => {
  		if (err) {
		    console.error(err)
		  }
  //file written successfully
  		});
			res.json(resposta_json);
			
		});
		} else 
			res.send("Porta nao encontrada");

//	console.log(z);
//	z++;
//	console.log(z);
	}
 	}        
	session.trap (snmp.TrapType.LinkDown, function (error) {
             if (error)
                     console.error (error);
                     });
	}
}


app.get(/\/*/, function (req, res) {
	//console.log(req.originalUrl.replace(/\//g,""));
	getdadossnmp(res,req.originalUrl);
});

app.put(/\/*/,function(req, res) { 
	var solicitacao = req.originalUrl;
	solicitacao = solicitacao.replace(/\//g,"");
	var sol_split = solicitacao.split('@');
	if(!(/^porta[0-9]*@*/).test(solicitacao)){
		res.send("\nFormato deve ser : porta[NUMERO]@oid ex: porta1@1.3.2.1...\n");
	}else if(!(oids_2[0].ports[sol_split[0]]== undefined)) { //oids_2 hardcoded em 0 pois nao esta implementado adicionar outros switchs, apenas outras portas
		oids_2[0].ports[sol_split[0]] = 	[sol_split[1]];
		res.send("Porta atualizada");	
	} else {
		oids_2[0].ports[sol_split[0]] = 	[sol_split[1]]; 
		res.send("Porta adicionada");	
	}

});

app.delete(/porta[0-9]*/,function(req,res)  {
	var solicitacao = req.originalUrl
	solicitacao = solicitacao.replace(/\//g,"");
	if(!(oids_2[0].ports[solicitacao] == undefined)) {
		delete oids_2[0].ports[solicitacao];
		res.send("Porta deletada");
	} else {
		res.send("Porta nao encontrada");
	}

});


app.listen(5000, function () {
  console.log('API desafio na porta 5000!\n');
});
