/**
 * Created by mbp on 28/10/2017.
 */
import { connect } from 'react-redux'
import {openModal} from '../actions'
import React  from 'react'
import {Modal} from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";

let ModalContainer = ({history, classes, Component, shouldOpen, closeModal, data}) => {
	     return (
			<Modal
				open={shouldOpen || false}
				onClose={closeModal}
				aria-modal={true}
				style={{top:"0", zIndex:'8000', padding:0, overflow:'scroll'}}
			>
				<DialogContent style={{padding:0}}>
					{Component && <Component/>}
				</DialogContent>
			</Modal>
		)
}

function mapStateToProps(state, ownProps){
	return {
		shouldOpen: state.modalReducer.shouldOpen,
		Component: state.modalReducer.component,
		// data:{
		// 	currentPost: state.currentPost,
		// 	categories: state.categories
		// }
	}
}

function mapDispatchToProps(dispatch){
	return {
		closeModal: () => {
			dispatch(openModal(false))
		}
	}
}

export default connect(
mapStateToProps, mapDispatchToProps) (ModalContainer)
