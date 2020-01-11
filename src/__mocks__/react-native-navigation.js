const events = jest.fn().mockReturnValue({
  registerComponentDidDisappearListener: jest.fn(),
});

export const Navigation = {
  setRoot: jest.fn(),
  showOverlay: jest.fn(),
  dismissOverlay: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  popTo: jest.fn(),
  popToRoot: jest.fn(),
  events,
};
