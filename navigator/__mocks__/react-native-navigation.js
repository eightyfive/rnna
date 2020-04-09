const events = jest.fn().mockReturnValue({
  registerComponentDidDisappearListener: jest.fn(),
  registerComponentDidAppearListener: jest.fn(),
  registerModalDismissedListener: jest.fn(),
  registerBottomTabSelectedListener: jest.fn(),
  registerBottomTabPressedListener: jest.fn(),
  registerBottomTabLongPressedListener: jest.fn(),
  registerAppLaunchedListener: jest.fn(),
});

export const Navigation = {
  setRoot: jest.fn(),
  showModal: jest.fn(),
  dismissModal: jest.fn(),
  showOverlay: jest.fn(),
  dismissOverlay: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  popTo: jest.fn(),
  popToRoot: jest.fn(),
  mergeOptions: jest.fn(),
  registerComponent: jest.fn(),
  events,
};
