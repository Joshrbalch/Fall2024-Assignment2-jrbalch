var timeEnabled = false;
var timeInterval;
var whichTurtle = 0;

$(document).ready(function () {
    $('#timeButton').on('click', function () {
        console.log("Time button clicked");  // Debugging log
        getTime();
        if (!timeEnabled) {
            timeEnabled = !timeEnabled;
            getTime(); // Initial time update

            // Set an interval to update time every second
            timeInterval = setInterval(getTime, 1000);
        }
    });

    $('#searchButton').on('click', function () {
        console.log('Search Button clicked')
        apiSearch(false);
    });

    $('#feelinLuckyButton').on('click', function () {
        console.log('FEEEEEEL THE LUCK')
        apiSearch(true);
    })
    $('#imageSearchButton').on('click', function () {
        console.log('Looking for images')
        apiImageSearch();
    })
});

function changeBackgroundImage() {
    if (whichTurtle == 0) {
        whichTurtle = 1;
        document.body.style.backgroundImage = "url('/turtle2.jpg')"
    }

    else {
        whichTurtle = 0;
        document.body.style.backgroundImage = "url('/turtle.jpg')"
    }
}

document.getElementById("searchEngineName").addEventListener("click", changeBackgroundImage);

function getTime() {
    console.log('Time Accessed');

    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var AMPM = 'AM';

    // Add leading zero if needed
    if (minutes < 10) minutes = '0' + minutes;

    // Convert to 12-hour format and adjust AM/PM
    if (hours >= 12) {
        AMPM = 'PM';
        if (hours > 12) hours = hours - 12;
    } else if (hours === 0) {
        hours = 12;
    }

    // Format time as HH:MM AM/PM
    var currentTime = hours + ':' + minutes + ' ' + AMPM;

    // Update the div with the current time
    $('#timeDiv').html(currentTime);

    // Check if the dialog is already initialized
        // If not, initialize it
    $('#timeDiv').dialog({
            title: "Turtle Time",
        close: function () {
            $(this).dialog("close");
            clearInterval(timeInterval);
            timeEnabled = false;
        }

        });
    $('#timeDiv').dialog('open');
}

function apiSearch(feelingLucky) {
    var params = {
        'q': $('#query').val(),
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
            var luckyWinner = data.webPages.value[0];
            var results = '';

            if (feelingLucky) {
                window.location.href = luckyWinner.url;
            }

            else {
                for (var i = 0; i < len; i++) {
                    results += `<p><a href="${data.webPages.value[i].url}">${data.webPages.value[i].name}</a>: ${data.webPages.value[i].snippet}</p>`;
                }

                $('#searchResults').html(results);
                //console.log(results);
            }
        })
        .fail(function () {
            alert('error');
        });
}

function apiImageSearch() {
    var params = {
        'q': $('#query').val(), // Gets the search query from an input field with id 'query'
        'count': 50,            // Number of images to return
        'offset': 0,            // Start at the first image
        'mkt': 'en-us'          // Locale for the search results
    };

    $.ajax({
        url: 'https://api.bing.microsoft.com/v7.0/images/search?' + $.param(params),
        type: 'GET',
        headers: {
            'Ocp-Apim-Subscription-Key': 'fddf265d9a8349cf8d1bc8442dfff5a3'  // Your API key
        }
    })
        .done(function (data) {
            console.log(data);  // Log the data for debugging
            var len = data.value.length;
            var results = '';

            // Loop through each image result
            for (var i = 0; i < len; i++) {
                var imageUrl = data.value[i].contentUrl;     // Get the URL of the image
                var pageUrl = data.value[i].hostPageUrl;     // Get the URL of the page hosting the image

                // Wrap the image in an anchor tag
                results += `<a href="${pageUrl}" target="_blank">
                          <img src="${imageUrl}" alt="Image result ${i + 1}" style="width: 200px; margin: 10px;">
                        </a>`;
            }

            // Insert the images with anchors into the 'searchResults' element
            $('#searchResults').html(results);
        })
        .fail(function () {
            alert('Error occurred while fetching image search results');
        });
}


