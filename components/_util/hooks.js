import { useState, useCallback, useEffect, useRef } from "react";
import { useObjState, debounce } from ".";

export const useNodeRef = function useNodeRef (init) {
  const [node, setNode] = useState(init);
  const ref = useCallback(setNode, []);

  return [node, ref];
}

export const useFetchData = function useFetchData ({dispatch, type, payload}, init) {
  const [data, setData] = useState(init)
  useEffect(() => {
    let didCancel = false
    const fetchData = () => {
      dispatch({
        type,
        payload,
        callback: !didCancel ? setData : () => {}
      });
    }
    fetchData();
    return () => didCancel = true;
  }, [dispatch, payload, type]);

  return [data]
}

export const useObj = function useObj (init) {
  const [state, setState] = useState(init);
  const setObj = useObjState(setState, state);
  return [state, setObj];
}

export const useDebounce = function useDebounce (func, delay) {
  const {current} = useRef(debounce(func, delay));
  return current
}
