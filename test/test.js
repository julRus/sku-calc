const skuCalc = require("../app/stockCalculator.js");
const { expect } = require("chai");

describe.only("stockCalculator", () => {
  it("returns an error with message: 'Please enter a valid sku' if sku is not in valid format", () => {
    const errorMsg = "Please enter a valid sku";
    return skuCalc(null).catch((err) => {
      expect(err.msg).to.equal(errorMsg);
    });
  });
  it("returns an error with message: 'Sku does not exist!' if sku is not found in stock.json or transactions.json", () => {
    const errorMsg = "Sku does not exist!";
    return skuCalc('{"sku":"KZK692833/24/77","stock":0}').catch((err) => {
      expect(err.msg).to.equal(errorMsg);
    });
  });
  it("returns the correct stock (and sku id) after transactions of a sku which exists in the stock json", () => {
    return skuCalc('{"sku":"LTV719449/39/39","stock":8525}').then((res) => {
      expect(res).to.eql({ sku: "LTV719449/39/39", qty: 8510 });
    });
  });
  it("returns the correct stock (and sku id) after transactions of a sku which does not exist in the stock json but does exist in transaction.json", () => {
    return skuCalc('{"sku":"KSS894454/75/76","stock":0}').then((res) => {
      expect(res).to.eql({ sku: "KSS894454/75/76", qty: -85 });
    });
  });
});
