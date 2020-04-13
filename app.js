//steps for this demp
//1. Read all the commands from terminal
//2. Do something based on command (add, read todos)
//3.Store data somewhere //need file to store data //json file:
//4.functions to read/write

const fs = require("fs"); //fileSystem, an inbuilt stream function
const chalk = require("chalk");
const yargs = require("yargs");
let currId = 0;

function loadData() {
  const buffer = fs.readFileSync("data/database.json"); //read file from our system, in binary stream
  const data = buffer.toString(); //convert binary to string
  return JSON.parse(data); //convert json string to JS object
}
function saveData(data) {
  let curr = loadData();
  curr.push(data);
  fs.writeFileSync("data/database.json", JSON.stringify(curr));
}
function addTodo(todoBody, status) {
  let curr = loadData();
  if (curr.length !== 0) {
    currId = ++curr[Math.max(curr.length - 1, 0)].id;
  }
  console.log({ id: currId, todo: todoBody, status: status });
  saveData({ id: currId, todo: todoBody, status: status });
}

/* //How to process CLI args manually
if (process.argv[2] === "add") {
  addTodo(process.argv[3], process.argv[4]);
} else if (process.argv[2] === "list") {
  const list = loadData();
  for (let { id, todo, status } of list) {
    console.log(chalk.bold.blue(id, todo, status));
  }
} */

//How to use a library called yargs !!! for handling CLI input/output
//add 2 yarg commands
yargs.command({
  command: "add",
  describe: "add some todo",
  builder: {
    todo: {
      describe: "content of our todo",
      demandOption: true,
      type: "string",
      default: "nothing",
    },
    status: {
      describe: "status of your todo",
      demandOption: false,
      default: false,
      type: "boolean",
    },
  },
  handler: function ({ todo, status }) {
    //argvs should match builder prop names
    addTodo(todo, status);
  },
});
yargs.command({
  command: "list",
  describe: "list contents of json",
  builder: {},
  handler: function () {
    console.log(loadData());
  },
});
yargs.parse(); //how to call yargs
