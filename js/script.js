let addTask = document.querySelector('.add');
let taskBlock = document.querySelector('.task-block');
let inputField = document.querySelector('.input-field');
let nameList = document.querySelector('.title');
let pageTitle = document.querySelector('title');



//save name list

let nameListData = [];


let nameListObj = {
    name: "My todo list",
}
nameListData.push(nameListObj)
if (localStorage.getItem('nameList')) {
    nameListData = JSON.parse(localStorage.getItem('nameList'));
    nameList.textContent = nameListData[0].name;
    pageTitle.textContent = nameListData[0].name;
}

//save message and checkbox (complete task) in localstorage
let saveData = [];

if (localStorage.getItem('todoList')) {
    saveData = JSON.parse(localStorage.getItem('todoList'));
    addingTasks();
}

function saveCompleteTaskData () {
saveData.forEach((item, index) => {
    if (item.complete === true) {
    let taskText = document.querySelectorAll('.task-text')[index];
        let buttonComplete = taskBlock.children[index].querySelector('.task-complete-btn');
        taskText.classList.add('task-text_complete');
        buttonComplete.classList.toggle("task-complete-btn_pressed");
        buttonComplete.classList.toggle("task-complete-btn");

    }
})
}

saveCompleteTaskData();


function logicAddingTasks () {
        

    if (inputField.value.trim() === "") {
        inputField.value = "";
        inputField.focus();
        return;
    }

    let objTodo = {
        message: inputField.value,
        complete: false,
    };
    saveData.push(objTodo);
    addingTasks();
    saveCompleteTaskData();
    localStorage.setItem('todoList', JSON.stringify(saveData));

}

addTask.addEventListener('click', logicAddingTasks);
inputField.addEventListener('keypress', event => {
    if (event.key === "Enter") {
        logicAddingTasks();
    }
});

function addingTasks () {
    let addTask = "";
    inputField.value = "";

    saveData.forEach((item, index) => {
        addTask += `
        <div class="block-elements" >
            <img src="img/taskComplete.png" class="task-complete-btn" alt="complete task">
            <p class="task-text">${item.message}</p>
            <img src="img/edit.png" class="edit-btn" alt="edit task" onclick="editTask(${index})">
            <img src="img/deleteTask.png" class="delete-btn" alt="remove task" onclick="deleteTask(${index})">
        </div>
    `;
    });

    taskBlock.innerHTML = addTask;
    Complete();

}

//editing logic
function editTask(index) {
    let textTask = taskBlock.children[index].querySelector('.task-text');
    taskBlock.children[index].innerHTML = `
    <div class="editBlock">
     <input class="edit-field" type="text" value="${textTask.textContent}" maxlength="260">
     <img src="img/save.png" class="save-btn" alt="save changes" onclick="saveChanges(${index})">
     <img src="img/cancel.png" class="cancel-btn" alt="cancel changes" onclick="cancelChanges(${index})"></div>
  `
    let editField = taskBlock.children[index].querySelector('.edit-field');
    editField.focus();
    editField.setSelectionRange(editField.value.length, editField.value.length);
    // save/cancel actions by pressing a key

    //save changes
    editField.addEventListener('keydown', (event) => {
        if (event.keyCode === 13) {
            saveChanges(index);
        }
    })
    //cancel changes
    editField.addEventListener('keydown', (event) => {
        if (event.keyCode === 27) {
            cancelChanges();
        }
    })
}

function saveChanges(index) {
    let editField = taskBlock.children[index].querySelector('.edit-field');
    let taskText = taskBlock.children[index].querySelector('.editBlock');
    let value = editField.value.trim();

    if (value === '') {
        editField.value = "";
        return;
    }

    taskText.textContent = value;

    saveData[index].message = value;
    saveData[index].complete = false;
    localStorage.setItem('todoList', JSON.stringify(saveData));



    addingTasks();
    saveCompleteTaskData();
}

function cancelChanges() {
    addingTasks();
    saveCompleteTaskData();
}




function deleteTask(item) {
    saveData.splice(item, 1);
    localStorage.setItem('todoList', JSON.stringify(saveData));
    addingTasks();
    saveCompleteTaskData();
}

function Complete() {
    let completeButtons = taskBlock.querySelectorAll('.task-complete-btn');
    completeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            let index = Array.from(completeButtons).indexOf(event.target);
            button.classList.toggle("task-complete-btn_pressed");
            button.classList.toggle("task-complete-btn");
            let taskText = taskBlock.children[index].querySelector('.task-text');
            taskText.classList.toggle('task-text_complete');
            saveData[index].complete = !saveData[index].complete;
            localStorage.setItem('todoList', JSON.stringify(saveData));
        });
    });
}

//change list name
function editNameList (item) {
    let editNameBtn = document.querySelector('.edit-name-btn')
    editNameBtn.addEventListener('click', () => {
        nameList.innerHTML =
            `<div class="editNameBlock">
            <input class="edit-name-field" placeholder="Enter name" type="text" value="${nameList.textContent}" maxlength="40">
            <img src="img/save.png" class="save-name-btn" alt="save changes">
            <img src="img/cancel.png" class="cancel-name-btn" alt="cancel changes"></div>
    `
        editNameBtn.style.display = "none";
        let editNameField = document.querySelector('.edit-name-field');
        editNameField.focus();
        editNameField.setSelectionRange(editNameField.value.length, editNameField.value.length);

        //save changes
        let saveNameList = document.querySelector('.save-name-btn');
        saveNameList.addEventListener('click', saveChangeList);
        editNameField.addEventListener('keydown', (event) => {
            if (event.keyCode === 13) {
                saveChangeList();
            }
        });


        //cancel changes
        let cancelChangesName = document.querySelector('.cancel-name-btn');
        cancelChangesName.addEventListener('click', cancelChangesList);
        editNameField.addEventListener('keydown', (event) => {
            if (event.keyCode === 27) {
                cancelChangesList();
            }
        });


        //save changes
        function saveChangeList() {
            if (editNameField.value.trim() === ""){
                editNameField.value = "";
                editNameField.focus();
                return;
            }
            nameList.textContent = editNameField.value;
            pageTitle.textContent = editNameField.value;
            editNameBtn.style.display = "flex";
            nameListData[item].name = editNameField.value;
            localStorage.setItem('nameList', JSON.stringify(nameListData));
        }

        //cancel changes

        function cancelChangesList () {
            nameList.textContent = nameListData[item].name;
            editNameBtn.style.display = "flex";
        }


    });
}
editNameList(0);

