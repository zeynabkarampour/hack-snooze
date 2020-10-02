// This is the global list of the stories, an instance of StoryList
let storyList;
let $storySubmitForm = $("#submit-form");
// let $myStories = ("nav-my-stories")




/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */


function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}" class="fave-star">
      <i class="far fa-star"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

$storySubmitForm.on("submit" , async function (evt){
  evt.preventDefault();
  let createAuthor = $(evt.target).find("#create-author").val();
  let createTitle = $(evt.target).find("#create-title").val();
  let createUrl =$(evt.target).find("#create-url").val();
  let newStory = await storyList.addStory(currentUser, {title : createTitle, author : createAuthor, url: createUrl});
  const $story = generateStoryMarkup(newStory);
  $allStoriesList.prepend($story);
  $storySubmitForm.trigger("reset");
  // $storySubmitForm.hide();
})


$allStoriesList.on("click", ".fave-star", function (evt){
  evt.preventDefault();
  // console.log(`evt target star`, $(evt.target).parent().attr("id"))
  let storyId = $(evt.target).parent().attr("id");
  currentUser.addFavoriteStory(storyId);
})





// /** Sync new story information to localStorage.
//  *
//  * We store the author/title/url in localStorage , and them show new story on page
//  */

// function saveNewStoryInLocalStorage() {
//   console.debug("saveNewStoryInLocalStorage");
//   if (currentUser) {
//     localStorage.setItem("token", currentUser.loginToken);
//     localStorage.setItem("username", currentUser.username);
//     localStorage.setItem("username", currentUser.username);
//   }
// }