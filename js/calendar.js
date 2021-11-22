class myCollection {
  constructor() {
    let data = [];
    let message = "";
    let booking = Object;

    this.setData = (newData) => (data = newData);
    this.getData = (_) => data;

    this.setMessage = (s) => (message = s);
    this.getMessage = (_) => message;

    this.setBooking = (book) => (booking = book);
    this.getBooking = (_) => booking;
  }
}
const DOMElements = {
  titleInfo: document.querySelector("#title-info"),
  dateInfo: document.querySelector("#date-info"),
  add_del_form: document.querySelector("#add-date-form"),
  add_del_addBtn: document.querySelector(".submit"),
  add_del_delBtn: document.querySelector(".cancel"),
  add_del_date: document.querySelector("#setDate"),
  add_del_title: document.querySelector("#setTitle"),
  findInfo: document.querySelector("#info-text"),
  findForm: document.querySelector("#form"),
  findYear: document.querySelector("#year"),
  findMonth: document.querySelector("#month"),
  findContainer: document.querySelector("#available-dates-container"),
};

const { findForm, findYear, findMonth, findInfo, findContainer } = DOMElements; // for Finding available dates
const {
  add_del_form,
  add_del_date,
  add_del_title,
  add_del_addBtn,
  add_del_delBtn,
} = DOMElements;

const {
  titleInfo,
  dateInfo
} = DOMElements;

const collection = new myCollection();

const rootURL = "http://localhost:5000/booking";

const fetchExactData = async (year, month, callback) => {
  const url = `${rootURL}/available/${year}/${month}`;
  try {
    await axios
      .get(url)
      .then((res) => res.data)
      .then((data) => data.result)
      .then((dates) => {
        const { data, message } = dates;
        collection.setData(data);
        collection.setMessage(message);
        return message;
      })
      .then((message) => {
        displayInfoMessage(message);
        callback(year, month);
      })
      .catch((e) => {
        console.log(e);
      });
  } catch (error) {
    console.error(error);
  }
};

const displayInfoMessage = (message) => {
  return (findInfo.innerText = message);
};

function displayResults(year, month) {
  findContainer.innerHTML = "";
  const data = collection.getData();
  console.log(data);
  data.forEach((item) => {
    const dateElement = document.createElement("span");
    dateElement.classList.add("blocks");
    dateElement.innerHTML = new Date(item).toLocaleDateString("en-PH", {
      day: "numeric",
    });
    findContainer.appendChild(dateElement);
  });
}

findForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const year = findYear.value;
  const month = findMonth.value;
  await fetchExactData(year, month, displayResults);
});

// For adding and deleting event

const checkExact = async (date, callback) => {
  const url = `${rootURL}/check/${date}`;
  try {
    await axios
      .get(url)
      .then((res) => res.data)
      .then((result) => {
        collection.setBooking(result.data);
        return result.status;
      })
      .then((status) => callback(status))
      .catch((e) => {
        throw e;
      });
  } catch (error) {
    console.error(error);
  }
};

const addEvent = async (date, title) => {
  const data = {
    date,
    title,
  };
  const url = `${rootURL}/add`;
  try {
    await axios
      .post(url, data)
      .then((res) => console.log(res))
      .catch((e) => {
        throw e;
      });
  } catch (error) {
    console.error(error);
  }
};
const delEvent = async (date) => {
  const url = `${rootURL}/delete/${date}`;
  try {
    await axios
      .delete(url)
      .then((res) => console.log(res))
      .catch((e) => {
        throw e;
      });
  } catch (error) {
    console.error(error);
  }
};

const verifyDate = async () => {
  add_del_title.value = "";
  add_del_addBtn.setAttribute("disabled", "yes");
  add_del_delBtn.setAttribute("disabled", "yes");

  const date = add_del_date.value;
  await checkExact(date, activateButton);
}

const activateButton = (status) => {
  if (status) {
    // if occupied
    const booking = collection.getBooking();
    titleInfo.innerText = booking.title;
    dateInfo.innerText = new Date(booking.date).toLocaleDateString('default', {
      day: "numeric",
      year: "numeric",
      month: "long"
    })
    add_del_title.value = booking.title;
    add_del_title.setAttribute("readonly", "yes");
    return add_del_delBtn.removeAttribute("disabled");
  }

  // if not occupied
  add_del_title.value = "";
  add_del_title.removeAttribute("readonly");
  return add_del_addBtn.removeAttribute("disabled");
};

add_del_date.addEventListener("change", async () => {
  await verifyDate();
});

add_del_form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const date = add_del_date.value,
    title = add_del_title.value;

  await addEvent(date, title);
});

add_del_delBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const date = add_del_date.value;
  await delEvent(date);
});