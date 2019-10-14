var express = require('express');
var app = express();

var snmp = require ("net-snmp");

var session = snmp.createSession ("200.137.87.181", "d3s4f10");

var oids = ["1.3.6.1.2.1.1.1.0", "1.3.6.1.2.1.2.2.1.8.1001", "1.3.6.1.2.1.2.2.1.8.1002"];

app.get('/', function (req, res) {


session.get (oids, function (error, varbinds) {
var resposta = "";
    if (error) {
        console.error (error);
    } else {
        for (var i = 0; i < varbinds.length; i++)
            if (snmp.isVarbindError (varbinds[i]))
                console.error (snmp.varbindError (varbinds[i]))
            else
              resposta = resposta + (varbinds[i].oid + " = " + varbinds[i].value + "\n");
	res.send("Todos os dados = " + resposta);
    }

    // If done, close the session
    //     session.close ();
        });
    
         session.trap (snmp.TrapType.LinkDown, function (error) {
             if (error)
                     console.error (error);
                     });

});

app.get('/porta1', function(req,res) {


session.get (["1.3.6.1.2.1.2.2.1.8.1001"], function (error, varbinds) {
    if (error) {
        console.error (error);
    } else {
        for (var i = 0; i < varbinds.length; i++)
            if (snmp.isVarbindError (varbinds[i]))
                console.error (snmp.varbindError (varbinds[i]))
            else
                res.send("Apenas STATUS porta1 = " + varbinds[i].oid + " = " + varbinds[i].value+"\n");
    }

    // If done, close the session
    //     session.close ();
         });
    
         session.trap (snmp.TrapType.LinkDown, function (error) {
             if (error)
                     console.error (error);
                     });
});

app.get('/porta2', function(req,res) {


session.get (["1.3.6.1.2.1.2.2.1.8.1002"], function (error, varbinds) {
    if (error) {
        console.error (error);
    } else {
        for (var i = 0; i < varbinds.length; i++)
            if (snmp.isVarbindError (varbinds[i]))
                console.error (snmp.varbindError (varbinds[i]))
            else
                res.send("Apenas STATUS porta2 = " + varbinds[i].oid + " = " + varbinds[i].value+"\n");
    }

    // If done, close the session
    //     session.close ();
             });
             session.trap (snmp.TrapType.LinkDown, function (error) {
                 if (error)
                     console.error (error);
                     });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
