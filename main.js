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
      <button id="submit-book">Submit</button>
      <button id="cancel-book">Cancel</button>
    </div>
  <form>
  `;

  dialogBox.innerHTML = innerDialog;

  dialogBox.showModal();
};

const addBookBtn = document.querySelector(".add-book-btn");
addBookBtn.addEventListener("click", addBookDialog);

const handleDialogBtn = event => {
  const btnEl = event.target;

  switch (btnEl.id) {
    case "submit-book":
      console.log("submit book");
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

// const formField = document.querySelector("#form-fields");
// formField.addEventListener("submit", event => {
//   event.preventDefault();
//   const bookKey = "book-list";

//   const bookTitle = formField["book-title"].value;

//   const book = { title: bookTitle };

//   const books = getData(bookKey);
//   books.push(book);

//   saveData(bookKey, books);
//   formField.reset();
// });
