import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import * as firebase from 'firebase'
import { CircularProgress } from 'material-ui/Progress'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import Card, { CardContent } from 'material-ui/Card'
import Slide from 'material-ui/transitions/Slide'
import Grow from 'material-ui/transitions/Grow'
import AddFarmDialog from '../apps/AddFarmDialog'
import FarmProto from '../utils/Farm'
import Consts from '../utils/Consts'

class Farms extends Component {
	constructor(props) {
		super(props)
		this.state = {
			farms: [],
			loadingFarms: true
		}
		this.transitionDelay = 0
		firebase.auth().onAuthStateChanged(user => {
			if (user !== null) this.attachListeners()
		})
	}

	attachListeners() {
		let userId = firebase.auth().currentUser.uid
		let farmsRef = firebase.database().ref('/users/' + userId + '/farms/').orderByChild('fName')
		
		// Detach the listeners
		farmsRef.off()
		
		// Then, attach necessary listeners
		farmsRef.on('value', data => {
			let farms = []
			data.forEach(farm => {
				let mFarm = new FarmProto(farm.key, farm.val().fName, farm.val().fCrop, farm.val().parentNodeId)
				farms.push(mFarm)
			})
			this.setState({ farms: farms, loadingFarms: false })
		})
	}

	generateCard(key, title, description, linkTo) {
		this.transitionDelay += Consts.ADD_ITEM_TRANSITION_INCR
		return (
			<Grow in key={key} style={{ transitionDelay: this.transitionDelay }}>
				<Grid component={Link} to={linkTo} item lg={4} md={8} sm={12} xs={12}><Card><CardContent>
					<Typography variant='subheading'>{title}</Typography>
					<Typography variant='body2'>{description}</Typography>
				</CardContent></Card></Grid>
			</Grow>
		)
	}

	showFarms() {
		if (this.state.loadingFarms) {
			return <Grid item><CircularProgress /></Grid>
		} else if (this.state.farms.length === 0) {
			return <Grid item><Grow in><Typography variant='subheading' align='center'>You haven't added any farms to Faast.<br />Add some to get started.</Typography></Grow></Grid>
		} else {
			let cards = [], farms = this.state.farms
			farms.forEach(farm => { cards.push(this.generateCard(farm.id, farm.fName, farm.fCrop, '/farms/' + farm.id)) })
			return cards
		}
	}

	render() {
		// If not logged in, return to the login page.
		if (!this.props.isLoggedIn)
			return <Redirect to='/login' />
		const { loadingFarms } = this.state
		return (
			<div>
				<Slide in direction='up' mountOnEnter unmountOnExit>
					<div style={{margin: 8}}>
						<Grid container justify='center' alignItems='center'><Grid item xl={6} lg={8} md={10} xs={12}>
							<Grid container spacing={8} alignItems='center' justify='center'>
								{this.showFarms()}
							</Grid>
						</Grid></Grid>
					</div>
				</Slide>
				{!loadingFarms ? <AddFarmDialog /> : null}
			</div>
		)
	}
}

Farms.propTypes = {
	isLoggedIn: PropTypes.bool.isRequired,
}

export default Farms