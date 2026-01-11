/**
 * Shared animation configurations for motion/react-client
 */

export const fadeInSlide = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4 }
};

export const fadeInSlideViewport = {
    initial: { opacity: 0, x: -50 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.4 }
};

export const fadeInUpViewport = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.3 }
};
