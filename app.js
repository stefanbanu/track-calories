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
        }
    }

})();


// UI Controller
const UICtrl = (() => {
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
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
        showTotalCalories(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
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


    // Public methods
    return {
        init: () => {
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
