const e={btnOne:document.querySelector(".search"),btnTwo:document.querySelector(".custom-button"),inpEl:document.querySelector(".inp-search")};e.btnTwo.addEventListener("click",(e=>{e.preventDefault()})),e.btnOne.addEventListener("click",(t=>{t.preventDefault(),e.btnTwo.style.display="none"})),e.inpEl.addEventListener("click",(t=>{t.preventDefault(),e.btnTwo.style.display="block"}));const t={form:document.querySelector("#search-form"),input:document.querySelector('input[type="text"]'),btn:document.querySelector('button[type="submit"]')};console.log(t.form,t.btn,t.input);fetch("https://pixabay.com/api/?key=37175835-76686085e99d052827f14fa60&&per_page=5&q=yellow&image_type=photo").then((e=>e.json())).then(console.log);
//# sourceMappingURL=index.1e0abaaf.js.map
