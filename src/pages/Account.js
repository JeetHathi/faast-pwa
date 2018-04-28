import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Card, { CardContent } from 'material-ui/Card'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Slide from 'material-ui/transitions/Slide'
import User from '../utils/User'

class Account extends Component {
	render() {
		return (
			<Slide in direction='up' mountOnEnter unmountOnExit>
				<div style={{flexGrow: 1, margin: 8}}>
					<Grid container spacing={8}>
						<Grid item xs={6}>
							<Card>
								<CardContent>
									<Typography variant='headline'>Username</Typography>
									<Typography>{this.props.userDetails.username}</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={6}>
							<Card>
								<CardContent>
									<Typography variant='headline'>Email</Typography>
									<Typography>{this.props.userDetails.email}</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12}>
							<Card>
								<CardContent>
									<Typography variant='headline'>User Id</Typography>
									<Typography>{this.props.userDetails.uid}</Typography>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</div>
			</Slide>
		)
	}
}

Account.propTypes = {
	userDetails: PropTypes.instanceOf(User).isRequired
}

export default Account