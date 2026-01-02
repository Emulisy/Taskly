import SearchPage from "../components/SearchPage/SearchPage.js";

export function initSearch() {
  new SearchPage(document.querySelector(".search"));
}
