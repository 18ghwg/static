// $(function Acc() {
//     $(".accordion > .accordion-item.open").children(".accordion-panel").slideDown();
//     $(".accordion  .accordion-thumb").on('click',function () {
//         $(this).parent().siblings(".accordion-item").removeClass("open").children(".accordion-panel").slideUp();
//         $(this).parent().toggleClass("open").children(".accordion-panel").slideToggle("ease-out");
//     });
// });
// $(function Tab() {
//     $(".tabs-item:first").addClass("active");
//     $(".tabs-content:first").addClass("active");
//     $(".tabs-item").on('click',function () {
//         $(this).addClass("active");
//         $(this).siblings(this).removeClass("active");
//         $(".tabs-content").siblings(".tabs-content").removeClass("active");
//         $(".tabs-content").eq($(this).index()).addClass("active");
//     });
// });
window.onload = function () {
    // document.querySelector(".tabLinks").classList.add("active");
    // document.querySelector(".tabContent").classList.add("active");

    const span = document.querySelectorAll('.tabLinks');     //css选择器
    const div = document.querySelectorAll('.tabContent');
    span[0].classList.add('active');
    div[0].classList.add('active');
    for (let i = 0; i < span.length; i++) {                   //循环span标签
        span[i].idx = i;
        span[i].onclick = function () {
            for (let j = 0; j < div.length; j++) {         //循环div标签
                span[j].classList.remove('active');
                div[j].classList.remove('active');
            }
            this.classList.add('active');                      //增加class
            div[i].classList.add('active');
        }
    }

}

