import musicHandler from "../../music_handler.mjs";
import AudioProgress from "../audio-progress/audio-progress.mjs";

export default class Music extends HTMLElement {
	#state;

	constructor() {
		super();
		this.view = new View(this);
		this.state = "stop";
		this.addEventListeners();
	}

	play() {
		this.state = "play";
	}

	pause() {
		this.state = "pause";
	}

	stop() {
		this.state = "stop";
	}

	set state(val) {
		if (val == "play" && this.#state != "play") {
			this.#state = "play";
			this.view.showPause();
			this.view.progress.style.opacity = 1;
		} else if (val == "pause" && this.#state != "pause") {
			this.#state = "pause";
			this.view.showPlay();
			this.view.progress.style.opacity = 1;
		} else if (val == "stop" && this.#state != "stop") {
			this.#state = "stop";
			this.view.showPlay();
			this.view.progress.style.opacity = 0;
		}
	}

	get state() {
		return this.#state;
	}

	set progress(val) {
		this.view.progress.progress = val;
	}

	get progress() {
		return this.view.progress.progress;
	}

	addEventListeners() {
		this.view.playPauseButton.addEventListener("click", () => {
			if (this.#state == "play") {
				musicHandler.pause(this);
			} else {
				musicHandler.play(this);
			}
		})
		this.view.progress.onSettingStart.add(() => {
			if (this.#state == "play") {
				musicHandler.pause(this);
				this.view.progress.onSettingEnd.addOnce(() => {
					musicHandler.audio.currentTime = musicHandler.audio.duration * this.progress;
					musicHandler.play(this);
				});
			} else {
				this.view.progress.onSettingEnd.addOnce(() => {
					musicHandler.audio.currentTime = musicHandler.audio.duration * this.progress;
				});
			}
			
		})
	}
}

class View {
	constructor(target) {
		this.target = target;
		target.attachShadow({ mode: "open" });
		this.domRoot = this.target.shadowRoot;
		this.domRoot.innerHTML = this.getStyle() + this.getHTML();
		this.nameTag = this.domRoot.querySelector("#music-name");
		this.playPauseButton = this.domRoot.querySelector("#play-pause-button");
		this.svgPlay = this.domRoot.querySelector("#play");
		this.svgPause = this.domRoot.querySelector("#pause");
		this.progress = this.domRoot.querySelector("#progress");
	}

	setName(val) {
		this.nameTag.innerHTML = val;
	}

	showPlay() {
		this.svgPlay.setAttribute("opacity", 1);
		this.svgPause.setAttribute("opacity", 0);
	}

	showPause() {
		this.svgPlay.setAttribute("opacity", 0);
		this.svgPause.setAttribute("opacity", 1);
	}

	getStyle() {
		return `
			<style>
				.main {
					margin: 0.2em;
					display: flex;
					align-items: center;
					gap: 0.5em;
				}
				
				#play-pause-button {
					flex: 0 0 2em;
					aspect-ratio: 1/1;
				}
				
				#info {
					flex-grow: 1;
					flex-shrink: 1;
					min-width: 0;
				}
				
				#music-name {
					margin: 0;
					padding: 0;
					overflow: hidden;
					text-overflow: ellipsis;
					text-wrap: nowrap;
				}

				my-audio-progress {
					width: 100%;
				}
			</style>
		`;
	}

	getHTML() {
		return `
			<div class="main">
				<svg viewBox="-10 -10 20 20" id="play-pause-button">
					<circle r="10" fill="#ffddb3"/>
					<path id="play" d="M -2 3.46 L -2 -3.46 L 4 0 Z" fill="#b9663a" stroke="#b9663a" stroke-width="2" stroke-linejoin="round" />
					<path id="pause" d="M -2 3.46 L -2 -3.46 M 2 3.46 L 2 -3.46" stroke="#b9663a" stroke-width="2" stroke-linecap="round" />
				</svg>
				<div id="info" data-progress="show">
					<p id="music-name">Music Name</p>
					<my-audio-progress id="progress"></my-audio-progress>
				</div>
			</div>
		`;
	}
}

customElements.define("my-music-player", Music);