// select elements from document
const quoteContainer = document.getElementById("quote-container");
const quoteImg = document.getElementById("quote-img");
const content = document.getElementById("content");
const newQuoteBtn = document.getElementById("getNewQuoteBtn");
const copyClipboardBtn = document.getElementById("copyClipboardBtn");
const shareTwitterBtn = document.getElementById("shareTwitterBtn");
const exportImageBtn = document.getElementById("exportImageBtn");

let getCanvas;

// Api Url for Quote Data
const quoteApiUrl = "https://api.freeapi.app/api/v1/public/quotes/quote/random";

// Getting Quote Data
const fetchQuote = async () => {
  // disable all buttons to avoid interruptions
  document
    .querySelectorAll("button")
    .forEach((button) => (button.disabled = true));
  //add loading element to quote container
  content.innerHTML = `<p>Loading Quote...</p>`;
  try {
    const quoteResponse = await fetch(quoteApiUrl);
    const quoteData = await quoteResponse.json();
    changeBackgroundImage();
    displayQuote(quoteData);
  } catch (error) {
    //error for not getting data from api
    content.innerHTML = `<p>Error getting Quote: ${error}\nPlease Try Again Later.</p>`;
  } finally {
    //enable all buttons to use them again
    document
      .querySelectorAll("button")
      .forEach((button) => (button.disabled = false));
  }
};

//display quote to quote container
function displayQuote(quoteData) {
  const quoteElement = `
    <p id="quote">"${quoteData.data.content}"</p>
    <p id="author">${quoteData.data.author}</p>
    `;
  content.innerHTML = quoteElement;
  exportImage();
}

//changing background with random images
function changeBackgroundImage() {
  // image address array
  const imgArray = [
    "https://images.pexels.com/photos/2117938/pexels-photo-2117938.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/31190452/pexels-photo-31190452/free-photo-of-textured-brick-wall-background-for-design.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/268966/pexels-photo-268966.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/194096/pexels-photo-194096.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/8892/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2768398/pexels-photo-2768398.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1843717/pexels-photo-1843717.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2096622/pexels-photo-2096622.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/7794365/pexels-photo-7794365.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/172288/pexels-photo-172288.jpeg?auto=compress&cs=tinysrgb&w=600",
  ];
  // get random number between 1 and 10
  const index = Math.floor(Math.random() * (10 - 1)) + 1;
  // change the url of background image
  quoteImg.src = `${imgArray[index]}`;
}

// event listener for all the buttons
newQuoteBtn.addEventListener("click", fetchQuote);
window.addEventListener("load", fetchQuote);
copyClipboardBtn.addEventListener("click", copyToClipboard);
shareTwitterBtn.addEventListener("click", shareToTwitter);
exportImageBtn.addEventListener("click", exportImage);

// copy data to clipboard
function copyToClipboard() {
  const quote = document.getElementById("quote");
  const author = document.getElementById("author");

  // disable all buttons to avoid interruptions
  document
    .querySelectorAll("button")
    .forEach((button) => (button.disabled = true));
  navigator.clipboard.writeText(
    `Quote: ${quote.innerText}\nAuthor: ${author.innerText}\n`
  );
  // showing success alert
  alert("Quote Copied to Clipboard");

  //enable all buttons to use them again
  document
    .querySelectorAll("button")
    .forEach((button) => (button.disabled = false));
}

// share to twitter
function shareToTwitter() {
  const quote = document.getElementById("quote");
  const author = document.getElementById("author");

  // disable all buttons to avoid interruptions
  document
    .querySelectorAll("button")
    .forEach((button) => (button.disabled = true));
  // encode data to URI Component
  const encodeContent = encodeURIComponent(
    `Quote: ${quote.innerText}\nAuthor: ${author.innerText}\n`
  );
  const twitterUrl = `https://x.com/intent/tweet?text=${encodeContent}`;

  //publish tweet in new tab window
  window.open(twitterUrl, "_blank");

  //enable all buttons to use them again
  document
    .querySelectorAll("button")
    .forEach((button) => (button.disabled = false));
}

async function exportImage() {
  // disable all buttons to avoid interruptions
  document
    .querySelectorAll("button")
    .forEach((button) => (button.disabled = true));

  try {
    // converting html element in canvas
    const canvas = await html2canvas(quoteContainer, {
      useCORS: true,
      backgroundColor: null,
    });

    // Converting canvas to image data
    const imageData = canvas.toDataURL("image/jpg");

    // Adding attributes to export image button
    exportImageBtn.href = imageData;
    exportImageBtn.download = "quote.jpg";
  } catch (error) {
    console.error("Error exporting image:", error);
    alert("Failed to export image. Please try again.");
  } finally {
    // Enable all buttons again
    document
      .querySelectorAll("button")
      .forEach((button) => (button.disabled = false));
  }
}
