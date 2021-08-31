const puppeteer = require('puppeteer');
const express = require('express');

const app = express();

app.get('/', function(req, res) {
	(async () => {
		const browser = await puppeteer.launch({
                  headless: true,
                  args: ['--no-sandbox','--disable-setuid-sandbox']
                })
		const page = await browser.newPage({ waitUntil: 'networkidle0' });
		await page.goto('https://www.worldometers.info/coronavirus/');
		await page.waitForSelector('body');

		let data = await page.evaluate(() => {
			let result = [];
			let countries = [];
			let totalCases = [];
			let newCases = [];
			let totalDeaths = [];
			let newDeaths = [];
			let totalRecovered = [];
			let activeCases = [];
			let seriousCritical = [];
			let totalTests = [];
			let rPopulation = [];

			let countryRequest = document.body.querySelectorAll('a.mt_a');
			countryRequest.forEach((item) => {
				countries.push(item.innerText);
			});

			let totalCasesRequest = document.body.querySelectorAll(
				'#main_table_countries_yesterday > tbody:nth-child(2) > tr:not(.total_row_world) > td.sorting_1'
			);
			totalCasesRequest.forEach((item) => {
				totalCases.push(item.innerText);
			});

			let newCasesRequest = document.body.querySelectorAll(
				'#main_table_countries_yesterday > tbody:nth-child(2) > tr:not(.total_row_world) > td:nth-child(4)'
			);
			newCasesRequest.forEach((item) => {
				newCases.push(item.innerText);
			});

			let deathRequests = document.body.querySelectorAll(
				'#main_table_countries_yesterday > tbody:nth-child(2) > tr:not(.total_row_world) > td:nth-child(5)'
			);
			deathRequests.forEach((item) => {
				totalDeaths.push(item.innerText);
			});

			let newDeathsRequest = document.body.querySelectorAll(
				'#main_table_countries_yesterday > tbody:nth-child(2) > tr:not(.total_row_world) > td:nth-child(6)'
			);
			newDeathsRequest.forEach((item) => {
				newDeaths.push(item.innerText);
			});

			let totalRecoveredRequest = document.body.querySelectorAll(
				'#main_table_countries_yesterday > tbody:nth-child(2) > tr:not(.total_row_world) > td:nth-child(7)'
			);
			totalRecoveredRequest.forEach((item) => {
				totalRecovered.push(item.innerText);
			});

			let activeCasesRequest = document.body.querySelectorAll(
				'#main_table_countries_yesterday > tbody:nth-child(2) > tr:not(.total_row_world) > td:nth-child(8)'
			);
			activeCasesRequest.forEach((item) => {
				activeCases.push(item.innerText);
			});

			let seriousCriticalRequest = document.body.querySelectorAll(
				'#main_table_countries_yesterday > tbody:nth-child(2) > tr:not(.total_row_world) > td:nth-child(9)'
			);
			seriousCriticalRequest.forEach((item) => {
				seriousCritical.push(item.innerText);
			});

			let totalTestsRequest = document.body.querySelectorAll(
				'#main_table_countries_yesterday > tbody:nth-child(2) > tr:not(.total_row_world) > td:nth-child(12)'
			);
			totalTestsRequest.forEach((item) => {
				totalTests.push(item.innerText);
			});

			let populationRequest = document.body.querySelectorAll(
				'#main_table_countries_yesterday > tbody:nth-child(2) > tr:not(.total_row_world) > td:nth-child(14) > a'
			);
			populationRequest.forEach((item) => {
				rPopulation.push(item.innerText);
			});

			for (var i = 0; i < totalCases.length; ++i) {
				result.push({
					countryName: countries[i],
					cases: totalCases[i],
					new_cases: newCases[i],
					deaths: totalDeaths[i],
					new_deaths : newDeaths[i],
					total_recovered : totalRecovered[i],
					active_cases : activeCases[i],
					serious_cases : seriousCritical[i],
					total_tests : totalTests[i],
					population : rPopulation[i],
				});
			}	

			return result;
		});

		await browser.close();
		res.send(data);
	})();
});
const port = process.env.PORT || 8000;
app.listen(port);
module.exports = app;
