class Book {
  #key = "book-list";

  data() {
    const data = localStorage.getItem(this.#key);

    if (!data) {
      return [];
    }

    try {
      return JSON.parse(data);
    } catch (error) {
      return console.log("Error parsing data", error);
    }
  }

  save(book) {
    const books = this.data();
    books.push(book);
    books.sort((a, b) => b.id - a.id);
    localStorage.setItem(this.#key, JSON.stringify(books));
  }

  delete(id) {
    const books = this.data();
    const bookIndex = books.findIndex(
      book => parseInt(book.id) === parseInt(id)
    );

    books.splice(bookIndex, 1);
    localStorage.setItem(this.#key, JSON.stringify(books));
  }

  update() {}
}

const book = new Book();
const bookContainer = document.querySelector(".books-container");
const dialogBox = document.querySelector(".dialog-box");

// DISPLAY
const renderBooks = books => {
  if (books.length === 0) {
    return (bookContainer.innerHTML = "<p>No data</p>");
  }

  let innerBooks = "";

  books.forEach(book => {
    innerBooks += `
    
    <div class="book-item" >
    <div class="book-info-container">
      <div class="status-container" >
        <p class="book-status-value ${
          book.status ? "complete" : "not-complete"
        }" >${book.status ? "already read" : "unread"}</p>
      </div>
      <p>Title: ${book.title}</p>
      <p>Author: ${book.author ? book.author : "-"}</p>
      <p>Year: ${book.year ? book.year : "-"}</p>
    </div>
    <div class="book-button-container">
     <button class="edit-book" data-id="${book.id}" >Edit</button>
     <button class="delete-book" data-id="${book.id}" >Delete</button>
    </div>

    </div>    
    `;
  });

  bookContainer.innerHTML = innerBooks;
};

document.addEventListener("DOMContentLoaded", () => {
  renderBooks(book.data());
});

const addBookDialog = () => {
  let innerDialog = `
  <h3>Add Book</h3>
  <form method="dialog" id="form-fields">
    <ul id="form-items" >
      <li>
        <label for="title">Title</label>
        <input type="text" name="title" id="title" />
        <p class="warning-title"></p>
      </li>
      <li>
        <label for="author">Author</label>
        <input type="text" name="author" id="author" />
      </li>
      <li>
        <label for="year">Year</label>
        <input type="number" name="year" id="year" />
      </li>
      <li>
        <label for="status">Sudah dibaca</label>
        <input type="checkbox" name="status" id="status" />
      </li>
    
    </ul>
    <div class="form-btn-container">
      <button id="add-book">Submit</button>
      <button id="cancel-book">Cancel</button>
    </div>
  <form>
  `;

  dialogBox.innerHTML = innerDialog;

  dialogBox.showModal();
};

const addBookBtn = document.querySelector(".add-book-btn");
addBookBtn.addEventListener("click", addBookDialog);

dialogBox.addEventListener("click", event => {
  let btnEl = event.target;

  switch (btnEl.id) {
    case "add-book":
      handelSubmitBook();
      break;
    default:
      return;
  }
});

const handelSubmitBook = () => {
  const bookForm = document.querySelector("#form-fields");

  console.log("handle submit book");

  let bookId = +new Date();
  let bookTitle = bookForm.title.value;
  let bookAuthor = bookForm.author.value;
  let bookYear = bookForm.year.value;
  let bookStatus = bookForm.status.checked;

  const warningTitle = document.querySelector(".warning-title");

  if (!bookTitle) {
    console.log("title cannot empty");
    warningTitle.textContent = "Title cannot empty!";
    return event.preventDefault();
  }

  warningTitle.textContent = "";

  let newBook = {
    id: bookId,
    title: bookTitle,
    author: bookAuthor,
    year: bookYear,
    status: bookStatus
  };

  book.save(newBook);
  renderBooks(book.data());
};

bookContainer.addEventListener("click", event => {
  let btn = event.target;
  let bookId = event.target.dataset.id;
  if (btn.className === "delete-book") {
    handleDeleteBook(bookId);
  } else if (btn.className === "edit-book") {
    handleEditBook(bookId);
  } else {
    console.log("not valid area");
    return;
  }
});

function handleDeleteBook(bookId) {
  book.delete(bookId);
  renderBooks(book.data());
}

function handleEditBook(id) {
  const books = book.data();
  let bookIndex = books.findIndex(book => parseInt(book.id) === parseInt(id));

  let innerDialog = `
  <h3>Add Book</h3>
  <form method="dialog" id="form-fields">
    <ul id="form-items" >
      <li>
        <label for="title">Title</label>
        <input type="text" name="title" id="title" value="${
          books[bookIndex].title
        }" />
        <p class="warning-title"></p>
      </li>
      <li>
        <label for="author">Author</label>
        <input type="text" name="author" id="author" value="${
          books[bookIndex].author
        }" />
      </li>
      <li>
        <label for="year">Year</label>
        <input type="number" name="year" id="year" value="${
          books[bookIndex].year
        }" />
      </li>
      <li>
        <label for="status">Sudah dibaca</label>
        <input type="checkbox" name="status" id="status" ${
          books[bookIndex].status ? "checked" : "unchecked"
        } />
      </li>
    
    </ul>
    <div class="form-btn-container">
      <button id="add-book">Submit</button>
      <button id="cancel-book">Cancel</button>
    </div>
  <form>
  `;

  dialogBox.innerHTML = innerDialog;

  dialogBox.showModal();
}
