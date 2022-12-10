//this is a TODO APP

/*
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="style.css" />
    <title>TODO</title>
  </head>
  <body>
    <!-- List of branches -->
    <div id="branches">
      <header>
        <h1>Branches</h1>
        <input type="text" name="" id="branch-name" />
        <button class="create-branch">Create branch</button>
      </header>
      <ul class="branch-list">
        <li class="branch-item">
          <header class="branch-header">
            <h2 class="branch-name">Branch 1</h2>
            <button class="btn delete-branch">Delete Branch</button>
          </header>

          <div class="todo">
            <header>
              <input type="text" name="" class="todo-name" id="" />
              <button class="create-todo">Create todo</button>
            </header>
            <ul class="todo-list">
              <li class="todo-item">
                <div class="left">
                  <input type="checkbox" name="todo" id="todo" />
                  <label for="todo">Todo 1</label>
                </div>
                <button class="btn delete-todo">Delete Todo</button>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <script src="app.js"></script>
  </body>
</html>

*/

const branchesContainer = document.getElementById("branches");
const branchName = document.getElementById("branch-name");
const createBranchButton = document.querySelector(".create-branch");
const branchList = document.querySelector(".branch-list");
const deleteBranchButtons = document.querySelector(".delete");
const createTodoButton = document.querySelector(".create-todo");
const deleteTodoButtons = document.querySelector(".delete-todo");
const branchButton = document.querySelector(".btn");

const createBranch = (branch) => {
    // Please note that this is just a template
    const branchItem = document.createElement("li");
    branchItem.classList.add("branch-item");
    const branchHeader = document.createElement("header");
    branchHeader.classList.add("branch-header");
    const branchName = document.createElement("h2");
    branchName.classList.add("branch-name");
    branchName.textContent = branch.name;
    const deleteBranchButton = document.createElement("button");
    deleteBranchButton.classList.add("btn", "delete-branch");
    deleteBranchButton.textContent = "Delete Branch";
    branchHeader.appendChild(branchName);
    branchHeader.appendChild(deleteBranchButton);
    branchItem.appendChild(branchHeader);
    const todo = document.createElement("div");
    todo.classList.add("todo");
    const todoHeader = document.createElement("header");
    const todoName = document.createElement("input");
    todoName.classList.add("todo-name");
    todoName.setAttribute("type", "text");
    todoName.setAttribute("placeholder", "Todo Name");
    const createTodoButton = document.createElement("button");
    createTodoButton.classList.add("create-todo");
    createTodoButton.textContent = "Create Todo";
    todoHeader.appendChild(todoName);
    todoHeader.appendChild(createTodoButton);
    todo.appendChild(todoHeader);
    const todoList = document.createElement("ul");
    todoList.classList.add("todo-list");
    todo.appendChild(todoList);
    branchItem.appendChild(todo);
    return branchItem;
}

const createTodo = (todo) => {
    // Please note that this is just a template
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");
    const left = document.createElement("div");
    left.classList.add("left");
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("name", "todo");
    checkbox.setAttribute("id", "todo");
    const label = document.createElement("label");
    label.setAttribute("for", "todo");
    label.textContent = todo.name;
    left.appendChild(checkbox);
    left.appendChild(label);
    todoItem.appendChild(left);
    const deleteTodoButton = document.createElement("button");
    deleteTodoButton.classList.add("btn", "delete-todo");
    deleteTodoButton.textContent = "Delete Todo";
    todoItem.appendChild(deleteTodoButton);
    return todoItem;
}

// event listener to create a branch

createBranchButton.addEventListener("click", () => {
    const branch = {
        name: branchName.value,
    };
    if (branch.name === "") {
        return;
    }
    const branchItem = createBranch(branch);
    branchList.appendChild(branchItem);
    branchName.value = "";
});

const save = () => {
    const branchItems = document.querySelectorAll(".branch-item");
    const branches = [];
    branchItems.forEach((branchItem) => {
        const branchName = branchItem.querySelector(".branch-name").textContent;
        const todoItems = branchItem.querySelectorAll(".todo-item");
        const todos = [];
        todoItems.forEach((todoItem) => {
            const todoName = todoItem.querySelector("label").textContent;
            const todo = {
                name: todoName,
            };
            todos.push(todo);
        });
        const branch = {
            name: branchName,
            todos: todos,
        };
        branches.push(branch);
    });
    localStorage.setItem("branches", JSON.stringify(branches));
};

const load = () => {
    const branches = JSON.parse(localStorage.getItem("branches"));
    if (branches && branches.length > 0) {
        branches.forEach((branch) => {
            const branchItem = createBranch(branch);
            branchList.appendChild(branchItem);
            const todoList = branchItem.querySelector(".todo-list");
            branch.todos.forEach((todo) => {
                const todoItem = createTodo(todo);
                todoList.appendChild(todoItem);
            });
        });
    }
    else {
        const branch = {
            name: "Default Branch",
        };
        const todo = {
            name: "Default Todo",
        };
        const todoItem = createTodo(todo);
        const branchItem = createBranch(branch);
        branchList.appendChild(branchItem);
        const todoList = branchItem.querySelector(".todo-list");
        todoList.appendChild(todoItem);
    }

};


branchesContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-branch")) {
        //ask for confirmation
        const confirmation = confirm("Are you sure you want to delete Branch \"" + e.target.parentElement.parentElement.querySelector(".branch-name").textContent + "\"?");
        if (!confirmation) {
            return;
        }
        //delete branch
        e.target.parentElement.parentElement.remove();
        save();
    }
    //toggle expand
    if (e.target.classList.contains("branch-header")) {
        e.target.parentElement.classList.toggle("expanded");
    }
});

branchesContainer.addEventListener("dblclick", (e) => {
    if (e.target.classList.contains("branch-name")) {
        e.target.contentEditable = true;
        e.target.focus();
        //listen for unfocus on branch name
        e.target.addEventListener("blur", () => {
            e.target.textContent = e.target.textContent.split("\n")[0];
            e.target.contentEditable = false;
            save();
        });
    }
});

onload = load();

//create todo
branchesContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("create-todo") && e.target.parentElement.querySelector(".todo-name").value !== "") {
        const todoName = e.target.parentElement.querySelector(".todo-name").value;
        const todo = {
            name: todoName,
        };
        const todoItem = createTodo(todo);
        const todoList = e.target.parentElement.parentElement.querySelector(".todo-list");
        todoList.appendChild(todoItem);
        e.target.parentElement.querySelector(".todo-name").value = "";
        save();
    }
}
);

//delete todo
branchesContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-todo")) {
        //ask confirmation 
        const confirmation = confirm("Are you sure you want to delete Todo \"" + e.target.parentElement.querySelector("label").textContent + "\" ?");
        if (!confirmation) {
            return;
        }
        //delete todo    
        e.target.parentElement.remove();
        save();
    }
}
);

