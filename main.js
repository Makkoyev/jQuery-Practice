console.log(window);

let exchangeLink = 'https://currency-exchange.p.rapidapi.com/exchange';
let listQuotesLink = 'https://currency-exchange.p.rapidapi.com/listquotes';

$(document).ready(() => {
    let buttonEl = $('#exchangeButton');
    let fromEl = $('#convertFrom');
    let toEl = $('#convertTo');
    let exchangeEl = $('#exchangeValue');


    makeRequest(listQuotesLink, createSelector);
    // Listen for the button click, and make a request on the server
    buttonEl.on('click', () => {
        let q = exchangeEl.val();
        let from = fromEl.val();
        let to = toEl.val();
        makeRequest(`${exchangeLink}?q=${q}&from=${from}&to=${to}`, makeExchange);
    })
    // Detect keypress ENTER and check if it contains value to fire the function
    exchangeEl.keypress((e) => {
        if(e.keyCode == 13 && exchangeEl.val().length > 0 && fromEl.val() !== toEl.val()){
            let q = exchangeEl.val();
            let from = fromEl.val();
            let to = toEl.val();
            makeRequest(`${exchangeLink}?q=${q}&from=${from}&to=${to}`, makeExchange);
        }
    })
    // When the window is ready, disable the button if the values are equal
    if(fromEl.val() === toEl.val()){
        buttonEl.prop('disabled', true) 
    } else {
        buttonEl.prop('disabled', false)
    }
    // Listen for the selects, and siable the button if the values are eqaul
    $('select').on('change', () => {
        if(fromEl.val() === toEl.val()) {
            buttonEl.prop('disabled', true) 
        } else {
            if(!exchangeEl.val()){
                buttonEl.prop('disabled', true)
            } else {
                buttonEl.prop('disabled', false)
            }
        }
    })
    exchangeEl.on('input', () => {
        if(!exchangeEl.val() || fromEl.val() === toEl.val()){
            buttonEl.prop('disabled', true)
        } else {
            buttonEl.prop('disabled', false)
        }
    })
    

    $(document).on()
    
})
// Make request function, passing url and another function
let makeRequest = (url, toDo) => {
    $.ajax({
        method: "GET",
        statusCode: {
            200: ( ) => {
                console.log('Response is 200')
            },
            404: ( ) => {
                console.log('Response is 404')
            }
        },
        url: url,
        headers: {
            "x-rapidapi-host": "currency-exchange.p.rapidapi.com",
            "x-rapidapi-key": "bc2f4cc09dmshd939f833be5199ap1b0562jsn8fb4893d08a4"
        }
    }).done((result) => {
        const json = JSON.parse(result)
        toDo(json);
    }).fail((error) => {
        console.log(error);
    })
}
// Make exchange function, editing HTML content with the result
function makeExchange(json) {
    let q = $('#exchangeValue').val();
    let to = $('#convertTo').val();
    console.log(json * q);
    $('.exchangeResult').html(`<span class="value">${(json * q).toFixed(2)} ${to}</span> <img class="flag" src="https://www.countryflags.io/${to.substring(0,2)}/flat/32.png">`);
}
// Create selectors on document ready
function createSelector(json) {
    $.each(json, (index, element) => {
        $('#convertFrom').append(`<option value=${element}>${index + 1} - ${element}</option>`);
        $('#convertTo').append(`<option value=${element}>${index + 1} - ${element}</option>`);
    })
};
