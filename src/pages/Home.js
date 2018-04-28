import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
// import { Header, Card, Button, Segment } from 'semantic-ui-react'
import Card, { CardContent, CardMedia } from 'material-ui/Card'
import Grid from 'material-ui/Grid'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Slide from 'material-ui/transitions/Slide'

const styles = {
	media: {
		height: 200
	}
}

class Home extends Component {
	render() {
		// If the user has logged in, redirect to /farms
		if (this.props.isLoggedIn) {
			return (
				<Redirect to='/farms' />
			)
		} else { // If not logged in, show the landing page
			return (
				<Slide in direction='up' mountOnEnter unmountOnExit>
					<div style={{margin: 8}}>
						<Grid container alignItems='center' justify='center'>
							<Grid item lg={4} md={8} sm={12} xs={12}>
								<Grid container spacing={8} alignItems='center' justify='center'>
									<Grid item xs={12}>
										<Card>
											<CardMedia style={styles.media} image={require('../assets/farm1.jpg')} />
											<CardContent>
												<Typography variant='headline'>Faast</Typography>
												<Typography>Some really impressive showboating in this and other cards.</Typography>
											</CardContent>
										</Card>
									</Grid>
									<Grid item xs={12}>
										<Card>
											<CardMedia style={styles.media} image={require('../assets/farm2.jpg')} />
											<CardContent>
												<Typography variant='headline'>Other card</Typography>
												<Typography>Describe some features. One feature per card.</Typography>
											</CardContent>
										</Card>
									</Grid>
									<Grid item xs={12}>
										<Card>
											<CardMedia style={styles.media} image={require('../assets/farm3.jpg')} />
											<CardContent>
												<Typography variant='headline'>Other card</Typography>
												<Typography>Describe some features. One feature per card.</Typography>
											</CardContent>
										</Card>
									</Grid>
									<Grid justify='center' container spacing={8}>
										<Grid item>
											<Button component={Link} to='/login' color='primary'>Login</Button>
										</Grid>
										<Grid item>
											<Button component={Link} to='/signup' color='secondary'>Sign up</Button>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</div>
				</Slide>
			)
		}
	}
}

Home.propTypes = {
	isLoggedIn: PropTypes.bool.isRequired
}

export default Home