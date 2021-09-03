const UNCOMPLETED_LIST_BOOK_ID = "books";
const COMPLETED_LIST_BOOK_ID = "completed-books";
const BOOK_ITEMID = "itemId";

function detailBuild(detailTitle, innerTitle) {
    const text = document.createElement("span");
    text.innerText = detailTitle;
    const textContainer = document.createElement("div");
    textContainer.innerHTML = "<b> " + innerTitle + " : </b>";
    textContainer.append(text);
    return textContainer;
}

function makeBook(bookTitle /* string */, author /* string */, year /* number */, isCompleted /* boolean */) {

    const textTitle = document.createElement("h1");
    textTitle.innerText = bookTitle;

    const textAuthor = detailBuild(author, "Penulis");
    const textYear = detailBuild(year, "Tahun");

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement("div");
    container.classList.add("item", "shadow")
    container.append(textContainer);

    if (isCompleted) {
        container.append(
            createUndoButton(),
            createTrashButton()
        );
    } else {
        container.append(
            createCheckButton(),
            createTrashButton()
        );
    }

    return container;
}

function createUndoButton() {
    return createButton("undo-button", function (event) {
        undoTaskFromCompleted(event.target.parentElement);
    });
}

function createTrashButton() {
    return createButton("trash-button", function (event) {
        removeTaskFromCompleted(event.target.parentElement);
        alert("Sukses membuang buku dari rak");
    });
}

function createCheckButton() {
    return createButton("check-button", function (event) {
        addTaskToCompleted(event.target.parentElement);
    });
}

function createButton(buttonType /* string */, eventListener /* callback function */) {
    const button = document.createElement("button");
    if (buttonType == "check-button") {
        button.innerText = "Selesai dibaca"
        button.classList.add("button");
    } else if (buttonType == "undo-button") {
        button.innerText = "Belum Selesai dibaca"
        button.classList.add("button");
    } else {
        button.innerText = "Hapus";
        button.classList.add(buttonType);
    }
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}


function addBook() {
    const uncompletedBOOKList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const completedBOOKList = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const textBook = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;
    const isCompleteId = document.getElementById("is-complete").checked;
    const book = makeBook(textBook, author, year, isCompleteId);
    const bookObject = composeBookObject(textBook, author, year, isCompleteId);
    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    if (isCompleteId) {
        completedBOOKList.append(book);
    } else {
        uncompletedBOOKList.append(book);
    }
    updateDataToStorage();
}
function addTaskToCompleted(bookElement /* HTMLELement */) {
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const bookTitle = bookElement.querySelector(".inner h1").innerText;
    const bookAuthor = bookElement.querySelectorAll(".inner span")[0].innerText;
    const bookYear = bookElement.querySelectorAll(".inner span")[1].innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);
    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;

    listCompleted.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function removeTaskFromCompleted(bookElement /* HTMLELement */) {
    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    bookElement.remove();
    updateDataToStorage();
}

function undoTaskFromCompleted(bookElement /* HTMLELement */) {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const bookTitle = bookElement.querySelector(".inner h1").innerText;
    const bookAuthor = bookElement.querySelectorAll(".inner span")[0].innerText;
    const bookYear = bookElement.querySelectorAll(".inner span")[1].innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);

    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;

    listUncompleted.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function searchBook() {
    const book = document.getElementById("title-search");
    const getBook = findBookByTitle(book.value);
    searchBuild(getBook);

}

function searchBuild(bookObject) {
    const searchResultContainer = document.getElementById("search-result");
    if (bookObject != null) {
        const textTitle = document.createElement("h1");
        textTitle.innerText = bookObject.bookTitle;

        const textAuthorContainer = detailBuild(bookObject.author, "Penulis");
        const textYearContainer = detailBuild(bookObject.year, "Tahun");
        const textIsCompletedContainer = detailBuild(bookObject.isCompleted, "Selesai dibaca?");
        const textIDContainer = detailBuild(bookObject.id, "ID Buku");

        const textContainer = document.createElement("div");
        textContainer.classList.add("inner")
        textContainer.append(textTitle, textAuthorContainer, textYearContainer, textIsCompletedContainer, textIDContainer);

        const container = document.createElement("div");
        container.classList.add("item", "shadow")
        container.append(textContainer);
        searchResultContainer.innerHTML = container.innerHTML;
    } else {
        searchResultContainer.innerHTML = "<h1>Buku tersebut tidak ada di rak</h1>";
    }

}

