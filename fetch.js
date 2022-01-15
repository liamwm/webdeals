const puppeteer = require("puppeteer")

const getStuff = async (req, res) => {
  const products = []

  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  const url = 'https://www.jbhifi.com.au/collections/computers-tablets/student-laptops'
  await page.goto(url);

  const container_selector = "#collection-container > div:nth-child(5) > div.collection-results-loop > div"
  await page.waitForSelector(container_selector)
  const product_container = await page.$(container_selector)
  const productsHandle = await page.$$(container_selector + " > *")
  console.log("Products found: " + productsHandle.length)

  for (const prod of productsHandle) {
    const nameSelector = "div > a > div > div.ais-hit--details.product-tile__details > h4"
    const nameHandle = await prod.$(nameSelector)
    const name = await page.evaluate((nameEl) => nameEl.innerHTML, nameHandle)

    const priceSelector = "div > div.ais-hit--cart.product-tile__cta > a > div > div > span"
    const priceHandle = await prod.$(priceSelector)
    const priceHTML = await page.evaluate(
      (priceEl) => priceEl.innerHTML, priceHandle
    )
    const priceSearch = priceHTML.match(/\d+/g)
    const price = (priceSearch != []) ? priceSearch[0] : null

    const linkSelector = "a"
    const linkHandle = await prod.$(linkSelector)
    const link = await page.evaluate((linkEl) => {
      return linkEl.attributes.getNamedItem("href").value
    }, linkHandle)

    const imgSelector = "img"
    const imgHandle = await prod.$(imgSelector)
    const img = await page.evaluate((imgEl) => {
      return imgEl.attributes.getNamedItem("src").value
    }, imgHandle)

    console.log(name, price, link, img)
    products.push({"name": name, "price": price, "link": link, "img": img})
  }
  res.send(products)
}

module.exports = {getStuff}
