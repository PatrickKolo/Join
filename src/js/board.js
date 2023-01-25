let currentDraggedElement;
let alreadyEmpty = true;
let filteredTasks = [];
let currentTask = {};


/**
 * init board function gets the global init function from script.js, checks if user is logged in
 * gets the tasks from current user, init the rendering of the tasks
 */
async function initBoard() {
    await init();
    setNavLinkActive();
    checkUserIsLoggedIn();
    getTasksOfCurrentUser();
    handleFilterTasks();
    imgheader();
}


/**
 * get the tasks of the current user
 */
function getTasksOfCurrentUser() {
    currentUserTasks = currentUser.tasks;
    // console.log(currentUserTasks);
}


/**
 * checks if search input is empty or not and filter the tasks, and calls the function to get the tasks by thier status
 */
function handleFilterTasks() {
    let search = document.getElementById('search_input').value;
    let searchTerm = search.toLowerCase();
    if (searchTerm.length == 0) {
        filteredTasks = currentUserTasks;
        filterTasksByStatus();
    } else {
        includesSearch(searchTerm, currentUserTasks);
        filterTasksByStatus();
    }
}


/**
 * checks the tasks for the searchterm
 * @param {*} searchTerm 
 * @param {*} currentUserTasks 
 */
function includesSearch(searchTerm, currentUserTasks){
    filteredTasks = currentUserTasks.filter(filteredTasks => {
        return filteredTasks.title
        .toLowerCase()
        .includes(searchTerm) || 
        filteredTasks.description
        .toLowerCase()
        .includes(searchTerm);
    })
}


/**
 * filter all Tasks by thier status and created new arrays for each status, calls reset board function and calls function to render the board
 */
function filterTasksByStatus() {
    let statusTodo = filteredTasks.filter(task => task.status == 'toDo');
    let statusInProgress = filteredTasks.filter(task => task.status == 'inProgress');
    let statusAwaitingFeedback = filteredTasks.filter(task => task.status == 'awaitingFeedback');
    let statusDone = filteredTasks.filter(task => task.status == 'done');
    resetBoard();
    renderBoard(statusTodo, statusInProgress, statusAwaitingFeedback, statusDone);
}


/**
 * reset the board and deletes all tasks from the html code
 */
function resetBoard() {
    document.getElementById('toDo').innerHTML = '';
    document.getElementById('inProgress').innerHTML = '';
    document.getElementById('awaitingFeedback').innerHTML = '';
    document.getElementById('done').innerHTML = '';
}


/**
 * renders all tasks by status
 * @param {string} toDo all tasks with status todo
 * @param {string} inProgress all tasks with status inProgress
 * @param {string} awaitingFeedback all tasks with status awaitingFeedback
 * @param {string} done all tasks with status done
 */
function renderBoard(toDo, inProgress, awaitingFeedback, done) {
    renderTasks(toDo);
    renderTasks(inProgress);
    renderTasks(awaitingFeedback);
    renderTasks(done);
    renderDropTemplate('toDo');
    renderDropTemplate('inProgress');
    renderDropTemplate('awaitingFeedback');
    renderDropTemplate('done');
}


/**
 * renders a single task    
 * @param {string} status of the single task
 */
function renderTasks(status) {
    for (let index = 0; index < status.length; index++) {
        const element = status[index];
        let taskStatus = element.status;
        document.getElementById(taskStatus).innerHTML += generateTodoHTML(element);
        renderProgressBar(element)
        renderContactInTask(element);
    }
}


/**
 * renders the area to drob a tragged task
 * @param {string} status is the value for the status of drag area
 */
function renderDropTemplate(status) {
    document.getElementById(status).innerHTML += dropTemplateHTML(status);
}


/**
 * renders the contacts in the task
 * @param {*} element 
 */
function renderContactInTask(element) {
    for (let i = 0; i < element.user.length; i++) {
        let letter = element.user[i]['contactInitials'];
        let color = element.user[i]['concolor'];
        let id = element.id;
        document.getElementById("contacts" + id).innerHTML += /*html*/`
        <div style="background-color: ${color}" class="user">${letter}</div>
        `;
    }
}


/**
 * determines how many subtasks are present
 * @param {object} element is the current task
 */
function renderProgressBar(element) {
    let subTasksInTask = element.subTasks;
    let subTasksInTasksDone = subTasksInTask.filter((subTasksInTasksDone) => {
        return subTasksInTasksDone.done == true;
    });
    let taskId = element.id;
    if (subTasksInTask.length > 0) {
        fillProgressbar(subTasksInTask, subTasksInTasksDone, taskId)
    }
}


/**
 * renders and fills the progress bar depending on the status of the SubTasks
 * @param {*} subTasksInTask 
 * @param {*} subTasksInTasksDone 
 * @param {*} taskId 
 */
function fillProgressbar(subTasksInTask, subTasksInTasksDone, taskId){
    let taskProgressContainer = document.getElementById('task_progress_' + taskId);
    taskProgressContainer.innerHTML += progressBarTemplate(taskId);
    let fill = document.getElementById('fill' + taskId);
    let fillText = document.getElementById('fill-text' + taskId);
    fill.style.width = `${subTasksInTasksDone.length / subTasksInTask.length * 100}%`;
    fillText.innerHTML = `${subTasksInTasksDone.length}/${subTasksInTask.length} Done`;
}


/**
 * defines the dragged task
 * @param {number} id - id for idintifying the dragged task
 */
function startDragging(id) {
    for (i = 0; i < currentUserTasks.length; i++) {
        let index = currentUserTasks[i]['id'];
        let currentDraggedTaskStatus = currentUserTasks[i].status;
        if (index == id) {
            highlightDropZone(currentDraggedTaskStatus);
        }
    }
}


/**
 * highlites the drop zones for the tasks
 * @param {*} currentDraggedTaskStatus 
 */
function highlightDropZone(currentDraggedTaskStatus) {
    let dragTemplates = document.querySelectorAll('.drag-template');
    dragTemplates.forEach(dragTemplate => dragTemplate.classList.add('drag-template-start'));
    let currentDragTemplate = document.getElementById(`drop_template_${currentDraggedTaskStatus}`);
    currentDragTemplate.classList.remove('drag-template-start');
    currentDraggedElement = i;
}


/**
 * Allows the task to be dropped
 * @param {*} ev - This is the event
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * changes the status of the task according to the dropped area
 * @param {*} e - Ths is the event
 * @param {*} status - This is the status of the Task on the board
 */
async function moveTo(status) {
    currentUserTasks[currentDraggedElement]['status'] = status;
    filterTasksByStatus();
   // console.log(currentUserTasks);
    backend.setItem('users', JSON.stringify(users));
}


/**
 * open the task details
 * @param {number} id is the uniqe id from the array entry of the task
 */
function showDetailWindow(id) {
    let detailContainer = document.getElementById('detail_container');
    let detailContent = document.getElementById('detail_content');
    for (let filteredTasksIndex = 0; filteredTasksIndex < filteredTasks.length; filteredTasksIndex++) {
        currentTask = filteredTasks[filteredTasksIndex];
        if (currentTask.id == id) {
            detailContainer.classList.remove('d-none');
            detailContent.innerHTML = detailContentTemplate();
            renderAssignedContactsDetails();
            renderAssignedSubTasks(id);
        }
    }
}


/**
 * renders the assigned contacts from the current task
 */
function renderAssignedContactsDetails() {
    let detailAssignedContacts = document.getElementById('detail_assigned_contacts');
    for (let assignedContactsIndex = 0; assignedContactsIndex < currentTask.user.length; assignedContactsIndex++) {
        let letter = currentTask.user[assignedContactsIndex]['contactInitials'];
        let color = currentTask.user[assignedContactsIndex]['concolor'];
        let name = currentTask.user[assignedContactsIndex]['contactname'];
        detailAssignedContacts.innerHTML += showAssignedContactDetails(color, letter, name);
    }
}


/**
 * renders all subtasks of a task in the detail view of a task
 * @param {number} id is the id of a task
 */
function renderAssignedSubTasks(id) {
    let detailAssignedSubTasks = document.getElementById('detail_subTasks');
    for (let assignedSubTaskIndex = 0; assignedSubTaskIndex < currentTask.subTasks.length; assignedSubTaskIndex++) {
        const currentSubTask = currentTask.subTasks[assignedSubTaskIndex];
        detailAssignedSubTasks.innerHTML += renderAssignedSubTasksTemplate(currentSubTask, assignedSubTaskIndex, id);
        isSubTaskDone(currentSubTask, assignedSubTaskIndex);
    }
}


/**
 * checks if a subtask is done
 * @param {object} currentSubTask is the current subtask, to check if it is done
 * @param {numer} assignedSubTaskIndex is the index of the current subtask in the array subtasks in a task
 */
function isSubTaskDone(currentSubTask, assignedSubTaskIndex) {
    let subTaskCheckbox = document.getElementById(`subTask_${assignedSubTaskIndex}`);
    let subTaskTitle = document.getElementById(`subTask_title_${assignedSubTaskIndex}`);
    if (currentSubTask.done) {
        subTaskCheckbox.setAttribute('checked', true);
        subTaskTitle.classList.add('crossed-out');
    } else {
        subTaskCheckbox.removeAttribute('checked');
        subTaskTitle.classList.remove('crossed-out');
    }
}


/**
 * function to mark a subtask as done
 * @param {number} id is the id of a task
 */
async function setSubTaskDone(id) {
    currentTask = filteredTasks.filter((currentTask) => {
        return currentTask.id == id;
    });
    let currentSubTasks = currentTask[0].subTasks;
    subTaskDone(currentSubTasks);
    await backend.setItem('users', JSON.stringify(users));
}


/**
 * sets a subtask done or undone und style it
 * @param {object} currentSubTasks are the current subtasks
 */
function subTaskDone(currentSubTasks) {
    for (let currentSubTaskIndex = 0; currentSubTaskIndex < currentSubTasks.length; currentSubTaskIndex++) {
        const currentSubTask = currentSubTasks[currentSubTaskIndex];
        let subTaskCheckbox = document.getElementById(`subTask_${currentSubTaskIndex}`);
        let subTaskTitel = document.getElementById(`subTask_title_${currentSubTaskIndex}`);
        if (subTaskCheckbox.checked) {
            currentSubTask.done = true;
            subTaskTitel.classList.add('crossed-out');
        }
        if (!subTaskCheckbox.checked) {
            currentSubTask.done = false;
            subTaskTitel.classList.remove('crossed-out');
        }
    }
}


/**
 * renders the mask for editing an existing task
 * @param {number} id - The unique id of the task for identifiying the current task
 */
function changeTask(id) {
    let detailContent = document.getElementById('detail_content');
    for (let filteredTasksIndex = 0; filteredTasksIndex < filteredTasks.length; filteredTasksIndex++) {
        currentTask = filteredTasks[filteredTasksIndex];
        if (currentTask.id == id) {
            // console.log(currentTask);
            userSelect = currentTask.user;
            detailContent.innerHTML = changeTaskTemplate(id);
            editShowSelectedPriority();
            editShowSubTasks(id);
        }
    }
}


/**
 * shows the selected priority for the current task in the edit mask
 */
function editShowSelectedPriority() {

    if (currentTask.priority == "urgent") {
        prioritySelect = "urgent";
        showSelectedPriorityUrgent();
    }
    if (currentTask.priority == "medium") {
        prioritySelect = "medium";
        showSelectedPriorityMedium();
    }
    if (currentTask.priority == "low") {
        prioritySelect = "low";
        showSelectedPriorityLow()
    }
}


/**
 * shows the urgent category button
 */
function showSelectedPriorityUrgent() {
    document.getElementById("editPriorityUrgent").classList.add('prio-urgent-selected');
    document.getElementById("editPriorityMedium").classList.remove('prio-medium-selected');
    document.getElementById("editPriorityLow").classList.remove('prio-low-selected');

    document.getElementById('editPriorityUrgentImg').src = 'assets/img/prio-urgent-white.png';
    document.getElementById('editPriorityMediumImg').src = 'assets/img/prio-medium.png';
    document.getElementById('editPriorityLowImg').src = 'assets/img/prio-low.png';
}


/**
 * shows the medium category button
 */
function showSelectedPriorityMedium() {
    document.getElementById("editPriorityMedium").classList.add('prio-medium-selected');
    document.getElementById("editPriorityUrgent").classList.remove('prio-urgent-selected');
    document.getElementById("editPriorityLow").classList.remove('prio-low-selected');

    document.getElementById('editPriorityUrgentImg').src = 'assets/img/prio-urgent.png';
    document.getElementById('editPriorityMediumImg').src = 'assets/img/prio-medium-white.png';
    document.getElementById('editPriorityLowImg').src = 'assets/img/prio-low.png';
}


/**
 * shows the low category button
 */
function showSelectedPriorityLow() {
    document.getElementById("editPriorityLow").classList.add('prio-low-selected');
    document.getElementById("editPriorityUrgent").classList.remove('prio-urgent-selected');
    document.getElementById("editPriorityMedium").classList.remove('prio-medium-selected');

    document.getElementById('editPriorityUrgentImg').src = 'assets/img/prio-urgent.png';
    document.getElementById('editPriorityMediumImg').src = 'assets/img/prio-medium.png';
    document.getElementById('editPriorityLowImg').src = 'assets/img/prio-low-white.png';
}


/**
 * onclick function for the newly edited priority for the current edited task 
 * @param {*} i - identifies which priority is clicked
 */
function editSelectedPriority(i) {
    if (i == 1) {
        prioritySelect = "urgent";
        showSelectedPriorityUrgent();
    }
    if (i == 2) {
        prioritySelect = "medium";
        showSelectedPriorityMedium();
    }
    if (i == 3) {
        prioritySelect = "low";
        showSelectedPriorityLow();
    }
}


/**
 * renders the subtasks in the edit task mask
 * @param {number} id is the id of the current task 
 */
function editShowSubTasks(id) {
    let detailAssignedSubTasks = document.getElementById('edit_subTasks')
    detailAssignedSubTasks.innerHTML = '';
    // console.log(currentTask);
    for (let assignedSubTaskIndex = 0; assignedSubTaskIndex < currentTask.subTasks.length; assignedSubTaskIndex++) {
        let currentSubTask = currentTask.subTasks[assignedSubTaskIndex];
        detailAssignedSubTasks.innerHTML += editShowSubTasksTemplate(currentSubTask, assignedSubTaskIndex, id);
        isSubTaskDone(currentSubTask, assignedSubTaskIndex);
    }
}


/**
 * identifies the right task to change and add a new subtask
 * @param {number} id ist the id (identification) of the task to change
 */
function newSubTask(id) {
    let newSubTaskText = document.getElementById('new_subtask_text').value;
    let emptySubTaskText = document.getElementById('empty_subtask_text');
    emptySubTaskText.innerHTML = '';
    currentTask = filteredTasks.filter((currentTask) => {
        return currentTask.id == id;
    });
    currentTask = currentTask[0];
    isNewSubTaskEdit(newSubTaskText, emptySubTaskText, id);
    document.getElementById("change_task_template").scrollIntoView(false);

}


/**
 * get the new subtask an push it to the right task
 * @param {string} newSubTaskText ist the content od the new subtask
 * @param {string} emptySubTaskText is the text to show if the content of the new subtask is empty
 * @param {number} id is the id of the task to add a new subtask
 */
function isNewSubTaskEdit(newSubTaskText, emptySubTaskText, id) {
    if (newSubTaskText.length > 0) {
        let newSubTask = {
            'title': newSubTaskText,
            'done': false
        }
        currentTask.subTasks.push(newSubTask);
        newSubTaskText = '';
        changeTask(id);
    } else {
        emptySubTaskText.innerHTML = 'Please enter a title for the subtask';
    }
}


/**
 * deletes a subtask
 * @param {number} id is the id of the current task
 * @param {number} assignedSubTaskIndex ist the index of the subtasks array from the current tas
 */
async function deleteSubTask(id, assignedSubTaskIndex) {
    currentTask = filteredTasks.filter((currentTask) => {
        return currentTask.id == id;
    });
    currentTask = currentTask[0];
    let currentSubTasks = currentTask.subTasks;
    currentSubTasks.splice(assignedSubTaskIndex, 1);
    editShowSubTasks(id);
    await backend.setItem('users', JSON.stringify(users));
}


/**
 * saves the current task if it was edit
 * @param {number} currentTaskId is the id from the current task to save
 */
async function saveChangedTask(currentTaskId) {
    selectorcontactIndex = 0;
    getChangesForEditedTask(currentTaskId);
    await backend.setItem('users', JSON.stringify(users));
    closeDetailTask();
}


/**
 * gets the changes from the medit Task Mask
 * @param {*} currentTaskId - defines the current task
 */
function getChangesForEditedTask(currentTaskId) {
    let changedTitle = document.getElementById('changed_title').value;
    let changedDescription = document.getElementById('changed_description').value;
    let changedDueDate = document.getElementById('changed_date').value;
    let taskToChange = filteredTasks.find((taskId) => taskId.id == currentTaskId);
    taskToChange.user = [];
    taskToChange.user = userSelect;
    taskToChange.title = changedTitle;
    taskToChange.description = changedDescription;
    taskToChange.dueDate = changedDueDate;
    taskToChange.priority = prioritySelect;
    userSelect = [];
    prioritySelect = [];
}


/**
 * deletes the current showing task
 * @param {number} currentTaskId is the id of the current task
 */
async function deleteTask(currentTaskId) {
    let taskToDelete = filteredTasks.findIndex((taskId) => taskId.id == currentTaskId);
    filteredTasks.splice(taskToDelete, 1);
    await backend.setItem('users', JSON.stringify(users));
    prioritySelect = [];
    taskCategoryFinaly = [];
    closeDetailTask()
}


/**
 * saving to the backend
 */
async function saveDeletetTask() {
    await backend.setItem('users', JSON.stringify(users));
}


/**
 * Closes the Detail Window
 */
function closeDetailTask() {
    userSelect = [];
    document.getElementById('detail_content').innerHTML = '';
    document.getElementById('detail_container').classList.add('d-none');
    filterTasksByStatus();
}


/**
 * Hiding the add Task
 */
function hideAddTaskMask() {
    setTimeout(() => {
        document.getElementById("AddTaskMaskBg").classList.add("d-none");
        document.getElementById("detail_container").classList.add("d-none");
        document.getElementById('AddTaskMaskContact').classList.add("d-none");
        document.getElementById('AddTaskMaskContact').classList.add("d-none");
    }, 250);
}


/**
 * prevents closing when clicking in the window
 * @param {*} event 
 */
function doNotClose(event) {
    event.stopPropagation();
}
