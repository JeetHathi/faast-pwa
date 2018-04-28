import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import * as firebase from 'firebase'
import GlobalAppBar from './apps/GlobalAppBar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Account from './pages/Account'
import Farms from './pages/Farms'
import Farm from './pages/Farm'
import GenericNotFound from './pages/GenericNotFound'
import Consts from './utils/Consts'
import UserProto from './utils/User'

class App extends Component {
	constructor(props) {
		super(props)

		// Initialize Firebase
		let config = {
			apiKey: "AIzaSyBCQEEe-BcnZnArlJ1XwmngLo9f3UWYWM4",
			authDomain: "faast-196309.firebaseapp.com",
			databaseURL: "https://faast-196309.firebaseio.com",
			projectId: "faast-196309",
			storageBucket: "faast-196309.appspot.com",
			messagingSenderId: "262560444876"
		}
		firebase.initializeApp(config)

		this.state = {
			useMaterial: true,
			user: new UserProto(null, null, null),
			farms: [],
			asyncOps: []
		}

		this.tryLogin = this.tryLogin.bind(this)
		this.tryLogout = this.tryLogout.bind(this)
		this.trySignUp = this.trySignUp.bind(this)
		this.addFarm = this.addFarm.bind(this)
		this.addLoadingText = this.addLoadingText.bind(this)
		this.removeLoadingText = this.removeLoadingText.bind(this)
	}

	componentDidMount() {
		this.addLoadingText(Consts.LOADING_SITE)

		firebase.auth().onAuthStateChanged(user => {
			console.log('onAuthStateChanged\nUser:\n', user)
			this.removeLoadingText(Consts.LOADING_SITE)
			if (user === null) {
				// User yet to login. Do nothing.
				let mUser = new UserProto(null, null, null)
				this.setState({user: mUser, farms: []})
				return
			} else {
				let mUser = new UserProto(user.uid, user.displayName, user.email)
				this.setState({user: mUser})
			}
		})
	}

	addLoadingText(text) {
		this.setState(preS => { return { asyncOps: [...preS.asyncOps, text] } })
	}

	removeLoadingText(text) {
		this.setState(preS => {	return { asyncOps: preS.asyncOps.filter(t => t !== text)} })
	}

	addFarm(p_id, name, crop) {
		firebase.database().ref('/users/' + this.state.user.uid + '/farms/').push({
			parentNodeId: p_id,
			fName: name,
			fCrop: crop
		})
	}

	tryLogin(email, password) {
		UserProto.login(email, password).then(result => {
			this.removeLoadingText(Consts.LOGGING_IN)
		}).catch(error => {
			console.error('Login error.\nErr code: ' + error.code + '\n' + error.message)
			this.removeLoadingText(Consts.LOGGING_IN)
		})
	}

	tryLogout() {
		UserProto.logout().then(() => {
			this.removeLoadingText(Consts.LOGGING_OUT)
		}).catch(error => {
			console.error('Logout error.\nErr code: ' + error.code + '\n' + error.message)			
			this.removeLoadingText(Consts.LOGGING_OUT)
		})
	}

	trySignUp(username, email, password) {
		UserProto.signUp(email, password).then(() => {
			return UserProto.setUsername(username)
		}).then(() => {
			this.setState(preS => {	
				let mUser = preS.user
				mUser.username = username
				return { user: mUser }
			})
			this.removeLoadingText(Consts.SIGNING_UP)
		}).catch(error => {
			console.error('Signup error. Err code: ' + error.code + '\n' + error.message)
			this.removeLoadingText(Consts.SIGNING_UP)
		})
	}

	render() {
		if (this.state.asyncOps.length > 0) {
			return (
				<div className="load-bar">
				  <div className="bar"></div>
				  <div className="bar"></div>
				  <div className="bar"></div>
				</div>
			)
		}
		return (
			<BrowserRouter>
				<div>
					<header>
						<GlobalAppBar user={this.state.user} tryLogout={this.tryLogout}/>
					</header>
					<Switch>
						<Route exact path='/' component={() => <Home isLoggedIn={this.state.user.email === null ? false : true} />} />
						<Route path='/account' component={() => <Account userDetails={this.state.user} />} />
						<Route path='/farms/:f_id' component={Farm} />
						<Route path='/farms' component={() => <Farms isLoggedIn={this.state.user.email === null ? false : true} farms={this.state.farms} addFarm={this.addFarm} />} />
						<Route path='/login' component={() => <Login tryLogin={this.tryLogin} isLoggedIn={this.state.user.email === null ? false : true} />} />
						<Route path='/signup' component={() => <Signup isLoggedIn={this.state.user.email === null ? false : true} trySignUp={this.trySignUp} />} />
						<Route component={GenericNotFound} />
					</Switch>
				</div>
			</BrowserRouter>
		)
	}
}

export default App