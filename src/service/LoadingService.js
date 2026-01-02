import LoadingPage from "../components/LoadingPage/LoadingPage";

let loader = null;

export function initLoading() {
  if (!loader) {
    const container = document.querySelector(".loader__container");
    loader = new LoadingPage(container);
  }
  return loader;
}

export function showLoading() {
  loader?.show();
}

export function hideLoading() {
  loader?.hide();
}
