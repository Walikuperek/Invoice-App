# InvoiceAppBackend
Node Express REST API for Invoice App 

###### invoices are based on chosen products 
###### upload .xslx format data as moderator &rarr; database update.


## NPM packages

* bcryptjs
* body-parser
* cors
* express
* handlebars
* jsonwebtoken
* multer
* mysql2
* nodemailer
* nodemailer-express-handlebars
* nodemailer-express-handlebars-plaintext-inline-ccs
* nodemailer-handlebars
* pdfkit
* read-excel-file
* sequelize


## REST routes


> AUTH
```
/api/auth/signup                      // signup (POST)
```
```
/api/auth/signin                      // signin (POST)
```


> CHART
```
/api/chart/roczny                     // getAll (GET)
```
```
/api/chart/roczny/create              // createChartRocznyRow (POST)
```


> CHOSEN
```
/api/products/chosen                  // getAll (GET)
```
```
/api/products/chosen/:id/vat/:vat     // updateVatById (POST)
```
```
/api/products/chosen/:id              // getById (GET)
```
```
/api/products/chosen/delete           // deleteAll (DELETE)
```
```
/api/products/chosen/delete/:id       // deleteById (DELETE)
```
```
/api/products/chosen/get/count        // count (GET)
```
```
/api/products/chosen/create           // createChosen (POST)
```


> CLIENT
```
/api/clients                          // getAll (GET)
```
```
/api/clients/id/:id                   // getById (GET)
```
```
/api/clients/search/:word             // search (GET)
```
```
/api/clients/delete/:id               // deleteById (DELETE)
```
```
/api/clients/create                   // createClient (POST)
```


> EXCEL
```
/api/upload                           // upload (POST)(single('file')('.xslx'))
```
```
/api/excel/list                       // getExcelFilesList (GET)
```


> LOG_ACTIONS
```
/api/admin/logs/                      // getAll (GET)
```
```
/api/admin/logs/:important            // getByImportant (GET)
```
```
/api/admin/logs/delete                // deleteAll (GET)
```


> PDF-CHOSEN
```
/api/products/chosen/pdf/create       // createPdfChosensFromJSON (POST)
```


> PDF-LIST
```
/api/products/chosen/pdf/search/:fileName       // download (GET)
```
```
/api/products/chosen/pdf/list                   // getAll (GET)
```
```
/api/products/chosen/pdf/list/create            // createPdfListFromJSON (POST)
```
```
/api/products/chosen/pdf/list/search/:word      // search (GET)
```


> PRODUCT
```
/api/products/                                  // getAll (GET)
```
```
'/api/products/id/:id                           // getById (GET)
```
```
/api/products/search/:word                      // search (GET)
```


> RAPORT-WIDGET
```
/api/raport/widgets                             // getWidgetRaporty (GET)
```


> SELLER
```
/api/sellers/                                   // getAll (GET)
```
```
/api/sellers/id/:id                             // getById (GET)
```
```
/api/sellers/search/:word                       // search (GET)
```
```
/api/sellers/delete/:id                         // deleteById (DELETE)
```
```
/api/sellers/create                             // createSeller (POST)
```


> USER
```
/api/test/all                                   // allAccess (GET)
```
```
/api/test/mod                                   // moderatorBoard (GET)
```
```
/api/test/admin                                 // adminBoard (GET)
```


### Project setup
```
npm install
```

### Run
```
node server.js
```

For more detail, please visit my website:
> [QUAK BLOG](http://quak.com.pl)
