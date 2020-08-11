const config = require('../config');
const pool = require('node-jt400').pool(config);

module.exports.lookup = (async function (res, dtf, PNID,PNNUM) {


    var stmt = "select * from MBRFLIB/PM200MP where PNNUM = '" +PNNUM +"' and PNID = '"+PNID+"' and PNSTS =''";
    try {
        result = await pool.query(stmt)

        if (result.length == 1) {
            return result;
        } else if (result.length > 1) {
            console.log("303 error PNID/PNNUM: " +PNID+" / "+ PNNUM);
            console.log("datetime: " + dtf);
            res.status(200).json({
                "RESP_SYSCDE": 200,
                "RESP_DATETIME": dtf,
                "RESP_CDE": 303,
                "RESP_MSG": "Not success, Found Duplicate Cards "+ PNNUM
            });
            res.end();
            return false;
        }
        else {
            console.log("301 error PNID/PNNUM: " +PNID+" / "+ PNNUM);
            console.log("datetime: " + dtf);
            res.status(200).json({
                "RESP_SYSCDE": 200,
                "RESP_DATETIME": dtf,
                "RESP_CDE": 301,
                "RESP_MSG": "Not success, No record in Partner"
            });
            res.end();
            return false;
        }
    } catch (err) {
        console.log("503 error message: " + err.stack);
        console.log("datetime: " + dtf);
        res.status(200).json({
            "RESP_SYSCDE": 200,
            "RESP_DATETIME": dtf,
            "RESP_CDE": 503,
            "RESP_MSG": "Not success, Connect Database Error",
        });
        res.end();
        return false;
    }
});


