//Selectors
const background = document.querySelector(".backgroundimg");
const form = document.getElementById('form');
const taskInput = document.querySelector(".task-input");
const taskBtn = document.querySelector(".task-btn");
const taskList = document.querySelector(".task-list");
let tasks;

//a map can act as a dicitionary
let checkedMap;

//Event listeners
document.addEventListener("DOMContentLoaded", () => {
    getTasks();
    changeBG();
});
taskBtn.addEventListener("click", addTask);
taskList.addEventListener("click", deleteCheck);

//Functions
function changeBG() {
    var randomNum = Math.floor(Math.random()*6);
    background.style.backgroundImage = "url(media/" + randomNum + ".webp)";
}

function addTask(event) {
    if (form.style.minHeight == "80vh") {
        let id = null;
  
        let minHeight = 80;
        clearInterval(id);
        id = setInterval(frame, 1);
        function frame() {
            if (minHeight == 20) {
                clearInterval(id);
            } else {
                minHeight--; 
                form.style.minHeight = minHeight + "vh"; 
            }
        }
        form.style.minHeight = "20vh";
    }

    //prevent from from submitting
    event.preventDefault();

    //Task div
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");

    //create li
    const newTask = document.createElement("li");
    newTask.innerText = taskInput.value;
    newTask.classList.add("task-item");
    taskDiv.appendChild(newTask);

    //add todo to local storage
    saveLocalTasks(taskInput.value);

    //Check mark button 
    const completedBtn = document.createElement("button");
    completedBtn.innerHTML = '<i class="material-icons">done</i>';
    completedBtn.classList.add("complete-btn"); 
    taskDiv.appendChild(completedBtn);
    
    //Delete button
    const trashBtn = document.createElement("button");
    trashBtn.innerHTML = '<i class="material-icons">delete</i>';
    trashBtn.classList.add("trash-btn");
    taskDiv.appendChild(trashBtn);

    //append to list
    taskList.appendChild(taskDiv);
    
    clearInputField();
}

function clearInputField() {
    taskInput.value = "";
}

function deleteCheck(e) {
    const item = e.target;
    const task = item.parentElement;

    //Delete
    if (item.classList[0] === 'trash-btn') {
        //animation
        task.classList.add("slideout");
        removeLocalTasks(task);

        if (task.classList.value.includes("completed")) {
            removeChecked(task);
        }

        task.addEventListener("transitionend", function () {
            task.remove();
        });
    }

    //Checked
    if (item.classList[0] === 'complete-btn') {
        task.classList.toggle("completed");
        
        if (task.classList.value.includes("completed")) {
            saveCheckedTasks(task);
        } else {
            removeChecked(task);
        }
    }
    if (tasks.length == 0) {
        moveFormDown();
    }
}

function moveFormDown() {
    let id = null;
  
    let minHeight = 20;
    clearInterval(id);
    id = setInterval(frame, 5);
    function frame() {
        if (minHeight == 80) {
            clearInterval(id);
        } else {
            minHeight++; 
            form.style.minHeight = minHeight + "vh"; 
        }
    }
}

function removeChecked(task) {
    checkedMap.delete(task.children[0].innerText);
    localStorage.setItem("checkedMap", JSON.stringify(Array.from(checkedMap.entries())));
}


function saveCheckedTasks(checkedTask) {
    checkedMap.set(checkedTask.children[0].innerText, true);
    localStorage.setItem("checkedMap", JSON.stringify(Array.from(checkedMap.entries())));
}

function saveLocalTasks(task) {
    checkLocalStorage();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasks() {
    checkLocalStorage();

    if (tasks.length === 0) {
        form.style.minHeight = "80vh";
    }
    tasks.forEach(function(individualtask) {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");

        //create li
        const newTask = document.createElement("li");
        newTask.innerText = individualtask;
        newTask.classList.add("task-item");
        taskDiv.appendChild(newTask);

        //Check mark button 
        const completedBtn = document.createElement("button");
        completedBtn.innerHTML = '<i class="material-icons">done</i>';
        completedBtn.classList.add("complete-btn"); 
        taskDiv.appendChild(completedBtn);
        
        if (checkedMap.size > 0 && checkedMap.has(individualtask)) {
            taskDiv.classList.toggle("completed");
        }
        
        //Delete button
        const trashBtn = document.createElement("button");
        trashBtn.innerHTML = '<i class="material-icons">delete</i>';
        trashBtn.classList.add("trash-btn");
        taskDiv.appendChild(trashBtn);

        //append to list
        taskList.appendChild(taskDiv);
    });
}

function removeLocalTasks(task){
    checkLocalStorage();
    const taskIndex = task.children[0].innerText;
    
    tasks.splice(tasks.indexOf(taskIndex), 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function checkLocalStorage() {
    if (localStorage.getItem("tasks") === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem("tasks"));   
    }

    if (localStorage.getItem("checkedMap") === null) {
        checkedMap = new Map();
    } else {
        checkedMap = new Map(JSON.parse(localStorage.getItem("checkedMap")));  
    }
}