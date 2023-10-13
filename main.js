const tasks = []
let time = 60
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
    tasksContainer.innerHTML = ""; // Limpia el contenido anterior

    tasks.forEach(task => {
        if (task.id === currentTaskId) {
            // No muestra la tarea actual en la lista
            return;
        }

        const taskHtml = `
            <div class="list-task">
                <div class="task">
                    <div class="completed">
                        ${task.completed 
                            ? `<span class="done">Completada</span>` 
                            : `<button class="start-button" data-id="${task.id}"><img src="./img/Group 818.png">Start</button>`
                        }
                    </div>
                    <div class="title">${task.title}</div>
                  
                </div>
            </div>
        `;
        
        tasksContainer.innerHTML += taskHtml; // Agrega la tarea al contenedor
    
     
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
    time = 0.5 * 60;
    currentTaskId = id; // Registra la tarea actual
    const taskIndex = tasks.findIndex(task => task.id === id);
    taskName.textContent = tasks[taskIndex].title ;

    // Oculta el botón "Start" de la tarea actual
    const startButton = document.querySelector(`[data-id="${id}"]`);
    startButton.style.display = "none";
    

    // Oculta solo la tarea que se está ejecutando
    const taskContainer = startButton.closest('.list-task');
    taskContainer.style.display = "none";

    // Crea un elemento <span> para el mensaje "En progreso..."
    const inProgressSpan = document.createElement("span");
    inProgressSpan.textContent = "En progreso...";

    // Agrega el <span> al contenedor de mensajes "En progreso..."
    const inProgressContainer = document.getElementById("inProgressMessage");
    inProgressContainer.innerHTML = ""; // Limpia cualquier mensaje anterior
    inProgressContainer.appendChild(inProgressSpan);


     // Muestra el temporizador al hacer clic en "Start"
     const minutesDiv = document.querySelector("#minutes");
     const secondsDiv = document.querySelector("#seconds");
     minutesDiv.style.display = "inline";
     secondsDiv.style.display = "inline";

    // Agrega la clase al cuerpo de la página para cambiar el fondo
    document.body.classList.add("active-background");

     // Cambia el fondo del elemento "time" al hacer clic en "Start"
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
        // current = null
        // taskName.textContent = ""
        renderTasks()
        startBreak()
    }
}

function startBreak() {

    hideInProgressMessage()
    time = 0.5 * 60;
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
        currentTaskId = null; // Reinicia la tarea actual
        timerBreak = null;
        taskName.textContent = "";

        hideInProgressMessage()
        // Restablece el fondo y muestra nuevamente el botón "Start" de la tarea actual
        document.body.classList.remove("active-background");
        renderTasks();
    }
}

function renderTime() {
    const minutesDiv = document.querySelector("#minutes");
    const secondsDiv = document.querySelector("#seconds");

    const minutes = parseInt(time / 60);
    const seconds = parseInt(time % 60);

    // Actualiza los divs de minutos y segundos
    minutesDiv.textContent = minutes < 10 ? "0" + minutes : minutes;
    secondsDiv.textContent = seconds < 10 ? "0" + seconds : seconds;
}


function markCompleted(id){
    const taskIndex = tasks.findIndex(task => task.id === id)
    tasks[taskIndex].completed = true
}

// Agrega la siguiente función para ocultar el mensaje "En progreso"
function hideInProgressMessage() {
    const inProgressContainer = document.getElementById("inProgressMessage");
    inProgressContainer.innerHTML = "";
}