var express = require('express');
var app = express();

var snmp = require ("net-snmp");

var session = snmp.createSession ("200.137.87.181", "d3s4f10");

var oids = ["1.3.6.1.2.1.1.1.0", "1.3.6.1.2.1.2.2.1.8.1001", "1.3.6.1.2.1.2.2.1.8.1002"];

function snmpGet()
{
session.get (oids, function (error, varbinds) {
    if (error) {
        console.error (error);
    } else {
        for (var i = 0; i < varbinds.length; i++)
            if (snmp.isVarbindError (varbinds[i]))
                console.error (snmp.varbindError (varbinds[i]))
            else
                console.log (varbinds[i].oid + " = " + varbinds[i].value);
    }

    // If done, close the session
         session.close ();
         });
    
         session.trap (snmp.TrapType.LinkDown, function (error) {
             if (error)
                     console.error (error);
                     });
}
app.get('/', function (req, res) {
  res.send('Hello World!');
  snmpGet();
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
