let selectorCategoryIndex = 0;
let taskCategorySelector = [];
let categorySelectedColor;
let selectorcontactIndex = 0;
let userSelect = [];
let taskCategoryFinaly = [];
let prioritySelect = [];
let subTasks = [];
let userSelected = [];

/**
 * init function will execute wenn page add-task.html is loading
 * checks if user is logged in 
 * execute "global" init function from script.js
 */
async function initAddTask() {
  await init();
  setNavLinkActive();
  checkUserIsLoggedIn();
  getTasksOfCurrentUser();
  imgheader();
}


/**
 * defines the current task and pushes it to the Array alltasks and saves it in the backend
 * @param {*} i - idintifies from where the task is created
 */
async function addToTask(i, taskStatus) {
  if (taskCategoryFinaly.length == 0) {
    document.getElementById('chooseCategory').classList.remove('d-none');
  }
  else if (prioritySelect.length == 0) {
    document.getElementById('chossePriority').classList.remove('d-none');
  }
  else {
    pushCurrentTask(i, taskStatus);
    await backend.setItem('users', JSON.stringify(users));
    clearArrays();
    submitAndCloseAddTask(i);
  }
  selectorcontactIndex = 0;
}


/**
 * close the AddTask Mask
 */
function submitAndCloseAddTask(i) {
  if (i == 0) {
    window.location.href = './board.html';
    filterTasksByStatus();
  }
  else if (i == 1) {
    closeMaskFromBoard();
  }
}


/**
 * clears the used Arrays
 */
function clearArrays() {
  prioritySelect = [];
  taskCategoryFinaly = [];
  subTasks = [];
  userSelect = [];
}


/**
 * pushes the currentTask
 * @param {*} i 
 * @param {*} taskStatus 
 */
function pushCurrentTask(i, taskStatus) {
  let title = document.getElementById('AddTitle');
  let description = document.getElementById('AddDescription');
  let dueDate = document.getElementById('add-date');
  let currentTask = {
    "id": (new Date().getTime() * Math.random()).toFixed(0),
    "category": {
      Category: taskCategoryFinaly,
      TaskColor: taskCategoryColorFinaly,
    },
    "title": title.value,
    "description": description.value,
    "dueDate": dueDate.value,
    "priority": prioritySelect,
    "user": userSelect,
    "subTasks": subTasks,
    'status': taskStatus
  };
  currentUserTasks.push(currentTask);
}


/**
 * closes the Mask when generating a task from board
 */
function closeMaskFromBoard() {
  document.getElementById('AddTaskMaskBg').classList.add('d-none');
  showTaskAddedPopUp();
  filterTasksByStatus();
}


/**
 * generates the pop up after a task is created
 */
function showTaskAddedPopUp() {
  document.getElementById('task_added_to_board_img').classList.remove('d-none');
  setTimeout(() => {
    document.getElementById('task_added_to_board_img').classList.add('d-none');
  }, 1000);

}


/**
 * renders the AddTask Mask
 * @param {*} i - idintifies from where the task is created
 */
function openAddTaskMask(i, taskStatus) {
  document.getElementById('AddTaskMaskBg').classList.remove('d-none');
  document.getElementById('AddTaskMaskContainer').classList.remove('d-none');
  userSelect = [];
  selectedSubtasks = [];
  let openaddtask = document.getElementById('AddTaskMaskContainer');
  openaddtask.innerHTML = openAddTaskHtml(i, taskStatus);
}


/**
 * renders the subTask in the add task mask
 */
function renderSubTask() {
  document.getElementById("addSubtaskCheckbox").innerHTML = ``;
  for (let subTaskIndex = 0; subTaskIndex < subTasks.length; subTaskIndex++) {
    subTask = subTasks[subTaskIndex];
    document.getElementById("addSubtaskCheckbox").innerHTML += showSubtaskCheckbox(subTask, subTaskIndex);
  }
}


/**
 * deletes the subtask
 * @param {number} subTaskIndex is the index of the subtask in the array subtasks
 */
function deleteSubTaskAdd(subTaskIndex) {
  document.getElementById(`subTask_${subTaskIndex}`).innerHTML = ``;
  subTasks.splice(subTaskIndex, 1);
}


/**
 * pushing new subTask in to the task array
 */
function pushSubtasks(x) {
  let newSubTaskText = document.getElementById('new_subtask_text').value;
  let emptySubTaskText = document.getElementById('empty_subtask_text');
  emptySubTaskText.innerHTML = '';
  isNewSubTask(newSubTaskText, emptySubTaskText);
  scrollToBottomAfterCreatingSubtask(x)
}


/**
 * get the content from the new subtask an push it to the array of the task
 * @param {string} newSubTaskText is the content of the new subtask
 * @param {string } emptySubTaskText is the text to show if the con from the new subtask is empty
 */
function isNewSubTask(newSubTaskText) {
  let subTaskInput = document.getElementById("new_subtask_text")
  if (newSubTaskText.length > 0) {
    pushNewSubTask(newSubTaskText)
  } else if (newSubTaskText.length == 0) {
    showAlertEmptySubtask(subTaskInput);
  }
}


/**
 * pushes a new subtask
 * @param {*} newSubTaskText 
 */
function pushNewSubTask(newSubTaskText) {
  newSubTask = {
    'title': newSubTaskText,
    'done': false
  }
  subTasks.push(newSubTask)
  renderSubTask(newSubTask);
  document.getElementById('new_subtask_text').value = ``
}


/**
 * scrolls to the bottom when subtask is generated
 * @param {*} x indicates where the subtask is generated
 */
function scrollToBottomAfterCreatingSubtask(x){
if (x == 1) {
  document.getElementById("atf").scrollIntoView(false);
} if (x == 2) {
  document.getElementById("left_container").scrollIntoView(false);
} if (x == 3) {
  document.getElementById("detail_content").scrollIntoView(false);
} 
}


/**
 * shows an Alert in the placeholder when subtask is submitted empty
 */
function showAlertEmptySubtask(subTaskInput) {
  subTaskInput.placeholder = 'Please enter a subtask!';
  setTimeout(() => {
    subTaskInput.placeholder = 'Add a new subtask!';
  }, 2000);
}


/**
 * clear subtask input
 */
function clearSubTasks() {
  if (document.getElementById('new_subtask_text').value != null) {
    document.getElementById("new_subtask_text").value = '';
  }
}


/**
 * closes the AddTaskMask
 * @param {*} i 
 */
function closeAddTaskMask(i) {
  userSelect = [];
  if (i == 1) {
    document.getElementById('AddTaskMaskBg').classList.add('d-none');
    selectorcontactIndex = 0;
  }
  else if (i == 0) {
    document.getElementById('openContactAddtaskBG').classList.add('d-none');
    selectorcontactIndex = 0;
    lfContact();
  }
}


/**
 * renders the Drop Down Menu for the User selection
 * @param {*} contact 
 */
function showUsers(contact) {
  let activUserContact = currentUser.contacts;
  document.getElementById('selector_user_dropdown').innerHTML = ``;
  if (selectorcontactIndex == 0) {
    document.getElementById('selector_user_dropdown_contact').innerHTML = ``;
    selectorcontactIndex++;
    chooseContactForTask(contact, activUserContact);
  }
  else {
    showSelectedContactBubbles()
    selectorcontactIndex--;
  }
}


/**
 * function for choosing a contact for a task
 * @param {*} contact 
 * @param {*} activUserContact 
 */
function chooseContactForTask(contact, activUserContact){
  for (let i = 0; i < activUserContact.length; i++) {
    document.getElementById('selector_user_dropdown').innerHTML += showContactsDropDown(i, activUserContact, currentUser);
  }
  if (!(contact == 0)) {
    document.getElementById('selector_user_dropdown').innerHTML += showInviteNewContact();
  }
  if (contact == 0) {
    selectContactForTask();
  }
  if (userSelect.length > 0) {
    for (let o = 0; o < userSelect.length; o++) {
      getSelectedContactForTask(o, userSelect);
    }
  }
}


/**
 * selects the Contact for a task when no contact was selected
 */
function selectContactForTask() {
  let f = savecontactforaddtask;
  let contactintask = currentUser.contacts[f];
  let contactInitials = contactintask['contactInitials'];
  let contactcolor = contactintask['contactcolor'];
  let contactname = contactintask['contactName'];
  selectedUser(contactInitials, contactcolor, f, contactname);
}


/**
 * gets the selected contacts for the current task
 */
function getSelectedContactForTask(o, userSelect) {
  let contactInitials = userSelect[o]['contactInitials'];
  let contactcolor = userSelect[o]['concolor'];
  let contactname = userSelect[o]['contactname'];
  let id = userSelect[o]['id'];
  selectedUserAdd(contactInitials, contactcolor, id, contactname);
}


/**
 * resets the dropdown menu for the contacts
 */
function lfContact() {
  let f = savecontactforaddtask;
  let contactintask = currentUser.contacts[f];

  let contactcolor = contactintask['contactcolor'];
  let index = findeContactIndex(contactcolor);
  userSelect.splice(index, 1);
  document.getElementById('selector_user_dropdown').innerHTML = ``;
}


/**
 * 
 * @param {*} contactInitials 
 * @param {*} contactcolor 
 * @param {*} i 
 * @param {*} contactname 
 */
function selectedUserAdd(contactInitials, contactcolor, id, contactname) {
  document.getElementById('user_select' + contactInitials + contactcolor + id + contactname).classList.add('checked');
  document.getElementById('user_select' + contactInitials + contactcolor + id + contactname).src = 'assets/img/userSelect-selected.png';
}


/**
 *  getting selected User
 * @param {*} contactInitials 
 * @param {*} contactcolor 
 * @param {*} i 
 * @param {*} contactname 
 */
function selectedUser(contactInitials, contactcolor, i, contactname) {
  let index = findeContactIndex(contactcolor);
  if (document.getElementById('user_select' + contactInitials + contactcolor + i + contactname).classList.contains('checked')) {
    userSelect.splice(index, 1)
    document.getElementById('user_select' + contactInitials + contactcolor + i + contactname).classList.remove('checked');
    document.getElementById('user_select' + contactInitials + contactcolor + i + contactname).src = 'assets/img/userSelect-img.png';
  }
  else {
    pushSelectedUser(contactInitials, contactcolor, i, contactname)
  }
}


/**
 * pushes the selected Contact
 * @param {*} contactInitials 
 * @param {*} contactcolor 
 * @param {*} i 
 * @param {*} contactname 
 */
function pushSelectedUser(contactInitials, contactcolor, i, contactname) {
  userSelect.push({
    'id': i,
    'contactInitials': contactInitials,
    'concolor': contactcolor,
    'contactname': contactname
  });
  document.getElementById('user_select' + contactInitials + contactcolor + i + contactname).classList.add('checked');
  document.getElementById('user_select' + contactInitials + contactcolor + i + contactname).src = 'assets/img/userSelect-selected.png';
}


/**
 * finds the index of the contact
 * @param {*} contactcolor 
 * @returns the index of the contact
 */
function findeContactIndex(contactcolor) {
  let index;
  for (let i = 0; i < userSelect.length; i++) {
    if (userSelect[i].concolor == contactcolor)
      index = i;
  }
  return index;
}


/**
 * renders the Drop Down Menu for the categories
 */
function showTaskCategories() {
  if (selectorCategoryIndex == 0) {
    document.getElementById('selector_Category_Dropdown').innerHTML = ``;
    document.getElementById('selector_Category_Dropdown').innerHTML += showNewCategory();
    for (let n = 0; n < currentUser.category.length; n++) {
      let staticCategorys = currentUser.category[n];
      document.getElementById('selector_Category_Dropdown').innerHTML += showExistingCategories(staticCategorys);
    }
    selectorCategoryIndex++;
  } else {
    document.getElementById('selector_Category_Dropdown').innerHTML = ``;
    selectorCategoryIndex--;
  }
};


/**
 * getting selected Category
 * @param {*} category - the newly generated category
 * @param {*} color - the chosen color
 */
function selectedCategory(category, color) {
  taskCategoryFinaly = category;
  taskCategoryColorFinaly = color;
  document.getElementById("category_selector").innerHTML = showSelectCategory(category, color);
  document.getElementById('selector_Category_Dropdown').innerHTML = '';
  selectorCategoryIndex--;
}


/**
 * renders the Input field for categorys
 */
function changeInputCategory() {
  document.getElementById('selector_Category_Dropdown').innerHTML = '';
  document.getElementById('category_selector').innerHTML = showChangeInputCategory();
}


/**
 * renders the drop down field when exiting the category generator
 */
function exitCategoryInput() {
  document.getElementById('category_selector').innerHTML = showExitCategoryInput();
  showTaskCategories();
}


/**
 * adds a chosen color to the newly generated category
 * @param {*} value - defines the clicked color
 */
function addCategoryColor(value) {
  if (document.getElementById("input-new-category").value) {
    categorySelectedColor = value;
    document.getElementById("categoryColorCells").innerHTML = ``;
    document.getElementById("categoryColorCells").innerHTML = /*html*/` <img class="chosen-color" src="./assets/img/${categorySelectedColor}.png" alt="">`;
    document.getElementById('alert_message').innerHTML = '';
  } else {
    document.getElementById('chooseCategory').innerHTML = `Please enter category first!`;
  }
}


/**
 * adds a individual category to the task
 */
async function addCategory() {
  newCategory = document.getElementById("input-new-category").value;
  if (categorySelectedColor && newCategory) {
    currentUser.category.push({
      'taskCategory': newCategory,
      'taskColor': categorySelectedColor
    });
    await backend.setItem('users', JSON.stringify(users));
    //console.log(currentUser);
    exitCategoryInput();
    showTaskCategories();
  } else {
    document.getElementById("chooseCategory").innerHTML = `Please select color!`;
  }
};


/**
 * defines the Priority and shows the matching img
 * @param {*} i - identifies which priority is clicked
 */
function selectedPriority(i) {
  if (i == 1) {
    prioritySelect = "urgent";
    urgentPrioritySelected();
  }
  if (i == 2) {
    prioritySelect = "medium";
    mediumPrioritySelected()
  }
  if (i == 3) {
    prioritySelect = "low";
    lowPrioritySelected()
  }
}


/**
 * Highlights the button when urgent is selected
 */
function urgentPrioritySelected() {
  document.getElementById("priorityUrgent").classList.add('prio-urgent-selected');
  document.getElementById("priorityMedium").classList.remove('prio-medium-selected');
  document.getElementById("priorityLow").classList.remove('prio-low-selected');
  document.getElementById('priorityUrgentImg').src = 'assets/img/prio-urgent-white.png';
  document.getElementById('priorityMediumImg').src = 'assets/img/prio-medium.png';
  document.getElementById('priorityLowImg').src = 'assets/img/prio-low.png';
}


/**
 * Highlights the button when medium is selected
 */
function mediumPrioritySelected() {
  document.getElementById("priorityMedium").classList.add('prio-medium-selected');
  document.getElementById("priorityUrgent").classList.remove('prio-urgent-selected');
  document.getElementById("priorityLow").classList.remove('prio-low-selected');
  document.getElementById('priorityUrgentImg').src = 'assets/img/prio-urgent.png';
  document.getElementById('priorityMediumImg').src = 'assets/img/prio-medium-white.png';
  document.getElementById('priorityLowImg').src = 'assets/img/prio-low.png';
}


/**
 * Highlights the button when low is selected
 */
function lowPrioritySelected() {
  document.getElementById("priorityLow").classList.add('prio-low-selected');
  document.getElementById("priorityUrgent").classList.remove('prio-urgent-selected');
  document.getElementById("priorityMedium").classList.remove('prio-medium-selected');
  document.getElementById('priorityUrgentImg').src = 'assets/img/prio-urgent.png';
  document.getElementById('priorityMediumImg').src = 'assets/img/prio-medium.png';
  document.getElementById('priorityLowImg').src = 'assets/img/prio-low-white.png';
}