import React, { Component } from 'react'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import Slide from 'material-ui/transitions/Slide'

class GenericNotFound extends Component {
	render() {
		return (
			<Slide in direction='up' mountOnEnter unmountOnExit>
				<div style={{margin: 8}}>
					<Grid container spacing={8} direction='column' alignItems='center' justify='center'>
						<Grid item xs={12}>
							<Typography align='center' variant='display4'>
								404
							</Typography>
						</Grid>
						<Grid item xs={8}>
							<Typography align='center' variant='display1'>
								Thank you, Mario! But our Princess is in another castle.
							</Typography>
						</Grid>
					</Grid>
				</div>
			</Slide>
		)
	}
}

export default GenericNotFound