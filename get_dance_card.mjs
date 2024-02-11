export default function getDanceCard(obj) {
	let res = "";
	if ("title" in obj) {
		res += `<h1 id="title">${obj["title"]}</h1>`;
	}
	if ("comment" in obj) {
		res += `<div id="comment">${obj["comment"]}</div>`;
	}
	if ("scheme_short" in obj) {
		res += `<my-details id="scheme-short" title="Схема (кратко)"><p>${obj["scheme_short"]}</p></my-details>`;
	}
	if ("scheme_long" in obj) {
		res += `<my-details id="scheme-long" title="Схема (подробно)"><p>${obj["scheme_long"]}</p></my-details>`;
	}
	if ("music" in obj) {
		res += `<my-details id="music" title="Музыка"><p>${obj["music"]}</p></my-details>`;
	}
	if ("video" in obj) {
		res += `<my-details id="video" title="Видео"><p>${obj["video"]}</p></my-details>`;
	}
	return res;
}