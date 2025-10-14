import { ActionContext, type Effect } from "@alfons-app/pdk";
import { useContext, useEffect, useRef } from "react";
import type { TimerProps } from "./editor";

const timerEffect: Effect<TimerProps> = ({ onInterval, interval, repeat }: TimerProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { getAction } = useContext(ActionContext);

  const timerHook = () => {
    intervalRef.current = setInterval(() => {
      getAction(onInterval?.__$ref)?.();

      if (!repeat && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  };

  useEffect(timerHook, [
    interval,
    repeat,
    onInterval,
    getAction,
  ]);
};

export default timerEffect;
