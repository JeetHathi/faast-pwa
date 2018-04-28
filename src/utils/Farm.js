import * as firebase from 'firebase'

class Farm {
	constructor(id, fName, fCrop, parentNodeId) {
		this.id = id
		this.fName = fName
		this.fCrop = fCrop
		this.parentNodeId = parentNodeId
	}

	static addFarm(p_id, name, crop) {
		firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/farms/').push({
			parentNodeId: p_id,
			fName: name,
			fCrop: crop
		})
	}
}

export default Farm