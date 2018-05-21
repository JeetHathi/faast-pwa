import React, { Component } from 'react'
import * as firebase from 'firebase'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Slide from 'material-ui/transitions/Slide'
import Grow from 'material-ui/transitions/Grow'
import Card, { CardContent, CardHeader } from 'material-ui/Card'
import { CircularProgress } from 'material-ui/Progress'
import { Line as LineChart } from 'react-chartjs'
import Consts from '../utils/Consts'

const styles = {
	bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
    background: '#B71C1C'
  }
}

class Farm extends Component {
	// TODO Update to chartjs2
	state = {
		farmId: this.props.match.params.f_id,
		farmData: {
			past: {
				times: undefined,
				temps: undefined,
				humidity: undefined,
				moisture: undefined
			},
			future: {
				times: undefined,
				temps: undefined,
				humidity: undefined,
				moisture: undefined
			}
		},
		latestT: undefined,
		latestH: undefined,
		latestM: undefined
	}
	componentDidMount = () => {
		this.attachListeners()
	}
	attachListeners = () => {
		let farmRef = firebase.database().ref('/sensorData/' + 123).limitToLast(Consts.MAX_DATA_POINTS)
		farmRef.off()
		farmRef.on('value', data => {
			this.jsonToArrays(data.val(), 'past')
		})
		let futureRef = firebase.database().ref('/sensorData/' + 123 + '/predictions/')
		futureRef.off()
		futureRef.on('value', data => {
			this.jsonToArrays(data.val(), 'future')
		})
	}
	jsonToArrays = (json, path) => {
		let times = [], temperatures = [], humidity = [], soilMoisture = [], requiredSoilMoisture = []
		for (let timeStamp in json) {
			let elem = json[timeStamp]
			let h = elem.humidity, s = elem.soilMoisture, t = elem.temperature, r = elem.requiredSoilMoisture
			if (h === undefined || s === undefined || t === undefined) {
				continue
			} else {
				temperatures = [...temperatures, t]
				humidity = [...humidity, h]
				soilMoisture = [...soilMoisture, s]
				requiredSoilMoisture = [...requiredSoilMoisture, r]
				let date = new Date(+timeStamp)
				date = date.getDate() + '/' + (date.getMonth() + 1)
				times = [...times, date]
			}
		}
		let obj = this.state.farmData
		obj[path] = {
			set: true,
			times: times,
			temps: temperatures,
			moisture: soilMoisture,
			humidity: humidity,
			requiredM: requiredSoilMoisture
		}
		this.setState({farmData: obj})
	}
	renderPastChart = () => {
		// const { state } = this
		// console.log('State:\n', state)
		const { times, temps, moisture, humidity } = this.state.farmData.past
		let label = undefined
		if (times !== undefined) {
			let numDates = Math.round(times.length / 10)
			label = times.filter((t, i) => i % numDates === 0)
		}
		let data = {
			labels: times, // Can be replaced with label
			data: [{
					x: new Date(),
					y: 1
				}, {
					t: new Date(),
					y: 17
			}],
			datasets: [
				{
					label: 'Temperature',
					fillColor: 'rgba(0, 0, 0, 0)',
					strokeColor: '#B71C1C', // Material red 900
					data: temps
				}, {
					label: 'Soil Moisture',
					fillColor: 'rgba(0, 0, 0, 0)',
					strokeColor: '#1B5E20', // Material green 900
					data: moisture
				}, {
					label: 'Humidity',
					fillColor: 'rgba(0, 0, 0, 0)',
					strokeColor: '#1A237E', // Material indigo 900
					data: humidity
				}
			]
		}
		let options = {
			responsive: true,
			pointDot: true,
			pointDotRadius: 2,
			scales: {
				xAxes: [{
					type: 'time',
					distribution: 'linear',
					time: {
						unit: 'day',
					}
				}]
			}
		}
		return (
			<Grow in>
				<Card>
					<CardHeader title='Sensor data' />
					<CardContent>
						<Grid container justify='center'>
							<Grid item>
								{times === undefined ? <CircularProgress /> : <LineChart data={data} options={options} />}
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</Grow>
		)
	}
	renderFutureChart = (trim = true) => {
		const { times, temps, moisture, humidity, requiredM } = this.state.farmData.future
		if (times === undefined) {
			return (
				<Grow in>
					<Card>
						<CardHeader><Typography>Future Soil Moisture</Typography></CardHeader>
						<CardContent>
							<Grid container justify='center'>
								<Grid item>
									<CircularProgress />
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				</Grow>
			)
		}
		let numDates = Math.round(times.length / 10)
		let label = times.filter((t, i) => i % numDates === 0)
		if (trim) {
			times.forEach((time, i) => {
				if (moisture[i] === undefined || requiredM === undefined) {
					moisture.splice(i, 1)
					requiredM.splice(i, 1)
					times.splice(i, 1)
				}
			})
		}
		let data = {
			labels: label,
			data: [{
					x: new Date(),
					y: 1
				}, {
					t: new Date(),
					y: 17
			}],
			datasets: [
				{
					label: 'Required Moisture',
					fillColor: 'rgba(0, 0, 0, 0)',
					strokeColor: '#B71C1C', // Material red 900
					data: requiredM
				}, {
					label: 'Predicted Soil Moisture',
					fillColor: 'rgba(0, 0, 0, 0)',
					strokeColor: '#1B5E20', // Material green 900
					data: moisture
				}
			]
		}
		let options = {
			responsive: true,
			pointDot: true,
			pointDotRadius: 2,
			scales: {
				xAxes: [{
					type: 'time',
					distribution: 'linear',
					time: {
						unit: 'day',
					}
				}]
			}
		}
		return (
			<Grow in>
				<Card>
					<CardHeader title='Predicted data' />
					<CardContent>
						<Grid container justify='center'>
							<Grid item>
								{times === undefined ? <CircularProgress /> : <LineChart data={data} options={options} />}
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</Grow>
		)
	}
	renderRecommendations = () => {
		const { requiredM, moisture, times } = this.state.farmData.future
		let WATERING_THRESHOLD = 20 // percentage of soil moisture
		let printStr = undefined
		if (times === undefined) {
			printStr = <Grid container justify='center'><Grid item><CircularProgress /></Grid></Grid>
		} else {
			times.forEach((time, i) => {
				let r = requiredM[i], m = moisture[i]
				if (r - m >= WATERING_THRESHOLD) {
					printStr = <Typography component='span' noWrap>You need to irrigate your farm on <Typography variant='headline'>{time}</Typography></Typography>
				}
			})
			if (printStr === undefined) {
				printStr = <Typography component='span' noWrap>You need to take no action.</Typography>
			}
		}
		return (
			<Card>
				<CardContent>
					<Typography variant='caption' align='right'>Recommendations</Typography>
					{printStr}
				</CardContent>
			</Card>
		)
	}
	render() {
		let lastOf = (arr) => arr !== undefined ? arr[arr.length - 1] : undefined
		const { moisture, temps, humidity } = this.state.farmData.past
		const latestM = lastOf(moisture), latestT = lastOf(temps), latestH = lastOf(humidity)
		const liveCardContent = latestM === undefined ? (
			<Typography variant='caption'>Loading latest readings</Typography>
		) : (
			<div>
				<Typography variant='caption' align='right'>Live</Typography>
				<Typography variant='headline'>{latestT}°C</Typography>
				<Typography component='span'>Temperature</Typography>
				<Typography variant='headline'>{latestH}%</Typography>
				<Typography component='span'>Humidity</Typography>
				<Typography variant='headline'>{latestM}%</Typography>
				<Typography component='span'>Soil Moisture</Typography>
			</div>
		)
		return (
			<Slide in direction='up' mountOnEnter unmountOnExit>
				<div style={{margin: 8}}>
					<Grid container alignItems='center' justify='center'>
						<Grid item lg={4} md={8} sm={12} xs={12}>
							<Grid container alignItems='center' justify='center' spacing={8}>
								<Grid item xs={12}>
									{this.renderPastChart()}
								</Grid>
								<Grid item xs={12}>
									{this.renderFutureChart()}
								</Grid>
								<Grid item xs={12}>
									<Grow in>
										<Card><CardContent>
											{liveCardContent}
										</CardContent></Card>
									</Grow>
								</Grid>
								<Grid item xs={12}>
									<Grow in>
										{this.renderRecommendations()}
									</Grow>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</div>
			</Slide>
		)
	}
}

export default Farm