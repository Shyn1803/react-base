import React from "react";
import { render, screen } from "@testing-library/react";
import LoginPage from "../index";
import { Provider } from "react-redux";
import { persistor, store } from "../../../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
// import ErrorBoundary from "../../../components/errorBoundary";

// test("renders the landing page", () => {
//   render(<LoginPage />);
// });
// beforeAll(() => {
//   Object.defineProperty(window, "matchMedia", {
//     writable: true,
//     value: jest.fn().mockImplementation(query => ({
//       matches: false,
//       media: query,
//       onchange: null,
//       addListener: jest.fn(), // Deprecated
//       removeListener: jest.fn(), // Deprecated
//       addEventListener: jest.fn(),
//       removeEventListener: jest.fn(),
//       dispatchEvent: jest.fn(),
//     }))
//   });
// });
// describe("Test", () => {
// });

global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

describe("Test the Login Component", () => {
  test("render the login form submit button on the screen", async () => {
    render(
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <LoginPage />
          </Router>
        </PersistGate>
      </Provider>
    );
    const buttonList = await screen.findAllByRole("button");
    expect(buttonList).toHaveLength(1);
  });

  test("should be able to submit the form", () => {
    render(
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <LoginPage />
          </Router>
        </PersistGate>
      </Provider>
    );
    const email = screen.getByPlaceholderText("Email");
    const password = screen.getByPlaceholderText("Password");
    const btnList = screen.getAllByRole("button");

    userEvent.type(email, "shyn@gmail.com");
    userEvent.type(password, "123456");
    userEvent.click(btnList[0]);

    const user = screen.getByText("shyn@gmail.com");
    expect(user).toBeInTheDocument();
  });
});
