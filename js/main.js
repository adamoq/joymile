$(document).ready(function() {

    var url = 'https://restcountries.eu/rest/v2/name/';
    createStartList();

    $("#search").on('change', function(e) {
        $('.loader').show();
        clearList();
        var searchValue = $(this).val();
        if (!searchValue) createStartList();
        else {
            var failure = true;
            $.getJSON(url + searchValue, {
                get_param: 'object'
            }, function(data) {
                failure = false;
                $.each(data, function(index, country) {
                    createListElement(country.name, createAttributestList(country.languages), createAttributestList(country.currencies), country.capital, country.timezones, country.latlng[0], country.latlng[1]);

                });

            });

            setTimeout(
                function() {
                    if (failure) showError();
                    $('.loader').hide();
                }, 1500);

        };

    });

    $("#filter").on('change', function() {
        var val = this.value;
        switch (val) {
            case '0':
                url = 'https://restcountries.eu/rest/v2/name/';
                break;
            case '1':
                url = 'https://restcountries.eu/rest/v2/name/';
                break;
            case '2':
                url = 'https://restcountries.eu/rest/v2/currency/';
                break;
            case '3':
                url = 'https://restcountries.eu/rest/v2/alpha/';
                break;
            case '4':
                url = 'https://restcountries.eu/rest/v2/capital/';
                break;
            case '5':
                url = 'https://restcountries.eu/rest/v2/callingcode/';
                break;

        }

    });

    function createListElement(name, lang, currency, capital, timezone, lat, lng) {
        $('.search-results').append(createListNode(name, capital, currency, lang, timezone, lat, lng));
        $('.modals').append(createModal(name, timezone, lat, lng));


    }
//lista atrybutów, które sie powielaja
    function createAttributestList($element) {
        var list = "";
        $.each($element, function(arrayID, group) {
            list += $element[0].name + ",";
        });
        return list;

    };
//lista dla stref czasowych
    function createTimezoneList($element) {
        var list = "";
        $.each($element, function(arrayID, group) {
            list += $element[0] + ","
        });
        return list;
    };
//zwraca aktualny czas dla danej strefy czasowej podanej jako "+03.0"
    function calcTime(offset) {

        var d = new Date();
        var utc = d.getTime() - (d.getTimezoneOffset() * 60000);
        var nd = new Date(utc + (3600000 * offset));
        return nd.toLocaleString();
    }
//zwraca stringa, wyświetlanego w modalu
    function getTimeList(element) {
        var list = "";
        $.each(element, function(arrayID, group) {
            element[0] = element[0].replace(':', '.');
            list += "<p>Dla strefy czasowej " + element[0] + " jest godzina " + calcTime(element[0].substr(3, 6)) + ",</p>"
        });
        return list;


    }

    function clearList() {
        $('.search-results').empty();
    }

    function showError() {

        $('.search-results').append("<p>Brak zapytań w bazie</p>");
    }


//tworzy listę początkową (bez wyszukiwań)
    function createStartList() {
        $('.loader').show();

        $.getJSON('https://restcountries.eu/rest/v2/all', {
            get_param: 'object'
        }, function(data) {
            $.each(data, function(index, country) {
                createListElement(country.name, createAttributestList(country.languages), createAttributestList(country.currencies), country.capital, country.timezones, country.latlng[0], country.latlng[1]);

            });
        });
        $('.loader').hide();
    }
//renderuje modal
    function createModal(name, timezone, lat, lng) {
        return "<div class='modal fade' id='modal" + name + "' role='dialog'> <div class='modal-dialog' role='document'><div class='modal-content'> <div class='modal-header'> <h5 class='modal-title'>Dane państwa " + name + "</h5> <button type='button' class='close' data-dismiss='modal' aria-label='Close'>" +
            "<span aria-hidden='true'>&times;</span>   </button>     </div>      <div class='modal-body'>" + getTimeList(timezone) +
            "<div id='map" + name + "' class='map'></div>" +
            "</div>      <div class='modal-footer'>        <button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>         </div>    </div>  </div></div>";
    }
//renderuje element listy
    function createListNode(name, capital, currency, lang, timezone, lat, lng) {
        return "<div class='item' data-toggle='modal' onclick='initMap('#map" + name + "', " + lat + ", " + lng + "))' data-target='#modal" + name + "'><h3>" + name + "</h3><p>Capital:" + capital + "</p><p>Currency:" + currency + "</p><p>Languages:" + lang + "</p><p>Timezones:" + createTimezoneList(timezone) + "</p><p>" + "</div>";

    }


})
