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

class Book {
    constructor(title, author = "Unknown", read, pages, completedPages) {
        this.title = title
        this.author = author
        this.read = read
        this.pages = pages
        this.completedPages = completedPages
    }

    toggleRead() {
        this.read = !this.read
        this.completedPages = this.read ? (this.pages ? +this.pages : null) : 0
    }
}

class LibraryClass {
    constructor(starterBooks = [], bookGrid) {
        this.books = starterBooks
        this.grid = bookGrid
        this.displayBooks(this.grid)
    }

    displayBooks() {
        clearGrid()
        this.books.forEach(book => {this.grid.appendChild(createCard(book))})
    }

    addBook(book) {
        this.books.push(book)
    }

    removeBook(title) {
        this.books = this.books.filter(book => book.title !== title)
    }

    findBook(title) {
        return this.books.find(book => book.title === title)
    }

    getTitles() {
        return this.books.map(book => book.title)
    }
}

const SampleBook = new Book("Sample Book", "Sample Author", true, 100, 100)

const Library = new LibraryClass([SampleBook], bookGrid)

addButton.addEventListener("click", () => {
    dialog.showModal()
    dialog.classList.add("show")
})

closeButton.addEventListener("click", () => {
    dialog.classList.remove("show")
    dialog.close()
})

titleEl.addEventListener("input", () => {
    if (Library.findBook(titleEl.value)) {
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
    Library.addBook(book)
    Library.displayBooks()
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
            ${book.pages ? (book.completedPages ? `<p id="pages-text">Completed Pages: ${book.completedPages}/${book.pages}</p>` : `<p id="pages-text">Pages: ${book.pages}</p>`) : ""}
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
    const pagesText = cardFromButton(button).querySelector("#pages-text")
    const book = bookFromButton(button)
    book.toggleRead()

    if (button.textContent === "Read") {
        button.textContent = "Not read"
        if (pagesText) {
            pagesText.textContent = `Completed Pages: 0/${book.pages}`
        }
    }
    else {
        button.textContent = "Read"
        if (pagesText) {
            pagesText.textContent = `Completed Pages: ${book.pages}/${book.pages}`
        }
    }
}

function editBook(event) {
    alert("Sorry, haven't implemented yet :p")
}

function deleteBook(event) {
    Library.removeBook(titleFromButton(event.target))
    Library.displayBooks()
}

function titleFromButton(btn) {
    return btn.parentElement.parentElement.getAttribute("data-info")
}

function bookFromButton(btn) {
    return Library.findBook(titleFromButton(btn))
}

function cardFromButton(btn) {
    return btn.parentElement.parentElement
}

function clearGrid() {
    const children = Array.prototype.slice.call(bookGrid.children)
    children.forEach(card => {card.remove()})
}