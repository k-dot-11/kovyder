const express = require('express');

const PORT = process.env.PORT || 3001;

const app = express();
const rp = require('request-promise');
const cheerio = require('cheerio');

let animes = [];
let scores = [];
let combined = [];

const options = {
	url: 'https://myanimelist.net/topanime.php',
	transform: (body) => cheerio.load(body)
};

rp(options).then(function($) {
	$('h3.anime_ranking_h3 a').each(function(i, elm) {
		animes.push($(this).text());
	});
	$('span.text.on.score-label').each(function(i, elm) {
		scores.push($(this).text());
	});

	for (let i = 0; i < animes.length; ++i) {
		combined.push({ animeName: animes[i], animeScore: scores[i] });
	}
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});

app.get('/api', (req, res) => {
	res.json({ anime: combined });
});
