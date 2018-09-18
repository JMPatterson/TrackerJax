var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('mobileinit', this.onMobileInit, false);
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onMobileInit: function() {
        $.mobile.defaultPageTransition = 'none';
        $.mobile.allowCrossDomainPages = true;
        $.support.cors = true;
        $.mobile.phonegapNavigationEnabled = true;
        $.mobile.linkBindingEnabled = true;
    },

    onDeviceReady: function() {
        app.getUsers();
        app.getTeams();
        app.getGoals();
        app.getEvents();
        //app.getStormPath();
        app.receivedEvent('deviceready');
    },

    // Get User Data
    getUsers: function() {
        console.log('getUsers');
        $.ajax({
            url: 'https://api.mongolab.com/api/1/databases/tracker/collections/users?apiKey=uP1dePymB9yxvoNiWduYysMxtUoch0TY',
            type: 'GET',
            contentType: "application/json",
            data: {},
            success: function(data) {
                $('#dbError').addClass('hidden');
                if (data.length > 0) {
                    var ulHTML = '';
                    for (var i = data.length - 1; i >= 0; i--) {
                        ulHTML += '<div class="col-xs-12 well well-sm user">';
                        ulHTML += '<h3>User</h3>';
                        ulHTML += '<p>ID: ' + data[i]._id.$oid + '</p>';
                        ulHTML += '<p>Name: ' + data[i].firstname + ' ' + data[i].lastname + '</p>';
                        ulHTML += '<p>Email: ' + data[i].email + '</p>';
                        if (data[i].teams.length > 0) {
                            var teams = data[i].teams;
                            for (var ii = teams.length - 1; ii >= 0; ii--) {
                                ulHTML += '<p>Team ID: ' + teams[ii].team_id + '<br />Status: ' + teams[ii].subscribe_status + '</p>';
                            };
                        }
                        ulHTML += '</div>';
                    };
                } else {
                    var ulHTML = '<p>No Users Found.</p>';
                }
                $('#dbUsers').html(ulHTML);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('error= ', textStatus);
                $('#dbError').removeClass('hidden');
                $('#dbError').text(textStatus);
            }
        });
    },

    // Get Team Data
    getTeams: function() {
        console.log('getUsers');
        $.ajax({
            url: 'https://api.mongolab.com/api/1/databases/tracker/collections/teams?apiKey=uP1dePymB9yxvoNiWduYysMxtUoch0TY',
            type: 'GET',
            contentType: "application/json",
            data: {},
            success: function(data) {
                $('#dbError').addClass('hidden');
                if (data.length > 0) {
                    var tHTML = '';
                    for (var i = data.length - 1; i >= 0; i--) {
                        tHTML += '<div class="col-xs-12 team well well-sm">';
                        tHTML += '<h3>Teams</h3>';
                        tHTML += '<p>ID: ' + data[i]._id.$oid + '</p>';
                        tHTML += '<p>Name: ' + data[i].team + '<br />' + data[i].desc + '</p>';
                        tHTML += '<p>Access Level: ' + data[i].access + '</p>';
                        tHTML += '<p>Access Code: ' + data[i].code + '</p>';
                        tHTML += '<p>Owner ID: ' + data[i].owner_id + '</p>';
                        tHTML += '</div>';
                    };
                } else {
                    var tHTML = '<p>No Users Found.</p>';
                }
                $('#dbTeams').html(tHTML);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('error= ', textStatus);
                $('#dbError').removeClass('hidden');
                $('#dbError').text(textStatus);
            }
        });
    },

    // Get Goal Data
    getGoals: function() {
        console.log('getGoals');
        $.ajax({
            url: 'https://api.mongolab.com/api/1/databases/tracker/collections/goals?apiKey=uP1dePymB9yxvoNiWduYysMxtUoch0TY',
            type: 'GET',
            contentType: "application/json",
            data: {},
            success: function(data) {
                $('#dbError').addClass('hidden');
                if (data.length > 0) {
                    var gHTML = '';
                    for (var j = data.length - 1; j >= 0; j--) {
                        var targetUnit = (data[j].targetUnit) ? ' ' + data[j].targetUnit : '';
                        gHTML += '<div class="col-xs-12 goal well well-sm" data-goal="' + data[j]._id.$oid + '">';
                        gHTML += '<h3>Goal</h3>';
                        gHTML += '<p>ID: ' + data[j]._id.$oid + '</p>';
                        gHTML += '<p>Name: ' + data[j].name + '</p>';
                        gHTML += '<p>Target: <span class="completeEvents">0</span> / ' + numeral(data[j].target).format('0,0') + targetUnit + '</p>';
                        gHTML += '<p>End Date: ' + data[j].endDate + '</p>';
                        gHTML += '</div>';
                    };
                } else {
                    var gHTML = '<p>No Goals Found.</p>';
                }
                $('#dbGoals').html(gHTML);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('error= ', textStatus);
                $('#dbError').removeClass('hidden');
                $('#dbError').text(textStatus);
            }
        }); 
    },

    // Get Goal Data
    getEvents: function() {
        console.log('getEvents');
        $.ajax({
            url: 'https://api.mongolab.com/api/1/databases/tracker/collections/events?apiKey=uP1dePymB9yxvoNiWduYysMxtUoch0TY',
            type: 'GET',
            contentType: "application/json",
            data: {},
            success: function(data) {
                $('#dbError').addClass('hidden');
                if (data.length > 0) {
                    var complete = {};
                    for (var k = 0, count = data.length; k < count; k++) {
                        var completeValue = parseInt(data[k].value);
                        if (!complete[data[k].goal_id]) complete[data[k].goal_id] = 0;
                        complete[data[k].goal_id] = (!isNaN(completeValue)) ? complete[data[k].goal_id] += completeValue : complete[data[k].goal_id];
                    };

                    for (goal in complete) {
                        $('div[data-goal="' + goal + '"]').children('p').children('span.completeEvents').text(numeral(complete[goal]).format('0,0'));
                    }

                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('error= ', textStatus);
                $('#dbError').removeClass('hidden');
                $('#dbError').text(textStatus);
            }
        }); 
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

$('#regForm').submit(function(event) {
    event.preventDefault();
    //console.info('event= ', event);

    var firstName = $('#regFName').val();
    var lastName = $('#regLName').val();
    var email = $('#regEmail').val();
    var pass = $('#regPass').val();
    var validEmail = validate(email, 'email');
    var validPass = validate(pass, 'password');
    //alert('validEmail: ' + validEmail + '\n' + 'validPass: ' + validPass);

    var validForm = true;
    if (firstName == '') {
        $('#regFNameAlert').removeClass('hidden');
        $('#regFName').parent('div').addClass('has-warning');
        validForm = false;
    } else {
        $('#regFNameAlert').addClass('hidden');
        $('#regFName').parent('div').removeClass('has-warning');
    }

    if (lastName == '') {
        $('#regLNameAlert').removeClass('hidden');
        $('#regLName').parent('div').addClass('has-warning');
        validForm = false;
    } else {
        $('#regLNameAlert').addClass('hidden');
        $('#regLName').parent('div').removeClass('has-warning');
    }

    if (!validEmail) {
        $('#regEmailAlert').removeClass('hidden');
        $('#regEmail').parent('div').addClass('has-warning');
        validForm = false;
    } else {
        $('#regEmailAlert').addClass('hidden');
        $('#regEmail').parent('div').removeClass('has-warning');
    }

    if (!validPass) {
        $('#regPassAlert').removeClass('hidden');
        $('#regPass').parent('div').addClass('has-warning');
        validForm = false;
    } else {
        $('#regPassAlert').addClass('hidden');
        $('#regPass').parent('div').removeClass('has-warning');
    }

    if (!validForm) return;

    var apiKey = 'WTD93WSEXL2QB2DKNCHEUMFFX';
    var apiSecret = '/yYATDxGEnUY80eMf1ycrXO8LsKtJeYcJ8YPSVqATdY';
    var apiAuth = apiKey.concat(':', apiSecret);

   $.ajax({
        url: 'https://api.stormpath.com/v1/applications/6XGREo2vmOAsO0DZEROlBI/accounts',
        headers: {
            'Authorization': 'Basic ' + apiAuth,
            'content-type': 'application/x-www-form-urlencoded'
        },
        dataType: 'jsonp',
        type: 'POST',
        data: {
            'givenName': firstName,
            'surname': lastName,
            'email': email,
            'password': pass
        },
        success: function(data, status, jqXHR) {
            console.info("success", data, 'status= ', status, 'jqXHR', jqXHR);
        },
        error: function(jqXHR, status, error){
            console.info('POST-register request failed= ', error, 'status= ', status, 'jqXHR= ', jqXHR);
        }
    });

});

function validate(val, type) {
    var emailRE = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var passRE = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    if (type == 'email') return emailRE.test(val);
    if (type == 'password') return passRE.test(val);
}

$(document).ready(function() {

    $.support.cors = true;

    // Get Stormpath info
    // StormPath
    // API Key ID: WTD93WSEXL2QB2DKNCHEUMFFX
    // API Key Secret: /yYATDxGEnUY80eMf1ycrXO8LsKtJeYcJ8YPSVqATdY

    /*var apiKey = 'WTD93WSEXL2QB2DKNCHEUMFFX';
    var apiSecret = '/yYATDxGEnUY80eMf1ycrXO8LsKtJeYcJ8YPSVqATdY';
    var toEncode = apiKey.concat(':', apiSecret);

    $('.stormpath').html('getting stormpath data');
    //var url = "https://status.github.com/api/status.json?callback=apiStatus";
    var url = 'https://api.stormpath.com/v1/applications/6XGREo2vmOAsO0DZEROlBI';

    $.ajax({
        url: url,
        success: function(data, status, jqXHR) {
            //var dataObj = JSON.parse(data)
            console.info("getStormPath success", data, 'status= ', status, 'jqXHR', jqXHR);
            $('.stormpath').html('success' + JSON.stringify(data));
        },
        error: function(jqXHR, status, error){
            console.info('getStormPath error= ', error, 'status= ', status, 'jqXHR= ', jqXHR);
            $('.stormpath').html('error' + JSON.stringify(jqXHR));
        }
    });*/
});