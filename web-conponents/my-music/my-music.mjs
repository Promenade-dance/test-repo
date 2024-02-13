export default class MyMusic extends HTMLElement {
	#name;

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.innerHTML = this.getHTML(this.innerHTML);
		this.addEventListeners();
	}

	static get observedAttributes() {
		return ["title"];
	}

	attributeChangedCallback(name, oldValue, newValue) {
	}

	addEventListeners() {
		this.shadowRoot.querySelector("svg#play-pause-button").addEventListener("click", () => {
			this.setAttribute("data-state", "pause");
		})
	}

	getHTML(content) {
		return `
			<link rel="stylesheet" href="${import.meta.resolve("./my-music.css")}"/>
			<div class="main">
				<svg data-state="play" viewBox="-10 -10 20 20" id="play-pause-button">
					<circle r="10" fill="#ffddb3"/>
					<path id="play" d="M -2 3.46 L -2 -3.46 L 4 0 Z" fill="#b9663a" stroke="#b9663a" stroke-width="2" stroke-linejoin="round" />
					<path id="pause" d="M -2 3.46 L -2 -3.46 M 2 3.46 L 2 -3.46" stroke="#b9663a" stroke-width="2" stroke-linecap="round" />
				</svg>
				</svg>
				<p class="caption">name</p>
			</div>
			`;
	}
}

customElements.define("my-music", MyMusic);