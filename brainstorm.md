To make thumbnails achievable, instead of making the entire manga list scrollable,
split it into pages and only get the covers for those in the current page

Download directory structure:
Base/Source/Manga/Chapter

Reader

- Dedicated second window

How to tell if a chapter was downloaded already

- Source matters. Same manga on different sources are treated differently. They might have differing image qualities, one might be ahead of the other, etc.
- Upon clicking into a manga to view its chapters, try to match source, manga title, then chapter titles to see if anything has already been downloaded.
- If already downloaded, offer to redownload (maybe the user deleted some pages by accident)

Favorites

- Save favorites by just copying its Manga object to favorites.json
- The favorites page simply displays the saved Manga objects instead of fetching and creating new ones from online.
- "Chapter downloaded already?" check logic will work as usual
- A favorite's cover image, title, and blurb should always be accessible offline
- Each of favorite's chapters can either be offline or online. When offline, only the downloaded chapters will appear.
- User should NOT have to favorite a manga to download its chapters
- Favorites and downloads must be in two separate locations

Most natural solution:

- Default download path is "downloads/" inside app folder
- User can change download path, i.e. "C:/Users/andre/Manga"
- Favorites information is always inside app folder
-

Storing favorites:

- favorites.json
- In same folder as executable to make it easy to find
  {
  favorites: [
  {
      }
  ]  
  }

How to do this?

Chapter offline info (simple):

- title: file/folder name
- pages: contents of file/folder

Manga offline info (more involved):

- title: folder name
- chapters: contents
- cover: cover.png/jpg
-
