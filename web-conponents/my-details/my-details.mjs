export default class MyDetails extends HTMLElement {
	#open = false;
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
		switch (name) {
			case "title":
				this.#changeTitle(newValue);
				break;
		}
	}

	#changeTitle(title) {
		this.shadowRoot.querySelector(".title-content").innerHTML = title;
	}

	#openHide() {
		let content = this.shadowRoot.querySelector(".content");
		let roll = this.shadowRoot.querySelector(".roll");
		if (this.#open) {
			this.setAttribute("open", "open");
			roll.style.maxHeight = `${content.offsetHeight}px`;
		} else {
			this.removeAttribute("open", "open");
			roll.style.maxHeight = 0;
		}
	}

	addEventListeners() {
		this.shadowRoot.querySelector(".title").addEventListener("click", () => {
			this.#open = !this.#open;
			this.#openHide();
		});
	}

	getHTML(content) {
		return `
			<link rel="stylesheet" href="${import.meta.resolve("./my-details.css")}"/>
			<div class="title">
				<svg viewBox="-12 -12 24 24">
					<path d="M -10 0 L 10 0 M 0 -10 L 0 10" stroke="#b9663a" stroke-width="4" stroke-linecap="round"/>
				</svg>
				<div class="title-content"></div>
			</div>
			<div class="roll"><div class="content">${content}</div></div>
			`;
	}
}

customElements.define("my-details", MyDetails);