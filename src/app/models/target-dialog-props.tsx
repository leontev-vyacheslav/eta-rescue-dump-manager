import { DialogProps } from './dialog-props';

export type TargetDialogCallback = (serverName: string) => Promise<void> | void;

export interface TargetDialogProps extends DialogProps {
  callback: TargetDialogCallback;
}