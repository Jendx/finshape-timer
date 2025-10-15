import { ActionContext, type Effect } from "@alfons-app/pdk";
import { RefObject, useContext, useEffect, useRef } from "react";
import type { TimerProps } from "./editor";
import { differenceInMilliseconds } from "date-fns";

/**
 * While reset is true, the timer is being reset
 */
const useReset = (reset: boolean, intervalRef: RefObject<number | null>) => {
  useEffect(() => {
    if (reset && intervalRef.current) {
      clearInterval(intervalRef.current);
    }

  }, [reset]);
}

/**
 * While pause is true, the timer is "paused", it's remaining time is stored ad will be used when resumed
 */
const usePause = (
  pause: boolean,
  intervalRef: RefObject<number | null>,
  intervalStartTimeRef: RefObject<Date | null>,
  intervalRemainingTimeRef: RefObject<number | null>,
  onTimerEnd: () => void,
  interval: number
) => {
  useEffect(() => {
    if (pause && intervalRef.current && intervalStartTimeRef.current) {
      clearInterval(intervalRef.current);
      const elapsedTime = differenceInMilliseconds(new Date(), intervalStartTimeRef.current);
      intervalRemainingTimeRef.current = interval - elapsedTime
    }

    if (!pause && intervalRemainingTimeRef.current) {
      intervalRef.current = window.setInterval(onTimerEnd, intervalRemainingTimeRef.current);

      // Reset the remaining time
      intervalRemainingTimeRef.current = null;
    }

  }, [pause]);
}

const timerEffect: Effect<TimerProps> = ({ onInterval, interval, repeat, pause, reset }: TimerProps) => {
  const intervalRef = useRef<number | null>(null);
  const intervalStartTimeRef = useRef<Date>(null);
  const intervalRemainingTimeRef = useRef<number>(null)
  const { getAction } = useContext(ActionContext);

  const onTimerEnd = () => {
    getAction(onInterval?.__$ref)?.();

    if (!repeat && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }

  const timerHook = () => {
    intervalRef.current = window.setInterval(onTimerEnd, interval);
    intervalStartTimeRef.current = new Date()
  
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  };

  useReset(reset, intervalRef);
  usePause(
    pause,
    intervalRef,
    intervalStartTimeRef,
    intervalRemainingTimeRef,
    onTimerEnd,
    interval);

  useEffect(timerHook, [
    interval,
    repeat,
    onInterval,
    getAction,
  ]);
};

export default timerEffect;
