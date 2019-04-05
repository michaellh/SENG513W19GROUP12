module.exports = {
    startListening: function (http) {
        let port = process.env.PORT;
        if(port == null || port == "") {
            port = 3000;
        }
        http.listen(port);
        console.log('Listening on Port ' + port);
    }
}
