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
      <p>Judul: ${book.title}</p>
      <p>Pengarang: ${book.author ? book.author : "-"}</p>
      <p>Tahun: ${book.year ? book.year : "-"}</p>
      <p>Sudah dibaca: ${book.status ? "sudah" : "belum"} </p>
      <div class="book-item-btn-container">
        <button class="edit-book">Edit</button>
        <button class="delete-book">Delete</button>
      </div>

    </div>
    `;

    container.innerHTML = innerBooks;
  });
};

document.addEventListener("DOMContentLoaded", () => {
  renderBooks("all", keyBook());
});
