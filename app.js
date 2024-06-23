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

  update(id, title, author, year, status) {
    const books = this.data();
    const bookIndex = books.findIndex(
      book => parseInt(book.id) === parseInt(id)
    );

    books[bookIndex].title = title;
    books[bookIndex].author = author;
    books[bookIndex].year = year;
    books[bookIndex].status = status;
    localStorage.setItem(this.#key, JSON.stringify(books));
  }
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
        <p class="warning-year"></p>
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

  if (btnEl.id === "add-book") {
    handelSubmitBook();
  } else if (btnEl.id === "update-book") {
    handleUpdateBook(btnEl.dataset.id);
  } else if (btnEl.id === "cancel-book") {
    return dialogBox.close();
  } else {
    return;
  }
});

const handelSubmitBook = () => {
  const bookForm = document.querySelector("#form-fields");

  let bookId = +new Date();
  let bookTitle = bookForm.title.value;
  let bookAuthor = bookForm.author.value;
  let bookYear = bookForm.year.value;
  let bookStatus = bookForm.status.checked;

  const warningTitle = document.querySelector(".warning-title");

  if (!bookTitle) {
    warningTitle.textContent = "Title cannot empty!";
    return event.preventDefault();
  }

  const warningYear = document.querySelector(".warning-year");

  if (!/^\d+$/.test(bookYear)) {
    warningYear.textContent = "Year must be numbers!";
    return event.preventDefault();
  }

  warningYear.textContent = "";

  warningTitle.textContent = "";

  let newBook = {
    id: bookId,
    title: bookTitle,
    author: bookAuthor,
    year: bookYear,
    isComplete: bookStatus
  };

  book.save(newBook);
  renderBooks(book.data());
};

function handleUpdateBook(id) {
  const bookForm = document.querySelector("#form-fields");
  let bookTitle = bookForm["title"].value;
  let bookAuthor = bookForm["author"].value;
  let bookYear = bookForm["year"].value;
  let bookStatus = bookForm["status"].checked;

  book.update(id, bookTitle, bookAuthor, bookYear, bookStatus);
  renderBooks(book.data());
}

bookContainer.addEventListener("click", event => {
  let btn = event.target;
  let bookId = event.target.dataset.id;
  if (btn.className === "delete-book") {
    handleDeleteBook(bookId);
  } else if (btn.className === "edit-book") {
    handleEditBook(bookId);
  } else {
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
      <button id="update-book" data-id="${id}" >Update</button>
      <button id="cancel-book">Cancel</button>
    </div>
  <form>
  `;

  dialogBox.innerHTML = innerDialog;

  dialogBox.showModal();
}

const filterButton = document.querySelector("#filter-read-books");
filterButton.addEventListener("change", event => {
  const dropDownValue = event.target.value;

  if (dropDownValue === "all-books") {
    renderBooks(book.data());
  } else if (dropDownValue === "read-books") {
    renderByStatus(true);
  } else {
    renderByStatus(false);
  }
});

function renderByStatus(status) {
  const books = book.data();
  const filterBooks = books.filter(book => book.isComplete === status);

  let innerBooks = "";

  filterBooks.forEach(book => {
    innerBooks += `
    
    <div class="book-item" >
    <div class="book-info-container">
      <div class="status-container" >
        <p class="book-status-value ${
          book.isComplete ? "complete" : "not-complete"
        }" >${book.status ? "already read" : "unread"}</p>
      </div>
      <p>Title: ${book.isComplete}</p>
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
}

function resetFilter() {
  filterButton.value = "all-books";
}

const searchBook = document.querySelector("#search-book");
searchBook.addEventListener("input", event => {
  let valueEl = event.target.value.toLowerCase();

  const books = book.data();

  const filterBooks = books.filter(book =>
    book.title.toLowerCase().includes(valueEl)
  );

  if (!filterBooks.length) {
    return (bookContainer.innerHTML = `<p>There is no book.</p>`);
  }

  let innerBooks = "";

  filterBooks.forEach(book => {
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
  resetFilter();
});

document.addEventListener("DOMContentLoaded", () => {
  renderBooks(book.data());
  resetFilter();
  searchBook.value = "";
});
