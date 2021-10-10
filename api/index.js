// database setup, we use sqlite because it is basic
// for advanced documentation see 
// https://github.com/mapbox/node-sqlite3/wiki
const sqlite3 = require('sqlite3').verbose(); 
const db = new sqlite3.Database('../db/my.db');

// server, we use express because that is the most common package
// for advanced documentation see 
// see https://expressjs.com 
const express = require('express') 
const app = express()
const port = 3000;

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// defineer startpunt voor statische bestanden
app.use(express.static('../web'))

// definieer startpunten voor de API-server
app.get('/api/echo', echoRequest)
app.get('/api/categories', getCategories)
app.get('/api/products', getProducts)
//app.get('/api/products/:id', db.getProductById)
//app.get('/api/products/:id/related', db.getRelatedProductsById)
// our API is not protected...so let's not expose these
// app.post('/api/products', createProduct)
// app.put('/api/products/:id', updateProduct)
// app.delete('/api/products/:id', deleteProduct)
app.post('/api/checkout', checkoutOrder)

// start de server!
app.listen(port, serverIsGestart)

function serverIsGestart() {
  console.log(`De server is opgestart en is bereikbaar op poort ${port}`)
}

// -----------------------
// functies die API requests afhandelen
// -----------------------

// stuurt de variabelen uit het request
// terug naar de browser en in de console
function echoRequest(request, response) {
  response.status(200).send(request.query)
}

function getCategories(request, response) {
  // TODO: change query to make it return categories
  var query = 'SELECT * FROM products ORDER BY id ASC'
  var params = []
  db.all(query, params, stuurZoekResultaat(response))
}

/*
*/
function getProducts(request, response) {
  console.log("getProducts called")
  const category_id = parseInt(request.query.category)
  var query = ''
  var params = []
  if(category_id > 0){
    query = 'SELECT * FROM products WHERE category_id = $1 ORDER BY id ASC'
    params = [category_id]
  } else {
    query = 'SELECT * FROM products ORDER BY id ASC'
    params = []
  }
  db.all(query, params, stuurZoekResultaat(response))
}



/*



const getProductsByIds = (ids, callback) => {
  pool.query(
    'SELECT * FROM products WHERE id = ANY($1::int[])',
    [ids],  // array of query arguments
    function(_err, result) {
      callback(result.rows)
    })
};

const getProductById = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('SELECT * FROM products WHERE id = $1', [id], (error, results) => {
    if (error) {
      console.log(error)
      response.status(500).json("oops")
    } else {
      response.status(200).json(results.rows[0])
    }
  })
}

const getRelatedProductsById = (request, response) => {
  const id = parseInt(request.params.id)
  // TODO: change query to return related products
  // it now return an array with the current products
  pool.query('SELECT * FROM products WHERE id = $1', [id], (error, results) => {
    if (error) {
      console.log(error)
      response.status(500).json("oops")
    } else {
      response.status(200).json(results.rows)
    }
  })
}

const createProduct = (request, response) => {
  const { name, email } = request.body

  pool.query('INSERT INTO products (name, email) VALUES ($1, $2)', [name, email], (error, _results) => {
    if (error) {
      console.log(error)
      response.status(500).json("oops")
    } else {
      response.status(201).json(`Product added with ID: ${result.insertId}`)
    }
  })
}

const updateProduct = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  // Note: query is not correct
  pool.query(
    'UPDATE products SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, _results) => {
      if (error) {
        console.log(error)
        response.status(500).json("oops")
      } else {
        response.status(200).send(`Product modified with ID: ${id}`)
      }
    }
  )
}

const deleteProduct = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM products WHERE id = $1', [id], (error, _results) => {
    if (error) {
      console.log(error)
      response.status(500).json("oops")
    } else {
      response.status(200).send(`Product deleted with ID: ${id}`)
    }
  })
}
*/

// ----------------------------------------------------------------------------
// hulpfuncties voor afhandelen van API requests
// ----------------------------------------------------------------------------

// verwerkt output van een SELECT-query en
// stuurt dat terug met de meegegeven response-parameter
function stuurZoekResultaat(response) {
  function returnFunction (error, data) {
    if (error == null) {    // alles ging goed
      console.log('API heeft resultaat terug gestuurd')
      // console.log(JSON.stringify(data, null, 2))
      response.status(200).send(data)
    }
    else {                  // er trad een fout op bij de database
      console.error(`Fout bij opvragen gegevens:` + error)
      response.status(400).send(error)
    }
  }

  return returnFunction;
}

// ---------------------------------
// checkout and email order
// ---------------------------------

function checkoutOrder(request, response)  {

  var { firstName, lastName, email, phone, articles } = request.body


  articles = articles || []
  if(!Array.isArray(articles)) {
    articles = [ articles ]
  }
  var basket = {}
  articles.forEach( id => {
    basket[id]= request.body[`item_${id}`]
  })

// order id: date + random number
var options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
var today  = new Date();
const orderID = String(today.valueOf())+String(Math.floor(Math.random()*1000))

console.log(today.toLocaleDateString("en-US", options)); 

  db.getProductsByIds(articles, function(rows){
    
    var products = {}
    rows.forEach (p => products[p.id] = p)

    var total = 0;
    for (let id in basket) {
      total += basket[id]*products[id].price
    }
    var articleTable = "<table>"
    articleTable += "<tr><th>Code</th><th>Naam</th><th>Aantal</th><th>Prijs</th></tr>"
    Object.values(products).forEach( p => {
      articleTable += `<tr><td>${p.code}</td><td>${p.name}</td><td>${basket[p.id]}</td><td>€${p.price}</td></tr>`
    })
    articleTable += `<tr><td colspan="3">Totaal</td><td>€${total.toFixed(2)}</td><tr>`
    articleTable += "</table>"

    var body = `<html><body>Hi<br><br>Er is een nieuwe order <b>${orderId}</b> ontvangen van <br><br>\n`+
   `Naam: ${firstName||'-'} ${lastName||'-'}<br>\n`+
   `Email: ${email||'-'}<br>\n`+
   `Telefoon: ${phone||'-'}<br>\n`+
   articleTable +
   `groet,<br><br>\n\nShop Mailer\n</body></html>`

  sendMail('New Order recieved', body)
  // note: mailer is async, so technically it has not been send yet 
  response.status(200).send({orderId})

  })


}

var nodemailer = require('nodemailer');

function mailConfigOK() {
    return process.env.GMAIL_EMAIL !== undefined && 
      process.env.GMAIL_PASSWORD !== undefined &&
      process.env.ORDER_MAIL_TO !== undefined 
}

function sendMail(subject, body) {
  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: process.env.ORDER_MAIL_TO,
    subject: subject,
    html: body
  };

  if(!mailConfigOK()) {
    console.log(`mail not configured properly - dumping mail: ${JSON.stringify(mailOptions)}`)
    return
  } 

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD
    }
  });

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  
} 