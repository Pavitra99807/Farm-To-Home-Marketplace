// backend/utils/distanceCalculation.js
// Using Haversine Formula to calculate distance between two geo-coordinates

const WAREHOUSE_LAT = 12.9237;
const WAREHOUSE_LNG = 77.4987;
const EARTH_RADIUS_KM = 6371;

/**
 * Calculate distance between two coordinates using Haversine Formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lng1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lng2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimals
}

/**
 * Calculate distance from farmer location to warehouse
 * @param {number} farmerLat - Farmer's latitude
 * @param {number} farmerLng - Farmer's longitude
 * @returns {object} Distance and pickup charge
 */
function calculatePickupCharge(farmerLat, farmerLng) {
  const distance = calculateDistance(
    farmerLat,
    farmerLng,
    WAREHOUSE_LAT,
    WAREHOUSE_LNG
  );

  let pickupCharge = 0;

  if (distance <= 10) {
    pickupCharge = 50;
  } else if (distance <= 25) {
    pickupCharge = 100;
  } else if (distance <= 50) {
    pickupCharge = 200;
  } else {
    pickupCharge = 200 + (distance - 50) * 5;
  }

  return {
    distance: distance,
    pickupCharge: Math.round(pickupCharge),
    category: getDistanceCategory(distance),
  };
}

/**
 * Calculate delivery charge from warehouse to customer
 * @param {number} customerLat - Customer's latitude
 * @param {number} customerLng - Customer's longitude
 * @returns {object} Distance and delivery charge
 */
function calculateDeliveryCharge(customerLat, customerLng) {
  const distance = calculateDistance(
    WAREHOUSE_LAT,
    WAREHOUSE_LNG,
    customerLat,
    customerLng
  );

  let deliveryCharge = 0;

  if (distance <= 5) {
    deliveryCharge = 30;
  } else if (distance <= 10) {
    deliveryCharge = 50;
  } else if (distance <= 20) {
    deliveryCharge = 80;
  } else {
    deliveryCharge = 100 + (distance - 20) * 5;
  }

  return {
    distance: distance,
    deliveryCharge: Math.round(deliveryCharge),
    category: getDistanceCategory(distance),
  };
}

/**
 * Get distance category for display
 */
function getDistanceCategory(distance) {
  if (distance <= 5) return "Very Close";
  if (distance <= 10) return "Close";
  if (distance <= 25) return "Moderate";
  if (distance <= 50) return "Far";
  return "Very Far";
}

/**
 * Calculate total delivery cost (pickup + delivery)
 */
function calculateTotalLogisticsCost(
  farmerLat,
  farmerLng,
  customerLat,
  customerLng,
  deliveryOption = "company-pickup"
) {
  let pickupCharge = 0;

  if (deliveryOption === "company-pickup") {
    const pickupData = calculatePickupCharge(farmerLat, farmerLng);
    pickupCharge = pickupData.pickupCharge;
  }

  const deliveryData = calculateDeliveryCharge(customerLat, customerLng);
  const deliveryCharge = deliveryData.deliveryCharge;

 return {
  pickupCharge,
  deliveryCharge,
  totalLogisticsCost: pickupCharge + deliveryCharge,

  farmerToWarehouseDistance: calculateDistance(
    farmerLat,
    farmerLng,
    WAREHOUSE_LAT,
    WAREHOUSE_LNG
  ),

  warehouseToCustomerDistance: deliveryData.distance,

  estimatedTime: estimateDeliveryTime(
    deliveryData.distance
  ),
};
}

/**
 * Calculate estimated delivery time in hours
 */
function estimateDeliveryTime(distance) {
  // Assuming average speed of 20 km/hour in urban areas
  // Plus 30 minutes for sorting and handling
  const hours = distance / 20 + 0.5;
  return Math.round(hours * 2) / 2; // Round to nearest 0.5 hours
}

/**
 * Get delivery status based on current time
 */
function getEstimatedDeliveryWindow(orderTime, distance) {
  const hours = estimateDeliveryTime(distance);
  const estimatedDeliveryTime = new Date(orderTime.getTime() + hours * 60 * 60 * 1000);

  return {
    estimatedDeliveryTime: estimatedDeliveryTime,
    estimatedHours: hours,
    deliveryWindow: `${hours} hours`,
  };
}

module.exports = {
  calculateDistance,
  calculatePickupCharge,
  calculateDeliveryCharge,
  calculateTotalLogisticsCost,
  estimateDeliveryTime,
  getEstimatedDeliveryWindow,
  WAREHOUSE_LAT,
  WAREHOUSE_LNG,
};
