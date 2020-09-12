const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
	// selecting the input
	// const root = document.querySelector('.autocomplete');
	root.innerHTML = `
    <label><b>Search<b></label>
    <input class="input"/>
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results">
            </div>
        </div>
    </div>
`;
	const input = root.querySelector('input');
	const dropdown = root.querySelector('.dropdown');
	const resultsWrapper = root.querySelector('.results ');

	/* To make fetch data run only when a certain period of time has elapsed
     preventing it from running on every keyboard input in the input tag 
     We create a debounce function that receive a function and a delay (number as argurments).
     debounce() is in utlis.js*/

	const onInput = async (event) => {
		const items = await fetchData(event.target.value);
		if (!items.length) {
			// when there are no results from the search or user clears search info
			dropdown.classList.remove('is-active');
			return;
		}

		// clearing out items on dropdown list when the user begins typing again for a new search
		resultsWrapper.innerHTML = '';

		//rendering items in dropdown
		dropdown.classList.add('is-active');
		for (let item of items) {
			const option = document.createElement('a');
			option.classList.add('dropdown-item');
			option.innerHTML = renderOption(item);

			option.addEventListener('click', () => {
				dropdown.classList.remove('is-active');
				input.value = inputValue(item);
				onOptionSelect(item);
			});

			resultsWrapper.appendChild(option);
		}
	};

	input.addEventListener('input', debounce(onInput, 500));

	//Closing the dropdown
	document.addEventListener('click', (event) => {
		if (!root.contains(event.target)) {
			dropdown.classList.remove('is-active');
		}
	});
};
