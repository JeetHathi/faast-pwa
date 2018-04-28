import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
// import { Button, Form, Grid } from 'semantic-ui-react'
import TextField from 'material-ui/TextField'
import Grid from 'material-ui/Grid'
import { CircularProgress } from 'material-ui/Progress'
import Card, { CardHeader, CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Slide from 'material-ui/transitions/Slide'

class Signup extends Component {
	state = {
		username: '',
		email: '',
		password: '',
		isSigningIn: false
	}

	handleChange = name => event => {
		this.setState({ [name]: event.target.value })
	}
	trySignUp = () => {
		const { username, email, password } = this.state
		this.props.trySignUp(username, email, password)
		this.setState({isSigningIn: true})
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
								<CardHeader title='Sign up' subheader='Create a new account and get started' />
								<CardContent>
									<TextField autoFocus fullWidth label='Username' value={this.state.username} onChange={this.handleChange('username')} />
									<TextField type='email' fullWidth label='Email' value={this.state.email} onChange={this.handleChange('email')} />
									<TextField fullWidth type='password' label='Password' value={this.state.password} onChange={this.handleChange('password')} />
								</CardContent>
								<CardActions>
									<Button component={Link} to='/login'>Sign in instead</Button>
									<div style={{flex: 1}} />
									{isSigningIn ? <CircularProgress /> : null}
									<Button variant='raised' disabled={isSigningIn} color='primary' onClick={this.trySignUp}>Sign up</Button>
								</CardActions>
							</Card>
						</Grid>
					</Grid>
				</div>
			</Slide>
		)
	}
}

Signup.propTypes = {
	trySignUp: PropTypes.func.isRequired,
	isLoggedIn: PropTypes.bool.isRequired
}

export default Signup