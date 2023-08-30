const fs = require('fs')
const {List} = require('immutable')
const Monkey = require('./Monkey')

fs.readFile('./input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  let monkeys = List(data.split(/^$/mg).map(x => new Monkey(x)))
  for (let i = 0; i < 20; i++) {
    monkeys.forEach(x => x.inspect(monkeys))
  }

  monkeys.forEach((x, i) => console.log(`Monkey ${i} inspected items ${x.Inspections} times.`))

  const business = monkeys
      .sortBy(x => x.Inspections)
      .reverse()
      .take(2)
      .reduce((s, monkey) => s * monkey.Inspections, 1)

  console.log(`Answer: ${business}`)
});

