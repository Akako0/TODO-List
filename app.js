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
    deleteBranchButton.textContent = "Delete";
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
    createTodoButton.textContent = "New";
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
    const label = document.createElement("label");
    label.setAttribute("for", "todo");
    label.textContent = todo.name;
    left.appendChild(checkbox);
    left.appendChild(label);
    todoItem.appendChild(left);
    const deleteTodoButton = document.createElement("button");
    deleteTodoButton.classList.add("btn", "delete-todo");
    deleteTodoButton.textContent = "Delete";
    todoItem.appendChild(deleteTodoButton);
    return todoItem;
}

const save = () => {
    const branchItems = document.querySelectorAll(".branch-item");
    const branches = [];
    branchItems.forEach((branchItem) => {
        const branchName = branchItem.querySelector(".branch-name").textContent;
        const todoItems = branchItem.querySelectorAll(".todo-item");
        const todos = {};
        todoItems.forEach((todoItem) => {
            const todoName = todoItem.querySelector("label").textContent;
            const isCompleted = todoItem.querySelector("input").checked;
            todos[todoName] = isCompleted;
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
            for (const todo in branch.todos) {
                const todoItem = createTodo({
                    name: todo,
                });
                if (branch.todos[todo]) {
                    todoItem.querySelector("input").checked = true;
                }
                todoList.appendChild(todoItem);
            }
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

// event listener to delete a branch
branchesContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-branch")) {
        //ask for confirmation
        const confirmation = confirm("Are you sure you want to delete Branch \"" + e.target.parentElement.parentElement.querySelector(".branch-name").textContent + "\"?");
        if (!confirmation) {
            return;
        }
        //delete branch
        e.target.parentElement.parentElement.remove();
    }
    //toggle expand
    if (e.target.classList.contains("branch-header")) {
        e.target.parentElement.classList.toggle("expanded");
    }
});

// event listener to edit branch name
branchesContainer.addEventListener("dblclick", (e) => {
    if (e.target.classList.contains("branch-name")) {
        e.target.contentEditable = true;
        e.target.focus();
        //listen for unfocus on branch name
        e.target.addEventListener("blur", () => {
            e.target.textContent = e.target.textContent.split("\n")[0];
            e.target.contentEditable = false;
        });
        e.target.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.target.blur();
            }
        });
    }
});
onload = load();

//event listener to create todo
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
    }
}
);

//event listener to delete todo
branchesContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-todo")) {
        //ask confirmation 
        const confirmation = confirm("Are you sure you want to delete Todo \"" + e.target.parentElement.querySelector("label").textContent + "\" ?");
        if (!confirmation) {
            return;
        }
        //delete todo    
        e.target.parentElement.remove();
    }
}
);
//event listener to edit todo name
branchesContainer.addEventListener("dblclick", (e) => {
    if (e.target.tagName === "LABEL") {
        e.target.contentEditable = true;
        e.target.focus();
        //listen for unfocus on todo name
        e.target.addEventListener("blur", () => {
            e.target.textContent = e.target.textContent.split("\n")[0];
            e.target.contentEditable = false;
        });
        //listen for enter key
        e.target.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.target.blur();
            }
        });
    }
});

branchName.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && branchName.value !== "") {
        createBranchButton.click();
    }
});

//event listener to create todo on enter key
branchesContainer.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && e.target.classList.contains("todo-name")) {
        e.target.parentElement.querySelector(".create-todo").click();
    }
});

//event listener to save on window close
window.addEventListener("beforeunload", () => {
    save();
});