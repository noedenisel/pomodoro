const tasks = []
let time = 0
let timer = null
let ak = null
let current = null

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

function renderTasks(){
    const html = tasks.map(task => {
        return `
            <div class="task">
                <div class="completed"> ${
                    task.completed 
                        ? `<span class="done">"Completada"</span>` 
                        : `<button class="start-button" data-id="${task.id}"><img src="./img/Group 818.png">Start</button>`
                    }</div>
                <div class="title">${task.title}</div>
            </div>
        `
    })

    const tasksContainer = document.querySelector("#tasks")
    tasksContainer.innerHTML = html.join(" ")

    const startButtons = document.querySelectorAll(".task .start-button")

    startButtons.forEach(button => {
        button.addEventListener("click", e => {
            if( !timer) {
                const id = button.getAttribute("data-id")
                startButtonHandler(id)
                button.textContent= "En progreso..."
            }
        })
    })
}

function startButtonHandler(id){
    time = 25 * 60
    current = id
    const taskIndex = tasks.findIndex(task => task.id === id)
    taskName.textContent = tasks[taskIndex].title

      // Oculta el botón "Start"
      const startButton = document.querySelector(`[data-id="${id}"]`);
      startButton.style.display = "none";

     // Oculta la tarea que se está ejecutando
     const title = startButton.closest('.task').querySelector('.title');
     title.style.display = "none";
      
  
      // Agrega la clase al cuerpo de la página para cambiar el fondo
      document.body.classList.add("active-background");

    timer = setInterval( ()=> {
        timeHandler(id)
    }, 1000)
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

function startBreak(){
    time = 5 * 60
    taskName.textContent = "break"
    timerBreak = setInterval(()=>{
        timerBreakHandler()

   }, 1000 )
}

function timerBreakHandler() {
    time--;
    renderTime();

    if (time === 0) {
        clearInterval(timerBreak);
        current = null;
        timerBreak = null;
        taskName.textContent = "";

        // Restablece el fondo y muestra nuevamente el botón "Start"
        document.body.classList.remove("active-background");
        renderTasks();
    }
}


function renderTime(){
    const timeDiv = document.querySelector("#time #value")
    const minutes = parseInt(time/60)
    const seconds = parseInt(time%60)

    timeDiv.textContent = `${minutes < 10 ? "0": ""}${minutes}:${seconds < 10 ? "0" :""}${seconds}`

}

function markCompleted(id){
    const taskIndex = tasks.findIndex(task => task.id === id)
    tasks[taskIndex].completed = true
}