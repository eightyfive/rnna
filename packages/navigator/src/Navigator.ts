import { Component } from './Component';
import { BottomTabs } from './BottomTabs';
import { Modal } from './Modal';
import { Overlay } from './Overlay';
import { Stack } from './Stack';

export type Navigator = Record<
  string,
  BottomTabs | Component | Modal | Overlay | Stack
>;
