const Joi = require('joi');

const _mandatory_template = {
    "CardTransactions": Joi.object().keys({
        PARTNER_ID: Joi.any().required(),
        CARD_REF: Joi.any().required(),
        TXN_TYPE: Joi.any().required(),
        TXN_ORI_AMT: Joi.any().required(),
        TXN_ORI_CCY: Joi.any().required(),
        TXN_BILL_AMT: Joi.any().required(),
        TXN_BILL_CCY: Joi.any().required(),
        TXN_DTE: Joi.any().required(),
        TXN_REFNBR: Joi.any().required(),
	ACQUIRER_BANK: Joi.any().required(),    
        ACQUIRER_CNTY: Joi.any().required(),
        TXN_POS_INFO: Joi.any().required(),
        TXN_VALID_ID: Joi.any().required(),
        TXN_CARDPRESENT: Joi.any().required(),
	MERCH_ID: Joi.any().required(),    
        MERCH_NAME: Joi.any().required(),
        MERCH_TID: Joi.any().required(),
        MCC_CATG: Joi.any().required(),
        MERCH_CITY: Joi.any().required(),
        MERCH_CNTY: Joi.any().required()
    })
};


const _template = {
    "CardTransactions": Joi.object().keys({
        PARTNER_ID: Joi.string().max(16),
        CARD_REF: Joi.string().max(16),
        TXN_TYPE: Joi.string().allow('').max(50),
        TXN_ORI_AMT: Joi.number().precision(2).strict(),
        TXN_ORI_CCY: Joi.string().allow('').max(3),
        TXN_BILL_AMT: Joi.number().precision(2).strict(),
        TXN_BILL_CCY: Joi.string().allow('').max(3),
        TXN_DTE: Joi.any(),
        TXN_REFNBR: Joi.string().max(12),
	ACQUIRER_BANK: Joi.string().allow('').max(11),    
        ACQUIRER_CNTY: Joi.string().max(3),
        TXN_POS_INFO: Joi.string().max(50),
        TXN_VALID_ID: Joi.string().max(50),
        TXN_CARDPRESENT: Joi.string().max(1),
	MERCH_ID: Joi.string().max(15),    
        MERCH_NAME: Joi.string().max(99),
        MERCH_TID: Joi.string().allow('').max(8),
        MCC_CATG: Joi.string().max(10),
        MERCH_CITY: Joi.string().max(50),
        MERCH_CNTY: Joi.string().max(3)
    })

}

module.exports.checkSchema = (async function (req, res, dtf, SCHEMANO) {
    console.log('check schema 1');
    let result = Joi.validate(req.body, _mandatory_template[SCHEMANO]);
    if (result.error === null) {
        let result = Joi.validate(req.body, _template[SCHEMANO]);
        if (result.error == null) {
            return true;
        } else {
            console.log(result);
            res.status(200);
            res.json({
                "RESP_SYSCDE": 200,
                "RESP_DATETIME": dtf,
                "RESP_CDE": 402,
                "RESP_MSG": "Not success, Invalid Parameter " + result.error.details[0].context.key
            });
            return false;
        }
    } else {
        console.log("THIS IS THE ONE "+result);
        res.status(200);
        res.json({
            "RESP_SYSCDE": 200,
            "RESP_DATETIME": dtf,
            "RESP_CDE": 401,
            "RESP_MSG": "Not success, Missing Parameter " + result.error.details[0].context.key
        });
        return false;
    }
});

