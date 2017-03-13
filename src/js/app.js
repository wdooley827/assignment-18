//HELPER function
var forEach = function(arr, func){
    for(var i = 0 ; i < arr.length; i++){
        func(arr[i], i, arr)
    }
}

//IMPORTS
import $ from 'jquery';

//FETCHING API

var pageContent = document.querySelector('.page_content')

var tabsContainer = document.querySelector('.tabcontent__list')

// render the tab
function renderActiveTab(theCurrentRoute){
	var previousTab = document.querySelector('[class="tabcontent__tab active"]')
	previousTab.classList.remove('active')

	var currentTab = document.querySelector(`[data-route="${theCurrentRoute}"]`)
	currentTab.classList.add('active')
}

// render content on tab
function renderContent(domEl, theRoute, theContent){

	if(theRoute === ''){
		 var homeDiv = `<div class="row home">
		 <h1>The Basic Facts</h1>
		 <table class="table">
		 <thead>
		 </thead>
		 <tbody>
		 	<tr>
				<td>Native Name</td>
				<td>Island</td>
			</tr>

			<tr>
				<td>Demonym</td>
				<td>Icelander</td>
			</tr>

			<tr>
				<td>Area (m2)</td>
				<td>103000</td>
			</tr>
			<tr>
				<td>Calling Code</td>
				<td>352</td>
			</tr>
			</tbody>
			</div>`
		}
	domEl.innerHTML = homeDiv

	if( theRoute === 'concerts' ){
		$.getJSON('http://apis.is/concerts').then(function(serverRes){
			// console.log(serverRes)

			var concertObjectList = serverRes.results

			var concertDiv = '<div class="row"><h1>Concerts</h1>'

			forEach(concertObjectList, function(concertObj){
				var imageConcert = concertObj.imageSource
				var nameConcert = concertObj.userGroupName
				var venueConcert = concertObj.eventHallName
				var dateConcert = concertObj.dateOfShow

				concertDiv += '<div class="col-xs-4 concerts">'
				concertDiv += '<img src=' + imageConcert + '>'
				concertDiv += '<h2>' + nameConcert + '</h2>'
				concertDiv += '<span>Venue:</span>' + ' ' + '<b>' + venueConcert + '<b>' + '</h5>'
				concertDiv += '<p>' + dateConcert + '</p>'
				concertDiv += '</div>'

			})
			concertDiv += '</div>'
			domEl.innerHTML = concertDiv
		})
	}
	if( theRoute === 'carpools' ){
		$.getJSON('http://apis.is/rides/samferda-drivers/').then(function(serverRes){

			var ridesObjectList = serverRes.results
			var rideDiv = `
			<div class="row carpools">
			<h1>Carpools</h1>
			<table class="table">
			<thead>
				<th>Time of Departure</th>
				<th>From</th>
				<th>To</th>
			</thead>
			<tbody>`

			forEach(ridesObjectList, function(rideObj){
				var timeRide = rideObj.time
				var fromRide = rideObj.from
				var toRide = rideObj.to

				rideDiv += '<tr>'
				rideDiv += '<td>' + timeRide + '</td>'
				rideDiv += '<td>' + fromRide + '</td>'
				rideDiv += '<td>' + toRide + '</td>'
				rideDiv += '</tr>'
			})
			rideDiv += '</tbody>'
			rideDiv += '</div>'
			domEl.innerHTML = rideDiv
		})

	}

	if( theRoute === 'flights' ){
	function buildFlightTemplate(arrivalsApiData, departuresApiData){

		var arrivalsList = arrivalsApiData[0].results
		var departuresList = departuresApiData[0].results

		var createArrivalsHtmlComponents = arrivalsList.map(function(arrivalsObj){
			return `
				<tr>
					<td>${arrivalsObj.date}</td>
					<td>${arrivalsObj.plannedArrival}</td>
					<td>${arrivalsObj.from}</td>
					<td>${arrivalsObj.airline}</td>
				</tr>
			`
		}).join('')

		var createDeparturesHtmlComponents = departuresList.map(function(departuresObj){
			return `
			<tr>
				<td>${departuresObj.date}</td>
				<td>${departuresObj.plannedArrival}</td>
				<td>${departuresObj.to}</td>
				<td>${departuresObj.airline}</td>`
		}).join('')

		let htmlHolder = `
		<div class="row">
			<h1>Flights</h1>
			<div class="col-xs-6">
				<h2>Arrivals</h2>
				<table class="table">
				<thead>
					<th>Date</th>
					<th>Arrival Time</th>
					<th>Origin</th>
					<th>Airline</th>
				</thead>
				<tbody>
					${createArrivalsHtmlComponents}
				</tbody>
				</table>
			</div>
			<div class="col-xs-6">
				<h2>Departures</h2>
				<table class="table">
				<thead>
					<th>Date</th>
					<th>Departure Time</th>
					<th>Desitnation</th>
					<th>Airline</th>
				</thead>
				<tbody>
					${createDeparturesHtmlComponents}
				</tbody>
				</table>
			</div>
		</div>
				`
			return htmlHolder
	}

	var arrivals = $.getJSON('http://apis.is/flight?language=en&type=arrivals')
	var departures = $.getJSON('http://apis.is/flight?language=en&type=departures')

	$.when(arrivals, departures).then(function(arrivalsData, departuresData){
		domEl.innerHTML = buildFlightTemplate(arrivalsData, departuresData)
	})
 }
}

// router function
var controllerRouter = function(){
	var currentRoute = window.location.hash.slice(1)
	if(currentRoute.length === 0){
		renderContent(pageContent, currentRoute)
	}
	if(currentRoute === "concerts"){
		console.log('concert')

		renderContent(pageContent, currentRoute)
	}
	if(currentRoute === "carpools"){
		console.log('carpool')
		renderContent(pageContent, currentRoute)
	}
	if(currentRoute === "flights"){
		console.log('flights')
		renderContent(pageContent, currentRoute)
	}
	renderActiveTab(currentRoute)
}


// event listener 'click' function
tabsContainer.addEventListener('click', function(evt){
	var clickedTab = evt.target
	var route = clickedTab.dataset.route
	window.location.hash = route
})

controllerRouter()
window.addEventListener('hashchange', controllerRouter)
