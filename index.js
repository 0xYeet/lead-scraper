// index.js

const puppeteer = require("puppeteer");
const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvWriter = createCsvWriter({
	path: "./goodFirmsLeads.csv",
	header: [
		{ id: "name", title: "Name" },
		{ id: "website", title: "Website" },
		{ id: "description", title: "Description" },
		{ id: "location", title: "Location" },
	],
});

async function scrapeWebsite() {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();

	// Scrape results, hit next,

	const results = new Set();

	// All 163 pages
	for (let i = 0; i < 163; i++) {
		console.log("Page: ", i + 1);
		await page.goto(
			`https://www.goodfirms.co/directory/marketing-services/top-digital-marketing-companies/email-marketing?page=${
				i + 1
			}`
		);
		// Your code here
		for (let j = 0; j < 50; j++) {
			const name = await page
				.$eval(
					`#service-providers > div > div.directory-list > ul > li:nth-child(${
						j + 1
					}) > div.firm-header > div > h3 > a`,
					(anchor) => anchor.textContent || ""
				)
				.catch((error) => {
					// console.log(`Error: ${error}`);
					return null;
				});

			const website = await page
				.$eval(
					`#service-providers > div > div.directory-list > ul > li:nth-child(${
						j + 1
					}) > div.firm-header > a`,
					(anchor) =>
						(anchor.getAttribute("href") || "").replace(
							/^(?:https?:\/\/)?(?:www\.)?([^\/]+).*$/,
							"$1"
						)
				)
				.catch((error) => {
					// console.log(`Error: ${error}`);
					return null;
				});

			const description = await page
				.$eval(
					`#service-providers > div > div.directory-list > ul > li:nth-child(${
						j + 1
					}) > div.firm-container > div.firm-description > p`,
					(anchor) => anchor.textContent || ""
				)
				.catch((error) => {
					// console.log(`Error: ${error}`);
					return null;
				});

			const location = await page
				.$eval(
					`#service-providers > div > div.directory-list > ul > li:nth-child(${
						j + 1
					}) > div.firm-container > div.firm-services > div.firm-location.custom_tooltip > span`,
					(anchor) => anchor.textContent || ""
				)
				.catch((error) => {
					// console.log(`Error: ${error}`);
					return null;
				});

			if (name || website || description || location) {
				results.add(JSON.stringify({ name, website, description, location }));
			}
		}
	}
	return Array.from(results, JSON.parse);
}

// Loop through

//www.goodfirms.co/directory/marketing-services/top-digital-marketing-companies/email-marketing?page=1

// page.$$eval(#service-providers > div > div.directory-list > ul > li:nth-child(1) > div.firm-header > div > h3 > a)
// page.$$eval(#service-providers > div > div.directory-list > ul > li:nth-child(2) > div.firm-header > div > h3 > a)
// #service-providers > div > div.directory-list > ul > li:nth-child(5) > div.firm-header > div > h3 > a

// await loginPage.goto(
// 	"https://www.goodfirms.co/directory/marketing-services/top-digital-marketing-companies/email-marketing?page=1"
// );

// await loginPage.click(
// 	"#organic-div > form > div.login__form_action_container > button"
// );

// await new Promise((resolve) => setTimeout(resolve, 2000));

// const page = await browser.newPage();

// await page.goto(url);

// const links = new Set();
// // Scroll to the bottom of the page and wait for all network requests to stop, then scroll again. Loop this 10 times
// for (let i = 0; i < 30; i++) {
// 	const newLinks = await page.$$eval(
// 		"div > div.update-components-actor.display-flex.update-components-actor--with-control-menu > div > div > a:nth-child(1)",
// 		(anchors) => {
// 			return anchors.map((a) => ({
// 				text: a.textContent || "",
// 				href: a.getAttribute("href") || "",
// 			}));
// 		}
// 	);
// 	await page.mouse.wheel({ deltaY: 10000 });

// 	await new Promise((resolve) => setTimeout(resolve, 2000));

// 	if (newLinks.length > 0) {
// 		newLinks.forEach((link) => links.add(JSON.stringify(link)));
// 	} else {
// 		console.log("Breaking on loop: ", i + 1);
// 		break;
// 	}
// }

// // await browser.close();

// Sample usage:
scrapeWebsite().then((links) => {
	csvWriter
		.writeRecords(links)
		.then(() => console.log("The CSV file was written successfully"));
});
