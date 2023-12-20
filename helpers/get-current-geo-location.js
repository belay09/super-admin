export default function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    // check if there is location on session storage

    if (window.sessionStorage.getItem("currentLocation")) {
      resolve(JSON.parse(window.sessionStorage.getItem("currentLocation")));
    }

    // else get current location from navigation object
    else {
      // Check if the Geolocation API is supported by the browser
      if ("geolocation" in navigator) {
        // Use the navigator.geolocation.getCurrentPosition method to get the current location
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            // store current location in session storage
            window.sessionStorage.setItem(
              "currentLocation",
              JSON.stringify({ latitude, longitude })
            );
            resolve({ latitude, longitude });
          },
          (error) => {
            reject(`Error getting location: ${error.message}`);
          },

          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        reject("Geolocation is not supported by this browser.");
      }
    }
  });
}
