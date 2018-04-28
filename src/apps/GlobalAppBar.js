import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Menu, { MenuItem } from 'material-ui/Menu'
import IconButton from 'material-ui/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import { Link, Redirect } from 'react-router-dom'
// import logo from '../logo.svg'

class GlobalAppBar extends Component {
	state = {
		anchorEl: null,
		redirect: false
	}

	handleMenu = (event) => {
		if (this.props.user.uid === null) {
			this.setState({ redirect: true })
		} else {
			this.setState({ anchorEl: event.currentTarget })
		}
	}

	handleClose = () => {
		this.setState({ anchorEl: null })
	}

	stopRedirecting = () => {
		this.setState({ redirect: false })
	}

	tryLogout = () => {
		this.props.tryLogout()
		this.handleClose()
	}

	render() {
		const { redirect, anchorEl } = this.state
		const open = Boolean(anchorEl)

		if (redirect) {
			return (<Redirect to='/login' />)
		} else {
			return (
				<AppBar position='static' style={{flexGrow: 1}}>
					<Toolbar>
						<Typography variant='title' color='inherit' style={{flex: 1}} component={Link} to='/'>Faast</Typography>
						<div>
							<IconButton color='inherit' onClick={this.handleMenu}>
								<AccountCircle />
							</IconButton>
							<Menu anchorEl={anchorEl} open={open} onClose={this.handleClose}>
								<MenuItem onClick={this.tryLogout}>Logout</MenuItem>
								<MenuItem component={Link} to='/account' onClick={this.handleClose}>My account</MenuItem>
							</Menu>
						</div>
					</Toolbar>
				</AppBar>
			)
		}
	}

	componentDidUpdate() {
		if (this.state.redirect) {
			this.stopRedirecting()
		}
	}
}

GlobalAppBar.propTypes = {
	user: PropTypes.object.isRequired,
	tryLogout: PropTypes.func.isRequired,
}

export default GlobalAppBar
