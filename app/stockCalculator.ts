const fs = require("fs").promises;
const skuData = require("../resources/stock.json");
const transactions = require("../resources/transactions.json");

function stockCalculator(sku: string): Promise<{ sku: string; qty: number }> {
  return new Promise((resolve, reject) => {
    if (!!!sku || typeof sku !== "string") {
      reject({ type: "Error", msg: "Please enter a valid sku" });
    }

    const itemInSkuData = skuData.find((skuItem) => {
      return JSON.stringify(skuItem) === sku;
    });

    const itemInTransactions = transactions.find((transaction) => {
      return transaction.sku === JSON.parse(sku).sku;
    });

    if (!!itemInSkuData) {
      return resolve(itemInSkuData);
    } else if (!itemInSkuData && !!itemInTransactions) {
      return resolve({ sku: itemInTransactions.sku, stock: 0 });
    } else {
      reject({ type: "Error", msg: "Sku does not exist!" });
    }
  })
    .then((item: { sku: string; stock: number }) => {
      transactions.map((transaction) => {
        if (transaction.sku === item.sku) {
          transaction.type === "refund"
            ? (item.stock += transaction.qty)
            : (item.stock -= transaction.qty);
        }
      });
      return { sku: item.sku, qty: item.stock };
    })
    .catch((err) => {
      return err;
    });
}

module.exports = stockCalculator;
