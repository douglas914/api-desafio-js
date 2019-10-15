var express = require('express');
var app = express();

var snmp = require ("net-snmp");

var session = snmp.createSession ("200.137.87.181", "d3s4f10");

var oids = ["1.3.6.1.2.1.1.1.0", "1.3.6.1.2.1.2.2.1.8.1001", "1.3.6.1.2.1.2.2.1.8.1002"];

var oids_2 = 	[
			{	
			nome:"nome1",
			name_oid:	["1.3.6.1.2.1.1.1.0"],
			ports:  { port1:["1.3.6.1.2.1.2.2.1.8.1001"],
				  port2:["1.3.6.1.2.1.2.2.1.8.1002"]
				}
			}
		]

		
//console.log(oids_2.lenght)
for (x in oids_2) {
//console.log(x)
//console.log(oids_2[x].ports);
//console.log(oids_2[x].name_oid);
	//for (p in oids_2[x].ports)
	//	console.log(oids_2[x].ports[p]);
	var teste = Object.keys(oids_2[x].ports);
	console.log(teste.length);
}

//console.log(oids_2.sys[0]['name_oid']);

function getdadossnmp(res,solicitacao) {

var resposta_json = 	{
				acess:"date",
				sysname:[],
				estado:[]
			};



	for (x in oids_2) {
	session.get(oids_2[x].name_oid, function(error, varbinds) {
		var datetime = new Date();
		resposta_json['acess'] = datetime;
		if (error) {
		        console.error (error);
		    } else {
		        for (var i = 0; i < varbinds.length; i++)
		        	if (snmp.isVarbindError (varbinds[i]))
                			console.error (snmp.varbindError (varbinds[i]))
            			else
					resposta_json['sysname'] = (varbinds[i].value + "");
			}
		
		//console.log(resposta_json);
	});

	 for (p in oids_2[x].ports) {
	var temp = oids_2[x].ports[p];	
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
				resposta_json['estado'][z] = Object.keys(oids_2[x].ports)[z]+"=UP(1)";

			else if (varbinds[i].value == 2)
				resposta_json['estado'][z] = Object.keys(oids_2[x].ports)[z]+"=DOWN(2)";
		}
	z++;
	//console.log(Object.keys(oids_2[x].ports)[z])
	//console.log(z)	
	
		if ( z == count.length){
			if (solicitacao == '/'){
			res.json(resposta_json);
			} else if (solicitacao == '/porta1') {
			delete resposta_json.sysname;
			delete resposta_json.estado[1];
			res.json(resposta_json);
			} else if (solicitacao == '/porta2') {
			delete resposta_json.sysname;
			delete resposta_json.estado[0];
			res.json(resposta_json);
			} else if (solicitacao == '/nome') {
			delete resposta_json.estado;
			res.json(resposta_json);
			} else
			res.send("Nao encontrado");
			
		}
        	});
	}
    
         session.trap (snmp.TrapType.LinkDown, function (error) {
             if (error)
                     console.error (error);
                     });




	}

}
//getdadossnmp()

app.get(/\/*/, function (req, res) {
//console.log(req.originalUrl);
	getdadossnmp(res,req.originalUrl);


});

//app.get('/porta1', function(req,res) {
//
//
//session.get (["1.3.6.1.2.1.2.2.1.8.1001"], function (error, varbinds) {
//    if (error) {
//        console.error (error);
//    } else {
//       for (var i = 0; i < varbinds.length; i++)
//            if (snmp.isVarbindError (varbinds[i]))
//                console.error (snmp.varbindError (varbinds[i]))
//            else
//                res.send("Apenas STATUS porta1 = " + varbinds[i].oid + " = " + varbinds[i].value+"\n");
//    }
//
//    // If done, close the session
//    //     session.close ();
//         });
//    
//         session.trap (snmp.TrapType.LinkDown, function (error) {
//             if (error)
//                     console.error (error);
//                     });
//});
//
//app.get('/porta2', function(req,res) {
//
//
//session.get (["1.3.6.1.2.1.2.2.1.8.1002"], function (error, varbinds) {
//    if (error) {
//        console.error (error);
//    } else {
//        for (var i = 0; i < varbinds.length; i++)
//            if (snmp.isVarbindError (varbinds[i]))
//                console.error (snmp.varbindError (varbinds[i]))
//            else
//                res.send("Apenas STATUS porta2 = " + varbinds[i].oid + " = " + varbinds[i].value+"\n");
//    }
//
//    // If done, close the session
//    //     session.close ();
//             });
//             session.trap (snmp.TrapType.LinkDown, function (error) {
//                 if (error)
//                     console.error (error);
//                     });
//});
//
//app.get('/nome', function(req, res) {
//
//
//session.get(["1.3.6.1.2.1.1.1.0"], function (error, varbinds) {
//  if(error) {
//	console.error(error);
//  } else {
//	for (var i = 0; i < varbinds.length; i++)
//	if(snmp.isVarbindError (varbinds[i]))
//		console.error (snmp.varbindError (varbinds[i]))
//	else
//	res.send(varbinds[i]);
//	}
//});
//	session.trap (snmp.TrapType.LinkDown, function (error) {
//	if (error)
//	console.error(error);
//	});
//});
app.listen(5000, function () {
  console.log('API desafio na porta 5000!\n');
});
