import "@testing-library/jest-dom";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query) => ({
    matches: query.includes("pointer: fine") ? true : false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: MockResizeObserver,
});

// Mock HTMLMediaElement play & pause
window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => {};

// Mock GSAP and ScrollTrigger
jest.mock("gsap", () => {
  return {
    gsap: {
      registerPlugin: jest.fn(),
      quickSetter: jest.fn().mockImplementation(() => jest.fn()),
      context: jest.fn((callback) => {
        const ctx = { revert: jest.fn() };
        if (typeof callback === "function") callback(ctx);
        return ctx;
      }),
      timeline: jest.fn(() => ({
        to: jest.fn().mockReturnThis(),
        fromTo: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
      })),
      set: jest.fn(),
      to: jest.fn(),
      fromTo: jest.fn(),
    },
  };
});

jest.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    registerPlugin: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    refresh: jest.fn(),
  },
}));

// Mock Howler.js Howl class
jest.mock("howler", () => {
  return {
    Howl: jest.fn().mockImplementation(() => ({
      play: jest.fn().mockReturnValue(1),
      pause: jest.fn(),
      stop: jest.fn(),
      rate: jest.fn(),
      fade: jest.fn(),
      playing: jest.fn().mockReturnValue(false),
    })),
  };
});
