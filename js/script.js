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

/*=========================================
        TASK 4 - WEATHER DASHBOARD
=========================================*/

const cityInput = document.getElementById("cityInput");
const searchWeatherBtn = document.getElementById("searchWeather");
const weatherResult = document.getElementById("weatherResult");

/*
    Replace YOUR_API_KEY with your OpenWeather API key.
*/
const API_KEY = "e8a6f1511a05e84dbc8aeb6c57b4dab2";

if (cityInput && searchWeatherBtn && weatherResult) {

    async function getWeather(city) {

        weatherResult.innerHTML = `
            <p class="loading">Loading weather...</p>
        `;

        try {

            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );

            if (!response.ok) {
                throw new Error("City not found");
            }

            const data = await response.json();

            displayWeather(data);

        } catch (error) {

            weatherResult.innerHTML = `
                <p class="error">${error.message}</p>
            `;

        }

    }
        function displayWeather(data) {

        const icon = data.weather[0].icon;
        let weatherImage = "";

switch (icon) {
    case "01d":
        weatherImage = "https://img.icons8.com/color/96/sun.png";
        break;

    case "01n":
        weatherImage = "https://img.icons8.com/color/96/full-moon.png";
        break;

    case "02d":
    case "03d":
    case "04d":
        weatherImage = "https://img.icons8.com/color/96/partly-cloudy-day.png";
        break;

    case "02n":
    case "03n":
    case "04n":
        weatherImage = "https://img.icons8.com/color/96/cloud.png";
        break;

    case "09d":
    case "09n":
    case "10d":
    case "10n":
        weatherImage = "https://img.icons8.com/color/96/rain.png";
        break;

    case "11d":
    case "11n":
        weatherImage = "https://img.icons8.com/color/96/storm.png";
        break;

    case "13d":
    case "13n":
        weatherImage = "https://img.icons8.com/color/96/snow.png";
        break;

    case "50d":
    case "50n":
        weatherImage = "https://img.icons8.com/color/96/fog-day.png";
        break;

    default:
        weatherImage = "https://img.icons8.com/color/96/cloud.png";
}

        weatherResult.innerHTML = `
            <div class="weather-info">

                <h2>${data.name}, ${data.sys.country}</h2>

                <img src="${weatherImage}" alt="Weather Icon">


               

                <p><strong>🌡 Temperature:</strong> ${data.main.temp} °C</p>

                <p><strong>💧 Humidity:</strong> ${data.main.humidity}%</p>

                <p><strong>🌬 Wind Speed:</strong> ${data.wind.speed} m/s</p>

                <p><strong>☁ Condition:</strong> ${data.weather[0].main}</p>

            </div>
        `;

    }
        searchWeatherBtn.addEventListener("click", function () {

        const city = cityInput.value.trim();

        if (city === "") {

            alert("Please enter a city name.");

            return;
        }

        getWeather(city);

    });

    cityInput.addEventListener("keypress", function (e) {

        if (e.key === "Enter") {

            searchWeatherBtn.click();

        }

    });

}