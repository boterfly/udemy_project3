"use strict";

window.addEventListener('DOMContentLoaded', () => {

    //Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent () {
        tabsContent.forEach(item => {
            item.classList.add('hide', 'fade');
            item.classList.remove('show');
        });
        tabs.forEach(item => {
                item.classList.remove('tabheader__item_active');
        });
    }
    
    function showTabContent (i = 0) {
        tabsContent[i].classList.add('show' , 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();


    tabsParent.addEventListener('click', (event) => {
       const target = event.target;

       if (target && target.classList.contains('tabheader__item')) {
           tabs.forEach((item, i) => {
                if(target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
           });
       }
    });

    //Timer 

    const deadline = '2020-12-31';

    function getTimeRemaining(endtime){
        const t = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours = Math.floor((t / (1000 * 60 * 60 ) % 24)),
              minutes = Math.floor((t / (1000 *60) % 60)),
              seconds = Math.floor((t / 1000) % 60);
                
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }
    
    function getZero(time){
        if (time<10){
            time = `0${time}`;
        } 
        return time;
    }
    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);
        
        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if(t.total <= 0){
                clearInterval(timeInterval);
            }
        }
        
    }
    setClock('.timer', deadline);

    // Modal

    const modalTrigger= document.querySelectorAll('[data-modal]'),
        //   modalCloseBtn = document.querySelector('[data-close'),
          modal = document.querySelector('.modal'),
          modalTimerId = setTimeout(modalOpen, 50000);
    
    function modalOpen(){
            // win.style.display = 'block';
            modal.classList.add('show');
            modal.classList.remove('hide');
            document.body.style.overflow = 'hidden';
            clearInterval(modalTimerId);
    }
   
    function closeModal(){
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function showModalByScroll (){
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            modalOpen();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    // for (let i = 0; i < modalTrigger.length; i++){
    //     modalOpen(modalTrigger[i],modal);
    // }
    modalTrigger.forEach((btn) =>{
        btn.addEventListener('click', modalOpen);
    });

    modal.addEventListener('click', (e)=>{
        if (e.target === modal || e.target.getAttribute('data-close') == ''){
            closeModal();
        }
    });
    document.addEventListener('keydown', (e)=>{
        if(e.code === 'Escape' && modal.classList.contains('show')){
            closeModal();
        }
    });

    window.addEventListener('scroll', showModalByScroll);

// Создаем классы для карточек

    class MenuCard {
        constructor (imgSrc, altTxt, title, descr, price, parentSelector, ...classes) {
            this.imgSrc = imgSrc;
            this.altTxt = altTxt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }
        changeToUAH(){
            this.price = +this.price * this.transfer;
        }
        render(){
            const element = document.createElement('div');
            if (this.classes.length === 0){
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }
            element.innerHTML = `
                        <img src=${this.imgSrc} alt=${this.altTxt}>
                        <h3 class="menu__item-subtitle">${this.title}</h3>
                        <div class="menu__item-descr">${this.descr}</div>
                        <div class="menu__item-divider"></div>
                        <div class="menu__item-price">
                            <div class="menu__item-cost">Цена:</div>
                            <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                        </div>
                        `;
            this.parent.append(element);
        }

    }
    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok){
            throw new Error(`Could not fetch ${url}, status ${res.status}`);
        }

        return await res.json();
    };

    // getResource('http://localhost:3000/menu')
        // .then (data => {
        //     data.forEach(({img, altimg, title, descr, price}) =>{
        //         new MenuCard(img, altimg, title, descr, price, '.menu .container')
        //             .render();
        //     });
        // });
    axios.get('http://localhost:3000/menu')
        .then (data => {
            data.data.forEach(({img, altimg, title, descr, price}) =>{
                new MenuCard(img, altimg, title, descr, price, '.menu .container')
                    .render();
            });
        });

    // getResource('http://localhost:3000/menu')
    //     .then(data => createCard(data));

    // function createCard(data) {
    //     data.forEach(({img, altimg, title, descr, price})=>{
    //         const element = document.createElement('div');
    //         element.classList.add('menu__item');
    //         element.innerHTML = `<img src=${img} alt=${altimg}>
    //                             <h3 class="menu__item-subtitle">${title}</h3>
    //                             <div class="menu__item-descr">${descr}</div>
    //                             <div class="menu__item-divider"></div>
    //                             <div class="menu__item-price">
    //                                 <div class="menu__item-cost">Цена:</div>
    //                                 <div class="menu__item-total"><span>${price}</span> грн/день</div>
    //                             </div>`;
    //         document.querySelector('.menu .container').append(element);
    //     });
    // }

    // Forms

    const forms = document.querySelectorAll('form');
    
    const message = {
        loading: 'icons/spinner.svg',
        success: 'Спасибо!, Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src =message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);
            
            const formData = new FormData(form);
            const json = JSON.stringify(Object.fromEntries(formData.entries()));
 
            postData('http://localhost:3000/requests', json)
            .then(data => {
                    console.log(data);
                    showThanksModal(message.success); 
                    statusMessage.remove();
            }).catch(()=>{
                showThanksModal(message.failure);
            }).finally(()=>{
                form.reset();
            });
        });
    }
    
    function showThanksModal(message){
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        modalOpen();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>`;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }
    
    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));


    // Slider (My variant)

    // const slider = document.querySelector('.offer__slider'),
    //       slide = slider.querySelector('.offer__slider-wrapper'),
    //       imgs = ['img/slider/pepper.jpg', 'img/slider/food-12.jpg', 
    //             'img/slider/olive-oil.jpg', 'img/slider/paprika.jpg'],
    //       altImgs = ['pepper', 'food', 'oil', 'paprika'],
    //       imgDiv = document.createElement('div'),
    //       prevBtn = slider.querySelector('.offer__slider-prev'),
    //       nextBtn = slider.querySelector('.offer__slider-next'),
    //       curSpan = slider.querySelector('#current'),
    //       totalSpan = slider.querySelector('#total');
    // let currentImg = 1;
    
    // function showImg(curImg){
    //     imgDiv.classList.add('offer__slide');
    //     imgDiv.innerHTML = `<img src=${imgs[curImg-1]} alt=${altImgs[curImg-1]}>`;
    //     curSpan.innerHTML = `0${curImg}`;
    //     totalSpan.innerHTML = `0${imgs.length}`;
    //     slide.append(imgDiv);
    // }
    // function nextImg(){
    //         currentImg++;
    //         showImg(currentImg);
    // }
    // function prevImg(){
    //         currentImg--;
    //         showImg(currentImg);
    // }
    // showImg(currentImg);

    // nextBtn.addEventListener('click', nextImg);
    // prevBtn.addEventListener('click', prevImg);

    // Slider 
    const slides = document.querySelectorAll('.offer__slide'),
          slider = document.querySelector('.offer__slider'),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          current = document.querySelector('#current'),
          total = document.querySelector('#total'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.offer__slider-inner'),
          width = window.getComputedStyle(slidesWrapper).width;
    let slideIndex =1;
    let offset = 0;

    function currentIndex(){
        if(slides.length < 10){
            current.textContent = `0${slideIndex}`;
        }else{
            current.textContent = `${slideIndex}`;
        }
    }

    function dotOpacity(){
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = '1';
    }

    if(slides.length < 10){
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = `${slides.length}`;
        current.textContent = `${slideIndex}`;
    }

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';
    slides.forEach(slide => {
        slide.style.width = width;
    });
    
    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
          dots = [];
    indicators.classList.add('carousel-indicators');
    slider.append(indicators);

    for(let i=0; i<slides.length; i++){
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');
        if(i==0){
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }

    next.addEventListener('click', ()=>{
        if (offset == +width.slice(0, width.length -2) * (slides.length - 1)){ //'500px'
            offset = 0;
        } else {
            offset += +width.slice(0, width.length -2);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if(slideIndex == slides.length){
            slideIndex = 1;
        }else{
            slideIndex++;
        }

        currentIndex();

        dotOpacity();
    });

    prev.addEventListener('click', ()=>{
        if (offset == 0){
            offset = +width.slice(0, width.length -2) * (slides.length - 1);
        } else {
            offset -= +width.slice(0, width.length -2);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if(slideIndex == 1){
            slideIndex = slides.length;
        }else{
            slideIndex--;
        }

        currentIndex();

        dotOpacity();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = +width.slice(0, width.length -2) * (slideTo - 1);

            slidesField.style.transform = `translateX(-${offset}px)`;

            dotOpacity();
            currentIndex();
        });
    });

    // showSlides(slideIndex);

    // if(slides.length < 10){
    //     total.textContent = `0${slides.length}`;
    // } else {
    //     total.textContent = `${slides.length}`;
    // }

    // function showSlides(n){
    //     if (slideIndex > slides.length) {
    //         slideIndex = 1;
    //     }
    //     if (slideIndex < 1){
    //         slideIndex = slides.length;
    //     }

    //     slides.forEach(item => item.style.display = 'none');
    //     slides[slideIndex-1].style.display = 'block';
    //     if (slideIndex < 10){
    //         current.textContent = `0${slideIndex}`;
    //     } else {
    //         current.textContent = `${slideIndex}`;
    //     }
    // }

    // function plusSlides(n){
    //     showSlides(slideIndex += n);
    // }

    // prev.addEventListener('click', ()=>{
    //     plusSlides(-1);
    // });
    // next.addEventListener('click', ()=>{
    //     plusSlides(1);
    // });
});
