const textarea = document.getElementById("message");
textarea.addEventListener("keyup", (e) => {
  textarea.style.height = "auto";
  let scHeight = e.target.scrollHeight;
  textarea.style.height = `${scHeight}px `;
});

function sendMail() {
  var params = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value,
  };

  const serviseId = "service_ey7xz1l";
  const templateId = "template_rlk6i0c";

  emailjs
    .send(serviseId, templateId, params)
    .then((res) => {
      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("message").value = "";
      console.log(res);
      alert("Habaringiz muvofaqiyatli jo'natildi");
    })
    .catch((err) => console.log(err));
}

var typingElement = document.querySelector(".typing-text");
var typeArray = ["Programmer ", "SMM Manager", "Mobilographer"];
var index = 0,
  isAdding = true,
  typeIndex = 0;

function playAnim() {
  setTimeout(
    function () {
      typingElement.innerText = typeArray[typeIndex].slice(0, index);
      /*
        This line handles both typing and removing text
        typeArray[typeIndex] selects the text from array
        slice(0, index) selects the part of that text

        Examples:

        typeIndex = 0     => First Text
        index = 0         => First Letter of the Text
        Result is "H"

        typeIndex = 0
        index = 1
        Result is "HT"    => First 2 Letters of the Text

        typeIndex = 0
        index = 2
        Result is "HTM"   => First 3 Letters of the Text

        typeIndex = 0
        index = 3
        Result is "HTML"  =>  Text typed completely, start to remove by decreasing index
                              While removing, index will be: 2,1,0 . After 0, move on to next text. 

        typeIndex = 1     => Second Text                   
        index = 0
        Result is "C"

        typeIndex = 1
        index = 1
        Result is "CS"

        typeIndex = 1
        index = 2
        Result is "CSS"
      */

      // If typing
      if (isAdding) {
        if (index >= typeArray[typeIndex].length) {
          isAdding = false;
          // If text typed completely, wait 2s before starting to remove it.
          setTimeout(function () {
            playAnim();
          }, 2000);
          return;
        } else {
          // Continue to typing text by increasing index
          index++;
        }
      } else {
        // If removing
        if (index === 0) {
          isAdding = true;
          //If text removed completely, move on to next text by increasing typeIndex
          typeIndex++;
          if (typeIndex >= typeArray.length) {
            // Turn to beginning when reached to last text
            typeIndex = 0;
          }
        } else {
          // Continue to removing text by decreasing index
          index--;
        }
      }
      // Call the function always
      playAnim();
    },

    /* 
      If typing text, call it every 120ms
      If removing text, call it every 60ms
      Type slower, remove faster
    */
    isAdding ? 120 : 60
  );
}

// Start typing text
playAnim();

window.addEventListener("DOMContentLoaded", () => {
  const clock = new ProgressClock("#clock");
});

class ProgressClock {
  constructor(qs) {
    this.el = document.querySelector(qs);
    this.time = 0;
    this.updateTimeout = null;
    this.ringTimeouts = [];
    this.update();
  }
  getDayOfWeek(day) {
    switch (day) {
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      default:
        return "Sunday";
    }
  }
  getMonthInfo(mo, yr) {
    switch (mo) {
      case 1:
        return { name: "February", days: yr % 4 === 0 ? 29 : 28 };
      case 2:
        return { name: "March", days: 31 };
      case 3:
        return { name: "April", days: 30 };
      case 4:
        return { name: "May", days: 31 };
      case 5:
        return { name: "June", days: 30 };
      case 6:
        return { name: "July", days: 31 };
      case 7:
        return { name: "August", days: 31 };
      case 8:
        return { name: "September", days: 30 };
      case 9:
        return { name: "October", days: 31 };
      case 10:
        return { name: "November", days: 30 };
      case 11:
        return { name: "December", days: 31 };
      default:
        return { name: "January", days: 31 };
    }
  }
  update() {
    this.time = new Date();

    if (this.el) {
      // date and time
      const dayOfWeek = this.time.getDay();
      const year = this.time.getFullYear();
      const month = this.time.getMonth();
      const day = this.time.getDate();
      const hr = this.time.getHours();
      const min = this.time.getMinutes();
      const sec = this.time.getSeconds();
      const dayOfWeekName = this.getDayOfWeek(dayOfWeek);
      const monthInfo = this.getMonthInfo(month, year);
      const m_progress = sec / 60;
      const h_progress = (min + m_progress) / 60;
      const d_progress = (hr + h_progress) / 24;
      const mo_progress = (day - 1 + d_progress) / monthInfo.days;
      const units = [
        {
          label: "w",
          value: dayOfWeekName,
        },
        {
          label: "mo",
          value: monthInfo.name,
          progress: mo_progress,
        },
        {
          label: "d",
          value: day,
          progress: d_progress,
        },
        {
          label: "h",
          value: hr > 12 ? hr - 12 : hr,
          progress: h_progress,
        },
        {
          label: "m",
          value: min < 10 ? "0" + min : min,
          progress: m_progress,
        },
        {
          label: "s",
          value: sec < 10 ? "0" + sec : sec,
        },
        {
          label: "ap",
          value: hr > 12 ? "PM" : "AM",
        },
      ];

      // flush out the timeouts
      this.ringTimeouts.forEach((t) => {
        clearTimeout(t);
      });
      this.ringTimeouts = [];

      // update the display
      units.forEach((u) => {
        // rings
        const ring = this.el.querySelector(`[data-ring="${u.label}"]`);

        if (ring) {
          const strokeDashArray = ring.getAttribute("stroke-dasharray");
          const fill360 = "progress-clock__ring-fill--360";

          if (strokeDashArray) {
            // calculate the stroke
            const circumference = +strokeDashArray.split(" ")[0];
            const strokeDashOffsetPct = 1 - u.progress;

            ring.setAttribute(
              "stroke-dashoffset",
              strokeDashOffsetPct * circumference
            );

            // add the fade-out transition, then remove it
            if (strokeDashOffsetPct === 1) {
              ring.classList.add(fill360);

              this.ringTimeouts.push(
                setTimeout(() => {
                  ring.classList.remove(fill360);
                }, 600)
              );
            }
          }
        }

        // digits
        const unit = this.el.querySelector(`[data-unit="${u.label}"]`);

        if (unit) unit.innerText = u.value;
      });
    }

    clearTimeout(this.updateTimeout);
    this.updateTimeout = setTimeout(this.update.bind(this), 1e3);
  }
}
