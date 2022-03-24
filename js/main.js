const PRICE_RANGES = [
  {
    id: "#month",
    morning: 1300,
    unlimited: 2800,
    evening: 2000,
  },
  {
    id: "#half-year",
    morning: 5500,
    unlimited: 9900,
    evening: 7490,
  },
  {
    id: "#year",
    morning: 9900,
    unlimited: 14900,
    evening: 11800,
  },
];

const morning = document.querySelector('.subscription__morning')
const unlimited = document.querySelector('.subscription__unlimited')
const evening = document.querySelector('.subscription__evening')






PRICE_RANGES.forEach((ticket) => {
    const button = document.querySelector(ticket.id);
    button.addEventListener("click", () => {
      morning.textContent = ticket.morning + ' Р'
      unlimited.textContent = ticket.unlimited + ' Р'
      evening.textContent = ticket.evening + ' Р'

      gsap.from([morning, unlimited, evening], {
        textContent: 0,
        duration: 1,
        ease: Power3.inOut,
        snap: { textContent: 1 }
      });
    });
  })
