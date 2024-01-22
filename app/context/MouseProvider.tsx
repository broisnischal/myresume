// MouseProvider.tsx

import React, { createContext, useState, useEffect } from "react";

export interface MouseContextProps {
  mouseX: number;
  mouseY: number;
}

export const MouseContext = createContext<MouseContextProps>({
  mouseX: 0,
  mouseY: 0,
});

const MouseProvider: React.FC = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const handleMouseMove = (e: MouseEvent) => {
    setMouseX(e.clientX);
    setMouseY(e.clientY);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <MouseContext.Provider value={{ mouseX, mouseY }}>
      {children}
    </MouseContext.Provider>
  );
};

export default MouseProvider;
