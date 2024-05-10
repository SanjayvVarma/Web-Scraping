const axios = require("axios")
const cheerio = require('cheerio');
const fs = require("node:fs")
const xlsx = require("xlsx")

const pageUrl = "https://www.amazon.in/s?k=mobile+phones&crid=11ZG26OV7ZLXF&sprefix=mobile+phones%2Caps%2C357&ref=nb_sb_noss_1"

let headers = {
    "content-type": "text/html"
}

let getWebpageData = async (url) => {
    try {
        let response = await axios.get(url, {
            headers,
        })
        // console.log(response.data);
        const strData = response.data
        fs.writeFileSync("may06/webPagedata.txt", strData)
    } catch (err) {
        console.log("error", err);
    }
}

// getWebpageData(pageUrl)

const getDatafromFile = () => {
    return fs.readFileSync("may06/webPagedata.txt", { encoding: "utf-8" })
}
let htmlPageData = getDatafromFile()
// console.log(htmlPageData);


let $ = cheerio.load(htmlPageData)
let products = []
let productCards = $("div[data-asin]")
    .each((i, e) => {
        let productName = $(e).find("span.a-size-medium.a-color-base.a-text-normal").text()
        let productPrice = $(e).find("span.a-price-whole").text()
        let productAvailability = $(e).find("span.a-badge-text").text()
        let productRating = $(e).find("span i").text()
        if (productName && productPrice && productAvailability && productRating) {
            products.push({
                name: productName,
                price: productPrice,
                Availability: productAvailability,
                rating: productRating,
            });
        }
    })

// console.log(products);

let workbook = xlsx.utils.book_new()
const worksheet = xlsx.utils.json_to_sheet(products)
xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1")

 xlsx.writeFile(workbook, "may06/products.xlsx");