async function fetchData() {
  const url = "https://618f0ee950e24d0017ce1577.mockapi.io/date";
  try {
    await fetch(url)
      .then((res) => res)
      .catch((e) => {
        throw e;
      });
  } catch (error) {
    console.log(error);
  }
}
export { fetchData };
