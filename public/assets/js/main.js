/* global io */

// Announcements sockets config
const socket = io.connect('http://localhost:8080', {forceNew: true});

socket.on('announcements', function(data) {
	console.log(data);
	render(data);
});

const btnAdd = document.getElementById('addAnAnnouncement');
const adsContainer = document.querySelector('div.ads');
const title = document.getElementById('title');
const description = document.getElementById('description');

btnAdd.addEventListener('click', e => {
	const payload = {
		title: title.value,
		desc: description.value
	};
	
	socket.emit('add', payload);
});

function render(data) {
	adsContainer.innerHTML = Object.keys(data).map(k => {
		const announcement = data[k];
		
		return (`
			<div class="announcement">
				<h3>${ announcement.title }</h3>
				<p>${ announcement.desc }</p>
			</div>
		`);
	}).join(' ');
}