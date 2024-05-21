import { Button } from "components/ui/button";
import { Fullscreen } from "lucide-react";
import { useEffect, useState } from "react";

export default function FullscreenComponent() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const elem = document.documentElement;

    if (!isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
        // @ts-expect-error
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        // @ts-expect-error
        elem.mozRequestFullScreen();
        // @ts-expect-error
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        // @ts-expect-error
        elem.webkitRequestFullscreen();
        // @ts-expect-error
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        // @ts-expect-error
        elem.msRequestFullscreen();
      } else {
        alert("Fullscreen API is not supported on this device.");
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        // @ts-expect-error
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        // @ts-expect-error
        document.mozCancelFullScreen();
        // @ts-expect-error
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        // @ts-expect-error
        document.webkitExitFullscreen();
        // @ts-expect-error
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        // @ts-expect-error
        document.msExitFullscreen();
      } else {
        alert("Exiting fullscreen mode is not supported on this device.");
      }
    }

    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  return (
    <Button onClick={toggleFullscreen} variant="ghost" className="pr-0">
      <Fullscreen />
    </Button>
  );
}
