// select elements from HTML Document
const searchBooks = document.getElementById("searchBooks");
const gridViewBtn = document.getElementById("gridViewBtn");
const listViewBtn = document.getElementById("listViewBtn");
const sortByTitle = document.getElementById("sortByTitle");
const sortByDate = document.getElementById("sortByDate");
const viewType = document.getElementById("viewType");
const bookContainer = document.getElementById("container");
const loading = document.getElementById("loading");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
const pagesContainer = document.getElementById("pages");

// Api URL
const bookApiUrl = "https://api.freeapi.app/api/v1/public/books";

// Page No for fetch Books from Api
let page = 1;

// Array to store all Books data need in filtering the Books based on search
let allBooks = [];

// fetch Books from api url
const fetchBooks = async () => {
  // disabled all buttons to avoid interruptions
  searchBooks.disabled = true;
  // add loading element to Book container
  loading.style.display = "block";
  try {
    const bookResponse = await fetch(`${bookApiUrl}?page=${page}`);
    const bookData = await bookResponse.json();
    // call function for display the Books
    allBooks = bookData.data.data;
    // console.log(bookData);
    displayBooks(bookData);
  } catch (error) {
    // error message in case of not getting and data
    bookContainer.innerHTML = `<p>Error getting Books: ${error}\nPlease Try Again...</p>`;
  } finally {
    // enable all buttons
    searchBooks.disabled = false;

    //hide loading message
    loading.style.display = "none";
  }
};

// function to create a Book card element
function createBookCard(book) {
  return `
                <div class="book-card">
                    <div class="thumbnail">
                        <a href="${book.volumeInfo.infoLink}" target="_blank">
                            <img src="${book.volumeInfo.imageLinks.thumbnail}" alt="${book.volumeInfo.title}" />
                        </a>
                    </div>
                    <div class="book-details">
                        <h3 class="book-title">${book.volumeInfo.title}</h3>
                        <p class="other-details"><strong>Author:</strong> ${book.volumeInfo.authors}</p>
                        <p class="other-details"><strong>Publisher:</strong> ${book.volumeInfo.publisher}</p>
                        <p class="other-details"><strong>Published on:</strong> ${book.volumeInfo.publishedDate}</p>
                    </div>
                </div>
                `;
}

// function for display message
function displayBooks(bookData) {
  // allBooks = bookData;
  bookContainer.innerHTML = ``;
  //loop for show all Books
  bookData.data.data.map((book) => {
    const bookElement = createBookCard(book);
    bookContainer.innerHTML += bookElement;
  });
  pageNumbers(bookData.data.totalPages);
  return;
}

// event listener for fetch books after loading window
window.addEventListener("load", fetchBooks);

function pageNumbers(totalPages) {
  let page = ``;
  for (let i = 1; i <= totalPages; i++) {
    page += `<span onclick="pageCall(${i})">${i}</span> `;
  }
  pagesContainer.innerHTML = page;
}

function pageCall(pageNumber) {
  page = pageNumber;
  fetchBooks();
}

sortByTitle.addEventListener("click", () => {
  sortBooks("title");
  sortByTitle.classList.remove("inactive");
  sortByDate.classList.add("inactive");
});

sortByDate.addEventListener("click", () => {
  sortBooks("date");
  sortByDate.classList.remove("inactive");
  sortByTitle.classList.add("inactive");
});

function sortBooks(sortBy) {
  bookContainer.innerHTML = ``;
  if (sortBy === "title") {
    allBooks.sort((a, b) => {
      return a.volumeInfo.title.localeCompare(b.volumeInfo.title);
    });
  } else if (sortBy === "date") {
    allBooks.sort((a, b) => {
      const dateA = new Date(a.volumeInfo.publishedDate);
      const dateB = new Date(b.volumeInfo.publishedDate);
      return dateB - dateA;
    });
  }
  allBooks.forEach((book) => {
    const bookElement = createBookCard(book);
    // adding all Books to Book container
    bookContainer.innerHTML += bookElement;
  });
  return;
}

gridViewBtn.addEventListener("click", () => {
  switchView("grid", "list");
  gridViewBtn.classList.remove("inactive");
  listViewBtn.classList.add("inactive");
});

listViewBtn.addEventListener("click", () => {
  switchView("list", "grid");
  listViewBtn.classList.remove("inactive");
  gridViewBtn.classList.add("inactive");
});

function switchView(add, remove) {
  viewType.classList.remove(`${remove}-view`);
  viewType.classList.add(`${add}-view`);
}

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// function to show filtered Books based on search input
function filterBooks(searchQuery) {
  searchQuery = searchQuery.toLowerCase().trim();

  // if no search input show all Books
  if (!searchQuery) {
    console.log(`SearchQuery ${searchQuery} All Books ${allBooks}`);
    // clearing Book container
    bookContainer.innerHTML = "";
    allBooks.forEach((book) => {
      const bookElement = createBookCard(book);
      // adding all Books to Book container
      bookContainer.innerHTML += bookElement;
    });
    return;
  }

  // function to filter Books based on search input
  const filteredBooks = allBooks.filter((book) => {
    const title = book.volumeInfo.title?.toLowerCase() || "";
    const authors = book.volumeInfo.authors || [];

    // Check if search query matches title
    if (title.includes(searchQuery)) {
      return true;
    }

    // Check if search query matches any author
    return authors.some((author) => author.toLowerCase().includes(searchQuery));
  });

  //Message if no Books found based on search input
  bookContainer.innerHTML = "";
  if (filteredBooks.length === 0) {
    bookContainer.innerHTML = "<p>No books found matching your search.</p>";
    return;
  }

  // showing filtered Books
  filteredBooks.forEach((book) => {
    const bookElement = createBookCard(book);
    bookContainer.innerHTML += bookElement;
  });
}

const filteredBooksDebounced = debounce(filterBooks, 500);

// event listener for search input
searchBooks.addEventListener("input", (e) => {
  console.log(e.target.value);
  filteredBooksDebounced(e.target.value);
});
