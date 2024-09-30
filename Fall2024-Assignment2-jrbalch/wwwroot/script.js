var timeEnabled = false;
var timeInterval;

$(document).ready(function () {
    $('#timeButton').on('click', function () {
        console.log("Time button clicked");  // Debugging log

        if (!timeEnabled) {
            timeEnabled = !timeEnabled;
            getTime(); // Initial time update

            // Set an interval to update time every second
            timeInterval = setInterval(getTime, 1000);
        }
    });

    $('#searchButton').on('click', function () {
        console.log('Search Button clicked')
        apiSearch();
    });
});

function getTime() {
    console.log('Time Accessed')
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var AMPM = 'AM'

    // Format the time to HH:MM:SS
    if (hours < 10) hours = '0' + hours;
    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;
    if (hours > 12) {
        hours = hours - 12;
        AMPM = 'PM';
    }

    var currentTime = hours + ':' + minutes + ':' + seconds + ' ' + AMPM;

    // Update the correct div for displaying time
    document.getElementById('timeDiv').innerHTML = currentTime;
}

function apiSearch() {
    var params = {
        'q': $('#apiSearch').val(),
        'count': 50,
        'offset': 0,
        'mkt': 'en-us'
    };

    $.ajax({
        url: 'https://api.bing.microsoft.com/v7.0/search?' + $.param(params),  // Ensure correct API URL
        type: 'GET',
        headers: {
            'Ocp-Apim-Subscription-Key': 'fddf265d9a8349cf8d1bc8442dfff5a3'
        }
    })
        .done(function (data) {
            var len = data.webPages.value.length;
            var results = '';
            for (var i = 0; i < len; i++) {
                results += `<p><a href="${data.webPages.value[i].url}">${data.webPages.value[i].name}</a>: ${data.webPages.value[i].snippet}</p>`;
            }

            $('#searchResults').html(results);
            //console.log(results);
        })
        .fail(function () {
            alert('error');
        });
}
