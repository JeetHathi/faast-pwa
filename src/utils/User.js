import * as firebase from 'firebase'

class User {
	constructor(uid, username, email) {
		this.uid = uid
		this.username = username
		this.email = email
	}

	static login(email, password) {
		return firebase.auth().signInWithEmailAndPassword(email, password)
	}

	static logout() {
		return firebase.auth().signOut()
	}

	static signUp(email, password) {
		return firebase.auth().createUserWithEmailAndPassword(email, password)
	}

	static setUsername(username) {
		return firebase.auth().currentUser.updateProfile({ displayName: username })
	}
}

export default User