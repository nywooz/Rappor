const api =
  "https://api.ipgeolocation.io/ipgeo?apiKey=fe0c9fc6a0934749a56400c8624947d5";

/**
 * fetch a URL example
 */
const getLocation1 = api => {
  fetch(api, {
    mode: "cors"
  })
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log("Request geolocation successful", data);
    })
    .catch(function(error) {
      console.log("Request geolocation failed", error);
    });
};
getLocation1(api);

/**
 * async await 1
 */
const that = this;
let fechDataFromApi = async api => {
  try {
    let response = await fetch(api);
    let result = await response.json();
    return result;
  } catch (err) {
    console.log("fetch failed", err);
  }
};
fechDataFromApi(url).then(result => that.getData(result));

/**
 * async await 2
 */
async function getLocation1(api) {
  try {
    let response = await fetch(api);
    let result = await response.json();
    console.log(result);
  } catch (err) {
    console.log("fetch failed", err);
  }
}

/**
 * async await 3
 */
const resolveAfter2Seconds = () => {
  return new Promise(resolve => {
    // server emulation
    setTimeout(() => {
      resolve("resolved");
    }, 2000);
  });
};

// call our promise
async function asyncCall() {
  console.log("calling");
  var result = await resolveAfter2Seconds();
  console.log(result);
  return result;
  // expected output: 'resolved'
}

asyncCall().then(res => console.log("then " + res));
// output
// "calling"
// "resolved"

/**
 *  asynchronous function call- Promises -Essentially, a promise is a returned object to which you attach callbacks(.then), instead of passing callbacks into a function.
 */
var promise1 = new Promise((resolve, reject) => {
  resolve("foo");
});

promise1
  .then(function(value) {
    console.log(value);
    return value;
  })
  .then(function(retValue) {
    console.log(retValue + " boo");
    return retValue;
  })
  .then(function(retValue) {
    console.log(retValue + " boo boo");
    return retValue;
  })
  .catch(err => console.log(err));

promise1.catch(err => {
  // Your Error Callback
});

/**
 *
 * Below we are combine multiple Promises in to one. Use `Promise.all` Method
 */
var promiseCall = (waitSecond, returnData) => {
  return (resolve, reject) => setTimeout(resolve, waitSecond, returnData);
};

// event loop simulation
var p1 = new Promise(promiseCall(1000, "one"));
var p2 = new Promise(promiseCall(2000, "two"));
var p3 = new Promise(promiseCall(3000, "three"));
var p4 = new Promise(promiseCall(4000, "four"));
var p5 = new Promise((resolve, reject) => reject("5th Promise Rejected"));

// Calling Promise 1 - 4 in Promise.all()
Promise.all([p1, p2, p3, p4]).then(
  function(value) {
    console.log("resolved " + value);
  },
  function(reason) {
    // Not Called
    console.log("rejected " + reason);
  }
);

// Expected Output: ["one", "two", "three", "four"]
// Calling Promise 1 - 5 in Promise.all()
Promise.all([p1, p2, p3, p4, p5]).then(
  function(value) {
    // Not Called
    console.log(value);
  },
  function(reason) {
    console.log(reason);
  }
);
// Trigger Rejection (Second) Callback if any one is rejected.
// Expected Output: 5th Promise Rejected
