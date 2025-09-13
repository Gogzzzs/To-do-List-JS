const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const reportBtn = document.getElementById("generate-report");
const reportOutput = document.getElementById("report-output");
const copyBtn = document.getElementById("copy-report");
const allDone = document.getElementById("allDone");
const allNot = document.getElementById("allNot");
const clearAll = document.getElementById("clearAll");

const tasks = [];

const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

const loadTasks = () => {
    const saved = localStorage.getItem("tasks");

    if(saved){
        tasks.push(...JSON.parse(saved));
    }
}
window.onload = () => {
    const saved = localStorage.getItem("tasks");
    if (saved){
        tasks.push(...JSON.parse(saved));
        renderTasks();
    };
};

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskName = todoInput.value.trim();
    if(taskName === "") return;

    tasks.push({name: taskName, done: false});
    todoInput.value = "";

    saveTasks();
    renderTasks();
})

const renderTasks = () =>{
    todoList.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = task.name;
        if (task.done){
            span.classList.add("done");
        };

        span.addEventListener("click", ()=> {
            tasks[index].done = !tasks[index].done;
            
            saveTasks();
            renderTasks();
        });

        const removeBtn = document.createElement("button");

        removeBtn.textContent = "❌";

        removeBtn.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        if (tasks[index].done) {
                li.classList.add("liDone");
        }
        else{
                li.classList.add("liOngoing");
            };

        li.appendChild(span);
        li.appendChild(removeBtn);
        todoList.appendChild(li);
    });
};

reportBtn.addEventListener("click", () => {
    const lines = tasks.map(task => {
        if (task.done) {
            return `${task.name} - 100%`;
        } else {
            return `${task.name} - On going`;
        }
    });

    const reportText = lines.join("\n");
    reportOutput.value = reportText;
});

copyBtn.addEventListener("click", () => {
    const text = reportOutput.value;

    if (!text) {
        alert("Generate a report first");
        return;
    }

    navigator.clipboard.writeText(text)
    .then(() => {
        copyBtn.textContent = "Copied!";

        setTimeout(() => {
            copyBtn.textContent = "Copy report";
        }, 2000);
    })
    .catch(() => {
        alert("Error trying to copy the report.")
    })
});

allDone.addEventListener("click", () => {
    tasks.forEach(task => {
        task.done = true;
    });
    saveTasks();
    renderTasks();
});

allNot.addEventListener("click", () => {
    tasks.forEach(task => {
        task.done = false;
    });
    saveTasks();
    renderTasks();
});

clearAll.addEventListener("click", () => {
        tasks.length = 0;
        saveTasks();
        renderTasks();
});

loadTasks();
renderTasks();
