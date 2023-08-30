const {List} = require('immutable')

const itemsRxp = /^\s{2}Starting items:((\s[0-9]+,?)+)$/m
const operationRxp = /^\s{2}Operation: new = (.*)$/m
const testRxp = /^\s{2}Test: divisible by ([0-9]*)$/m
const trueRxp = /^\s{4}If true: throw to monkey ([0-9])$/m
const falseRxp = /^\s{4}If false: throw to monkey ([0-9])$/m

module.exports = class Monkey {
  Inspections = 0
  Operation
  DivisibleTest
  TrueId
  FalseId
  Items

  /**
   *
   * @param {String} input the raw input of a monkey
   */
  constructor(input) {
    let parsed = itemsRxp.exec(input)
    this.Items = List(parsed[1].split(',').map(x => parseInt(x)))
    parsed = operationRxp.exec(input)
    this.Operation = parsed[1]
    parsed = testRxp.exec(input)
    this.DivisibleTest = parseInt(parsed[1])
    parsed = trueRxp.exec(input)
    this.TrueId = parseInt(parsed[1])
    parsed = falseRxp.exec(input)
    this.FalseId = parseInt(parsed[1])
  }

  /**
   *
   * @param {List<Monkey>} others list of monkeys
   */
  inspect(others) {
    this.Items = this.Items.map(x => eval(this.Operation.replaceAll("old", x))).map(x => Math.floor(x / 3));
    this.Items.forEach(x => {
      ++this.Inspections
      others.get(x % this.DivisibleTest ? this.FalseId : this.TrueId).addItem(x)
    });
    this.Items = this.Items.clear()
  }

  /**
   *
   * @param {number} item
   */
  addItem(item) {
    this.Items = this.Items.push(item);
  }
}
