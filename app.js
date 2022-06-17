// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert')
const submitBtn = document.querySelector('.submit-btn')
const form = document.querySelector('.grocery-form')
const input = document.getElementById('grocery')
const container = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
const clearBtn = document.querySelector('.clear-btn')
// edit option
let editElement
let editFlag = false
let editID = ""

// ****** EVENT LISTENERS **********
// load items
window.addEventListener('DOMContentLoaded', setupItems)
clearBtn.addEventListener('click', clearAllItems)
form.addEventListener('submit', function (e) {
    e.preventDefault()
    const value = input.value
    const id = new Date().getTime().toString()
    if (value && !editFlag) {
        createListItem(id, value)
        // display alert
        displayAlert('item added to list', 'success')
        // show list
        container.classList.add('show-container')
        // add to local storage
        addToLocalStorage(id, value)
        // set back to defaul
        setBackToDefault()

    } else if (value && editFlag) {
        console.log('editing')
        editElement.innerHTML = value
        displayAlert('value changed', 'success')
        // edit local storage
        editLocalStorage(editID, value)
        setBackToDefault()

    } else {
        console.log('empty value')
        displayAlert('please enter value', 'danger')
    }
})

//display alert
function displayAlert(text, action) {
    alert.textContent = text
    alert.classList.add(`alert-${action}`)

    // remove alert
    setTimeout(function () {
        alert.textContent = ''
        alert.classList.remove(`alert-${action}`)
    }, 1000)
}

// ****** FUNCTIONS **********
// edit function
function editItem(e) {
    console.log('item edited')
    const element = e.currentTarget.parentElement.parentElement
    // set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling
    // set form value
    grocery.value = editElement.innerHTML
    editFlag = true
    editID = element.dataset.id
    submitBtn.textContent = 'edit'
}
// delete function
function deleteItem(e) {
    console.log('item deleted')
    const element = e.currentTarget.parentElement.parentElement
    const id = element.dataset.id
    list.removeChild(element)
    if (list.children.length === 0) {
        container.classList.remove('show-container')
    }
    displayAlert('item removed', 'danger')
    setBackToDefault()
    // remove from local storage
    removeFromLocalStorage(id)
}
function setBackToDefault() {
    console.log('set back to default')
    input.value = ''
    editFlag = false
    editID = ''
    submitBtn.textContent = 'submit'
}

function clearAllItems() {
    container.classList.remove('show-container')
    console.log('clear all items')
    list.innerHTML = ''
    displayAlert('empty list', 'success')
    setBackToDefault()
    localStorage.removeItem('list')
}

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
    console.log('added to local storage')
    const grocery = { id, value }
    let items = getLocalStorage()
    items.push(grocery)
    localStorage.setItem('list', JSON.stringify(items))
}

function removeFromLocalStorage(id) {
    console.log('remove from local storage')
    let items = getLocalStorage()
    items = items.filter(function (item) {
        if (item.id !== id) {
            return item
        }
    })
    localStorage.setItem('list', JSON.stringify(items))
}

function editLocalStorage(id, value) {
    console.log('edit local storage')
    let items = getLocalStorage()
    items = items.map(function (item) {
        if (item.id === id) {
            item.value = value
        }
        return item
    })
    localStorage.setItem('list', JSON.stringify(items))
}

function getLocalStorage() {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : []
}

// ****** SETUP ITEMS **********
function setupItems() {
    let items = getLocalStorage()
    if (items.length > 0) {
        items.forEach(function (item) {
            createListItem(item.id, item.value)
        })
        container.classList.add('show-container')
    }
}

function createListItem(id, value) {
    console.log('add item to list')
    const element = document.createElement('article')
    // add class
    element.classList.add('grocery-item')
    // add id
    const attr = document.createAttribute('data-id')
    attr.value = id
    element.setAttributeNode(attr)
    element.innerHTML = `<p class="title">${value}</p>
        <div class="btn-container">
          <button type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
          </button>
          <button type="button" class="delete-btn">
            <i class="fas fa-trash"></i>
          </button>
        </div>`
    const deleteBtn = element.querySelector('.delete-btn')
    const editBtn = element.querySelector('.edit-btn')
    deleteBtn.addEventListener('click', deleteItem)
    editBtn.addEventListener('click', editItem)
    // append child
    list.appendChild(element)
}