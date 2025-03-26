// select elements from HTML Document
const searchVideos = document.getElementById("searchVideos");
const videoContainer = document.getElementById("container");
const loading = document.getElementById("loading");
const getMoreVideos = document.getElementById("getMoreVideos");

// Api URL
const videoApiUrl = "https://api.freeapi.app/api/v1/public/youtube/videos";

// Page No for fetch videos from Api
let page = 1;

// Array to store all videos data need in filtering the videos based on search
let allVideos = [];

// fetch videos from api url
const fetchVideos = async () => {
  // disabled all buttons to avoid interruptions
  searchVideos.disabled = true;
  getMoreVideos.style.display = "none";
  // add loading element to video container
  loading.style.display = "block";
  try {
    const videoResponse = await fetch(`${videoApiUrl}?page=${page}`);
    const videoData = await videoResponse.json();
    // call function for display the videos
    displayVideos(videoData);
    // increase page number for next videos call on demand
    page++;
  } catch (error) {
    // error message in case of not getting and data
    videoContainer.innerHTML = `<p>Error getting Videos: ${error}\nPlease Try Again...</p>`;
    getMoreVideos.style.display = "none";
  } finally {
    // enable all buttons
    searchVideos.disabled = false;
    getMoreVideos.style.display = "block";
    //hide loading message
    loading.style.display = "none";
  }
};

// function to create a video card element
function createVideoCard(video) {
  return `
                <div class="video-card">
                    <div class="thumbnail">
                        <a href="https://www.youtube.com/watch?v=${
                          video.items.id
                        }" target="_blank">
                            <img src="${
                              video.items.snippet.thumbnails.high.url
                            }" alt="${video.items.snippet.title}" />
                        </a>
                    </div>
                    <div class="video-details">
                        <h3 class="video-title">${
                          video.items.snippet.title
                        }</h3>
                        <p class="channel-name">${
                          video.items.snippet.channelTitle
                        }</p>
                        <p class="upload-ago">${
                          video.items.statistics.viewCount
                        } views, ${timeAgo(video.items.snippet.publishedAt)}</p>
                    </div>
                </div>
                `;
}

// function for display message
function displayVideos(videoData) {
  // spread all video data to store in a single array
  allVideos = [...allVideos, ...videoData.data.data];
  //loop for show all videos
  videoData.data.data.map((video) => {
    const videoElement = createVideoCard(video);
    videoContainer.innerHTML += videoElement;
    // condition check for load more button. not show if no more further videos available
    if (videoData.data.totalPages <= page) {
      getMoreVideos.style.display = "none";
    }
  });
  return;
}

// event listener for fetch videos after loading window
window.addEventListener("load", fetchVideos);
// event listner for load more videos button
getMoreVideos.addEventListener("click", fetchVideos);

// function to get information about how long back video uploaded
const timeAgo = (time) => {
  const currentTime = new Date();
  const lastPost = new Date(time);

  const timeDifference = currentTime - lastPost;
  const msPerMinute = 1000 * 60;

  const minutesAgo = Math.floor(timeDifference / msPerMinute);
  const hoursAgo = Math.floor(minutesAgo / 60);
  const daysAgo = Math.floor(hoursAgo / 24);
  const weeksAgo = Math.floor(daysAgo / 7);
  const monthsAgo = Math.floor(daysAgo / 30);
  const yearsAgo = Math.floor(daysAgo / 365);

  if (minutesAgo < 60) {
    return `${minutesAgo}min ago`;
  }

  if (hoursAgo < 24) {
    return `${hoursAgo}hours ago`;
  }

  if (daysAgo < 7) {
    return `${daysAgo} days ago`;
  }

  if (daysAgo < 30) {
    return `${weeksAgo} weeks ago`;
  }

  if (daysAgo < 365) {
    return `${monthsAgo} months ago`;
  }

  return `${yearsAgo} years ago`;
};

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// function to show filtered videos based on search input
function filterVideos(searchQuery) {
  searchQuery = searchQuery.toLowerCase().trim();

  // if no search input show all videos
  if (!searchQuery) {
    // clearing video container
    videoContainer.innerHTML = "";
    allVideos.forEach((video) => {
      const videoElement = createVideoCard(video);
      // adding all videos to video container
      videoContainer.innerHTML += videoElement;
    });
    return;
  }

  // function to filter videos based on search input
  const filteredVideos = allVideos.filter((video) =>
    video.items.snippet.title.toLowerCase().includes(searchQuery)
  );

  //Message if no videos found based on search input
  videoContainer.innerHTML = "";
  if (filteredVideos.length === 0) {
    videoContainer.innerHTML = "<p>No videos found matching your search.</p>";
    return;
  }

  // showing filtered videos
  filteredVideos.forEach((video) => {
    const videoElement = createVideoCard(video);
    videoContainer.innerHTML += videoElement;
  });
}

const filteredVideosDebounced = debounce(filterVideos, 500);

// event listener for search input
searchVideos.addEventListener("input", (e) => {
  filteredVideosDebounced(e.target.value);
});
