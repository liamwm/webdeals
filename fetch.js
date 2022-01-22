const puppeteer = require("puppeteer")

const MAX_PRODS = 5

const getStuff = async (req, res) => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  // const url = 'https://www.jbhifi.com.au/collections/computers-tablets/student-laptops'
  //
  // const products = await fetchProducts(page, url)

  //const url = "https://www.jbhifi.com.au/sitemap_collections_1.xml"
  const url = "https://www.jbhifi.com.au/sitemap_products_1.xml?from=1614257324130&to=1618968379490"
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

  //for (const url of urls.filter(url => !urlIgnore.includes(url))) {
  i = 0
  const toCrawl = urls.filter(url => !urlIgnore.includes(url))
  while (products.length < MAX_PRODS) {
    //const new_prods = await fetchProducts(page, url)
    const new_prods = await fetchProduct(page, toCrawl[i++])
    if (new_prods) {products.push(new_prods)}
    console.log("")
  }
  return products
}

const fetchProduct = async (page, url) => {
  await page.goto(url);
  console.log(url)

  const nameSelector = "h1[itemprop=name]"
  const priceSelector = "meta[itemprop=price]"
  const imgSelector = "img"

  const name = await fetchAttribute(page, nameSelector, (el)=>el.innerHTML)
  const price = await fetchAttribute(page, priceSelector, (el)=>el.content)
  const img = await fetchAttribute(page, imgSelector, (el)=>el.src)

  return {"name": name, "price": price, "img": img, "url": url}
}

const removeTags = (htmlStr) => {
  return htmlStr.replace(/<[\s\S]+?>/g, "")
}

const fetchAttribute = async (page, selector, pageFunction) => {
  // Wait for page to load desired element
  await page.waitForSelector(selector).catch((err) => {
    console.log("Selector " + selector + " not found")
  })
  // Retrieve the desired info from element
  const attr = await page.$eval(selector, pageFunction).catch((err) => {
    console.log("No value retrieved for selector " + selector)
  })

  if (attr) {console.log(attr)}
  return attr
}


module.exports = {getStuff}
