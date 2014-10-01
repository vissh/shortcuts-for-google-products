(function () {
    var dataUrl = 'https://www.google.com/async/newtab';

    var request = function (url, callback) {
        var statechange = function () {
            if (this.readyState == 4) {
                callback.call(this);
            }
        };

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = statechange;
        xhr.send();
    };

    var clickHandler = function () {
        window.open(this.childNodes[0].href);
    };

    request(dataUrl, function () {
        var obj = JSON.parse(this.responseText.slice(4));
        var strCss = obj.update.og.css.replace(/\/\/ssl.gstatic./g, 'https://ssl.gstatic.');
        document.getElementById('loadcss').innerHTML = strCss;
        
        var tmp = document.createElement('div');
        tmp.innerHTML = obj.update.og.html;
        var elements = tmp.getElementsByTagName('li');
        var div = elements[0].parentNode;
        for (var i = 0; i < div.childNodes.length; i++) {
            div.childNodes[i].addEventListener('click', clickHandler);
        }
        document.body.appendChild(div);
    });

})();