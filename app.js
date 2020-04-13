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
  fs.writeFileSync("data/database.json", JSON.stringify(data));
}
function addTodo(todoBody, status) {
  let curr = loadData();
  if (curr.length !== 0) {
    currId = curr[curr.length - 1].id;
    currId++;
  }
  let newTodo = { id: currId, todo: todoBody, status: status };
  displayItem(newTodo);
  curr.push(newTodo);
  saveData(curr);
}
function display(data) {
  //console.log(data);
  if (data.length === 0) {
    console.log(chalk.blue.bold("No items to show"));
  } else {
    data.forEach((item) => {
      let str = `id: ${item.id}  todo: ${item.todo}  status: ${item.status}`;
      if (item.status === true) console.log(chalk.green.bold(str));
      else console.log(chalk.red.bold(str));
    });
  }
}
function displayItem(data) {
  let str = `Created a todo: "${data.todo}"`;
  console.log(chalk.blue.bold(str));
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
  command: "list-complete",
  describe: "list contents of json",
  builder: {},
  handler: function () {
    display(
      loadData().filter((item) => {
        return item.status === true;
      })
    );
  },
});
yargs.command({
  command: "list-incomplete",
  describe: "list contents of json",
  builder: {},
  handler: function () {
    display(
      loadData().filter((item) => {
        return item.status === false;
      })
    );
  },
});

const COMMANDS = [
  "list",
  "list-commands",
  "list-complete",
  "list-incomplete",
  "add --todo=<content here>",
  "delete <id>",
  "delete-all",
  "delete-completed",
  "toggle <id>",
];
yargs.command({
  command: "list-commands",
  describe: "list cli commands available",
  builder: {},
  handler: function () {
    //let arrayOfCommands = COMMANDS;
    COMMANDS.forEach((str) => {
      console.log(chalk.yellow(str));
    });
  },
});
yargs.command({
  command: "list",
  describe: "list contents of json",
  builder: {},
  handler: function () {
    display(loadData());
  },
});

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
      describe: "status of your todo. True means it's done",
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
//the command will always be on process.argv[2]. argv[3...] will be the IDs
//The 1st/2nd index is two path directories to node and the current project
yargs.command({
  command: "delete",
  describe: "delete an todo items in your json, based on id",
  builder: {},
  handler: function () {
    let args = [...process.argv];
    let data = loadData();
    if (args.length > 3) {
      for (let x = 3; x < args.length; x++) {
        let currId = parseInt(process.argv[x]);
        data = data.filter((item) => {
          return item.id !== currId;
        });
      }
    }
    // let id = parseInt(process.argv[3]);
    saveData(data);
  },
});
yargs.command({
  command: "delete-all",
  describe: "delete all items in your json",
  builder: {},
  handler: function () {
    saveData([]);
  },
});
yargs.command({
  command: "delete-completed",
  describe: "delete items in your json, that are completed",
  builder: {},
  handler: function () {
    let result = loadData().filter((item) => {
      return item.status === false;
    });
    saveData(result);
  },
});
yargs.command({
  command: "toggle",
  describe: "switch the status of a todo item",
  builder: {},
  handler: function () {
    let selectedId = parseInt(process.argv[3]);
    let result = loadData().map((item) => {
      if (item.id === selectedId) {
        item.status = !item.status;
        return item;
      }
      return item;
    });
    saveData(result);
  },
});

yargs.parse(); //how to call yargs
