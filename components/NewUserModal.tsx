
/* ——————— Copyright (c) 2021-2022 toastythetoaster. All rights reserved. ———————
 *
 * New User Modal Component
 *
 * —————————————————————————————————————————————————————————————————————————————— */

import { React, DNGetter, getByProps } from '@webpack';
import { makeLazy } from '@util';
import { ErrorBoundary, Slider, FormItem } from '@components';
import { Modals } from '@modules';

import LockIcon from './LockIcon';

import { LockdownSettings } from '../types';

const NewUserModal = makeLazy({
  promise: () => {

    const settings = Astra.settings.get<LockdownSettings>('Lockdown');

    //@ts-ignore
    const { ModalRoot, ModalSize, ModalHeader, ModalContent, ModalFooter, ModalCloseButton } = Modals.Components;

    const { Text } = DNGetter;

    const ButtonOptions = getByProps('ButtonLink');
    const Button = ButtonOptions.default;

    const InputModule = getByProps('Input');
    const { Input } = InputModule;

    interface NewUserModalProps {
      transitionState: number
      onClose(): void
      onSetPasscode(currentPasscode: null, newPasscode: string, onboarding: true): void | string
    }

    interface NewUserModalState {
      step: number
      newPasscode: string
      confirmPasscode: string
      newPasscodeError: string | null
      confirmPasscodeError: string | null
    }

    class NewUserModal extends React.PureComponent<NewUserModalProps, NewUserModalState> {
      state = {
        step: 0,
        newPasscode: '',
        confirmPasscode: '',
        newPasscodeError: null,
        confirmPasscodeError: null
      };
      render(): any {
        return (
          <ModalRoot transitionState={this.props.transitionState} size={ModalSize.SMALL}>
            <ModalHeader separator={false} className='header-1LEkUo'>
              <Text color={Text.Colors.HEADER_PRIMARY} size={Text.Sizes.SIZE_24} className='title-2tnl9d'>
                {this.state.step === 0 && 'Welcome to Lockdown!'}
                {this.state.step === 1 && 'Create a passcode'}
                {this.state.step === 2 && 'Setup timeout'}
                {this.state.step === 3 && 'Thanks for using Lockdown!'}
                <LockIcon height='24px' style={{ marginLeft: '0.25em' }} />
              </Text>
              <ModalCloseButton onClick={this.props.onClose} className='modalCloseButton-1g0I9f' />
            </ModalHeader>
            <ModalContent className='content-qdMtCa'>
              {this.state.step === 0 && (
                <>
                  <Text color={Text.Colors.STANDARD} size={Text.Sizes.SIZE_16} className='subtitle-3sUbvY'>
                    Lockdown protects your privacy by requiring a passcode to access the Discord client.<br/><br/>
                    To start using Lockdown, please set a passcode.
                    You can change your passcode later.<br/><br/>
                  </Text>
                </>
              )}
              {this.state.step === 1 && (
                <>
                  <Input label='New Passcode' name='Passcode' autoFocus={false} value={this.state.newPasscode} onChange={(newPasscode: string): void => this.setState({ newPasscode })} error={this.state.newPasscodeError} type='password'/>
                  <Input label='Confirm New Passcode' name='Passcode' autoFocus={false} value={this.state.confirmPasscode} onChange={(confirmPasscode: string): void => this.setState({ confirmPasscode })} error={this.state.confirmPasscodeError} className='newPassword-2uGqp4' type='password'/>
                </>
              )}
              {this.state.step === 2 && (
                <>
                  <Text color={Text.Colors.STANDARD} size={Text.Sizes.SIZE_16} className='subtitle-3sUbvY'>
                    Lockdown will automatically lock your client after a set amount of time.
                    You can change this later.<br/><br/>
                  </Text>
                  <FormItem title='Timeout' className='marginTop20-3TxNs6'>
                    <Slider initialValue={5} onMarkerRender={(value): string => (value === 0 ? 'Off' : `${value}m`)} onValueRender={(value): string => `${Math.round(value)} mins`} onValueChange={(value: number): any => settings.set('timeoutTime', Math.round(value))} markers={[0, 1, 2, 3, 5, 10, 15, 30, 60]} equidistant={true} keyboardStep={1} handleSize={1} maxValue={60} minValue={1} stickToMarkers={true}/>
                  </FormItem>
                </>
              )}
            </ModalContent>
            <ModalFooter>
              {this.state.step === 0 && (
                <Button color={Button.Colors.BRAND} size={Button.Sizes.MEDIUM} onClick={() => this.setState({ step: 1 })}>
                  Start
                </Button>
              )}
              {this.state.step === 1 && (
                <Button color={Button.Colors.BRAND} size={Button.Sizes.MEDIUM} onClick={(): void => {
                  if (this.state.newPasscodeError || this.state.confirmPasscodeError) this.setState({ newPasscodeError: null, confirmPasscodeError: null });
                  if (this.state.newPasscode === '') {
                    this.setState({ newPasscodeError: 'Please enter a new passcode.' });
                    return;
                  }
                  if (this.state.confirmPasscode === '') {
                    this.setState({ confirmPasscodeError: 'Please confirm your new passcode.' });
                    return;
                  }
                  if (this.state.newPasscode !== this.state.confirmPasscode) {
                    this.setState({ confirmPasscodeError: 'Passcodes do not match!' });
                    return;
                  }
                  const ret = this.props.onSetPasscode(null, this.state.newPasscode, true);
                  if (typeof ret === 'string') {
                    this.setState({ newPasscodeError: ret, confirmPasscodeError: ret });
                    return;
                  }
                  this.setState({ step: 2 });
                }}>
                  Next
                </Button>
              )}
              {this.state.step === 2 && (
                <Button color={Button.Colors.BRAND} size={Button.Sizes.MEDIUM} onClick={() => this.props.onClose()}>
                  Finish
                </Button>
              )}
              <Button onClick={this.props.onClose} color={Button.Colors.PRIMARY} look={Button.Looks.LINK} className='cancel-1Qvixr'>
                Cancel
              </Button>
              {this.state.step > 0 && (
                <Button color={Button.Colors.PRIMARY} look={Button.Looks.LINK} disabled={true} className='cancel-1Qvixr lockdown-newusermodal-stepcounter'>
                  Step <strong>{this.state.step}</strong> of <strong>2</strong>
                </Button>
              )}
            </ModalFooter>
          </ModalRoot>
        );
      }
    }

    return Promise.resolve(NewUserModal);
  },
  displayName: 'NewUserModal'
});

class NewUserModalErrorBoundary extends ErrorBoundary {
  constructor(props) {
    props.label = 'User onboarding modal';
    super(props);
  }
  renderChildren(): any {
    return <NewUserModal {...this.props}/>;
  }
}
export { NewUserModalErrorBoundary as NewUserModal };
