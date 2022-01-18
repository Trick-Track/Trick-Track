const PRIMARY_MOUSE_BUTTON = 0;

const isEscEvent = (evt) => {
  return evt === ('Escape' || 'Esc');
};
  
const isMouseLeftEvent = (evt) => {
  return evt.button === PRIMARY_MOUSE_BUTTON;
};


export {isEscEvent, isMouseLeftEvent};