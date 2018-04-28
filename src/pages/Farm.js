import React, { Component } from 'react'
import * as firebase from 'firebase'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Slide from 'material-ui/transitions/Slide'
import Grow from 'material-ui/transitions/Grow'
import Card, { CardContent, CardHeader } from 'material-ui/Card'
import { CircularProgress } from 'material-ui/Progress'
import Avatar from 'material-ui/Avatar'
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
			times: undefined,
			temps: undefined,
			moisture: undefined
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
			this.jsonToArrays(data.val())
		})
	}
	jsonToArrays = json => {
		let times = [], temperatures = [], humidity = [], soilMoisture = []
		let latestT = 0, latestH = 0, latestM = 0
		for (let timeStamp in json) {
			let element = json[timeStamp]
			let h = element.humidity, s = element.soilMoisture, t = element.temperature
			if (h === undefined || s === undefined || t === undefined) {
				continue
			} else {
				temperatures = [...temperatures, t]
				humidity = [...humidity, h]
				soilMoisture = [...soilMoisture, s]
				let date = new Date(+timeStamp)
				date = date.getDate() + '/' + (date.getMonth() + 1)
				times = [...times, date]
				latestT = t
				latestH = h
				latestM = s
			}
		}
		this.setState({
			farmData: { times: times, temps: temperatures, moisture: soilMoisture, humidity: humidity },
			latestT: latestT, latestH: latestH, latestM: latestM
		})
	}
	renderChart = () => {
		const { times, temps, moisture, humidity } = this.state.farmData
		let data = {
			labels: times,
			datasets: [
				{
					label: 'Temperature',
					fillColor: 'rgba(0, 0, 0, 0)',
					strokeColor: '#B71C1C', // Material red 900
					data: temps
				},
				{
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
		}
		return (
			<Grow in>
				<Card>
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

	render() {
		const { latestM, latestT, latestH } = this.state
		const bull = <span className={styles.bullet}>•</span>
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
									{this.renderChart()}
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
										<Card>
											<CardContent>
												<Typography variant='caption' align='right'>Recommendations</Typography>
												<Typography component='span' noWrap>Water your farm in <Typography noWrap variant='headline' component='span'>2 days</Typography></Typography>
											</CardContent>
										</Card>
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