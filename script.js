const ctx = document.getElementById("myChart");

var chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Work Time",
        data: [],
        borderWidth: 1,
        backgroundColor: "#00FFFFFF",
        borderColor: "#00FFFFFF",
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return this.getLabelForValue(value) ? value : "";
          },
        },
        border: {
          color: "rgba(255,255,255,0.2)",
        },
      },
      x: {
        border: {
          color: "rgba(255,255,255,0.2)",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
  },
});

Chart.defaults.font.family = "Space Grotesk";

const formatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
});

async function fetchLogs() {
  const response = await fetch("https://kairosapi.vercel.app/get_logs");
  const logs = await response.json();
  const logList = document.getElementById("logList");
  logList.innerHTML = "";

  logs.forEach((log) => {
    const listItem = document.createElement("li");
    var color = "";
    var inner = "";
    var element = "";
    if (log.duration >= 180) {
      element = `<div class="rank"><img style="width: 28px;" src="https://cultofthepartyparrot.com/parrots/hd/parrot.gif" alt="Epic" /></div>`;
    } else {
      if (log.duration < 60) {
        color = "#ce8946";
        inner = "#121212";
      } else if (log.duration >= 60 && log.duration < 120) {
        color = "#c4c4c4";
        inner = "#121212";
      } else if (log.duration >= 120) {
        color = "#F1B32B";
        inner = "#121212";
        //inner = "#fff";
      }
      element = `<svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="-0.5 -0.5 16 16"
        class="rank"
        height="24"
        width="24"
        >
            <path
            fill="${color}"
            d="M7.5 15c4.14215625 0 7.5 -3.3578437500000002 7.5 -7.5 0 -4.1421375000000005 -3.3578437500000002 -7.5 -7.5 -7.5C3.3578625 0 0 3.3578625 0 7.5c0 4.14215625 3.3578625 7.5 7.5 7.5Z"
            stroke-width="1"
            ></path>
            <path style="ring"
            fill="${inner}"
            d="M7.3828125 1.875C4.340625 1.875 1.875 4.340625 1.875 7.3828125S4.340625 12.890625 7.3828125 12.890625 12.890625 10.424999999999999 12.890625 7.3828125c0 -1.4607656249999998 -0.580265625 -2.8616953124999998 -1.613203125 -3.8946093750000004C10.24453125 2.455284375 8.843578124999999 1.875 7.3828125 1.875Zm0 9.6421875c-1.0965 0 -2.14809375 -0.4355625 -2.9234437499999997 -1.210921875C3.6840234375 9.53090625 3.2484374999999996 8.4793125 3.2484374999999996 7.3828125s0.4355859375 -2.14809375 1.21093125 -2.9234437499999997C5.234718750000001 3.6840234375 6.2863125 3.2484374999999996 7.3828125 3.2484374999999996s2.14809375 0.4355859375 2.923453125 1.21093125C11.081624999999999 5.234718750000001 11.5171875 6.2863125 11.5171875 7.3828125s-0.4355625 2.14809375 -1.210921875 2.923453125C9.53090625 11.081624999999999 8.4793125 11.5171875 7.3828125 11.5171875Zm-1.3734375 -4.1296875 1.378125 2.0625 1.36875 -2.0625 -1.36875 -2.0671875 -1.378125 2.0671875Z"
            stroke-width="1"
            ></path>
        </svg>`;
    }
    listItem.innerHTML = `
    <div class="outerbox">
        ${element}
        <div class="item">
            <p>${log.duration} mins • ${log.sessions} laps</p>
            <div class="datetime">
                <p class="datetimeval">${new Date(log.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}</p>
                <p class="datetimeval">${new Date(log.date).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}</p>
            </div>
        </div>
    </div>`;
    /*listItem.textContent = `Duration: ${log.duration}, Sessions: ${log.sessions}, Date: ${new Date(
      log.date
    ).toLocaleString()}`;*/
    logList.appendChild(listItem);
  });

  const datewiseDuration = logs.reduce((acc, obj) => {
    const temp = obj.date.split(",")[0];
    const datee = new Date(temp);
    const date = datee.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
    });
    const duration = parseInt(obj.duration);
    acc[date] = (acc[date] || 0) + duration;
    return acc;
  }, {});

  const labels = Object.keys(datewiseDuration);
  const durations = Object.values(datewiseDuration);

  chart.data.labels = labels;
  chart.data.datasets[0].data = durations;
  chart.update();
}

fetchLogs();

setInterval(fetchLogs, 5000);
