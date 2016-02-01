(function () {
    var nav = {
        navItems: null,

        getNavItems: function getNavItems() {
            var currentScope = this;
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState === 4 && xhttp.status === 200) {
                    currentScope.navItems = JSON.parse(xhttp.response);
                    currentScope.insertElementsToView();
                }
            };
            xhttp.open('GET', '/api/nav.json', true);
            xhttp.send();
        },

        insertElementsToView: function insertElementsToView() {
            var currentScope = this;
            var nav = document.getElementsByTagName('nav')[0];
            var ul = document.createElement('ul');
            var p = document.createElement('p');
            this.navItems.items.forEach(function (element) {
                if (element.items.length > 0) {
                    var li = currentScope.createListItem(element.label, element.url);
                    var subList = document.createElement('ul');
                    var span = document.createElement('span');
                    span.setAttribute('class', 'chevron bottom');
                    li.setAttribute('data-sub-menu', true);
                    li.appendChild(span);
                    element.items.forEach(function (element) {
                        subList.appendChild(currentScope.createListItem(element.label, element.url));
                        li.appendChild(subList);
                    });
                    ul.appendChild(li);
                } else {
                    ul.appendChild(currentScope.createListItem(element.label, element.url));
                }
            });
            p.textContent = '© 2014 Huge. All Rights Reserved.';
            nav.appendChild(ul);
            nav.appendChild(p);
            this.setEvents();
        },

        createListItem: function createListItem(label, url) {
            var li = document.createElement('li');
            var anchore = document.createElement('a');
            anchore.innerHTML = label;
            anchore.href = url;
            li.setAttribute('class', 'backgroundGray');
            li.appendChild(anchore);
            return li;
        },

        setEvents: function setEvents() {
            this.setEventToImg();
            this.setEventToMenu();
            this.setEventToblocker();
        },

        setEventToImg: function setEventToImg() {
            var imgs = document.getElementsByTagName('img');
            for (var i = 0; imgs.length > i; i++) {
                if (imgs[i].getAttribute('alt') === 'hamburger' ||
                    imgs[i].getAttribute('alt') === 'close') {
                    imgs[i].addEventListener('click', this.toggleClassToNavAndContainer);
                }
            }
        },

        setEventToMenu: function setEventToMenu() {
            var lis = document.getElementsByTagName('li');
            for (var i = 0; lis.length > i; i++) {
                if (lis[i].getAttribute('data-sub-menu') === 'true') {
                    lis[i].addEventListener('click', this.toggleClassSubMenu);
                }
            }
        },
        setEventToblocker: function setEventToblocker() {
            document.getElementsByClassName('blocker')[0].addEventListener('click', this.closeAll);
        },

        closeAll: function closeAll() {
            var lis = document.getElementsByTagName('li');
            var imgs = document.getElementsByTagName('img');
            for (var i = 0; lis.length > i; i++) {
                if (lis[i].getAttribute('data-sub-menu') === 'true' &&
                    lis[i].getAttribute('class') === 'backgroundGray menuActiveSubSection') {
                    lis[i].setAttribute('class', 'backgroundGray');
                }
            }
            for (var i = 0; imgs.length > i; i++) {
                if (imgs[i].getAttribute('alt') === 'close') {
                    imgs[i].click();
                }
            }
        },

        toggleClassSubMenu: function toggleClassSubMenu(event) {
            if (event.target.className === 'backgroundGray') {
                event.target.setAttribute('class', 'backgroundGray menuActiveSubSection');
            } else if (event.target.className === 'chevron bottom') {
                toggleClassSubMenu({
                    target: event.target.parentElement
                });
            } else {
                event.target.setAttribute('class', 'backgroundGray');
            }
        },

        toggleClassToNavAndContainer: function () {
            var nav = document.getElementsByTagName('nav')[0];
            var container = document.getElementsByClassName('container')[0];
            if (nav.getAttribute('class') !== 'null') {
                nav.setAttribute('class', null);
                var lis = document.getElementsByTagName('li');
                container.setAttribute('class', 'container containerAfter');
                for (var i = 0; lis.length > i; i++) {
                    if (lis[i].getAttribute('data-sub-menu') === 'true' &&
                        lis[i].getAttribute('class') === 'backgroundGray menuActiveSubSection') {
                        lis[i].setAttribute('class', 'backgroundGray');
                    }
                }
            } else {
                nav.setAttribute('class', 'menuActive');
                container.setAttribute('class', 'container menuActiveContainer');
            }
            nav = container = null;
        },

        initialize: function initialize() {
            this.getNavItems();
        }
    };

    nav.initialize();
})();