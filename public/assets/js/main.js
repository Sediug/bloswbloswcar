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
const from = document.getElementById('from');
const to = document.getElementById('to');
const date = document.getElementById('date');

btnAdd.addEventListener('click', e => {
	socket.emit('create', {
		title: title.value,
		description: description.value,
		from: from.value,
		to: to.value,
		date: date.value
	});

	title.value = '';
	description.value = '';
	from.value = '';
	to.value = '';
	date.value = '';
});

function render(data) {
	adsContainer.innerHTML = Object.keys(data).map(k => {
		const announcement = data[k];

		return (`
			<div class="announcement">
				<h3>${ announcement.title }</h3>
				<h3>${ announcement.from }</h3>
				<h3>${ announcement.to }</h3>
				<h4>${ announcement.date }</h4>
				<p>${ announcement.description }</p>
			</div>
		`);
	}).join(' ');
}

document.addEventListener("DOMContentLoaded", e => {
	const request = new XMLHttpRequest();

	request.onreadystatechange = function() {
		if (request.status === 200) {
			const profile = JSON.parse(request.responseText);

			document.getElementById('user-data').innerHTML = (
				`
					<img src="${ profile.photos[0].value }"></img>
					<span class="profile-name">${ profile.username }</span>
				`
			);
		} else {
			document.getElementById('user-data').innerHTML = 'No hay ningún usuario logueado todavía!';
		}
	};

	request.open('Get', '/auth/view'); // Debug purpouse temp
	request.send();
});
