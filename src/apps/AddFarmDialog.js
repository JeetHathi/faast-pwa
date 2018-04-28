import React, { Component } from 'react'
import AddIcon from '@material-ui/icons/Add'
import Button from 'material-ui/Button'
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import Grow from 'material-ui/transitions/Grow'
import FarmProto from '../utils/Farm'

const styles = ({
	fab: {
		margin: 0,
		top: 'auto',
		right: 20,
		bottom: 20,
		left: 'auto',
		position: 'fixed'
	}
})

class AddFarmDialog extends Component {
	state = {
		open: false,
		fName: '',
		fCrop: '',
		pId: ''
	}

	handleOpen = () => {
		this.setState({ open: true })
	}
	handleClose = () => {
		this.setState({ open: false })
	}
	handleChange = name => event => {
		this.setState({ [name]: event.target.value })
	}
	addFarm = () => {
		const { fName, fCrop, pId } = this.state
		console.warn('TODO add farm validations')
		FarmProto.addFarm(pId, fName, fCrop)
		this.handleClose()
		this.clearState()
	}
	clearState = () => {
		this.setState({fName: '', fCrop: '', pId: ''})
	}

	render() {
		return (
			<div>
				<Grow in>
					<Button variant='fab' color='secondary' style={styles.fab} onClick={this.handleOpen}><AddIcon /></Button>
				</Grow>
				<Dialog open={this.state.open} onClose={this.handleClose}>
					<DialogTitle>Add farm</DialogTitle>
					<DialogContent>
						<TextField label='Farm name' value={this.state.fName} fullWidth onChange={this.handleChange('fName')} />
						<TextField label='Farm crop' value={this.state.fCrop} fullWidth onChange={this.handleChange('fCrop')} />
						<TextField label='Parent node id' value={this.state.pId} fullWidth onChange={this.handleChange('pId')} />
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose} color='primary'>
							Cancel
						</Button>
						<Button onClick={this.addFarm} color='primary'>
							Save
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		)
	}
}

export default AddFarmDialog