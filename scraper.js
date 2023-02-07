const axios = require('axios')
const cheerio = require('cheerio')
const client = require('twilio')(process.env.TWILIO_ACCOUNT_ID, process.env.TWILIO_AUTH_TOKEN)
require('dotenv').config()


const URL =
'https://www.amazon.it/Apple-AirPods-custodia-ricarica-Modello/dp/B07PYMK77Y/ref=zg-bs_473365031_sccl_2/261-6427791-7272257?pd_rd_w=VSHu0&content-id=amzn1.sym.7d60e39f-03ab-4838-8b01-91663b993811&pf_rd_p=7d60e39f-03ab-4838-8b01-91663b993811&pf_rd_r=XMC9MXG6RKAEBXKTX75E&pd_rd_wg=8Jy1n&pd_rd_r=888bbf77-7074-4fc7-a687-b4441f5b6906&pd_rd_i=B07PYMK77Y&psc=1'

const product = {
    name: '',
    price: '',
    link: ''
}

//Set interval 
const handleScraping = setInterval(goScraping, 60000)


async function goScraping() {
    //Fetch data
    const { data } = await axios.get(URL)

    //Load up html
    const $ = cheerio.load(data)
    const item = $('div#dp-container')

    //Extract data needed
    product.name = $(item).find('h1 span#productTitle').text().trim()
    product.link = URL
    const priceString = $(item).find('span.a-price-whole').first().text().replace(/[€,.]/g, '')
    product.price = parseInt(priceString)

    //Send alert via SMS
    if (priceNum < 100) {
        client.messages
            .create({
                body: `The price of ${product.name} went below ${product.price}. Purchase it now at ${product.link}.`,
                from: process.env.SENDER_NUM,
                to: process.env.RECEIVER_NUM,
            })
            .then(message => {
                console.log(message)
                clearInterval(handleScraping)
            })
    }
}


goScraping()