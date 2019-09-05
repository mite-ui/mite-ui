import React, { useState, useCallback } from "react";
import { offsetDeep } from "../_util";

const ScrollView = function ScrollView ({children, className, style, overflow = 'auto', ...rest}) {
  const [height, setHeight] = useState(0);
  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(document.documentElement.clientHeight - offsetDeep(node) )
    }
  }, [])

  return (
    <div className={className} ref={measuredRef} style={{...style, height, overflow}} {...rest}>
      {children}
    </div>
  );
}

export default ScrollView;
