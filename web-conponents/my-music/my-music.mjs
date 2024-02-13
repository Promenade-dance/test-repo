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
	}

	getHTML(content) {
		return `
			<link rel="stylesheet" href="${import.meta.resolve("./my-music.css")}"/>
			<div class="main">
				<svg viewBox="-10 -10 20 20" class="play-button">
					<circle r="10" fill="#ffddb3"/>
					<path d="M -2.5 4.33 L -2.5 -4.33 L 5 0 Z" fill="#b9663a" stroke="#b9663a" stroke-width="2" stroke-linecap="round" />
				</svg>
				<p class="caption">name</p>
			</div>
			`;
	}
}

customElements.define("my-music", MyMusic);