import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useGSAP(() => {
    const cursorXSetter = gsap.quickTo("#cursor", "x", {
      duration: 0.2,
      ease: "power3",
    });
    const cursorYSetter = gsap.quickTo(cursorRef.current, "y", {
      duration: 0.2,
      ease: "power3",
    });

    const followerXSetter = gsap.quickTo(followerRef.current, "x", {
      duration: 0.6,
      ease: "power3",
    });
    const followerYSetter = gsap.quickTo("#follower", "y", {
      duration: 0.6,
      ease: "power3",
    });

    window.addEventListener("mousemove", (e) => {
      const x = e.clientX;
      const y = e.clientY;

      cursorXSetter(x);
      cursorYSetter(y);
      followerXSetter(x);
      followerYSetter(y);
    });
  }, []);

  return (
    <>
      <span id="cursor" ref={cursorRef} />
      <span id="follower" ref={followerRef} />
    </>
  );
};

export default CustomCursor;