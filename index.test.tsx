import React from "react";
import { render, act } from "@testing-library/react";
import { ActionContext, TestProps } from "@alfons-app/pdk";
import timerEffect from "./index";
import { differenceInMilliseconds } from "date-fns";
import { TimerProps } from "./editor";

jest.useFakeTimers();
jest.mock("date-fns", () => ({
  differenceInMilliseconds: jest.fn(),
}));

const renderWrappedEffect = (getActionMock: jest.Mock<any, any, any>, WrapperComponent: () => null) => {
  return render(
    <ActionContext.Provider value={{ getAction: getActionMock, registerAction: jest.fn() }}>
      <WrapperComponent />
    </ActionContext.Provider>
  );
}

// POC of tests
describe("timerEffect", () => {
  let mockAction: jest.Mock;
  let getActionMock: jest.Mock;

  const initTests = ({
    onInterval = "onIntervalRef",
    interval = 1000,
    repeat = false,
    pause = false,
    reset = false,
  } = {}) => {
    mockAction = jest.fn();
    getActionMock = jest.fn().mockImplementation((ref: string | undefined) => {
      return ref === "onIntervalRef" ? mockAction : null;
    });

    const props: TimerProps & TestProps = {
      onInterval: { __$ref: onInterval },
      interval,
      repeat,
      pause,
      reset,
      "data-testid": 'dataTestId',
      testID: 'testId'
    };

    // Wrap the effect in a component to invoke hooks
    const WrapperComponent = () => {
      timerEffect.call(null, {
        ...props,
      });
      return null;
    };

    return renderWrappedEffect(getActionMock, WrapperComponent);
  };

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  test("calls onInterval after interval and clears if not repeating", () => {
    // Arrange
    initTests({ interval: 1000, repeat: false });

    // Act
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Assert
    expect(mockAction).toHaveBeenCalledTimes(1);
    expect(clearInterval).toHaveBeenCalledTimes(1);
  });

  test("resets interval when reset is true", () => {
    // Arrange
    initTests({ reset: true });

    // Assert
    expect(clearInterval).toHaveBeenCalledTimes(1);
  });

  test("pauses the timer and stores remaining time", () => {
    // Arrange
    (differenceInMilliseconds as jest.Mock).mockReturnValue(400);
    initTests({ pause: true, interval: 1000 });

    // Assert
    expect(clearInterval).toHaveBeenCalledTimes(1);
    expect(differenceInMilliseconds).toHaveBeenCalled();
  });

  test("resumes from pause with remaining time", () => {
    // Arrange
    let resume;
    const RemainingTime = 600;

    (differenceInMilliseconds as jest.Mock).mockReturnValue(400);

    const Wrapper = () => {
      const [pause, setPause] = React.useState(true);

      React.useEffect(() => {
        setTimeout(() => {
          setPause(false);
        }, 0);
      }, []);

      timerEffect({
        onInterval: { __$ref: "onIntervalRef" },
        interval: 1000,
        repeat: false,
        pause,
        reset: false,
        "data-testid": 'dataTestId',
        testID: 'testId',
      });

      resume = () => setPause(false);
      return null;
    };

    renderWrappedEffect(getActionMock, Wrapper)

    act(() => {
      jest.advanceTimersByTime(0);
    });

    act(() => {
      jest.advanceTimersByTime(RemainingTime);
    });

    expect(mockAction).toHaveBeenCalledTimes(1);
  });
});
