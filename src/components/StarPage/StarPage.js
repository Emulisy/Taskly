import TaskList from "../TaskList/TaskList.js";
import "./starPage.css";

export default class StarPage {
  constructor(container) {
    this.container = container;
    this._render();
  }

  _render() {
    this.container.innerHTML = `
      <div class="star__bg">

        <div style="width: 150px; height: 150px;" class="star__bg-star">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="overflow: visible;">
            <defs>
              <radialGradient id="glow-strong" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style="stop-color:var(--color-accent);stop-opacity:1" />
                <stop offset="30%" style="stop-color:var(--color-accent-light);stop-opacity:0.9" />
                <stop offset="100%" style="stop-color:var(--color-accent-lighter);stop-opacity:0" />
              </radialGradient>
            </defs>

            <g transform="translate(100, 100)">
              
              <g stroke="var(--color-accent-lighter)" stroke-width="1.0" opacity="0.8" class="layer2">
                <line x1="0" y1="-95" x2="0" y2="95" transform="rotate(22.5)" />
                <line x1="0" y1="-95" x2="0" y2="95" transform="rotate(67.5)" />
                <line x1="0" y1="-95" x2="0" y2="95" transform="rotate(112.5)" />
                <line x1="0" y1="-95" x2="0" y2="95" transform="rotate(157.5)" />
              </g>

              <g fill="var(--color-accent)" class="layer1">
                <polygon points="0,-90 3,0 0,90 -3,0" transform="rotate(30)" />
                <polygon points="0,-90 3,0 0,90 -3,0" transform="rotate(60)" />
                <polygon points="0,-90 3,0 0,90 -3,0" transform="rotate(-30)" />
                <polygon points="0,-90 3,0 0,90 -3,0" transform="rotate(-60)" />
                <polygon points="0,-90 3,0 0,90 -3,0" transform="rotate(0)" />
                <polygon points="0,-90 3,0 0,90 -3,0" transform="rotate(90)" />
              </g>

              <g fill="var(--color-accent-light)">
                <polygon points="0,-100 4,0 0,100 -4,0" />
                <polygon points="-100,0 0,4 100,0 0,-4" />
              </g>
              
              <circle cx="0" cy="0" r="10" fill="url(#glow-strong)" />

            </g>
          </svg>
        </div>

        <div class="star__bg-rect"></div>
        <div class="star__bg-rect"></div>
        <div class="star__bg-rect"></div>
        <div class="star__bg-rect"></div>
        <div class="star__bg-rect"></div>
        <div class="star__bg-rect"></div>
        <div class="star__bg-rect"></div>
        <div class="star__bg-rect"></div>
      </div>
      <div class="star__wrapper">
        <h2 class="star__header"> <i class="fa-solid fa-star-half-stroke"></i> Star your important tasks! </h2>
      </div>
      <div class="star__results"></div>
    `;

    this.starResults = this.container.querySelector(".star__results");

    this.taskList = new TaskList(this.starResults, { star: true });
  }
}
