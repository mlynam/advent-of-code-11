const {List} = require('immutable')

module.exports = class Monkey {
  Inspections = 0;
  Operation;
  DivisibleTest;
  TrueId;
  FalseId;
  Items;

  /**
   *
   * @param {String} input the raw input of a monkey
   */
  constructor(input) {
    const E01 = 'Input is not parseable';

    const headerRxp = /Monkey [0-9]:/
    const itemsRxp = /^\s{2}Starting items:((\s[0-9]+,?)+)$/m
    const operationRxp = /^\s{2}Operation: new = (.*)$/m
    const testRxp = /^\s{2}Test: divisible by ([0-9]*)$/m
    const trueRxp = /^\s{4}If true: throw to monkey ([0-9])$/m
    const falseRxp = /^\s{4}If false: throw to monkey ([0-9])$/m

    if (!headerRxp.test(input)) {
      throw new Error(E01)
    }

    // Group 1 should include the items
    let parsed = itemsRxp.exec(input)
    if (parsed.length !== 3) {
      throw new Error(E01)
    }
    this.Items = List(parsed[1].split(',').map(x => parseInt(x)))

    parsed = operationRxp.exec(input)
    if (parsed.length !== 2) {
      throw new Error(E01)
    }
    this.Operation = parsed[1]

    parsed = testRxp.exec(input)
    if (parsed.length !== 2) {
      throw new Error(E01)
    }
    this.DivisibleTest = parseInt(parsed[1])

    parsed = trueRxp.exec(input)
    if (parsed.length !== 2) {
      throw new Error(E01)
    }
    this.TrueId = parseInt(parsed[1])

    parsed = falseRxp.exec(input)
    if (parsed.length !== 2) {
      throw new Error(E01)
    }
    this.FalseId = parseInt(parsed[1]);
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
