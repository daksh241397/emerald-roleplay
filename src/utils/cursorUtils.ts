// Function to blur an element when it receives focus
export const blurOnFocus = (event: FocusEvent) => {
  const target = event.target as HTMLElement;
  target.blur();
};

// Function to add blur behavior to an element
export const addBlurBehavior = (element: HTMLElement) => {
  element.addEventListener('focus', blurOnFocus);
};

// Function to remove blur behavior from an element
export const removeBlurBehavior = (element: HTMLElement) => {
  element.removeEventListener('focus', blurOnFocus);
};

// Function to add blur behavior to all text inputs in a container
export const addBlurBehaviorToContainer = (container: HTMLElement) => {
  const textInputs = container.querySelectorAll('input, textarea');
  textInputs.forEach(input => {
    addBlurBehavior(input as HTMLElement);
  });
}; 