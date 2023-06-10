const fs = require('fs');
const http = require('http');
const url = require('url');

/////////////////////////
///SERVER
const replaceTemplate = (temp, product) =>{
let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
output = output.replace(/{%IMAGE%}/g, product.image);
output = output.replace(/{%PRICE%}/g, product.price);
output = output.replace(/{%FROM%}/g, product.from);
output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
output = output.replace(/{%QUANTITY%}/g, product.quantity);
output = output.replace(/{%DESCRIPTION%}/g, product.description);
output = output.replace(/{%ID%}/g, product.id);

if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic'); 
return output;
}


const template_Overview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8'); 
const template_Product = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8'); 
const template_Card = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8'); 

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'); 
const dataObj = JSON.parse(data);


const server = http.createServer((req, res) =>{
   
    const {query, pathname} = url.parse(req.url, true)
    // const pathname = req.url;



    // OVERVIEW PAGE
    if (pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {'Content-type' : 'text/html'});

        const cardHtml = dataObj.map(elem => replaceTemplate(template_Card, elem)).join('');
    //    console. log(cardHtml);  
       const output = template_Overview.replace('{%PRODUCT_CARDS%}', cardHtml);
       res.end(output);
        
    }
    
     // PRODUCT PAGE
    else if(pathname === '/product'){
          

        res.writeHead(200, {'Content-type' : 'text/html'});
        const product = dataObj[query.id];
    //   
        const output = replaceTemplate(template_Product, product);
        res.end(output);
    }

    else if (pathname === '/api'){
        res.writeHead(200, {'Content-type' : 'application/json'});
        res.end(data);

    }
    // NOT FOUND PAGE
    else {
        res.writeHead(404,);

    res.end('Page not found');
    };
});

server.listen(8000, '127.0.0.1', () => {
    console.log('listening to request on port 8000');
});


