var fs = require("fs").promises;
var skuData = require("../resources/stock.json");
var transactions = require("../resources/transactions.json");
function stockCalculator(sku) {
    return new Promise(function (resolve, reject) {
        if (!!!sku || typeof sku !== "string") {
            reject({ type: "Error", msg: "Please enter a valid sku" });
        }
        var itemInSkuData = skuData.find(function (skuItem) {
            return JSON.stringify(skuItem) === sku;
        });
        var itemInTransactions = transactions.find(function (transaction) {
            return transaction.sku === JSON.parse(sku).sku;
        });
        if (!!itemInSkuData) {
            return resolve(itemInSkuData);
        }
        else if (!itemInSkuData && !!itemInTransactions) {
            return resolve({ sku: itemInTransactions.sku, stock: 0 });
        }
        else {
            reject({ type: "Error", msg: "Sku does not exist!" });
        }
    })
        .then(function (item) {
        transactions.map(function (transaction) {
            if (transaction.sku === item.sku) {
                transaction.type === "refund"
                    ? (item.stock += transaction.qty)
                    : (item.stock -= transaction.qty);
            }
        });
        return { sku: item.sku, qty: item.stock };
    })["catch"](function (err) {
        return err;
    });
}
module.exports = stockCalculator;
