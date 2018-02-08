/* global io */
// Announcements sockets config
const socket = io.connect(window.document.location.href, {forceNew: true});

socket.on('announcements', function(data) {
	render(data);
});

socket.on('announcementError', function(message) {
	alert(message);
});

const btnAdd = document.getElementById('addAnAnnouncement');
const adsContainer = document.querySelector('div.ads');
const title = document.getElementById('title');
const description = document.getElementById('description');

btnAdd.addEventListener('click', e => {
	const payload = {
		title: title.value,
		description: description.value
	};

	socket.emit('add', payload);
});

function render(data) {
	adsContainer.innerHTML = Object.keys(data).map(k => {
		const announcement = data[k];

		return (`
			<div class="announcement">
				<h3>${ announcement.title }</h3>
				<p>${ announcement.description }</p>
			</div>
		`);
	}).join(' ');
}
