const addButton = document.querySelector("#add-book")

const dialog = document.querySelector("dialog")
const submitButton = document.querySelector("#submit")
const closeButton = document.querySelector("#cancel")

const form = document.querySelector("form")

const titleEl = document.querySelector("#title")
const authorEl = document.querySelector("#author")
const readEl = document.querySelector("#read")
const pagesEl = document.querySelector("#pages")
const completedPagesEl = document.querySelector("#completed-pages")

const bookGrid = document.querySelector(".books")

let titles = []

function Book(title, author = "Unknown", read, pages, completedPages) {
  this.title = title
  this.author = author
  this.read = read
  this.pages = pages
  this.completedPages = completedPages
}

function clearGrid() {
    const children = Array.prototype.slice.call(bookGrid.children)
    children.forEach(card => {card.remove()})
}

const myLibrary = {
    books: [],
    displayBooks: function() {
        clearGrid()
        this.books.forEach(book => {bookGrid.appendChild(createCard(book))})
    }
}

addButton.addEventListener("click", () => {
    titles = myLibrary.books.map(value => value.title)
    dialog.showModal()
    dialog.classList.add("show")
})

closeButton.addEventListener("click", () => {
    dialog.classList.remove("show")
    dialog.close()
})

titleEl.addEventListener("input", () => {
    if (titles.includes(titleEl.value)) {
        console.log("Already in library")
        titleEl.setCustomValidity("This book is already in your library!")
    } else {
        console.log("Not in library")
        titleEl.setCustomValidity("")
    }
})

readEl.addEventListener('input', () => {
    if (readEl.checked) {
        completedPagesEl.setAttribute("disabled", true)
        completedPagesEl.value = pagesEl.value
    }
    else {
        completedPagesEl.removeAttribute("disabled")
    }
})
// Page validation
const pagesArr = [pagesEl, completedPagesEl]

pagesArr.forEach(element => {element.addEventListener("input", () => {
    const completedPagesValue = +completedPagesEl.value
    const pagesValue = +pagesEl.value

    if (readEl.checked) {
        completedPagesEl.value = pagesEl.value
        pagesEl.setCustomValidity("")
        return
    }

    if (completedPagesValue && (completedPagesValue > pagesValue)) {
        pagesEl.setCustomValidity("Page number must be higher than completed pages number.")
    } else {
        pagesEl.setCustomValidity("")
    }
})})

// Submiting data
submitButton.addEventListener("click", (event) => {
    if (!form.checkValidity()) {return}
    dialog.classList.remove("show")
    event.preventDefault()
    const book = new Book(titleEl.value, authorEl.value, readEl.checked, pagesEl.value, completedPagesEl.value)
    form.querySelectorAll("input").forEach(element => {element.value = null})
    myLibrary.books.push(book)
    myLibrary.displayBooks()
    dialog.close()
})

function createCard(book) {
    const card = document.createElement("div")
    card.classList.add("card")
    card.dataset.info = book.title
    const readButton = document.createElement("button")
    const editButton = document.createElement("button")
    const deleteButton = document.createElement("button")

    readButton.classList.add("toggle-read", book.read ? "button-read" : "button-not-read")
    readButton.innerHTML = book.read ? "Read" : "Not Read"
    readButton.onclick = toggleRead

    editButton.classList.add("edit")
    editButton.textContent = "Edit"
    editButton.onclick = editBook

    deleteButton.classList.add("Delete")
    deleteButton.textContent = "Delete"
    deleteButton.onclick = deleteBook


    card.innerHTML = `
        <h4> "${book.title}" </h4>
        <div class="row2">
            ${book.author ? `<p>Author: <i>${book.author}</italic></i>` : ""}
            ${book.pages ? (book.completedPages ? `<p>Completed Pages: ${book.completedPages}/${book.pages}</p>` : `<p>Pages: ${book.pages}</p>`) : ""}
        <div>
    ` 

    const row3 = document.createElement("div")
    row3.classList.add("row3")

    row3.appendChild(readButton)
    row3.appendChild(editButton)
    row3.appendChild(deleteButton)

    card.appendChild(row3)

    return card
}

function toggleRead(event) {
    const button = event.target
    if (button.textContent === "Read") {
        button.textContent = "Not read"
        
    }
    else {
        button.textContent = "Read"
    }
}

function editBook() {
    alert("Sorry, haven't implemented yet :p")
}

function deleteBook(event) {
    let title = event.target.parentElement.parentElement.getAttribute("data-info")
    myLibrary.books = myLibrary.books.filter(book => book.title !== title)
    console.log(myLibrary.books)
    myLibrary.displayBooks()
}