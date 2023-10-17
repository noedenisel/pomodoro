//ToDo: cuando vuelve a renderizarse con las tareas completadas que no muestre el reloj

const tasks = []
let time = 1500
let timer = null
let task = null
let current = null
let currentTaskId = null;

const bAdd = document.querySelector("#bAdd")
const itTask = document.querySelector("#itTask")
const form = document.querySelector("#form")
const taskName = document.querySelector("#time #taskName")


renderTime()
renderTasks()

form.addEventListener("submit", e => {
    e.preventDefault()
        if(itTask.value !== " "){
            createTask(itTask.value)
            itTask.value= " "
            renderTasks()
            document.querySelector("#pendientes").style.display = "block";
        }

        
})

function createTask(value){
    const newTask = {
        id: (Math.random() * 100).toString(36).slice(3),
        title: value, 
        complete: false
    }
    tasks.unshift(newTask)
}

function renderTasks() {
    const tasksContainer = document.querySelector("#tasks");
    tasksContainer.innerHTML = ""; 

    tasks.forEach(task => {
        if (task.id === currentTaskId) {
            return;
        }

        const taskHtml = `
            <div class="list-task">
                <div class="task">
                    <div class="completed">
                        ${task.completed 
                            ? `<span class="done"><img src="./img/dibujar-marca-de-verificacion.png"></span>` 
                            : `<button class="start-button" data-id="${task.id}"><img src="./img/Group 818.png">Start</button>`
                        }
                    </div>
                    <div class="title">${task.title}</div>
                  
                </div>
            </div>
        `;
        
        tasksContainer.innerHTML += taskHtml; 
    
     
    });

    const startButtons = document.querySelectorAll(".task .start-button");

    startButtons.forEach(button => {
        button.addEventListener("click", e => {
            if (!timer) {
                const id = button.getAttribute("data-id");
                startButtonHandler(id);
                button.textContent = "En progreso...";
            }
        });
    });


}


function startButtonHandler(id) {
    time = 25 * 60;
    currentTaskId = id; 
    const taskIndex = tasks.findIndex(task => task.id === id);
    taskName.textContent = tasks[taskIndex].title ;

    const startButton = document.querySelector(`[data-id="${id}"]`);
    startButton.style.display = "none";
    
    const taskContainer = startButton.closest('.list-task');
    taskContainer.style.display = "none";

    const inProgressSpan = document.createElement("span");
    inProgressSpan.textContent = "En progreso...";

    const inProgressContainer = document.getElementById("inProgressMessage");
    inProgressContainer.innerHTML = ""; 
    inProgressContainer.appendChild(inProgressSpan);




     const minutesDiv = document.querySelector("#minutes");
     const secondsDiv = document.querySelector("#seconds");
     minutesDiv.style.display = "inline";
     secondsDiv.style.display = "inline";

    document.body.classList.add("active-background");

     const timeElement = document.querySelector("#time");
     timeElement.style.backgroundColor = "rgba(245, 245, 245, 0.058)";

    timer = setInterval(() => {
        timeHandler(id);
    }, 1000);
}

function timeHandler(id){
    time = time - 1
    renderTime()

    if( time === 0 ) {
        clearInterval(timer)
        markCompleted(id)
        timer = null
        renderTasks()
        startBreak()
    }
}

function startBreak() {

    hideInProgressMessage()
    time = 5 * 60;
    taskName.textContent = "Break";
    timerBreak = setInterval(() => {
        timerBreakHandler();
    }, 1000);
}

function timerBreakHandler() {
    time--;
    renderTime();

    if (time === 0) {
        clearInterval(timerBreak);
        currentTaskId = null; 
        timerBreak = null;
        taskName.textContent = "";

        hideInProgressMessage()
        document.body.classList.remove("active-background");
        renderTasks();
    }
}

function renderTime() {
    const minutesDiv = document.querySelector("#minutes");
    const secondsDiv = document.querySelector("#seconds");

    const minutes = parseInt(time / 60);
    const seconds = parseInt(time % 60);

    minutesDiv.textContent = minutes < 10 ? "0" + minutes : minutes;
    secondsDiv.textContent = seconds < 10 ? "0" + seconds : seconds;
}


function markCompleted(id){
    const taskIndex = tasks.findIndex(task => task.id === id)
    tasks[taskIndex].completed = true
}

function hideInProgressMessage() {
    const inProgressContainer = document.getElementById("inProgressMessage");
    inProgressContainer.innerHTML = "";
}