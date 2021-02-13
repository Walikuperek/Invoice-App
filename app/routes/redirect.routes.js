const ENV_MODE = require('../config/environment.config');
module.exports = (app) => {

    const HOST = `your-front-adress`; // no http or .com, etc.
    
    app.get(`/pdf/lista`, (req, res) => {
        res.setHeader(`Access-Control-Allow-Origin`, `${HOST}.pl`);
        res.redirect(`http://${HOST}.pl`);
    });

    app.get(`/produkty`, (req, res) => {
        res.setHeader(`Access-Control-Allow-Origin`, `${HOST}.pl`);
        res.redirect(`http://${HOST}.pl`);
    });

    app.get(`/produkty/wybrane`, (req, res) => {
        res.setHeader(`Access-Control-Allow-Origin`, `${HOST}.pl`);
        res.redirect(`http://${HOST}.pl`);
    });

    app.get(`/produkty/dodaj`, (req, res) => {
        res.setHeader(`Access-Control-Allow-Origin`, `${HOST}.pl`);
        res.redirect(`http://${HOST}.pl`);
    }); 

    app.get(`/api/products`, (req, res) => {
        res.setHeader(`Access-Control-Allow-Origin`, `${HOST}.pl`);
        res.redirect(`http://${HOST}.pl`);
    });

    app.get(`/glowna`, (req, res) => {
        res.setHeader(`Access-Control-Allow-Origin`, `${HOST}.pl`);
        res.redirect(`http://${HOST}.pl`);
    });

    app.get(`/tablica`, (req, res) => {
        res.setHeader(`Access-Control-Allow-Origin`, `${HOST}.pl`);
        res.redirect(`http://${HOST}.pl`);
    });

    app.get(`/profil`, (req, res) => {
        res.setHeader(`Access-Control-Allow-Origin`, `${HOST}.pl`);
        res.redirect(`http://${HOST}.pl`);
    });

    app.get(`/profil/zarejestruj`, (req, res) => {
        res.setHeader(`Access-Control-Allow-Origin`, `${HOST}.pl`);
        res.redirect(`http://${HOST}.pl`);
    });


    app.get(`/upload`, (req, res) => {
        res.setHeader(`Access-Control-Allow-Origin`, `${HOST}.pl`);
        res.redirect(`http://${HOST}.pl`);
    });


    app.get(`/admin`, (req, res) => {
        res.setHeader(`Access-Control-Allow-Origin`, `${HOST}.pl`);
        res.redirect(`http://${HOST}.pl`);
    });

    app.get(`/login`, (req, res) => {
        res.setHeader(`Access-Control-Allow-Origin`, `${HOST}.pl`);
        res.redirect(`http://${HOST}.pl`);
    });

    app.get(`/sprzedawca`, (req, res) => {
        res.setHeader(`Access-Control-Allow-Origin`, `${HOST}.pl`);
        res.redirect(`http://${HOST}.pl`);
    });

    app.get(`/klient`, (req, res) => {
        res.setHeader(`Access-Control-Allow-Origin`, `${HOST}.pl`);
        res.redirect(`http://${HOST}.pl`);
    });

}
