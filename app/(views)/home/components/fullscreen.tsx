import { Button } from "components/ui/button";
import { Fullscreen } from "lucide-react";
import { useState } from "react";

export default function FullscreenComponent() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const elem = document.documentElement;

    if (!isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }

    setIsFullscreen(!isFullscreen);
  };

  return (
    <Button onClick={toggleFullscreen} variant="ghost" className="pr-0">
      <Fullscreen />
    </Button>
  );
}
