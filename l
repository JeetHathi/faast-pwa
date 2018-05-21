warning: LF will be replaced by CRLF in package.json.
The file will have its original line endings in your working directory.
[1mdiff --git a/package.json b/package.json[m
[1mindex c3d9f04..7f93280 100644[m
[1m--- a/package.json[m
[1m+++ b/package.json[m
[36m@@ -4,8 +4,10 @@[m
   "private": true,[m
   "dependencies": {[m
     "@material-ui/icons": "^1.0.0-beta.42",[m
[32m+[m[32m    "axios": "^0.18.0",[m
     "chart.js": "^1.1.1",[m
     "firebase": "^4.10.1",[m
[32m+[m[32m    "jquery": "^3.3.1",[m
     "material-ui": "^1.0.0-beta.41",[m
     "prop-types": "^15.6.0",[m
     "react": "^16.2.0",[m
[1mdiff --git a/src/App.js b/src/App.js[m
[1mindex e71ca21..e04b676 100644[m
[1m--- a/src/App.js[m
[1m+++ b/src/App.js[m
[36m@@ -81,6 +81,7 @@[m [mclass App extends Component {[m
 			this.removeLoadingText(Consts.LOGGING_IN)[m
 		}).catch(error => {[m
 			console.error('Login error.\nErr code: ' + error.code + '\n' + error.message)[m
[32m+[m			[32mwindow.alert('Error when logging in')[m
 			this.removeLoadingText(Consts.LOGGING_IN)[m
 		})[m
 	}[m
[36m@@ -90,6 +91,7 @@[m [mclass App extends Component {[m
 			this.removeLoadingText(Consts.LOGGING_OUT)[m
 		}).catch(error => {[m
 			console.error('Logout error.\nErr code: ' + error.code + '\n' + error.message)			[m
[32m+[m			[32mwindow.alert('Error when logging out')[m
 			this.removeLoadingText(Consts.LOGGING_OUT)[m
 		})[m
 	}[m
[36m@@ -106,6 +108,7 @@[m [mclass App extends Component {[m
 			this.removeLoadingText(Consts.SIGNING_UP)[m
 		}).catch(error => {[m
 			console.error('Signup error. Err code: ' + error.code + '\n' + error.message)[m
[32m+[m			[32mwindow.alert('Error when signing up')[m
 			this.removeLoadingText(Consts.SIGNING_UP)[m
 		})[m
 	}[m
[1mdiff --git a/src/pages/Farm.js b/src/pages/Farm.js[m
[1mindex a660c00..8ce5cfa 100644[m
[1m--- a/src/pages/Farm.js[m
[1m+++ b/src/pages/Farm.js[m
[36m@@ -1,5 +1,7 @@[m
 import React, { Component } from 'react'[m
 import * as firebase from 'firebase'[m
[32m+[m[32mimport axios from 'axios'[m
[32m+[m[32mimport jquery from 'jquery'[m
 import Grid from 'material-ui/Grid'[m
 import Typography from 'material-ui/Typography'[m
 import Slide from 'material-ui/transitions/Slide'[m
[36m@@ -24,9 +26,18 @@[m [mclass Farm extends Component {[m
 	state = {[m
 		farmId: this.props.match.params.f_id,[m
 		farmData: {[m
[31m-			times: undefined,[m
[31m-			temps: undefined,[m
[31m-			moisture: undefined[m
[32m+[m			[32mpast: {[m
[32m+[m				[32mtimes: undefined,[m
[32m+[m				[32mtemps: undefined,[m
[32m+[m				[32mhumidity: undefined,[m
[32m+[m				[32mmoisture: undefined[m
[32m+[m			[32m},[m
[32m+[m			[32mfuture: {[m
[32m+[m				[32mtimes: undefined,[m
[32m+[m				[32mtemps: undefined,[m
[32m+[m				[32mhumidity: undefined,[m
[32m+[m				[32mmoisture: undefined[m
[32m+[m			[32m}[m
 		},[m
 		latestT: undefined,[m
 		latestH: undefined,[m
[36m@@ -34,51 +45,87 @@[m [mclass Farm extends Component {[m
 	}[m
 	componentDidMount = () => {[m
 		this.attachListeners()[m
[31m-	}[m
[32m+[m		[32mconst farmId = 123 // this.state[m
[32m+[m		[32maxios.interceptors.request.use(request => {[m
[32m+[m		[32m  console.log('Starting Request', request)[m
[32m+[m		[32m  return request[m
[32m+[m		[32m})[m
[32m+[m		[32mconsole.log('ComponentDidMount')[m
[32m+[m		[32maxios.interceptors.response.use(response => {[m
[32m+[m		[32m  console.log('Response:', response)[m
[32m+[m		[32m  return response[m
[32m+[m		[32m})[m
[32m+[m		[32maxios.get('http://35.200.197.64/api/predict/' + farmId).then(response => {[m
[32m+[m			[32mconsole.log('Response: ', response)[m
[32m+[m		[32m}).catch(err => {[m
[32m+[m			[32mconsole.log('Error: ', err)[m
[32m+[m		[32m})[m
[32m+[m[32m}[m
 	attachListeners = () => {[m
 		let farmRef = firebase.database().ref('/sensorData/' + 123).limitToLast(Consts.MAX_DATA_POINTS)[m
 		farmRef.off()[m
 		farmRef.on('value', data => {[m
[31m-			this.jsonToArrays(data.val())[m
[32m+[m			[32mthis.jsonToArrays(data.val(), 'past')[m
[32m+[m		[32m})[m
[32m+[m		[32mlet futureRef = firebase.database().ref('/sensorData/' + 123 + '/predictions/')[m
[32m+[m		[32mfutureRef.off()[m
[32m+[m		[32mfutureRef.on('value', data => {[m
[32m+[m			[32mthis.jsonToArrays(data.val(), 'future')[m
 		})[m
 	}[m
[31m-	jsonToArrays = json => {[m
[31m-		let times = [], temperatures = [], humidity = [], soilMoisture = [][m
[31m-		let latestT = 0, latestH = 0, latestM = 0[m
[32m+[m	[32mjsonToArrays = (json, path) => {[m
[32m+[m		[32mlet times = [], temperatures = [], humidity = [], soilMoisture = [], requiredSoilMoisture = [][m
 		for (let timeStamp in json) {[m
[31m-			let element = json[timeStamp][m
[31m-			let h = element.humidity, s = element.soilMoisture, t = element.temperature[m
[32m+[m			[32mlet elem = json[timeStamp][m
[32m+[m			[32mlet h = elem.humidity, s = elem.soilMoisture, t = elem.temperature, r = elem.requiredSoilMoisture[m
 			if (h === undefined || s === undefined || t === undefined) {[m
 				continue[m
 			} else {[m
 				temperatures = [...temperatures, t][m
 				humidity = [...humidity, h][m
 				soilMoisture = [...soilMoisture, s][m
[32m+[m				[32mrequiredSoilMoisture = [...requiredSoilMoisture, r][m
 				let date = new Date(+timeStamp)[m
 				date = date.getDate() + '/' + (date.getMonth() + 1)[m
 				times = [...times, date][m
[31m-				latestT = t[m
[31m-				latestH = h[m
[31m-				latestM = s[m
 			}[m
 		}[m
[31m-		this.setState({[m
[31m-			farmData: { times: times, temps: temperatures, moisture: soilMoisture, humidity: humidity },[m
[31m-			latestT: latestT, latestH: latestH, latestM: latestM[m
[31m-		})[m
[32m+[m		[32mlet obj = this.state.farmData[m
[32m+[m		[32mobj[path] = {[m
[32m+[m			[32mset: true,[m
[32m+[m			[32mtimes: times,[m
[32m+[m			[32mtemps: temperatures,[m
[32m+[m			[32mmoisture: soilMoisture,[m
[32m+[m			[32mhumidity: humidity,[m
[32m+[m			[32mrequiredM: requiredSoilMoisture[m
[32m+[m		[32m}[m
[32m+[m		[32mthis.setState({farmData: obj})[m
 	}[m
[31m-	renderChart = () => {[m
[31m-		const { times, temps, moisture, humidity } = this.state.farmData[m
[32m+[m	[32mrenderPastChart = () => {[m
[32m+[m		[32m// const { state } = this[m
[32m+[m		[32m// console.log('State:\n', state)[m
[32m+[m		[32mconst { times, temps, moisture, humidity } = this.state.farmData.past[m
[32m+[m		[32mlet label = undefined[m
[32m+[m		[32mif (times !== undefined) {[m
[32m+[m			[32mlet numDates = Math.round(times.length / 10)[m
[32m+[m			[32mlabel = times.filter((t, i) => i % numDates === 0)[m
[32m+[m		[32m}[m
 		let data = {[m
[31m-			labels: times,[m
[32m+[m			[32mlabels: times, // Can be replaced with label[m
[32m+[m			[32mdata: [{[m
[32m+[m					[32mx: new Date(),[m
[32m+[m					[32my: 1[m
[32m+[m				[32m}, {[m
[32m+[m					[32mt: new Date(),[m
[32m+[m					[32my: 17[m
[32m+[m			[32m}],[m
 			datasets: [[m
 				{[m
 					label: 'Temperature',[m
 					fillColor: 'rgba(0, 0, 0, 0)',[m
 					strokeColor: '#B71C1C', // Material red 900[m
 					data: temps[m
[31m-				},[m
[31m-				{[m
[32m+[m				[32m}, {[m
 					label: 'Soil Moisture',[m
 					fillColor: 'rgba(0, 0, 0, 0)',[m
 					strokeColor: '#1B5E20', // Material green 900[m
[36m@@ -95,10 +142,20 @@[m [mclass Farm extends Component {[m
 			responsive: true,[m
 			pointDot: true,[m
 			pointDotRadius: 2,[m
[32m+[m			[32mscales: {[m
[32m+[m				[32mxAxes: [{[m
[32m+[m					[32mtype: 'time',[m
[32m+[m					[32mdistribution: 'linear',[m
[32m+[m					[32mtime: {[m
[32m+[m						[32munit: 'day',[m
[32m+[m					[32m}[m
[32m+[m				[32m}][m
[32m+[m			[32m}[m
 		}[m
 		return ([m
 			<Grow in>[m
 				<Card>[m
[32m+[m					[32m<CardHeader title='Sensor data' />[m
 					<CardContent>[m
 						<Grid container justify='center'>[m
 							<Grid item>[m
[36m@@ -110,9 +167,117 @@[m [mclass Farm extends Component {[m
 			</Grow>[m
 		)[m
 	}[m
[31m-[m
[32m+[m	[32mrenderFutureChart = (trim = true) => {[m
[32m+[m		[32mconst { times, temps, moisture, humidity, requiredM } = this.state.farmData.future[m
[32m+[m		[32mif (times === undefined) {[m
[32m+[m			[32mreturn ([m
[32m+[m				[32m<Grow in>[m
[32m+[m					[32m<Card>[m
[32m+[m						[32m<CardHeader><Typography>Future Soil Moisture</Typography></CardHeader>[m
[32m+[m						[32m<CardContent>[m
[32m+[m							[32m<Grid container justify='center'>[m
[32m+[m								[32m<Grid item>[m
[32m+[m									[32m<CircularProgress />[m
[32m+[m								[32m</Grid>[m
[32m+[m							[32m</Grid>[m
[32m+[m						[32m</CardContent>[m
[32m+[m					[32m</Card>[m
[32m+[m				[32m</Grow>[m
[32m+[m			[32m)[m
[32m+[m		[32m}[m
[32m+[m		[32mlet numDates = Math.round(times.length / 10)[m
[32m+[m		[32mlet label = times.filter((t, i) => i % numDates === 0)[m
[32m+[m		[32mif (trim) {[m
[32m+[m			[32mtimes.forEach((time, i) => {[m
[32m+[m				[32mif (moisture[i] === undefined || requiredM === undefined) {[m
[32m+[m					[32mmoisture.splice(i, 1)[m
[32m+[m					[32mrequiredM.splice(i, 1)[m
[32m+[m					[32mtimes.splice(i, 1)[m
[32m+[m				[32m}[m
[32m+[m			[32m})[m
[32m+[m		[32m}[m
[32m+[m		[32mlet data = {[m
[32m+[m			[32mlabels: label,[m
[32m+[m			[32mdata: [{[m
[32m+[m					[32mx: new Date(),[m
[32m+[m					[32my: 1[m
[32m+[m				[32m}, {[m
[32m+[m					[32mt: new Date(),[m
[32m+[m					[32my: 17[m
[32m+[m			[32m}],[m
[32m+[m			[32mdatasets: [[m
[32m+[m				[32m{[m
[32m+[m					[32mlabel: 'Required Moisture',[m
[32m+[m					[32mfillColor: 'rgba(0, 0, 0, 0)',[m
[32m+[m					[32mstrokeColor: '#B71C1C', // Material red 900[m
[32m+[m					[32mdata: requiredM[m
[32m+[m				[32m}, {[m
[32m+[m					[32mlabel: 'Predicted Soil Moisture',[m
[32m+[m					[32mfillColor: 'rgba(0, 0, 0, 0)',[m
[32m+[m					[32mstrokeColor: '#1B5E20', // Material green 900[m
[32m+[m					[32mdata: moisture[m
[32m+[m				[32m}[m
[32m+[m			[32m][m
[32m+[m		[32m}[m
[32m+[m		[32mlet options = {[m
[32m+[m			[32mresponsive: true,[m
[32m+[m			[32mpointDot: true,[m
[32m+[m			[32mpointDotRadius: 2,[m
[32m+[m			[32mscales: {[m
[32m+[m				[32mxAxes: [{[m
[32m+[m					[32mtype: 'time',[m
[32m+[m					[32mdistribution: 'linear',[m
[32m+[m					[32mtime: {[m
[32m+[m						[32munit: 'day',[m
[32m+[m					[32m}[m
[32m+[m				[32m}][m
[32m+[m			[32m}[m
[32m+[m		[32m}[m
[32m+[m		[32mreturn ([m
[32m+[m			[32m<Grow in>[m
[32m+[m				[32m<Card>[m
[32m+[m					[32m<CardHeader title='Predicted data' />[m
[32m+[m					[32m<CardContent>[m
[32m+[m						[32m<Grid container justify='center'>[m
[32m+[m							[32m<Grid item>[m
[32m+[m								[32m{times === undefined ? <CircularProgress /> : <LineChart data={data} options={options} />}[m
[32m+[m							[32m</Grid>[m
[32m+[m						[32m</Grid>[m
[32m+[m					[32m</CardContent>[m
[32m+[m				[32m</Card>[m
[32m+[m			[32m</Grow>[m
[32m+[m		[32m)[m
[32m+[m	[32m}[m
[32m+[m	[32mrenderRecommendations = () => {[m
[32m+[m		[32mconst { requiredM, moisture, times } = this.state.farmData.future[m
[32m+[m		[32mlet WATERING_THRESHOLD = 20 // percentage of soil moisture[m
[32m+[m		[32mlet printStr = undefined[m
[32m+[m		[32mif (times === undefined) {[m
[32m+[m			[32mprintStr = <Grid container justify='center'><Grid item><CircularProgress /></Grid></Grid>[m
[32m+[m		[32m} else {[m
[32m+[m			[32mtimes.forEach((time, i) => {[m
[32m+[m				[32mlet r = requiredM[i], m = moisture[i][m
[32m+[m				[32mif (r - m >= WATERING_THRESHOLD) {[m
[32m+[m					[32mprintStr = <Typography component='span' noWrap>You need to irrigate your farm on <Typography variant='headline'>{time}</Typography></Typography>[m
[32m+[m				[32m}[m
[32m+[m			[32m})[m
[32m+[m			[32mif (printStr === undefined) {[m
[32m+[m				[32mprintStr = <Typography component='span' noWrap>You need to take no action.</Typography>[m
[32m+[m			[32m}[m
[32m+[m		[32m}[m
[32m+[m		[32mreturn ([m
[32m+[m			[32m<Card>[m
[32m+[m				[32m<CardContent>[m
[32m+[m					[32m<Typography variant='caption' align='right'>Recommendations</Typography>[m
[32m+[m					[32m{printStr}[m
[32m+[m				[32m</CardContent>[m
[32m+[m			[32m</Card>[m
[32m+[m		[32m)[m
[32m+[m	[32m}[m
 	render() {[m
[31m-		const { latestM, latestT, latestH } = this.state[m
[32m+[m		[32mlet lastOf = (arr) => arr !== undefined ? arr[arr.length - 1] : undefined[m
[32m+[m		[32mconst { moisture, temps, humidity } = this.state.farmData.past[m
[32m+[m		[32mconst latestM = lastOf(moisture), latestT = lastOf(temps), latestH = lastOf(humidity)[m
 		const bull = <span className={styles.bullet}>•</span>[m
 		const liveCardContent = latestM === undefined ? ([m
 			<Typography variant='caption'>Loading latest readings</Typography>[m
[36m@@ -134,7 +299,10 @@[m [mclass Farm extends Component {[m
 						<Grid item lg={4} md={8} sm={12} xs={12}>[m
 							<Grid container alignItems='center' justify='center' spacing={8}>[m
 								<Grid item xs={12}>[m
[31m-									{this.renderChart()}[m
[32m+[m									[32m{this.renderPastChart()}[m
[32m+[m								[32m</Grid>[m
[32m+[m								[32m<Grid item xs={12}>[m
[32m+[m									[32m{this.renderFutureChart()}[m
 								</Grid>[m
 								<Grid item xs={12}>[m
 									<Grow in>[m
[36m@@ -145,12 +313,7 @@[m [mclass Farm extends Component {[m
 								</Grid>[m
 								<Grid item xs={12}>[m
 									<Grow in>[m
[31m-										<Card>[m
[31m-											<CardContent>[m
[31m-												<Typography variant='caption' align='right'>Recommendations</Typography>[m
[31m-												<Typography component='span' noWrap>Water your farm in <Typography noWrap variant='headline' component='span'>2 days</Typography></Typography>[m
[31m-											</CardContent>[m
[31m-										</Card>[m
[32m+[m										[32m{this.renderRecommendations()}[m
 									</Grow>[m
 								</Grid>[m
 							</Grid>[m
warning: LF will be replaced by CRLF in src/App.js.
The file will have its original line endings in your working directory.
