/* To make fetch data run only when a certain period of time has elapsed
 preventing it from running on every keyboard input in the input tag
 We create a debounce function that receive a function and a delay (number) as argurments */

//  creating a debouce function
const debounce = (func, delay = 1000) => {
	let timeoutId;
	return (...args) => {
		// console.log(func);
		// console.log(args);
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			func.apply(null, args);
		}, delay);
	};
};
