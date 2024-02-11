export default class MyDetails extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.shadowRoot.innerHTML = this.getHtmlTemplate();
		// this.addEventListeners();
	}

	static get observedAttributes() {
		return ["title"];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case "title":
				this.#changeTitle(newValue);
				break;
		}
	}

	#changeTitle(title) {
		this.shadowRoot.querySelector(".title").innerHTML = title;
	}

	addEventListeners() {
		this.shadowRoot.addEventListener("changeLang", this.handleLangEvent.bind(this));
	}

	getHtmlTemplate() {
		return `
			<link rel="stylesheet" href="${import.meta.resolve("./my-details.css")}"/>
			<div class="title"></div>
			<div class="content"></div>
			`;
	}
}

customElements.define("my-details", MyDetails);