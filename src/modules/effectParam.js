export default class EffectParam {
	/**
	 * Defines a single effect parameter used to display effects in the <EffectsList> component.
	 * @param {string} name the displayed name of the effect
	 * @param {number} value 
	 * @param {number} minValue 
	 * @param {number} maxValue 
	 * @param {string} controlType a template for the future. This will define the type of control for the param
	 */
	constructor(name, value, minValue, maxValue, controlType) {
		this.name = name;
		this.value = value;
		this.minValue = minValue;
		this.maxValue = maxValue;
		this.controlType = controlType;
	}
}