import { Component } from './Component';
import { BottomTabs, BottomTabsOptions } from './BottomTabs';
import { Modal, ModalOptions } from './Modal';
import { Overlay } from './Overlay';
import { Stack, StackOptions } from './Stack';

export function createBottomTabs(
  stacks: Record<string, Stack>,
  options?: BottomTabsOptions,
) {
  return new BottomTabs(stacks, options);
}

export function createStack(names: string[], options?: StackOptions) {
  const components = names.map(createComponent);

  return new Stack(components, options);
}

export function createModal(names: string[], options?: ModalOptions) {
  const components = names.map(createComponent);

  return new Modal(components, options);
}

export function createOverlay(name: string) {
  return new Overlay(name);
}

export function createComponent(name: string) {
  return new Component(name);
}
