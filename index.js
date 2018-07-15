document.addEventListener('DOMContentLoaded', function () {
    var hostName = chrome.i18n.getMessage('hostname');
    var dataUrl = hostName + 'async/newtab?async=xid:1,_fmt:json&espv=2&yv=1';

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

    var clickHandler = function (event) {
        window.open(this.childNodes[0].href);
        window.close();
    };

    var savedHtml = localStorage.getItem('savedHtml');
    var originHtml = document.documentElement.innerHTML;

    if (savedHtml) {
        document.documentElement.innerHTML = savedHtml;
    }

    request(dataUrl, function () {
        var obj = JSON.parse(this.responseText.slice(4));
        var css = obj.update.og.css;
        var html = obj.update.og.up;

        document.documentElement.innerHTML = originHtml;
        
        if (css) {
            css = css.replace(/'\/\/ssl\.gstatic/g, "'https://ssl.gstatic");
            document.getElementById('loadcss').innerHTML = css;
        }
        
        var tmp = document.createElement('div');
        tmp.innerHTML = html;
        var elements = tmp.getElementsByTagName('li');
        
        if (elements.length) {
            var div = elements[0].parentNode;
            for (var i = 0; i < div.childNodes.length; i++) {
                div.childNodes[i].addEventListener('click', clickHandler);
            }
            document.body.innerHTML = '';
            document.body.appendChild(div);
            localStorage.setItem('savedHtml', document.documentElement.innerHTML);
        } else {
            var msgElement = document.createElement('span');
            msgElement.style['white-space'] = 'nowrap';
            msgElement.innerText = chrome.i18n.getMessage('error_message');
            document.body.appendChild(msgElement);
        }
    });

});
