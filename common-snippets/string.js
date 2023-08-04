export function ucFirstLetterWords(input) {
	const inputs = input.split(" ");
	for (var i = 0; i < inputs.length; i++) {
		inputs[i] = inputs[i].charAt(0).toUpperCase() + inputs[i].slice(1);

	}

	const output = inputs.join(" ");
    return output;
}