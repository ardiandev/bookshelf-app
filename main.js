const getData = key => {
  const data = localStorage.getItem(key);

  if (!data) {
    console.log("No data");
    return [];
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    return console.log("Error parsing process", error);
  }
};

const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

class Book {
  #key = "book-list";

  data() {
    const books = localStorage.getItem(this.#key);

    if (!books) {
      return [];
    }

    try {
      return JSON.parse(books);
    } catch (error) {
      return console.log("Error parsing data", error);
    }
  }
}

class Display {
  #bookContainer = document.querySelector(".books-container");

  renderBooks(books) {
    if (books.length === 0) {
      return (this.#bookContainer.innerHTML = `<p>There is no book!</p>`);
    }

    let innerBooks = "";

    console.log("render", books);

    books.forEach(book => {
      innerBooks += `
    <div class="book-item" >
      <div class="book-main-info" >
        <div class="status-container ${book.status ? "read" : "unread"} " >
          <p>${book.status ? "Sudah dibaca" : "Belum dibaca"}</p>
        </div>
        <p class="book-title" >${book.title}</p>
        <p>Penulis: ${book.author ? book.author : "-"}</p>
        <p>Diterbitkan: ${book.year ? book.year : "-"}</p>
      </div>
      <div class="book-item-btn-container">
        <button class="edit-book" data-book="${book.id}" >Edit</button>
        <button class="delete-book" data-book="${book.id}" >Delete</button>
      </div>

    </div>
    `;

      this.#bookContainer.innerHTML = innerBooks;
    });
  }
}

const book = new Book();
const display = new Display();

const keyBook = () => "book-list";

const addBookDialog = () => {
  console.log("hello");
  const dialogBox = document.querySelector(".dialog-box");
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

const createBooks = (id, title, author, year, status) => {
  return { id, title, author, year, status };
};

const sortAndSaveBook = (key, data) => {
  data.sort((a, b) => b.id - a.id);
  saveData(key, data);
};

const handleAddBook = (key, event) => {
  const bookForm = document.querySelector("#form-fields");

  let bookId = +new Date();
  let bookTitle = bookForm.title.value;
  let bookAuthor = bookForm.author.value;
  let bookYear = bookForm.year.value;
  let bookStatus = bookForm.status.checked;

  let newBook = createBooks(
    bookId,
    bookTitle,
    bookAuthor,
    bookYear,
    bookStatus
  );

  const warningTitle = document.querySelector(".warning-title");

  if (!bookTitle) {
    console.log("title cannot empty");
    warningTitle.textContent = "Title cannot empty!";
    return event.preventDefault();
  }

  warningTitle.textContent = "";

  const books = getData(key);
  books.push(newBook);
  sortAndSaveBook(key, books);
  renderBooks("all", key);
};

const handleDialogBtn = event => {
  const btnEl = event.target;
  const bookKey = "book-list";

  switch (btnEl.id) {
    case "add-book":
      console.log("submit book");
      handleAddBook(bookKey, event);
      break;
    case "edit-book":
      console.log("edit-book");
      break;
    case "cancel-book":
      console.log("cancel dialog btn");
      break;
    default:
      return;
  }
};

const dialogBox = document.querySelector(".dialog-box");
dialogBox.addEventListener("click", handleDialogBtn);

const renderBooks = (status, key) => {
  const bookContainer = document.querySelector(".books-container");

  if (status === "all") {
    renderAllBooks(key, bookContainer);
  }
};

const renderAllBooks = (key, container) => {
  const books = getData(key);

  if (books.length === 0) {
    return (container.innerHTML = `<p>There is no book!</p>`);
  }

  let innerBooks = "";

  books.forEach(book => {
    innerBooks += `
    <div class="book-item" >
      <div class="book-main-info" >
        <div class="status-container ${book.status ? "read" : "unread"} " >
          <p>${book.status ? "Sudah dibaca" : "Belum dibaca"}</p>
        </div>
        <p class="book-title" >${book.title}</p>
        <p>Penulis: ${book.author ? book.author : "-"}</p>
        <p>Diterbitkan: ${book.year ? book.year : "-"}</p>
      </div>
      <div class="book-item-btn-container">
        <button class="edit-book" data-book="${book.id}" >Edit</button>
        <button class="delete-book" data-book="${book.id}" >Delete</button>
      </div>

    </div>
    `;

    container.innerHTML = innerBooks;
  });
};

const bookContainer = document.querySelector(".books-container");
bookContainer.addEventListener("click", event => {
  let btnEl = event.target;

  if (btnEl.className === "edit-book") {
    console.log("edit book");
  } else if (btnEl.className === "delete-book") {
    console.log("delete book");
    handleDeleteBook(btnEl);
  } else {
    return;
  }
});

const handleDeleteBook = btn => {
  let bookId = +btn.dataset.book;

  let books = book.data();

  let bookIndex = books.findIndex(book => book.id === bookId);

  books.splice(bookIndex, 1);

  display.renderBooks(book.data());
};

document.addEventListener("DOMContentLoaded", () => {
  renderBooks("all", keyBook());
});
