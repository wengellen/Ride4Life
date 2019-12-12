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
				style={{top:"0", height:"100vh", zIndex:'8000', padding:0, overflow:'scroll'}}
			>
				<DialogContent style={{padding:0}}>
					{Component && <Component data={data}/>}
				</DialogContent>
			</Modal>
		)
		
}

function mapStateToProps({modalReducer}){
	console.log('data:modalReducer.data',modalReducer.data)
	return {
		shouldOpen: modalReducer.shouldOpen,
		Component: modalReducer.component,
		data:modalReducer.data
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
