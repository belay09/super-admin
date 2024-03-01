export default function findMainLocation(placeLocations) {
  let location = placeLocations.find(
    (placeLocation) => placeLocation.isMainLocation
  );
  if (location) {
    return location;
  } else if (placeLocations.length > 0) {
    return placeLocations[0];
  } else {
    return null;
  }
}
