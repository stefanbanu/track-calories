// Storage Controller

// Item Controller (IIFE: immediately invoked function expression)
const ItemCtrl = (() => {
    // Item Constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    };

    // Data Structure / State
    const data = {
        items: [
            // {id: 0, name: 'Steak Dinner', calories: 1200},
            // {id: 1, name: 'Cookie', calories: 400},
            // {id: 2, name: 'Eggs', calories: 300}
        ],
        currentItem: null,
        totalCalories: 0
    };

    // Public methods
    return {
        getItems: () => {
            return data.items;
        },
        logData: data,
        addItem(name, calories) {
            let id;
            // create id
            if (data.items.length > 0) {
                id = data.items[data.items.length - 1].id + 1;
            } else {
                id = 0;
            }
            // Calories to number
            calories = parseInt(calories);

            // Create new Item
            const newItem = new Item(id, name, calories);
            data.items.push(newItem);

            return newItem;

        },
        getTotalCalories() {
            let total = 0;
            data.items.forEach(item => {
                total += item.calories;
            });
            data.totalCalories = total;
            return data.totalCalories;
        },
        getItemById(id) {
            let found = null;
            data.items.forEach(item => {
                if (item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        setCurrentItem(itemToEdit) {
            data.currentItem = itemToEdit;
        },
        getCurrentItem() {
            return data.currentItem;
        },
        updateItem(name, calories) {
            calories = parseInt(calories);

            let found = null;
            data.items.forEach(item => {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        }
    }

})();


// UI Controller
const UICtrl = (() => {
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        listItems: '#item-list li'
    }

    // Public methods
    return {
        populateItemList(items) {
            let html = '';
            items.forEach((item) => {
                html += `<li class="collection-item" id="item-${item.id}">
                             <strong>${item.name}: </strong> <em>${item.calories}</em>
                             <a href="#" class="secondary-content">
                                 <i class="edit-item fa fa-pencil"></i>
                             </a>
                         </li>`;
            });

            // insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;

        },
        getSelectors() {
            return UISelectors;
        },
        getItemInput() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        hideList() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        addListItem(newItem) {
            // show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${newItem.id}`;
            li.innerHTML = `<strong>${newItem.name}: </strong> <em>${newItem.calories}</em>
                                 <a href="#" class="secondary-content">
                                     <i class="edit-item fa fa-pencil"></i>
                                 </a>`;
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        clearInput() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        showTotalCalories(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState() {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        updateListItem(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // turn Node list into array
            listItems = Array.from(listItems);
            listItems.forEach(listItem => {
                const itemId = listItem.getAttribute('id');
                if (itemId === `item-${item.id}`) {
                    document.querySelector(`#${itemId}`).innerHTML =
                        `<strong>${item.name}: </strong> <em>${item.calories}</em>
                             <a href="#" class="secondary-content">
                                 <i class="edit-item fa fa-pencil"></i>
                             </a>`
                }
            });
        }
    }
})();


// App Controller
const App = ((ItemCtrl, UICtrl) => {

    // Load event listeners
    const loadEventListeneres = function () {
        const uiSelectors = UICtrl.getSelectors();

        // Add Item event
        document.querySelector(uiSelectors.addBtn).addEventListener('click', itemAddSubmit);

        // disable submit on enter key pressed
        document.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });

        // edit icon click event
        document.querySelector(uiSelectors.itemList).addEventListener('click', itemEditClick);
        // update item event
        document.querySelector(uiSelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
    };

    // Add item submit
    const itemAddSubmit = function (e) {
        // Get form input from UI controller
        const input = UICtrl.getItemInput();
        if (input.name !== '' && input.calories !== '') {
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            // Add item to UI list
            UICtrl.addListItem(newItem);

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // clear fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    };

    // edit item
    const itemEditClick = function (e) {
        if (e.target.classList.contains('edit-item')) {
            // get list item id
            const listId = e.target.parentNode.parentNode.id;

            // break into an array
            const listIdArray = listId.split('-');
            // get the id
            const id = parseInt(listIdArray[1]);
            // get item
            const itemToEdit = ItemCtrl.getItemById(id);
            // set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // add item to form
            UICtrl.addItemToForm();

        }

        e.preventDefault();
    };

    // update item submit
    const itemUpdateSubmit = function (e) {
        // get item input
        const input = UICtrl.getItemInput();
        // update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
        // update the UI
        UICtrl.updateListItem(updatedItem);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState();
        e.preventDefault();
    };

    // Public methods
    return {
        init: () => {
            // set initial state
            UICtrl.clearEditState();

            const items = ItemCtrl.getItems();

            // check if any items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                // populate list with items
                UICtrl.populateItemList(items);
            }

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Load event listeners
            loadEventListeneres();
        }
    }
})(ItemCtrl, UICtrl);

// Initialize App
App.init();
