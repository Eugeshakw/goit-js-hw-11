!function(){var t={btnOne:document.querySelector(".search"),btnTwo:document.querySelector(".custom-button"),inpEl:document.querySelector(".inp-search")};t.btnTwo.addEventListener("click",(function(t){t.preventDefault()})),t.btnOne.addEventListener("click",(function(e){e.preventDefault(),t.btnTwo.style.display="none"})),t.inpEl.addEventListener("click",(function(e){e.preventDefault(),t.btnTwo.style.display="block"}));var e,n,o={form:document.querySelector("#search-form"),input:document.querySelector('input[type="text"]'),btn:document.querySelector('button[type="submit"]')};console.log(o.form,o.btn,o.input),e="cat",n="".concat("https://pixabay.com/api/","/?key=").concat("37175835-76686085e99d052827f14fa60","&q=").concat(e),fetch(n).then((function(t){return t.json()})).then(console.log)}();
//# sourceMappingURL=index.71807606.js.map
