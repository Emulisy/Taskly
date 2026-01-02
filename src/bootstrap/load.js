import LoadingPage from "../components/LoadingPage/LoadingPage";

export function initLoad() {
  const container = document.querySelector(".loader__container");
  new LoadingPage(container);
}
