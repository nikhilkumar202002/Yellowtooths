import Lenis from '@studio-freight/lenis';

const lenisScrollReset = () => {
  const lenis = new Lenis({
    smooth: true,
  });

  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };

  requestAnimationFrame(raf);

  lenis.scrollTo(0);

  return () => {
    lenis.destroy();
  };
};

export default lenisScrollReset;
