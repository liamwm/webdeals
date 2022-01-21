const puppeteer = require("puppeteer")

const MAX_PRODS = 20

const getStuff = async (req, res) => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  // const url = 'https://www.jbhifi.com.au/collections/computers-tablets/student-laptops'
  //
  // const products = await fetchProducts(page, url)

  //const url = "https://www.jbhifi.com.au/sitemap_collections_1.xml"
  const url = "https://www.jbhifi.com.au/sitemap_products_1.xml?from=1614257324130&to=1618967593058"
  const products = await crawlSite(page, url)

  res.send(products)
}


const crawlSite = async (page, url) => {
  let urls = []
  let products = []
  const urlIgnore = ["https://www.jbhifi.com.au/"]

  await page.goto(url)
  const pageHandles = await page.$$("url > loc")
  console.log(pageHandles.length)
  for (const pageHandle of pageHandles) {
    const pageUrl = await page.evaluate((page) => page.innerHTML, pageHandle)
    urls.push(pageUrl)
  }

  for (const url of urls.filter(url => !urlIgnore.includes(url))) {
    //const new_prods = await fetchProducts(page, url)
    const new_prods = await fetchProduct(page, url)
    if (new_prods) {products.push(new_prods)}
  }
  return products
}

const fetchProduct = async (page, url) => {
  await page.goto(url);
  console.log(url)

  const nameSelector = "h1[itemprop=name]"
  const pricetagSelector = "meta[itemprop=price]"

  await page.waitForSelector(nameSelector).catch((err) => {
    console.log("Name not found")
  })
  const name = await page.$eval(nameSelector, (el)=>el.innerHTML).catch((err) => {
    console.log("No product found")
  })
  if (name) {console.log(name)}

  await page.waitForSelector(pricetagSelector).catch((err) => {
    console.log("Price not found")
  })
  const pricetag = await page.$eval(pricetagSelector, (el)=>el.content).catch((err) => {
    console.log("No product found")
  })
  if (pricetag) {console.log(pricetag)}
  return {name, pricetag}
}

const fetchProducts = async (page, url) => {
  await page.goto(url);
  console.log(url)
  products = []

  const container_selector = "div.collection-results-loop > div"//"#collection-container > div:nth-child(5) > div.collection-results-loop > div"
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

    //console.log(name, price, link, img)
    products.push({"name": name, "price": price, "link": link, "img": img})
  }

  return products
}

const removeTags = (htmlStr) => {
  return htmlStr.replace(/<[\s\S]+?>/g, "")
}


module.exports = {getStuff}
