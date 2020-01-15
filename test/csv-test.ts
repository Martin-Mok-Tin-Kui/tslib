import { Random, visibleLetters } from '../src/random';
import { csv_to_json, from_csv, json_to_csv, to_csv } from '../src/csv';

let testData = [
  ['sid', 'name'],
  ['101', 'beeno'],
  ['102', 'peter'],
];
let jsonData = csv_to_json(testData);
if (jsonData[0].name !== 'beeno') {
  console.error('csv_to_json() failed', { jsonData });
  process.exit(1);
}
let csvData = json_to_csv(jsonData);
if (JSON.stringify(testData) !== JSON.stringify(csvData)) {
  console.error('json_to_csv() failed', { testData, csvData });
  process.exit(1);
}

let genRows = (size: number): string[][] => {
  let rows: string[][] = [];
  for (let row = 0; row < size; row++) {
    let cols: string[] = rows[row] = [];
    for (let col = 0; col < size; col++) {
      cols[col] = Random.nextString(size, visibleLetters);
    }
  }
  return rows;
};
let test = (size: number) => {
  let rows = genRows(size);
  let encoded = to_csv(rows);
  let decoded = from_csv(encoded);
  let matched = JSON.stringify(rows) === JSON.stringify(decoded);
  console.log(`test size=${size}, matched=${matched}`);
  if (!matched) {
    console.log('==csv==');
    console.log(encoded);
    console.log('=======');
    main:
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          if (rows[row][col] !== decoded[row][col]) {
            console.log(`diff row=${row}, col=${col}`);
            console.log({
              src: rows[row][col],
              decoded: decoded[row][col],
            });
            break main;
          }
        }
      }
    console.log({
      rows,
      decoded,
    });
  }
  return matched;
};
for (let size of [0, 1, 2, 4, 5, 10, 100]) {
  if (!test(size)) {
    break;
  }
}

let data = genRows(19);
// data = data.map(line => line.map(cell => `="${cell}"`));
let text = to_csv(data);
let fs = require('fs');
console.log('write to test.csv');
fs.writeFileSync('test.csv', text);
console.log('finished write');

let rows: string[][] = [];
rows[0] = [];
rows[0][0] = 'a';
rows[0][2] = 'c';
if (to_csv(rows).trim() !== 'a,"",c') {
  console.error(`to_csv() failed to handle empty cell`);
  process.exit(1);
}
