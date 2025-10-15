import onChangeEffect from './index';
import { renderHook } from '@testing-library/react-hooks';
import '@testing-library/jest-native/extend-expect';
import { render } from '@testing-library/react';
import { TimerProps } from './editor';
import { TestProps } from '@alfons-app/pdk';
import TimerEffect from './index';
 
const getMockTestProps = (testID: string) => ({ interval: 2, repeat: false, onInterval: {}, }) as TimerProps;
 
describe('alfons-effect-on-change', () => {
  const props: TimerProps = {
    interval: 100,
    repeat: false,
    onInterval: { __$path: '', __$ref: '' },
    pause: false,
    reset: false,

  }
 
  it('Effect renders', () => {
    const { container } = render(<TimerEffect {...props} />);
    expect(container).toBeTruthy();
  })

  it('should call action on init and when dependencies changed', async () => {
    const testProps: TimerProps & TestProps = {
      ...getMockTestProps(testId),
      "data-testid": 'test',
      testID: 'testId'
    };
 
    const runAction = jest.fn();
    const getAction = jest.fn(() => runAction);
    jest.spyOn(require('react'), 'useContext').mockReturnValue({ getAction });
 
    const { rerender } = renderHook(() => onChangeEffect(testProps));
 
    expect(getAction).toHaveBeenCalledTimes(1);
    expect(getAction).toHaveBeenCalledWith('actionKey');
 
    rerender();
    expect(runAction).toHaveBeenCalledTimes(2);
  });
})
