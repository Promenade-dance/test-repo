import EventMaster from "../../event-master.mjs";

export default class AudioProgress extends HTMLElement {
	constructor() {
		super();
		this.onSettingStart = new EventMaster();
		this.onSettingEnd = new EventMaster();
		this.view = new View(this);
		this.clickManager = new ClickManager(this);
	}

	get progress() {
		return this.view.progress;
	}

	set progress(val) {
		this.view.setProgress(val);
	}
}

class View {
	width = 0;
	height = 0;
	progress = 0;

	constructor(target) {
		this.target = target;
		target.attachShadow({ mode: "open" });
		this.domRoot = this.target.shadowRoot;
		this.domRoot.innerHTML = this.getStyle() + this.getHTML();
		this.addResizeObserver();
		this.svg = this.domRoot.querySelector("svg");
		this.trackLine1 = this.domRoot.querySelector("#trackLine1");
		this.trackLine2 = this.domRoot.querySelector("#trackLine2");
		this.thumb = this.domRoot.querySelector("#thumb");
		this.thumbCircle = this.domRoot.querySelector("#thumb-circle");
	}

	get trackWidth() {
		return this.width - this.height;
	}

	get trackX() {
		return this.height / 2;
	}

	get trackY() {
		return this.height / 2;
	}

	get thumbOffset() {
		return this.progress * this.trackWidth;
	}

	setProgress(value) {
		if (!value) {
			this.progress = 0;
		} else if (value < 0) {
			this.progress = 0;
		} else if (value > 1) {
			this.progress = 1;
		} else {
			this.progress = value;
		}
		this.redrawProgress();
	}

	redrawWidthHeight() {
		this.svg.setAttribute("width", this.width);
		this.svg.setAttribute("height", this.height);
		this.trackLine1.setAttribute("x1", this.trackX);
		this.trackLine1.setAttribute("x2", this.trackX + this.thumbOffset);
		this.trackLine1.setAttribute("y1", this.trackY);
		this.trackLine1.setAttribute("y2", this.trackY);
		this.trackLine1.setAttribute("stroke-width", 0.4 * this.height);
		this.trackLine2.setAttribute("x1", this.trackX + this.thumbOffset);
		this.trackLine2.setAttribute("x2", this.trackX + this.trackWidth);
		this.trackLine2.setAttribute("y1", this.trackY);
		this.trackLine2.setAttribute("y2", this.trackY);
		this.trackLine2.setAttribute("stroke-width", 0.4 * this.height);
		this.thumbCircle.setAttribute("r", this.height / 2);
		this.thumbCircle.setAttribute("cy", this.trackY);
		this.thumbCircle.setAttribute("cx", this.trackX);
		this.thumb.setAttribute("transform", `translate(${this.thumbOffset})`);
	}

	redrawProgress() {
		this.trackLine1.setAttribute("x2", this.trackX + this.thumbOffset);
		this.trackLine2.setAttribute("x1", this.trackX + this.thumbOffset);
		this.thumb.setAttribute("transform", `translate(${this.thumbOffset})`);
	}

	setThumb(offsetX) {
		const progress = (offsetX - this.height/2) / (this.width - this.height);
		this.setProgress(progress);
	}

	addResizeObserver() {
		this.resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.target == this.target) {
					this.width = entry.contentRect.width;
					this.height = entry.contentRect.height;
					this.redrawWidthHeight();
				}
			}
		});
		this.resizeObserver.observe(this.target);
	}

	getStyle() {
		return `
			<style>
				:host {
					display: inline-block;
					width: 10em;
					height: 0.5em;
				}
			</style>
		`;
	}

	getHTML() {
		return `
			<div id="em-square" style="display:none; width: 1em; height: 1em"></div>
			<svg>
				<line id="trackLine1" stroke="#b9663a" stroke-linecap="round" />
				<line id="trackLine2" stroke="#ffddb3" stroke-linecap="round" />
				<g id="thumb">
					<circle id="thumb-circle" fill="#b9663a"/>
				</g>
			</svg>
		`;
	}
}

class ClickManager {
	constructor(target) {
		this.target = target;
		this.isMoving = false;
		this.offsetX = 0;
		this.addMouseEvents();
	}

	addMouseEvents() {
		const mouseMove = ((event) => {
			if (event.buttons & 1) {
				event.preventDefault();
				this.target.view.setThumb(event.x + this.offsetX);
			} else {
				this.isMoving = false;
				this.target.onSettingEnd.triger();
				document.removeEventListener("mousemove", mouseMove);
			}
		}).bind(this)
		this.target.addEventListener("mousedown", ((event) => {
			event.preventDefault();
			this.isMoving = true;
			this.target.onSettingStart.triger();
			this.offsetX = event.offsetX - event.x;
			this.target.view.setThumb(event.offsetX);
			document.addEventListener("mousemove", mouseMove);
		}).bind(this));
	}

}

customElements.define("my-audio-progress", AudioProgress);