import {MusicItem} from "./music_handler.mjs";

export default function getDanceCard(obj) {
	let res = document.createDocumentFragment();
	let part;
	if ("title" in obj) {
		part = document.createElement("h1");
		part.setAttribute("id", "title");
		part.innerHTML = obj["title"];
		res.append(part);
	}
	if ("comment" in obj) {
		part = document.createElement("div");
		part.setAttribute("id", "comment");
		part.innerHTML = obj["comment"];
		res.append(part);
	}
	if ("scheme_short" in obj) {
		part = document.createElement("my-details");
		part.setAttribute("id", "scheme-short");
		part.setAttribute("title", "Схема (кратко)");
		part.contentDiv.innerHTML = `<p>${obj["scheme_short"]}</p>`;
		res.append(part);
	}
	if ("scheme_long" in obj) {
		part = document.createElement("my-details");
		part.setAttribute("id", "scheme-long");
		part.setAttribute("title", "Схема (подробно)");
		part.contentDiv.innerHTML = `<p>${obj["scheme_long"]}</p>`;
		res.append(part);
	}
	if ("music" in obj) {
		part = document.createElement("my-details");
		part.setAttribute("id", "music");
		part.setAttribute("title", "Музыка");
		part.contentDiv.append(getMusicPart(obj["music"]));
		res.append(part);
	}
	if ("video" in obj) {
		part = document.createElement("my-details");
		part.setAttribute("id", "video");
		part.setAttribute("title", "Видео");
		part.contentDiv.append(getVideoPart(obj["video"]));
		res.append(part);
	}
	return res;
}

function getMusicPart(music) {
	let docPart = document.createDocumentFragment();
	music.forEach(m => {
		let player = document.createElement("my-music-player");
		window.musicHandler.addMusic(new MusicItem(player, m["url"]));
		player.view.setName(m["title"]);
		docPart.append(player);
	});
	return docPart;
}

function getVideoPart(video) {
	let docPart = document.createDocumentFragment();
	video.forEach(m => {
		// TODO
	});
	return docPart;
}