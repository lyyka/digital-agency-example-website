$(document).ready(function() {
    $("#team-cards-slider").slick({
        autoplay: true,
        centerMode: true,
        centerPadding: '60px',
        slidesToShow: 2,
        arrows: true,
        prevArrow: ".team-cards-slider--previous",
        nextArrow: ".team-cards-slider--next",
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '10px',
                    slidesToShow: 1
                }
            }
        ]
    });
});