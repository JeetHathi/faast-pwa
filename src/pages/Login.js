import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
// import { Button, Form, Grid } from 'semantic-ui-react'
import TextField from 'material-ui/TextField'
import Grid from 'material-ui/Grid'
import { CircularProgress } from 'material-ui/Progress'
import Slide from 'material-ui/transitions/Slide'
import Card, { CardHeader, CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'

class Login extends Component {
	state = {
		email: '',
		password: '',
		isSigningIn: false
	}

	handleChange = name => event => {
		this.setState({ [name]: event.target.value })
	}

	tryLogin = () => {
		const { email, password } = this.state
		this.props.tryLogin(email, password)
		this.setState({ isSigningIn: true })
	}

	render() {
		if (this.props.isLoggedIn) {
			return (
				<Redirect to='/' />
			)
		}
		const { isSigningIn } = this.state
		return (
			<Slide in direction='up' mountOnEnter unmountOnExit>
				<div style={{margin: 8}}>
					<Grid container direction='column' justify='center' alignItems='center' spacing={8}>
						<Grid item lg={4} md={8} xs={12}>
							<Card>
								<CardHeader title='Login' subheader='Login to view your farms' />
								<CardContent>	
									<TextField fullWidth type='email' label='Email' value={this.state.email} onChange={this.handleChange('email')} autoFocus />
									<TextField fullWidth type='password' label='Password' value={this.state.password} onChange={this.handleChange('password')} />
								</CardContent>
								<CardActions>
									<Button component={Link} to='/signup'>Create account</Button>
									<div style={{flex: 1}} />
									{isSigningIn ? <CircularProgress /> : null}
									<Button variant='raised' disabled={isSigningIn} color='primary' onClick={this.tryLogin}>Sign in</Button>
								</CardActions>
							</Card>
						</Grid>
					</Grid>
				</div>
			</Slide>
		)
	}
}

Login.propTypes = {
	tryLogin: PropTypes.func.isRequired,
	isLoggedIn: PropTypes.bool.isRequired
}

export default Login