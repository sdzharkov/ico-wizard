import { observable, action } from 'mobx';

class StepThreeValidationStore {

	@observable validationsList 

	constructor(validationsList = []) {
		this.validationsList = validationsList;
		this.validationsList[0] = {};
		this.validationsList[0].name = 'EMPTY';
		this.validationsList[0].walletAddress = 'EMPTY';
		this.validationsList[0].rate = 'EMPTY';
		this.validationsList[0].supply = 'EMPTY';
		this.validationsList[0].startTime = 'VALIDATED';
		this.validationsList[0].endTime = 'VALIDATED';
		this.validationsList[0].updatable = "VALIDATED";
	}

	@action changeProperty = (index, property, value) => {
		this[index][property] = value;
	}

	@action addValidationItem = (item) => {
		this.validationsList.push(item);
	}

}

const stepThreeValidationStore = new StepThreeValidationStore();

export default stepThreeValidationStore;
export { StepThreeValidationStore };
