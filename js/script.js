const themeBtn = document.getElementById("themeBtn");

if(themeBtn){

    themeBtn.addEventListener("click",()=>{

        document.body.classList.toggle("dark-theme");

        if(document.body.classList.contains("dark-theme")){
            themeBtn.textContent="☀️";
        }

        else{
            themeBtn.textContent="🌙";
        }

    });

}
/*=========================================
        TASK 3 - TODO LIST
=========================================*/

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");

if(taskInput && addTaskBtn && taskList){

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

function saveTasks(){

    localStorage.setItem("tasks",JSON.stringify(tasks));

}

function renderTasks(){

    taskList.innerHTML="";

    let filteredTasks = tasks;

    if(currentFilter==="active"){

        filteredTasks = tasks.filter(task=>!task.completed);

    }

    else if(currentFilter==="completed"){

        filteredTasks = tasks.filter(task=>task.completed);

    }

    filteredTasks.forEach(task=>{

        const li=document.createElement("li");

        li.className="task-item";

        li.innerHTML=`

        <div class="task-left">

            <input
            type="checkbox"
            class="complete-checkbox"
            data-id="${task.id}"
            ${task.completed ? "checked":""}>

            <span class="${task.completed ? "completed":""}">

                ${task.text}

            </span>

        </div>

        <div class="task-actions">

            <button
            class="edit-btn"
            data-id="${task.id}">

            Edit

            </button>

            <button
            class="delete-btn"
            data-id="${task.id}">

            Delete

            </button>

        </div>

        `;

        taskList.appendChild(li);

    });

}

/*=========================================
        ADD TASK
=========================================*/

function addTask(){

    const text = taskInput.value.trim();

    if(text===""){

        alert("Please enter a task.");

        return;

    }

    const task={

        id:Date.now(),

        text:text,

        completed:false

    };

    tasks.push(task);

    saveTasks();

    renderTasks();

    taskInput.value="";

}

addTaskBtn.addEventListener("click",addTask);

taskInput.addEventListener("keypress",function(e){

    if(e.key==="Enter"){

        addTask();

    }

});

/*=========================================
        EVENT DELEGATION
=========================================*/

taskList.addEventListener("click", function (e) {

    const deleteBtn = e.target.closest(".delete-btn");
    const editBtn = e.target.closest(".edit-btn");

    if (deleteBtn) {

        const id = Number(deleteBtn.dataset.id);

        tasks = tasks.filter(task => task.id !== id);

        saveTasks();

        renderTasks();

        return;
    }

    if (editBtn) {

        const id = Number(editBtn.dataset.id);

        const task = tasks.find(task => task.id === id);

        if (!task) return;

        const updated = prompt("Edit Task", task.text);

if (updated === null) return;

task.text = updated.trim();

saveTasks();

renderTasks();

applyFilter();

    }

});

/*=========================================
        COMPLETE TASK
=========================================*/

taskList.addEventListener("change",function(e){

   if (e.target.classList.contains("complete-checkbox")) {

    const id = Number(e.target.dataset.id);

    const task = tasks.find(task => Number(task.id) === Number(id));

    if (!task) return;

    task.completed = e.target.checked;

    saveTasks();

    renderTasks();

}

});

/*=========================================
        FILTER BUTTONS
=========================================*/

filterButtons.forEach(button=>{

    button.addEventListener("click",function(){

        filterButtons.forEach(btn=>{

            btn.classList.remove("active-filter");

        });

        this.classList.add("active-filter");

        currentFilter=this.dataset.filter;

        renderTasks();

    });

});

/*=========================================
        INITIAL LOAD
=========================================*/

renderTasks();

}