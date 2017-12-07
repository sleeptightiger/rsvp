//update localStorage on edit
//save edit on enter

document.addEventListener('DOMContentLoaded', () => {
  function supportsLocalStorage() {
      try {
        return 'localStorage' in window && window['localStorage'] !== null;
      } catch(e) {
        return false;
      }
  }

  function getRecentInvitees() {
      //retrieve item from localStorage from previous use
      //must parse searches, which is stringified json, to return an array of searches
      //must test searches for previous input
      var invitees = localStorage.getItem('getRecentInvitees');
      if(invitees) {
        return JSON.parse(invitees);
      } else {
        return [];
      }
  }

  function saveInviteesString(str) {
      //saves search string
      //validates input
      //any string with length greater than 0
      var invitees = getRecentInvitees();

      if(!str || invitees.indexOf(str) > -1) {

        return false;
      }

      invitees.push(str);

      //turn string search into json
      //and set it in localStorage
      localStorage.setItem('getRecentInvitees', JSON.stringify(invitees));
      console.log(localStorage.getRecentInvitees);
      return true;
  }

  //remove list from localStorage
  function removeInvitees() {
      localStorage.removeItem('getRecentInvitees');
  }

  function clearList(listElement) {
      listElement.innerHTML = '';
    }

  if(supportsLocalStorage()) {

    const form = document.querySelector('#registrar');
    const input = form.querySelector('input');

    const mainDiv = document.querySelector('.main');
    const clearButton = document.querySelector('#clear');
    const ul = document.querySelector('#invitedList');


    const div = document.createElement('div');
    const filterLabel = document.createElement('label');
    const filterCheckBox = document.createElement('input');

    filterLabel.textContent = "Hide those who haben't responded";
    filterCheckBox.type = 'checkbox';
    div.appendChild(filterLabel);
    div.appendChild(filterCheckBox);
    mainDiv.insertBefore(div, ul);

    // Initialize display list
    var recentInvitees = getRecentInvitees();
    recentInvitees.forEach(function(inviteeString) {
        const li = createLi(inviteeString);
        ul.appendChild(li);
    });

    filterCheckBox.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      const lis = ul.children;
      if(isChecked) {
        for(let i = 0; i < lis.length; i += 1) {
          let li = lis[i];
          if(li.className === 'responded') {
            li.style.display = '';
            const label = li.querySelector('label');
            label.style.display = 'none';
          } else {
            li.style.display = 'none';
          }
        }
      } else {
        for(let i = 0; i < lis.length; i += 1) {
          let li = lis[i];
          li.style.display = '';
          const label = li.querySelector('label');
          label.style.display = '';
        }
      }
    });

    function createLi(text) {
      function createElement(elementName, property, value) {
        const element = document.createElement(elementName);
        element[property] = value;
        return element;
      }

      function appendToLi(elementName, property, value) {
        const element = createElement(elementName, property, value);

        li.appendChild(element);
        return element;
      }

      const li = document.createElement('li');
      appendToLi('span', 'textContent', text);
      appendToLi('label', 'textContent', 'Confirmed')
        .appendChild(createElement('input', 'type', 'checkbox'));
      appendToLi('button', 'textContent', 'edit');
      appendToLi('button', 'textContent', 'remove');
      return li;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if(saveInviteesString(input.value)) {
        const text = input.value;
        input.value = '';
        const li = createLi(text);
        //add to localStorage
        ul.appendChild(li);
      }

    });

    clearButton.addEventListener('click', (e) => {
      e.preventDefault();
      removeInvitees();
      clearList(ul);

    });



    ul.addEventListener('change', (e) => {
      const checkbox = event.target;
      const checked = checkbox.checked;
      const listItem = checkbox.parentNode.parentNode;

      if(checked) {
        listItem.className = 'responded';
      } else {
        listItem.className = '';
      }
    });

    ul.addEventListener('click', (e) => {
      if(e.target.tagName === 'BUTTON') {
        const button = e.target;
        const li = button.parentNode;
        const ul = li.parentNode;
        const action = button.textContent;
        const nameActions = {
          remove: () => {
            ul.removeChild(li);
          },
          edit: () => {
            const span = li.firstElementChild;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent;
            li.insertBefore(input, span);
            li.removeChild(span);
            button.textContent = 'save';
          },
          save: () => {
            const span = document.createElement('span');
            const input = li.firstElementChild;
            span.textContent = input.value;
            li.insertBefore(span, input);
            li.removeChild(input);
            button.textContent = 'edit';
          }
        };

        // select and run action in button's name
        nameActions[action]();
      }
    });
  }
});
