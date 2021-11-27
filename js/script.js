// select everything
// select the todo-form
const todoForm = document.querySelector('.todo-form');
// select the input box
const todoInput = document.querySelector('.todo-input');
// select the <ul> with class="todo-items"
const todoItemsList = document.querySelector('.todo-items');

const pointHolder = document.getElementById('pointholder');
const medalOne = document.getElementById('medalone');
const medalOneText = document.getElementById('medalonetext');
const medalTwo = document.getElementById('medaltwo');
const medalTwoText = document.getElementById('medaltwotext');
const medalThree = document.getElementById('medalthree');
const medalThreeText = document.getElementById('medalthreetext');
const pointYesterday = document.getElementById('pointyesterday');

const achievementContainer = document.getElementById('achievement-container');
const achievementText = document.getElementById('achievement-text');

let hiddenAchievementValue = 0;

let dayNumber = 1;

let value = 0;

// array which stores every todos
let todos = [];

// Ser till att pointholder renderar value
pointHolder.innerHTML = value;

// add an eventListener on form, and listen for submit event
todoForm.addEventListener('submit', function(event) {
  // prevent the page from reloading when submitting the form
  event.preventDefault();
  addTodo(todoInput.value); // call addTodo function with input box current value
});

// function to add todo
function addTodo(item) {
  // if item is not empty
  if (item !== '') {
    // make a todo object, which has id, name, and completed properties
    const todo = {
      id: Date.now(),
      name: item,
      completed: false
    };

    // then add it to todos array
    todos.push(todo);
    addToLocalStorage(todos); // then store it in localStorage

    // finally clear the input box value
    todoInput.value = '';
  }
}

// function to render given todos to screen
function renderTodos(todos) {
  // clear everything inside <ul> with class=todo-items
  todoItemsList.innerHTML = '';

  // run through each item inside todos
  todos.forEach(function(item) {
    // check if the item is completed
    const checked = item.completed ? 'checked': null;

    // make a <li> element and fill it
    // <li> </li>
    const li = document.createElement('li');
    // <li class="item"> </li>
    li.setAttribute('class', 'item');
    // <li class="item" data-key="20200708"> </li>
    li.setAttribute('data-key', item.id);
    /* <li class="item" data-key="20200708"> 
          <input type="checkbox" class="checkbox">
          Go to Gym
          <button class="delete-button">X</button>
        </li> */
    // if item is completed, then add a class to <li> called 'checked', which will add line-through style
    if (item.completed === true) {
      li.classList.add('checked');
    }

    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${checked}>
      ${item.name}
      <button class="delete-button">x</button>
    `;
    // finally add the <li> to the <ul>
    todoItemsList.append(li);

  });
}

// function to add todos to local storage
function addToLocalStorage(todos) {
  // conver the array to string then store it.
  localStorage.setItem('todos', JSON.stringify(todos));
  // render them to screen
  renderTodos(todos);
}

// function helps to get everything from local storage
function getFromLocalStorage() {
  const reference = localStorage.getItem('todos');
  // if reference exists
  if (reference) {
    // converts back to array and store it in todos array
    todos = JSON.parse(reference);
    renderTodos(todos);
  }
}

// toggle the value to completed and not completed
function toggle(id) {
  todos.forEach(function(item) {
    // use == not ===, because here types are different. One is number and other is string
    if (item.id == id) {
      // toggle the value
      item.completed = !item.completed;

      //Ökar value med 1 för varje utförd task, sänker med 1 när man checkar ur
      if(item.completed == true) {
        value++;
        console.log(value);
      } else if (item.completed == false) {
        value--;
        console.log(value);
      }

      /* MEDALJER */

      //Om en uppgift tickats i, visa upp siffran + 00 i pointholder
      if(value > 0) {
        achievementFunction();
        pointHolder.innerHTML = value + "00";
        //Om poängen är mer än 3, visa upp medaljen i medalholder
        if(value==2) {
          medalOne.className = "filledin";
          medalOneText.className = "filledtext";
        } else if (value==4) {
            medalTwo.className = "filledin";
            medalTwoText.className = "filledtext";
          } else if (value==6) {
            medalThree.className = "filledin";
            medalThreeText.className = "filledtext";
        }
      } 
      /* MEDALJER SLUT*/
    }
    
  });

  addToLocalStorage(todos);
}

// deletes a todo from todos array, then updates localstorage and renders updated list to screen
function deleteTodo(id) {
  // filters out the <li> with the id and updates the todos array
  todos = todos.filter(function(item) {
    // use != not !==, because here types are different. One is number and other is string
    return item.id != id;
  });

  // update the localStorage
  addToLocalStorage(todos);
}

// initially get everything from localStorage
getFromLocalStorage();

// after that addEventListener <ul> with class=todoItems. Because we need to listen for click event in all delete-button and checkbox
todoItemsList.addEventListener('click', function(event) {
  // check if the event is on checkbox
  if (event.target.type === 'checkbox') {
    // toggle the state
    toggle(event.target.parentElement.getAttribute('data-key'));
  }

  // check if that is a delete-button
  if (event.target.classList.contains('delete-button')) {
    // get id from data-key attribute's value of parent <li> where the delete-button is present
    deleteTodo(event.target.parentElement.getAttribute('data-key'));
  }
});

//Achievementfunktionen
function achievementFunction(){
  //Omvandlar från string till int och har si
  let havString = window.localStorage.getItem('achievement', hiddenAchievementValue);
  hiddenAchievementValue = Number(havString);

  let dayTemp = window.localStorage.getItem('day', dayNumber);
  dayNumber = Number(dayTemp);

  //Om användaren inte gjort detta innan:
  if(hiddenAchievementValue < 1) {
    achievementAnimation();
    hiddenAchievementValue = 2;
    dayNumber = 1; //Sätter dagnumret till 1
    achievementText.innerHTML = "Utfört din första uppgift i att.göra!"
  } else if (hiddenAchievementValue == 2 && value == 2) {
    achievementAnimation();
    hiddenAchievementValue = 3;
    achievementText.innerHTML = "Fått din första medalj i att.göra!";
  } else if (hiddenAchievementValue == 3 && value == 4) {
    achievementAnimation();
    hiddenAchievementValue = 4;
    achievementText.innerHTML = "Fått två medaljer i att.göra!"
  } else if (hiddenAchievementValue == 4 && value == 6) {
    achievementAnimation();
    hiddenAchievementValue = 5;
    achievementText.innerHTML = "Fått tre medaljer i att.göra!"
  } else if (hiddenAchievementValue == 5 && value == 10) {
    achievementAnimation();
    hiddenAchievementValue = 6;
    achievementText.innerHTML = "Tjänat 1000 poäng!"
  } else if (hiddenAchievementValue == 6 && value == 12) {
    achievementAnimation();
    hiddenAchievementValue = 7;
    achievementText.innerHTML = "Tjänat 1200 poäng!"
  } else if (hiddenAchievementValue == 7 && value == 15) {
    achievementAnimation();
    hiddenAchievementValue = 8;
    achievementText.innerHTML = "Tjänat 1500 poäng!"
  } else if (dayNumber == 1 && value == 1) { //Räknar dagarna så man får sina dagliga achievements
    achievementAnimation();
    dayNumber = 2;
    achievementText.innerHTML = "Använt att.göra i två dagar!"
  } else if (dayNumber == 2 && value == 1) {
    achievementAnimation();
    dayNumber = 3;
    achievementText.innerHTML = "Använt att.göra i tre dagar!"
  } else if (dayNumber == 3 && value == 1) {
    achievementAnimation();
    dayNumber = 4;
    achievementText.innerHTML = "Använt att.göra i fyra dagar!"
  } else if (dayNumber == 4 && value == 1) {
    achievementAnimation();
    dayNumber = 5;
    achievementText.innerHTML = "Använt att.göra i fem dagar!"
  } else if (dayNumber == 5 && value == 1) {
    achievementAnimation();
    dayNumber = 6;
    achievementText.innerHTML = "Använt att.göra i sex dagar!"
  } else if (dayNumber == 6 && value == 1) {
    achievementAnimation();
    dayNumber = 7;
    achievementText.innerHTML = "Använt att.göra i sju dagar!"
  }

  //Sets HVA till localstorage
  window.localStorage.setItem('achievement', hiddenAchievementValue);

  //Sets day till localstorage
  window.localStorage.setItem('day', dayNumber);

}

function achievementAnimation(){
  achievementContainer.style.animation = 'achievement-in 1s ease';
  achievementContainer.style.animationFillMode = 'forwards';
  setTimeout(animationOut, 5000);

  function animationOut(){
    achievementContainer.style.animation = 'achievement-out 0.8s ease';
  }
}