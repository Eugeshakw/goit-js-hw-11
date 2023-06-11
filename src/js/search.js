const refs = {
    btnOne: document.querySelector('.search'),
    btnTwo: document.querySelector('.custom-button'),
    inpEl: document.querySelector('.inp-search')
  };
  
 


 refs.btnTwo.addEventListener('click', (e) => {
    e.preventDefault();
    
 })
  refs.btnOne.addEventListener('click', (e) => {
    e.preventDefault();
    refs.btnTwo.style.display = 'none';
    
  })

  refs.inpEl.addEventListener('click', (e) => {
    e.preventDefault();
    refs.btnTwo.style.display = 'block';
  });
  
 