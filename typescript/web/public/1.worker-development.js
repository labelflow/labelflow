"use strict";
(self["webpackChunk_labelflow_web"] = self["webpackChunk_labelflow_web"] || []).push([[1],{

/***/ 1244:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _throw_if_resolves_to_nil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(794);

it("does nothing if the function resolves to a defined value", async () => {
  const functionToWrap = jest.fn(() => true);
  const wrappedFunction = (0,_throw_if_resolves_to_nil__WEBPACK_IMPORTED_MODULE_0__.throwIfResolvesToNil)("This error shouldn't happen", functionToWrap);
  expect(await wrappedFunction()).toEqual(true);
});
it("forwards the parameters of wrappedFunction to the function to wrap", async () => {
  const functionToWrap = jest.fn((arg1, arg2, arg3) => arg1 + arg2 + arg3);
  const wrappedFunction = (0,_throw_if_resolves_to_nil__WEBPACK_IMPORTED_MODULE_0__.throwIfResolvesToNil)("This error shouldn't happen", functionToWrap);
  await wrappedFunction(1, 2, 3);
  expect(functionToWrap).toHaveBeenCalledWith(1, 2, 3);
});
it("throws the error message if the function resolves to undefined", async () => {
  const functionToWrap = jest.fn(() => undefined);
  const wrappedFunction = (0,_throw_if_resolves_to_nil__WEBPACK_IMPORTED_MODULE_0__.throwIfResolvesToNil)("This error should happen", functionToWrap);
  expect(() => wrappedFunction()).rejects.toThrow("This error should happen");
});
it("throws the error message if the function resolves to null", async () => {
  const functionToWrap = jest.fn(() => null);
  const wrappedFunction = (0,_throw_if_resolves_to_nil__WEBPACK_IMPORTED_MODULE_0__.throwIfResolvesToNil)("This error should happen", functionToWrap);
  expect(() => wrappedFunction()).rejects.toThrow("This error should happen");
});

/***/ })

}]);