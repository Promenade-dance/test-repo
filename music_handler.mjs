class MusicHandler {
	audio;
	musicSet;
	currentMusicItem;

	constructor() {
		this.audio = new Audio();
		this.musicSet = new Set();
		this.currentMusicItem = undefined;
		this.animationRequest = undefined;
		this.addEventListeners();
	}

	addMusic(musicItem) {
		this.musicSet.add(musicItem);
	}

	removeMusic(musicItem) {
		this.musicSet.delete(musicItem);
	}

	play(musicComponent) {
		this.musicSet.forEach((item) => {
			if (item.view == musicComponent) {
				if (this.currentMusicItem == item) {
					this.audio.play();
					this.animationRequest = window.requestAnimationFrame(this.drawProgress);
				} else {
					item.getBlob().then(blob => this.audio.src = URL.createObjectURL(blob)).then(() => {
						this.audio.play();
						this.animationRequest = window.requestAnimationFrame(this.drawProgress);
					});
				}
				item.view.play();
				this.currentMusicItem = item;
			} else {
				item.view.stop();
			}
		});
	}

	pause(musicComponent) {
		// window.cancelAnimationFrame(this.animationRequest);
		this.audio.pause();
		this.musicSet.forEach((item) => {
			if (item.view == musicComponent) {
				item.view.pause();
			}
		});
	}

	drawProgress = () => {
		if (this.currentMusicItem.view.state == "play") {
			this.currentMusicItem.view.progress = this.audio.currentTime / this.audio.duration;
			console.log("draw")
			window.requestAnimationFrame(this.drawProgress);
		}
	}

	addEventListeners() {
		this.audio.addEventListener("ended", (event) => {
			this.currentMusicItem.view.stop();
		});
	}
}

class MusicItem {
	view;
	url;
	blob;

	constructor(view, url) {
		this.view = view;
		this.url = url;
		this.blob = undefined;
	}

	async getBlob() {
		if (this.blob == undefined) {
			return fetch("audio/" + this.url).then(res => res.blob()).then(blob => this.blob = blob);
		} else {
			return Promise.resolve(this.blob);
		}
	}
}

const musicHandler = new MusicHandler();
export {musicHandler as default, MusicHandler, MusicItem};